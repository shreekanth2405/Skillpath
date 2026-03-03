const prisma = require('../prismaClient');

// @desc    Get all upcoming events
// @route   GET /api/v1/events
// @access  Public
exports.getEvents = async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            orderBy: { date: 'asc' }
        });
        res.status(200).json({ success: true, count: events.length, data: events });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Register for an event
// @route   POST /api/v1/events/:id/register
// @access  Private
exports.registerForEvent = async (req, res) => {
    try {
        const eventId = req.params.id;

        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (!event) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }

        // Check if already registered
        const existing = await prisma.eventRegistration.findUnique({
            where: {
                userId_eventId: {
                    userId: req.user.id,
                    eventId: eventId
                }
            }
        });

        if (existing) {
            return res.status(400).json({ success: false, error: 'Already registered for this event' });
        }

        const registration = await prisma.eventRegistration.create({
            data: {
                userId: req.user.id,
                eventId: eventId
            }
        });

        res.status(201).json({ success: true, data: registration });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get user's registered events
// @route   GET /api/v1/events/my-registrations
// @access  Private
exports.getMyRegistrations = async (req, res) => {
    try {
        const registrations = await prisma.eventRegistration.findMany({
            where: { userId: req.user.id },
            include: { event: true }
        });

        res.status(200).json({ success: true, data: registrations });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Seed mock events (for dev)
// @route   POST /api/v1/events/seed
// @access  Private (Admin)
exports.seedEvents = async (req, res) => {
    try {
        await prisma.eventRegistration.deleteMany({});
        await prisma.event.deleteMany({});

        const newEvents = [
            {
                title: 'Global AI Summit 2026',
                organizer: 'Stanford University',
                description: 'The world\'s largest convergence of AI researchers, engineers, and visionaries.',
                date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // 1 day from now
                time: '10:00 AM EST',
                mode: 'Online',
                type: 'Conference',
                category: 'AI & Tech',
                price: 'Free',
                image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
                recommended: true,
                speakers: ['Dr. Fei-Fei Li', 'Yann LeCun', 'Andrew Ng'],
                creatorId: req.user.id
            },
            {
                title: 'Cloud Architecture Masterclass',
                organizer: 'Amazon Web Services',
                description: 'Earn your AWS Solutions Architect certification with hands-on labs.',
                date: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
                time: '11:00 AM PST',
                mode: 'Online',
                type: 'Certification',
                category: 'AI & Tech',
                price: 'Paid',
                image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
                recommended: false,
                speakers: ['Werner Vogels'],
                creatorId: req.user.id
            }
        ];

        const created = await prisma.event.createMany({ data: newEvents });

        res.status(201).json({ success: true, data: created });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
