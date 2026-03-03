const prisma = require('./prismaClient');
const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY || 'dummy_key');
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID || 'AC_dummy', process.env.TWILIO_AUTH_TOKEN || 'dummy');
const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

console.log("==================================================");
console.log("⏰ SKILLPATH NOTIFICATION & SCHEDULER ENGINE ⏰");
console.log("==================================================");

// Connects to DB directly
async function analyzeAndNotify() {
    try {
        console.log(`[${new Date().toISOString()}] Analyzing upcoming schedules and user registrations...`);

        // Fetch events happening in the next 24 hours
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        let upcomingEvents = [];

        try {
            upcomingEvents = await prisma.event.findMany({
                where: {
                    date: {
                        gt: now,
                        lte: tomorrow
                    }
                },
                include: {
                    registrations: {
                        include: {
                            user: true
                        }
                    }
                }
            });
        } catch (dbError) {
            console.warn(`[WARNING] Database connection timeout. Utilizing fallback offline event data for notifications.`);
            // Mock offline data
            upcomingEvents = [
                {
                    id: 'mock-1',
                    title: 'Generative AI Workshop 2026',
                    type: 'Workshop',
                    mode: 'Online',
                    date: new Date(now.getTime() + 12 * 60 * 60 * 1000), // 12 hours from now
                    registrations: [
                        {
                            user: {
                                id: 'mock-u1',
                                name: 'Alex Developer',
                                email: 'alex@example.com',
                                phone: '+1234567890',
                                notificationEmail: true,
                                notificationWhatsapp: true
                            }
                        }
                    ]
                }
            ];
        }

        if (upcomingEvents.length === 0) {
            console.log("No upcoming events found within the next 24 hours.");
            return;
        }

        console.log(`Found ${upcomingEvents.length} upcoming events. Checking registrations...`);

        for (const event of upcomingEvents) {
            const timeUntilEventMs = event.date.getTime() - now.getTime();
            const hoursUntilEvent = timeUntilEventMs / (1000 * 60 * 60);

            console.log(`\n[ALERT] Upcoming Event Detected: ${event.title}`);
            console.log(`Time remaining: ${Math.round(hoursUntilEvent)} hours`);
            console.log(`Registered Attendees: ${event.registrations.length}`);

            event.registrations.forEach(reg => {
                const user = reg.user;
                // Check user preferences
                if (user.notificationEmail || user.notificationWhatsapp) {
                    const mechanisms = [];
                    if (user.notificationEmail) mechanisms.push('Email');
                    if (user.notificationWhatsapp) mechanisms.push('WhatsApp');

                    console.log(`   -> Sending ${mechanisms.join(' & ')} to ${user.name} (${user.email})...`);

                    const messageBody = `Hi ${user.name}, your scheduled ${event.type} '${event.title}' starts in ${Math.round(hoursUntilEvent)} hours. Join via ${event.mode} link.`;
                    console.log(`      [Payload]: "${messageBody}"`);

                    if (user.notificationEmail && process.env.SENDGRID_API_KEY && !process.env.SENDGRID_API_KEY.includes('placeholder')) {
                        sgMail.send({
                            to: user.email,
                            from: 'notifications@skillpath.ai',
                            subject: `Reminder: ${event.title} is starting soon!`,
                            text: messageBody
                        }).then(() => console.log('      [Email] Sent successfully'))
                            .catch(e => console.error('      [Email] Error sending:', e.response ? e.response.body : e));
                    } else if (user.notificationEmail) {
                        console.log('      [Email] SendGrid API Key is a placeholder. Skipping actual send.');
                    }

                    if (user.notificationWhatsapp && user.phone && process.env.TWILIO_ACCOUNT_SID && !process.env.TWILIO_ACCOUNT_SID.includes('placeholder')) {
                        twilioClient.messages.create({
                            body: messageBody,
                            from: twilioNumber,
                            to: `whatsapp:${user.phone}`
                        }).then(() => console.log('      [WhatsApp] Sent successfully'))
                            .catch(e => console.error('      [WhatsApp] Error sending:', e));
                    } else if (user.notificationWhatsapp) {
                        console.log('      [WhatsApp] Twilio SID is missing/placeholder or user has no phone number. Skipping actual send.');
                    }
                } else {
                    console.log(`   -> Skipping ${user.name} - Notifications disabled.`);
                }
            });
        }

        console.log("\n==================================================");
        console.log("✅ Scheduler Engine Cycle Complete.");

    } catch (err) {
        console.error("Scheduler Error:", err);
    }
}

module.exports = { analyzeAndNotify };
