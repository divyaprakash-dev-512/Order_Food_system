const express = require('express');

const {
  Register,
  login,
  AllUsers,
  getUserById,
  deleteUser,
  updateUserRole,
} = require('../controller/AuthController');
const {getFoodById} = require('../controller/foodController')

const router = express.Router()

router.post('/signup',Register)
router.post('/login',login);
router.get('/show-all-users',AllUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/role', updateUserRole);
router.get('/food/:id',getFoodById)

module.exports = router;
