const Node = require('../utils/ats');
const Rule = require('../models/rules');

// Helper function to evaluate the AST
const evaluateNode = (node, data) => {
    if (node.type === 'operator') {
        const leftValue = evaluateNode(node.left, data);
        const rightValue = evaluateNode(node.right, data);

        if (node.value === 'AND') {
            return leftValue && rightValue;
        } else if (node.value === 'OR') {
            return leftValue || rightValue;
        }
    } else if (node.type === 'operand') {
        const { attribute, operator, value } = node.value;
        const dataValue = data[attribute];

        const cleanValue = typeof value === 'string' && value.startsWith("'") && value.endsWith("'")
            ? value.slice(1, -1)
            : value;

        switch (operator) {
            case '>':
                return dataValue > cleanValue;
            case '<':
                return dataValue < cleanValue;
            case '>=':
                return dataValue >= cleanValue;
            case '<=':
                return dataValue <= cleanValue;
            case '=':
                return dataValue == cleanValue;
            default:
                return false;
        }
    }
    return false;
};

// Function to parse rule string into AST
const parseRuleString = (ruleString) => {
    console.log('Parsing rule string:', ruleString);
    const tokens = ruleString.match(/(?:[^\s()]+|\(|\))/g);  // Tokenize by splitting on spaces, parentheses
    if (!tokens) throw new Error('Invalid rule string - No tokens found.');

    const outputQueue = [];
    const operatorStack = [];
    const operators = ['AND', 'OR'];
    const precedence = { 'AND': 1, 'OR': 0 };

    tokens.forEach(token => {
        if (operators.includes(token)) {
            while (operatorStack.length && operators.includes(operatorStack[operatorStack.length - 1]) && precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(token);
        } else if (token === '(') {
            operatorStack.push(token);
        } else if (token === ')') {
            while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.pop();
        } else {
            outputQueue.push(token);
        }
    });

    while (operatorStack.length) {
        outputQueue.push(operatorStack.pop());
    }

    const stack = [];

    const createOperandNode = (tokens) => {
        const [attribute, operator, value] = tokens;
        if (!attribute || !operator || !value) throw new Error('Invalid operand: missing attribute/operator/value');
        return new Node('operand', null, null, { attribute, operator, value });
    };

    for (let i = 0; i < outputQueue.length; i++) {
        const token = outputQueue[i];
        if (operators.includes(token)) {
            const right = stack.pop();
            const left = stack.pop();
            if (!right || !left) throw new Error('Invalid rule string - Missing operands for operator.');
            stack.push(new Node('operator', left, right, token));
        } else if (['>', '<', '>=', '<=', '='].includes(token)) {
            const value = outputQueue[++i];
            const attribute = stack.pop();
            stack.push(new Node('operand', null, null, { attribute, operator: token, value }));
        } else {
            stack.push(token);
        }
    }

    if (stack.length !== 1) throw new Error('Invalid rule string - Too many elements in stack after parsing.');

    return stack[0];
};


// Controller function to create a new rule
exports.createRule = async (req, res) => {
    try {
        const { rule_string: ruleString } = req.body;

        console.log('Received rule string:', ruleString);

        // Attempt to parse the rule string
        const ast = parseRuleString(ruleString);

        console.log('AST generated:', JSON.stringify(ast, null, 2));  // Log AST for debugging

        const newRule = new Rule({
            ruleString,
            ast,
            created_at: new Date(), // Current date/time
            created_by: req.user ? req.user.username : 'admin',
        });
        await newRule.save();

        res.status(201).json(newRule);
    } catch (error) {
        console.error('Error in createRule:', error.message);
        res.status(400).json({ error: error.message });
    }
};


// Controller function to evaluate a rule
// exports.evaluateRule = async (req, res) => {
//     try {
//         const ruleId = req.body.ruleId; // Ensure the key matches your request
//         const data = req.body.data;

//         if (!ruleId || !data) {
//             return res.status(400).send({ message: 'Rule ID and data are required' });
//         }

//         const rule = await Rule.findById(ruleId);
//         if (!rule) {
//             return res.status(404).send({ message: 'Rule not found' });
//         }

//         const result = evaluateNode(rule.ast, data); // Use evaluateNode if that's the right function
//         res.status(200).send({ result, ruleString: rule.ruleString });
//     } catch (error) {
//         res.status(500).send({ message: 'Error evaluating rule', error });
//     }
// };


exports.evaluateRule = async (req, res) => {
    try {
        const { data } = req.body; // No ruleId or ruleString required, just the data

        if (!data) {
            return res.status(400).send({ message: 'Data is required' });
        }

        // Fetch all rules from the database
        const rules = await Rule.find(); // Assuming Rule is the model for your rules

        // Check if any rule matches the provided data
        let isRuleMatched = false;
        for (let rule of rules) {
            // Parse and evaluate each rule's string using the same logic as before
            const ast = parseRuleString(rule.ruleString);
            const result = evaluateNode(ast, data);
            
            if (result) {
                isRuleMatched = true;
                break; // Exit loop early if a matching rule is found
            }
        }

        // Send the result (true if any rule matches, false otherwise)
        res.status(200).send({ result: isRuleMatched });
    } catch (error) {
        res.status(500).send({ message: 'Error evaluating rule', error });
    }
};




exports.combineRules = async (req, res) => {
    try {
        const { ruleStrings } = req.body;
        const parsedRules = ruleStrings.map(parseRuleString);

        let combinedAST = parsedRules[0];
        for (let i = 1; i < parsedRules.length; i++) {
            combinedAST = new Node('operator', combinedAST, parsedRules[i], 'AND');
        }

        // Create a new combined rule
        const combinedRule = new Rule({
            ruleString: ruleStrings.join(' AND '), // Create a string representation
            ast: combinedAST,
            isCombined: true, // Mark it as a combined rule
            created_by: "admin" // You can set this dynamically as per your app logic
        });

        await combinedRule.save(); // Save the combined rule to the database

        res.json({ combinedAST });
    } catch (error) {
        res.status(400).json({ error: 'Error combining rules' });
    }
};



exports.modifyRule = async (req, res) => {
    try {
        const { id: ruleId } = req.params; // Use 'id' instead of 'ruleId' based on your route params
        console.log('Received ruleId:', ruleId); // Log the ruleId for debugging
        
        const { newRuleString } = req.body; // Get the new rule string from request body
        if (!newRuleString) {
            return res.status(400).json({ error: 'New rule string is required' }); // Check if the new rule string is provided
        }

        const newAST = parseRuleString(newRuleString); // Parse the new rule string into AST
        
        // Find the rule by its ID in the database
        const rule = await Rule.findById(ruleId);
        if (!rule) {
            return res.status(404).json({ error: 'Rule not found' }); // Return if rule doesn't exist
        }

        // Update the rule's string and AST with the new values
        rule.ruleString = newRuleString;
        rule.ast = newAST;
        
        await rule.save(); // Save the modified rule
        
        res.status(200).json(rule); // Return the updated rule object
    } catch (error) {
        console.error('Error modifying rule:', error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to modify the rule' }); // General error message for failed request
    }
};






exports.getAllRules = async (req, res) => {
    try {
        const rules = await Rule.find();
        res.status(200).json(rules);
    } catch (error) {
        console.error('Error fetching rules:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};


// Controller function to delete a rule
exports.deleteRule = async (req, res) => {
    try {
        const ruleId = req.params.id; // Get the rule ID from the request parameters

        if (!ruleId) {
            return res.status(400).json({ message: 'Rule ID is required' });
        }

        const deletedRule = await Rule.findByIdAndDelete(ruleId);

        if (!deletedRule) {
            return res.status(404).json({ message: 'Rule not found' });
        }

        res.status(200).json({ message: 'Rule deleted successfully', deletedRule });
    } catch (error) {
        console.error('Error deleting rule:', error.message);
        res.status(500).json({ message: 'Error deleting rule', error });
    }
};

