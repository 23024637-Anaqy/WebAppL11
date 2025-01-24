const express = require('express');
const Workout = require('../models/workoutModel');
const authenticate = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  const workouts = await Workout.find({ userId: req.userId });
  res.json(workouts);
});

router.get('/:id', authenticate, async (req, res) => {
  const workout = await Workout.findOne({ _id: req.params.id, userId: req.userId });
  if (!workout) {
    return res.status(404).json({ error: 'Workout not found' });
  }
  res.json(workout);
});

router.post('/', authenticate, async (req, res) => {
  const { title, reps, load } = req.body;
  const workout = new Workout({ title, reps, load, userId: req.userId });
  await workout.save();
  res.status(201).json(workout);
});

router.patch('/:id', authenticate, async (req, res) => {
  const workout = await Workout.findOne({ _id: req.params.id, userId: req.userId });
  if (!workout) {
    return res.status(404).json({ error: 'Workout not found' });
  }
  workout.set(req.body);
  await workout.save();
  res.json(workout);
});

router.delete('/:id', authenticate, async (req, res) => {
  const workout = await Workout.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!workout) {
    return res.status(404).json({ error: 'Workout not found' });
  }
  res.json(workout);
});

module.exports = router;