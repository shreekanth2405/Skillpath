const mongoose = require('mongoose');

const JobMatchSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    relevanceScore: {
        type: Number,
        required: true
    },
    matchStatus: {
        type: String,
        enum: ['New', 'Saved', 'Viewed', 'Applied', 'Rejected', 'In Progress'],
        default: 'New'
    },
    skillGap: [{
        type: String // Skills required by job but missing in profile
    }],
    notified: {
        type: Boolean,
        default: false
    },
    notifiedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('JobMatch', JobMatchSchema);
