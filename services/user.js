const { User } = require('../db/models'); // Import your User model

// Function to create a new user
async function createUser(data) {
  try {
    const user = await User.create(data);
    return user;
  } catch (error) {
    throw new Error('Could not create user');
  }
}

// Function to get all users
async function getAllUsers() {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    throw new Error('Could not retrieve users');
  }
}

// Function to get a user by ID
async function getUserById(id) {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error('Could not retrieve user');
  }
}

// Function to update a user
async function updateUser(id, data) {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    await user.update(data);
    return user;
  } catch (error) {
    throw new Error('Could not update user');
  }
}

// Function to delete a user
async function deleteUser(id) {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    await user.destroy();
    return user;
  } catch (error) {
    throw new Error('Could not delete user');
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
