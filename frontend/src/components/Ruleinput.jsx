import React, { useState } from 'react';
import { createRule } from '../api';

const RuleInput = ({ onRuleAdded }) => {
    const [ruleString, setRuleString] = useState('');

    const handleAddRule = async () => {
        try {
            await createRule({ rule_string: ruleString });
            setRuleString('');
            onRuleAdded();
        } catch (error) {
            console.error('Error adding rule', error);
        }
    };

    return (
        <div className="card mb-4">
            <div className="card-header">
                <h2>Add New Rule</h2>
            </div>
            <div className="card-body">
                <input
                    type="text"
                    className="form-control mb-3"
                    value={ruleString}
                    onChange={(e) => setRuleString(e.target.value)}
                    placeholder="Enter rule string"
                />
                <button className="btn btn-primary" onClick={handleAddRule}>
                    Add Rule
                </button>
            </div>
        </div>
    );
};

export default RuleInput;
