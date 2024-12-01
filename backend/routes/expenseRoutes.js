// expenseRoutes.js

const { doesFileExistInKestra, deleteFileFromKestra, uploadFileToKestra} = require('../utils/FileHandlingKestra');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Expense = require('../models/Expense');
const { Parser } = require('json2csv'); // Library to convert JSON to CSV
const axios = require('axios')
const path = require('path');
const fs = require('fs-extra');

// @route   GET /api/expenses
// @desc    Get all expenses
// @access  Private
router.get('/expenses', authMiddleware, async (req, res) => {
  try {
    // Get expenses for the authenticated user
    const expenses = await Expense.find({ user: req.user.id });
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/expenses
// @desc    Add a new expense
// @access  Private
router.post('/expenses', authMiddleware, async (req, res) => {
  try {
    const { amount, category, modeOfExpense, date, description } = req.body;

    // Create new expense
    const newExpense = new Expense({
      amount,
      category,
      modeOfExpense,
      date,
      description,
      user: req.user.id // Associate expense with the logged-in user
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Route to send the data as a csv to kestra's internal storage using Kestra's API
// Issue: Resolved
router.post('/expenses/sendReport', authMiddleware, async (req, res) => {
  try {
    // Get the authenticated user's ID
    const userId = req.user.id;
    console.log("UserID: ", userId);

    // Fetch the user's expenses
    const expenses = await Expense.find({ user: userId });

    if (expenses.length === 0) {
      return res.status(404).json({ message: 'No expenses found for this user.' });
    }

    // Prepare data for CSV conversion
    const fields = ['amount', 'category', 'modeOfExpense', 'date', 'description'];
    const json2csvParser = new Parser({ fields });
    const csvData = json2csvParser.parse(expenses);

    // Save the CSV data to a temporary file
    const filePath = path.join(__dirname, 'temp_expenses.csv');
    fs.writeFileSync(filePath, csvData);

    const filename = 'temp_expenses.csv';
    const kestraApiBaseUrl = 'http://localhost:8080/api/v1/namespaces/company.team/files'; // Kestra API base URL

    // Upload the file to Kestra
    console.log('Uploading file to Kestra...');
    await uploadFileToKestra(kestraApiBaseUrl, filename, filePath);
    console.log('File uploaded successfully.');

    const formData = new FormData();
    formData.append('fileContent', fs.createReadStream(filePath));
    await axios.post(`http://localhost:8080/api/v1/executions/company.team/make_and_send_pdf`, formData, {
      headers: {
        // ...formData.getHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });

    // Clean up the temporary file
    fs.unlinkSync(filePath);
    
    res.status(200).json({ message: 'File sent successfully to Kestra!' });

  } catch (error) {
    console.error('Error in /api/expenses/sendReport:', error.response?.data || error.message);
    res.status(500).json({ error: 'An error occurred while sending the CSV file.' });
  }
});

router.put('/expenses/:id', async (req, res) => {
  const { id } = req.params;
  const { amount, category, modeOfExpense, date, description } = req.body;

  try {
    const expense = await Expense.findByIdAndUpdate(
      id,
      { amount, category, modeOfExpense, date, description },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/expenses/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;