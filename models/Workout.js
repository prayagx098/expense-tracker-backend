const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    fkUserLoginId: { type: mongoose.Schema.Types.ObjectId, required: true },
    monday: [{ 
        name: String, 
        isCompleted: Boolean, 
        note: String, 
        timeTaken: Number, 
        rescheduledFrom: String 
    }],
    tuesday: [{ 
        name: String, 
        isCompleted: Boolean, 
        note: String, 
        timeTaken: Number,
        rescheduledFrom: String
    }],
    wednesday: [{ 
        name: String, 
        isCompleted: Boolean, 
        note: String, 
        timeTaken: Number,
        rescheduledFrom: String
    }],
    thursday: [{ 
        name: String, 
        isCompleted: Boolean, 
        note: String, 
        timeTaken: Number,
        rescheduledFrom: String
    }],
    friday: [{ 
        name: String, 
        isCompleted: Boolean, 
        note: String, 
        timeTaken: Number,
        rescheduledFrom: String
    }],
    saturday: [{ 
        name: String, 
        isCompleted: Boolean, 
        note: String, 
        timeTaken: Number,
        rescheduledFrom: String
    }],
    sunday: [{ 
        name: String, 
        isCompleted: Boolean, 
        note: String, 
        timeTaken: Number,
        rescheduledFrom: String
    }]
});

module.exports = mongoose.model('Workout', workoutSchema);