const router = require('express').Router();
const Budgets = require('../models/Budgets');
const private = require('./verifyToken');
const { budgetsValidation, budgetUpdateValidation } = require('../validation');

router.post('/', private, async (req, res) => {

    // validate data

    const { error } = budgetsValidation(req.body);

    if (error) {
        res.status(400).json({error: error.details[0].message});
        return;
    }

    // Getting the user
    const user = req.user;

    // console.log(user);

    const budgetsObj = new Budgets({
        ...req.body, userId: user._id,
    })

    // Saving Budgets
    try {
        const savedBudgets = await budgetsObj.save();
        res.status(200).json({ savedBudgets });
    } catch (error) {
        res.status(404).json({ error });
    }

});

router.get('/', private, async (req, res) => {

    const user = req.user;

    try {
        const data = await Budgets.findOne({ userId: user._id });

        if (!data)
            return res.status(400).json({error:"Budgets are not defined yet ..."});

        res.status(200).json({ data });

    } catch (error) {
        res.status(400).json({ error });
    }
});

router.put('/', private, async (req, res) => {

    const { error } = budgetUpdateValidation(req.body);

    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }

    const user = req.user;

    try {
        const data = await Budgets.find({ userId: user._id });

        if (!data)
            return res.json({ error: "Budgets are not defined yet ..." });

        await Budgets.findOneAndUpdate({ userId: user._id }, { [req.body.budget]: req.body.value });

        res.status(200).json({ message: "Budget updated!" });

    } catch (error) {
        res.status(400).json({ error });
    }
});

module.exports = router;