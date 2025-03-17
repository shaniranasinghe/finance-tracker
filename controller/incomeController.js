import Goal from '../model/goalModel.js';

export const allocateSavings = async (req, res) => {
    try {
        const { incomeAmount } = req.body;
        const goals = await Goal.find({ userId: req.user._id, savedAmount: { $lt: targetAmount } });

        let remainingIncome = incomeAmount;

        for (let goal of goals) {
            const amountNeeded = goal.targetAmount - goal.savedAmount;
            const allocation = Math.min(amountNeeded, remainingIncome);
            goal.savedAmount += allocation;
            remainingIncome -= allocation;

            await goal.save();

            if (remainingIncome <= 0) break;
        }

        res.status(200).json({ message: 'Savings allocated', remainingIncome });
    } catch (error) {
        res.status(500).json({ error: 'Error allocating savings' });
    }
};
