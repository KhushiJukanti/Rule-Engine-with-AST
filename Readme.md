# Rule Engine with Abstract Syntax Tree (AST)

## Table of Contents
- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Folder Structure](#folder-structure)
- [Data Structure & Abstract Syntax Tree (AST)](#data-structure--abstract-syntax-tree-ast)
- [Pages and Components](#pages-and-components)
- [API Endpoints](#api-endpoints)
- [Running the Application](#running-the-application)
- [Conclusion](#conclusion)

## Project Overview

This project implements a rule engine using an Abstract Syntax Tree (AST) to evaluate user eligibility based on specific attributes like age, department, income, and spending. The platform allows users to create, combine, and evaluate rules. The rules are stored in the database and parsed into AST nodes for efficient evaluation.

## Technologies Used

- **Frontend**: React, Bootstrap
- **Backend**: Node.js, Express, MongoDB
- **Database**: MongoDB (for storing rules and combined rules)
- **Other Libraries**: Axios, Socket.IO, dotenv

## Setup Instructions

1. **Clone the repository :**
   ```bash
   git clone https://github.com/yourusername/rule-engine-ast.git
   cd rule-engine-ast
   ```
2. **Install dependencies :**
    - **For the frontend :**
        ```bash
        cd frontend
        npm install
        ```
      
    - **For the backend :** 
        ```bash
        cd backend
        npm install
        ```

3. **Create a `.env` file in the `backend` directory and set up your environment variables:**
    ```bash
    MONGO_URI=your_mongo_db_connection_string
    PORT=7000
    ```

4. **Ensure MongoDB is running and the environment variables are correctly set up in your `.env` file.**


## Folder Structure
```bash

    rule-engine-ast/
    ├── backend/
    │   ├── controllers/        # Contains logic for rule evaluation, AST parsing, and combining rules
    │   ├── models/             # MongoDB models for rules
    │   ├── routes/             # Defines API endpoints for rule operations
    │   ├── utils/              # Utility functions such as AST parsing
    │   ├── server.js           # Main server file
    │   ├── .env                # Environment variables
    │   └── package.json        # Backend dependencies
    ├── frontend/
    │   ├── public/
    │   │   └── index.html
    │   ├── src/
    │   │   ├── components/      # React components for rule input, evaluation, and listing
    │   │   ├── api/             # API calls (evaluate, create, and combine rules)
    │   │   ├── App.js           # Main app file
    │   │   └── index.js         # Entry point of the React app
    │   └── package.json         # Frontend dependencies
    └── README.md
```

## Data Structure & Abstract Syntax Tree (AST)

### Rule Nodes

Each rule is parsed into a node that represents a specific part of the rule. A rule can consist of conditions `(AND, OR)` and comparisons `(>, <, =)`.

The nodes are structured as follows:

- **Condition Node:**
    - `type: 'AND' | 'OR'`
    - `left: Node`
    - `right: Node`

- **Comparison Node:**
    - `type: '>' | '<' | '='`
    - `attribute: string` (e.g., age, department, salary)
    - `value: any`


## Abstract Syntax Tree (AST)
**An Abstract Syntax Tree (AST) is a hierarchical representation of the rule. Each node is either a condition or a comparison.**


## Pages and Components
- **RuleInput Component:**

    - Enables users to input custom rules in a string format.
    - The rule is parsed into an AST and stored in the backend.
- **CombineRule Component:**

    - Allows the user to combine existing rules using logical operators.
    - Provides options to save combined rules in the database.
- **EvaluateRule Component:**

    - Takes user data (e.g., age, department, salary, experience) and evaluates it against stored rules.
    - Displays `true` if any rule matches the data; otherwise, `false`.
- **RuleList Component:**

    - Displays all the stored rules, with options to delete or edit them.

## API Endpoints
### API Endpoints for Rule Operations:
- **POST** `/api/rules`: Create a new rule.

    - Body: `{ ruleString: "(age > 30 AND department = 'Sales')" }`
- **POST** `/api/rules/combine`: Combine multiple rules.

    - Body: `{ ruleIds: ['id1', 'id2'], operator: 'OR' }`
- **POST** `/api/rules/evaluate`: Evaluate a rule against user data.

    - Body: `{ data: { age: 35, department: 'Sales', salary: 50000 } }`
- **GET** `/api/rules`: Fetch all stored rules.

- **DELETE** `/api/rules/:id`: Delete a specific rule by its ID.


## Running the Application

1. **Start the backend server:**
    ```bash
    cd backend
    node server.js
    ```
2. **Start the frontend server:**
    ```blash
    cd frontend
    npm start
    ```

3. **Navigate to the app in your browser** at `http://localhost:3000`.


## Conclusion
This rule engine uses an AST to evaluate and combine rules efficiently. The platform allows users to create custom rules based on specific criteria and evaluate them against provided data. The ability to combine rules and store them in the database adds flexibility for more complex use cases.

If you have any questions or suggestions, feel free to contribute or raise an issue!
