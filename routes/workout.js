const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');

// Fetch or create workout schedule
router.get('/workout/:userId', async (req, res) => {
    try {
        let workout = await Workout.findOne({ fkUserLoginId: req.params.userId });
        if (!workout) {
            // Initialize with 5 default workouts for each day
            workout = new Workout({
                fkUserLoginId: req.params.userId,
                monday: Array(5).fill({ name: "", isCompleted: false, note: "", timeTaken: 0, rescheduledFrom: "" }),
                tuesday: Array(5).fill({ name: "", isCompleted: false, note: "", timeTaken: 0, rescheduledFrom: "" }),
                wednesday: Array(5).fill({ name: "", isCompleted: false, note: "", timeTaken: 0, rescheduledFrom: "" }),
                thursday: Array(5).fill({ name: "", isCompleted: false, note: "", timeTaken: 0, rescheduledFrom: "" }),
                friday: Array(5).fill({ name: "", isCompleted: false, note: "", timeTaken: 0, rescheduledFrom: "" }),
                saturday: Array(5).fill({ name: "", isCompleted: false, note: "", timeTaken: 0, rescheduledFrom: "" }),
                sunday: Array(5).fill({ name: "", isCompleted: false, note: "", timeTaken: 0, rescheduledFrom: "" }),
            });
            await workout.save();
        }
        res.json(workout);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update workout schedule
router.post('/workout/:userId', async (req, res) => {
    try {
        const { day, workouts } = req.body;
        const workout = await Workout.findOne({ fkUserLoginId: req.params.userId });
        if (!workout) {
            return res.status(404).send('Workout not found');
        }
        workout[day] = workouts;
        await workout.save();
        res.json(workout);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Reschedule workout
router.post('/workout/reschedule/:userId', async (req, res) => {
    try {
        const { fromDay, toDay, workoutIndex } = req.body;
        const workout = await Workout.findOne({ fkUserLoginId: req.params.userId });
        if (!workout) {
            return res.status(404).send('Workout not found');
        }

        // Move the workout from one day to another
        const movedWorkout = workout[fromDay][workoutIndex];
        movedWorkout.rescheduledFrom = fromDay; // Track where it was rescheduled from
        workout[toDay].push(movedWorkout);

        // Remove the workout from the original day
        workout[fromDay].splice(workoutIndex, 1);

        await workout.save();
        res.json(workout);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;