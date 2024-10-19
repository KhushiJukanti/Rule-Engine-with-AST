import React, { useState } from 'react';
import { evaluateRule } from '../api';

const EvaluateRule = () => {
    // const [ruleString, setRuleString] = useState(''); // Use ruleString instead of ruleId
    const [data, setData] = useState({});
    const [result, setResult] = useState(null);

    const handleEvaluate = async () => {
        try {
            // Send ruleString directly to evaluate API
            // const response = await evaluateRule({ ruleString, data });
            const response = await evaluateRule({ data });
            setResult(response.data.result);
        } catch (error) {
            console.error('Error evaluating rule', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Convert department to uppercase, leave other fields as is
        const updatedValue = name === 'department' ? value.toUpperCase() : value;

        setData((prev) => ({ ...prev, [name]: updatedValue }));
    };

    return (
        <div className="card">
            <div className="card-header">
                <h2>Evaluate Rule</h2>
            </div>
            <div className="card-body">
                {/* <input
                    type="text"
                    className="form-control mb-3"
                    value={ruleString}
                    onChange={(e) => setRuleString(e.target.value)}
                    placeholder="Enter rule string (e.g., age > 30 AND department = 'SALES')"
                /> */}
                <h4>Data</h4>
                <input
                    name="age"
                    type="number"
                    className="form-control mb-2"
                    placeholder="Enter age"
                    onChange={handleChange}
                />
                <input
                    name="department"
                    className="form-control mb-2"
                    placeholder="Enter department"
                    onChange={handleChange}
                />
                <input
                    name="salary"
                    type="number"
                    className="form-control mb-2"
                    placeholder="Enter salary"
                    onChange={handleChange}
                />
                <input
                    name="experience"
                    type="number"
                    className="form-control mb-3"
                    placeholder="Enter experience (in years)"
                    onChange={handleChange}
                />
                <button className="btn btn-primary" onClick={handleEvaluate}>
                    Evaluate
                </button>
                {result !== null && (
                    <div className="alert alert-info mt-3">
                        Result: {result ? 'True' : 'False'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EvaluateRule;
