import React from 'react';
import { deleteRule } from '../api';

const RuleList = ({ rules, onDelete }) => {
    const handleDeleteRule = async (ruleId) => {
        try {
            await deleteRule(ruleId);
            onDelete();
        } catch (error) {
            console.error('Error deleting rule', error);
        }
    };

    return (
        <div className="card mb-4">
            <div className="card-header">
                <h2>Rule List</h2>
            </div>
            <div className="card-body">
                <ul className="list-group">
                    {rules.map((rule) => (
                        <li key={rule._id} className="list-group-item d-flex justify-content-between align-items-center">
                            {rule.ruleString}
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRule(rule._id)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RuleList;
