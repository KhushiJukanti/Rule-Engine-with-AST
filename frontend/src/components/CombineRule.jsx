import React, { useState } from 'react';
import { combineRules } from '../api';

const CombineRule = ({ rules, onRulesCombined }) => {
    const [selectedRules, setSelectedRules] = useState([]);

    const handleSelectRule = (ruleId) => {
        setSelectedRules((prev) =>
            prev.includes(ruleId)
                ? prev.filter((id) => id !== ruleId)
                : [...prev, ruleId]
        );
    };

    const handleCombineRules = async () => {
        const ruleStrings = rules
            .filter((rule) => selectedRules.includes(rule._id))
            .map((rule) => rule.ruleString);

        try {
            await combineRules(ruleStrings);
            setSelectedRules([]);
            onRulesCombined();
        } catch (error) {
            console.error('Error combining rules', error);
        }
    };

    return (
        <div className="card mb-4">
            <div className="card-header">
                <h2>Combine Rules</h2>
            </div>
            <div className="card-body">
                <ul className="list-group mb-3">
                    {rules.map((rule) => (
                        <li key={rule._id} className="list-group-item">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={selectedRules.includes(rule._id)}
                                    onChange={() => handleSelectRule(rule._id)}
                                />
                                <label className="form-check-label">{rule.ruleString}</label>
                            </div>
                        </li>
                    ))}
                </ul>
                <button className="btn btn-success" onClick={handleCombineRules}>
                    Combine Selected Rules
                </button>
            </div>
        </div>
    );
};

export default CombineRule;
