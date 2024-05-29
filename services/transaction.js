const { Transaction } = require('../db/models'); // Import your Transaction model

// Function to create a new transaction
async function createTransaction(data) {
  try {
    const transaction = await Transaction.create(data);
    return transaction;
  } catch (error) {
    throw new Error('Could not create transaction');
  }
}

// Function to get all transactions
async function getAllTransactions() {
  try {
    const transactions = await Transaction.findAll();
    return transactions;
  } catch (error) {
    throw new Error('Could not retrieve transactions');
  }
}

// Function to get a transaction by ID
async function getTransactionById(id) {
  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return transaction;
  } catch (error) {
    throw new Error('Could not retrieve transaction');
  }
}

// Function to update a transaction
async function updateTransaction(id, data) {
  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    await transaction.update(data);
    return transaction;
  } catch (error) {
    throw new Error('Could not update transaction');
  }
}

// Function to delete a transaction
async function deleteTransaction(id) {
  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    await transaction.destroy();
    return transaction;
  } catch (error) {
    throw new Error('Could not delete transaction');
  }
}

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
};
