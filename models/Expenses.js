const mongoose = require('mongoose');

const expensesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    home: {
        type: Number,
        required: true
    },
    food: {
        type: Number,
        required: true
    },
    healthAndInsurance: {
        type: Number,
        required: true
    },
    transportation: {
        type: Number,
        required: true
    },
    subscriptionAndExpenses: {
        type: Number,
        required: true
    },
    materialGoods: {
        type: Number,
        required: true
    },
    interest: {
        type: Number,
        required: true
    },
    misc: {
        type: Number,
        required: true
    },
    venmo: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Expenses', expensesSchema);