import axios from 'axios';

const API_URL = 'http://localhost:7000/rules'; // Replace with your backend URL

// Fetch all rules
export const fetchRules = () => axios.get(`${API_URL}/`);

// Create a new rule
export const createRule = (ruleData) => axios.post(`${API_URL}/create`, ruleData);

// Combine rules
export const combineRules = (ruleStrings) => axios.post(`${API_URL}/combine`, { ruleStrings });

// Evaluate a rule
export const evaluateRule = (evaluationData) => axios.post(`${API_URL}/evaluate`, evaluationData);

// Delete a rule
export const deleteRule = (ruleId) => axios.delete(`${API_URL}/delete/${ruleId}`);
