const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    sourceUrl: {
        type: String,
        required: true,
        unique: true
    },
    sourceDomain: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    location: [{
        type: String
    }],
    experienceRequired: {
        type: String
    },
    skillsRequired: [{
        type: String
    }],
    rawDescription: {
        type: String
    },
    postedAt: {
        type: Date
    },
    discoveredAt: {
        type: Date,
        default: Date.now
    },
    isDuplicate: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Job', JobSchema);
