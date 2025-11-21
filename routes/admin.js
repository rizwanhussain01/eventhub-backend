const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getAllEventsAdmin,
  getDashboardStats
} = require('../controllers/adminController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/roleCheck');

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/events', getAllEventsAdmin);
router.get('/stats', getDashboardStats);

module.exports = router;
