import React, { useState } from 'react';
import { deleteRule, updateRule } from '../api'; // Ensure this includes the updateRule function

const RuleList = ({ rules, onDelete }) => {
    const [editMode, setEditMode] = useState(null); // Track which rule is being edited
    const [editedRule, setEditedRule] = useState(''); // Hold the edited rule string

    const handleDeleteRule = async (ruleId) => {
        try {
            await deleteRule(ruleId);
            onDelete(); // Refresh the rule list
        } catch (error) {
            console.error('Error deleting rule', error);
        }
    };

    const handleEditRule = (ruleId, ruleString) => {
        setEditMode(ruleId);
        setEditedRule(ruleString);
    };

    const handleSaveEdit = async (ruleId) => {
        try {
            // Call the updateRule function with the ruleId and the updated rule string
            await updateRule(ruleId, { newRuleString: editedRule });
            setEditMode(null); // Exit edit mode after saving
            onDelete(); // Refresh the rule list
        } catch (error) {
            console.error('Error updating rule', error);
        }
    };

    const handleCancelEdit = () => {
        setEditMode(null); // Cancel edit mode
        setEditedRule(''); // Clear the edited rule
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
                            {editMode === rule._id ? (
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editedRule}
                                    onChange={(e) => setEditedRule(e.target.value)}
                                    placeholder="Edit rule..."
                                />
                            ) : (
                                <span>{rule.ruleString}</span>
                            )}
                            <div>
                                {editMode === rule._id ? (
                                    <>
                                        <button className="btn btn-success btn-sm me-2" onClick={() => handleSaveEdit(rule._id)}>
                                            Save
                                        </button>
                                        <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditRule(rule._id, rule.ruleString)}>
                                            Edit
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRule(rule._id)}>
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RuleList;
