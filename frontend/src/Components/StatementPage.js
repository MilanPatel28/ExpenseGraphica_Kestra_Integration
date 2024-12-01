import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import EditExpenseModal from './EditExpenseModal';
import styles from '../Styles/statementPage.module.css'
import Heading from './Heading';
export default function StatementPage() {
  const [expenses, setExpenses] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('x-auth-token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/expenses`, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': `${token}`
        }
      });
      const data = await response.json();
      const sortedExpenses = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setExpenses(sortedExpenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/expenses/${id}`, {
        method: 'DELETE'
      });
      setExpenses(expenses.filter(expense => expense._id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleEdit = (expense) => {
    console.log("i m in edit button expense");
    setSelectedExpense(expense);
    setEditModalOpen(true);
    console.log(expense);
  };

  const handleSaveEdit = (editedExpense) => {
    // Update the expense in local state
    const updatedExpenses = expenses.map(expense =>
      expense._id === editedExpense._id ? editedExpense : expense
    );
    setExpenses(updatedExpenses);

    // Send a request to update the expense on the server
    // You need to implement this part according to your backend API
    // For example:
    fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/expenses/${editedExpense._id}`, {
      method: 'PUT',
      body: JSON.stringify(editedExpense),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      // Handle response
    }).catch(error => {
      console.error('Error updating expense:', error);
    });

    setEditModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  // Function to format date to DD/MM/YYYY format
  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <Navbar />
      <div>
        <Heading text="Statement"/>
        <ul className={styles.outerUl}>
          {expenses.map(expense => (
            <li key={expense._id} className={styles.expenseItem}>
              <div className={styles.detailsDiv}>
                <p>Amount: {expense.amount}</p>
                <p>Category: {expense.category}</p>
                <p>Mode of Expense: {expense.modeOfExpense}</p>
                <p>Date: {formatDate(expense.date)}</p>
                <p>Description: {expense.description}</p>
              </div>
              <div className={styles.btnDiv}> 
                <button className={styles.btn} onClick={() => handleEdit(expense)}>Edit</button>
                <br/><br/>
                <button className={styles.btn} onClick={() => handleDelete(expense._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {editModalOpen && (
        <EditExpenseModal
          expense={selectedExpense}
          onSave={handleSaveEdit}
          onClose={handleCloseEditModal}
        />
      )}
    </>
  );
}
