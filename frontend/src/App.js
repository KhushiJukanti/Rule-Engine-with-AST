import React, { useState, useEffect } from 'react';
import { fetchRules } from './api';
import './App.css'
import RuleInput from './components/Ruleinput';
import RuleList from './components/RuleList';
import CombineRule from './components/CombineRule';
import EvaluateRule from './components/EvaluateRule';

const App = () => {
    const [rules, setRules] = useState([]);

    useEffect(() => {
        loadRules();
    }, []);

    const loadRules = async () => {
        try {
            const response = await fetchRules();
            setRules(response.data);
        } catch (error) {
            console.error('Error fetching rules', error);
        }
    };

    return (
        <div className="container my-4">
            <h1 className="text-center mb-4">Rule Engine</h1>
            <div className="row">
                <div className="col-md-6">
                    <RuleInput onRuleAdded={loadRules} />
                </div>
                <div className="col-md-6">
                    <RuleList rules={rules} onDelete={loadRules} />
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col-md-6">
                    <CombineRule rules={rules} onRulesCombined={loadRules} />
                </div>
                <div className="col-md-6">
                    <EvaluateRule />
                </div>
            </div>
        </div>
    );
};

export default App;
