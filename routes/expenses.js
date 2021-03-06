const router = require('express').Router();
const Expenses = require('../models/Expenses');
const private = require('./verifyToken');
const { expensesValidation, expenseUpdateValidation } = require('../validation');
const { string } = require('joi');

router.post('/', private, async (req, res) => {

    // validate data

    const { error } = expensesValidation(req.body);

    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }

    // Getting the user
    const user = req.user;

    // console.log(user);

    const expensesObj = new Expenses({
        ...req.body, userId: user._id
    })

    // Saving Expenses
    try {
        const savedExpenses = await expensesObj.save();
        res.status(200).json({ savedExpenses });
    } catch (error) {
        
        res.status(404).json({ error });
    }

});

router.get('/', private, async (req, res) => {

    const user = req.user;

    try {
        const data = await Expenses.findOne({ userId: user._id });

        if (!data)
            return res.status(400).json({ error: "Expenses are not defined yet ..." });

        res.status(200).json({ data });

    } catch (error) {
        res.status(400).json({ error });
    }
});

router.put('/addExpense', private, async (req, res) => {

    const { error } = expenseUpdateValidation(req.body);

    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }

    const user = req.user;

    try {
        const data = await Expenses.findOne({ userId: user._id });

        if (!data)
            return res.status(400).json({ error: "Expenses are not defined yet ..." });

        const flag = typeof req.body.value;

        let add = parseFloat(req.body.value);

        const newValue = (add + parseFloat(data[req.body.expense]));

        await Expenses.findOneAndUpdate({ userId: user._id }, { [req.body.expense]: newValue, totalExpense: (data.totalExpense + add) });

        res.status(200).send("Expense Updated");

    } catch (error) {
        res.status(400).json({ error });
    }
});

router.put('/reset', private, async (req, res) => {

    const user = req.user;
    try {
        const data = await Expenses.findOne({ userId: user._id });

        if (!data) {
            return res.send("Expenses are not defined yet ...");
        }

        Expenses.findOneAndUpdate({ userId: user._id }, {
            "$set": {
                "groeries": 0,
                "housing": 0,
                "transportation": 0,
                "clothing": 0,
                "health": 0,
                "disretionary": 0,
                "education": 0,
                "communication": 0,
                "misc": 0,
                "totalExpense" : 0
            }
        }).exec(function (err, obj) {
            if (err) {
                res.status(400).json({ error: err });
            }
            res.status(200).json({ message: "Expenses reset" });
        });

    } catch (error) {
        res.status(400).json({ error });
    }
});

module.exports = router;