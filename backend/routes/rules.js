const express = require("express");
const router = express.Router();
const ruleController = require("../controllers/rules");


router.post("/create", ruleController.createRule);

router.post("/combine", ruleController.combineRules);

router.post("/evaluate", ruleController.evaluateRule);

router.put('/modify/:id', ruleController.modifyRule);

router.get("/", ruleController.getAllRules);

router.delete('/delete/:id', ruleController.deleteRule);

module.exports = router;
