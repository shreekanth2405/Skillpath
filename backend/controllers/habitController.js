const prisma = require('../prismaClient');

// @desc    Get all habits for logged in user
// @route   GET /api/v1/habits
// @access  Private
exports.getHabits = async (req, res) => {
    try {
        const habits = await prisma.habit.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            success: true,
            count: habits.length,
            data: habits
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create new habit
// @route   POST /api/v1/habits
// @access  Private
exports.createHabit = async (req, res) => {
    try {
        const { title, category, frequency, reminder, target, xpPerCompletion, color } = req.body;

        const habit = await prisma.habit.create({
            data: {
                userId: req.user.id,
                title,
                category,
                frequency,
                reminder,
                target: target || 30,
                xpPerCompletion: xpPerCompletion || 30,
                color
            }
        });

        res.status(201).json({
            success: true,
            data: habit
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Complete a habit for today
// @route   PUT /api/v1/habits/:id/complete
// @access  Private
exports.completeHabit = async (req, res) => {
    try {
        let habit = await prisma.habit.findUnique({
            where: { id: req.params.id }
        });

        if (!habit) {
            return res.status(404).json({ success: false, error: 'Habit not found' });
        }

        if (habit.userId !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        if (habit.completedToday) {
            return res.status(400).json({ success: false, error: 'Already completed today' });
        }

        habit = await prisma.habit.update({
            where: { id: req.params.id },
            data: {
                completedToday: true,
                streak: habit.streak + 1,
                totalDone: habit.totalDone + 1,
                lastCompletedAt: new Date()
            }
        });

        // Award XP to user
        await prisma.user.update({
            where: { id: req.user.id },
            data: {
                xp: { increment: habit.xpPerCompletion }
            }
        });

        res.status(200).json({
            success: true,
            data: habit
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete habit
// @route   DELETE /api/v1/habits/:id
// @access  Private
exports.deleteHabit = async (req, res) => {
    try {
        const habit = await prisma.habit.findUnique({
            where: { id: req.params.id }
        });

        if (!habit) {
            return res.status(404).json({ success: false, error: 'Habit not found' });
        }

        if (habit.userId !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        await prisma.habit.delete({
            where: { id: req.params.id }
        });

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
