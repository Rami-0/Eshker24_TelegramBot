const { Transaction } = require('../db/models'); // Import your Transaction model

class TransactionServices {
  // Function to create a new transaction
  static async createTransaction(data) {
    try {
      const transaction = await Transaction.create(data);
      return transaction;
    } catch (error) {
      throw new Error('Could not create transaction');
    }
  }

  // Function to get all transactions
  static async getAllTransactions() {
    try {
      const transactions = await Transaction.findAll();
      return transactions;
    } catch (error) {
      throw new Error('Could not retrieve transactions');
    }
  }

  // Function to get a transaction by ID
  static async getTransactionById(id) {
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
  static async updateTransaction(id, data) {
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
  static async deleteTransaction(id) {
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
}

module.exports = TransactionServices;
