import Goal from '../model/goalModel.js';
import { convertCurrency } from '../utils/currencyUtils.js';

// Create a new goal
export const createGoal = async (req, res) => {
    try {
        const { title, targetAmount, deadline, currency } = req.body;

        const baseCurrency = 'USD';
        let convertedAmount = null;

        if (!title || !targetAmount || !deadline) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (currency !== baseCurrency) {
            convertedAmount = await convertCurrency(targetAmount, currency, baseCurrency);
        }

        const newGoal = new Goal({
            userId: req.user._id,
            title,
            targetAmount: convertedAmount || targetAmount,
            deadline,
            currency,
        });
        await newGoal.save();
        res.status(201).json(newGoal);
    } catch (error) {
        console.error('Error creating goal:', error.message); // Log the error
        res.status(500).json({ error: 'Error creating goal' });
    }
};


// Get all goals for a user
export const getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.user._id });
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching goals' });
    }
};

// Update a goal
export const updateGoal = async (req, res) => {
    try {
        const updatedGoal = await Goal.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );
        res.status(200).json(updatedGoal);
    } catch (error) {
        res.status(500).json({ error: 'Error updating goal' });
    }
};

// Delete a goal
export const deleteGoal = async (req, res) => {
    try {
        await Goal.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Goal deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting goal' });
    }
};

export const getGoalProgress = async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.user._id });
        const progress = goals.map(goal => ({
            title: goal.title,
            progress: (goal.savedAmount / goal.targetAmount) * 100,
        }));
        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching progress' });
    }
};

