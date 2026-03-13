const prisma = require('../prismaClient');

// @desc    Get all notifications for logged in user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
    try {
        let notification = await prisma.notification.findUnique({
            where: { id: req.params.id }
        });

        if (!notification) {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }

        if (notification.userId !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        notification = await prisma.notification.update({
            where: { id: req.params.id },
            data: { read: true }
        });

        res.status(200).json({ success: true, data: notification });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Mark all as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res) => {
    try {
        await prisma.notification.updateMany({
            where: { userId: req.user.id },
            data: { read: true }
        });

        res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await prisma.notification.findUnique({
            where: { id: req.params.id }
        });

        if (!notification) {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }

        if (notification.userId !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        await prisma.notification.delete({
            where: { id: req.params.id }
        });

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
