const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
    ruleString: String,
    ast: Object, // Store the parsed AST representation
    isCombined: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    created_by: { type: String, required: true },
});

module.exports = mongoose.model('Rule', ruleSchema);
