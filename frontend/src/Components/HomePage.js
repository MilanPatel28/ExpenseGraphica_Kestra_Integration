import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import React from 'react';
import Navbar from './Navbar';
import RecentExpensesChart from './RecentExpensesChart';
import styles from '../Styles/homepage.module.css'
import Heading from './Heading';
export default function HomePage() {
  const [expenseData, setExpenseData] = useState([]);
  const [latestExpenses, setLatestExpenses] = useState([]);

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
      setExpenseData(data);
      // Set the latest two expenses
      setLatestExpenses(data.slice(0, 2));
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const calculateAverageExpenses = () => {
    const totalAmount = expenseData.reduce((acc, expense) => acc + expense.amount, 0);
    const totalExpenses = expenseData.length;
    if (totalExpenses === 0) return 0;
    return (totalAmount / totalExpenses).toFixed(2);
  };

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
      <Heading text="ExpenseGraphica" />
      <div>
        <div className={styles.div1}>
          <h4>Average Expenses per day: &#8377;{calculateAverageExpenses()}</h4><br/>
          <RecentExpensesChart />
          <Link to="/detailed-report">
            <button className='btn btn-primary my-2'>View Detailed Report</button>
          </Link>
        </div>
        <div className={styles.div2}> 
          <h4>Latest Expenses</h4>
          <ul>
            {latestExpenses.map(expense => (
              <li key={expense._id} className={styles.expenseItem} style={{marginLeft:"-40px"}}>
                <div className={styles.detailsDiv}>
                  <p>Amount: {expense.amount}</p>
                  <p>Category: {expense.category}</p>
                  <p>Mode of Expense: {expense.modeOfExpense}</p>
                  <p>Date: {formatDate(expense.date)}</p>
                  <p>Description: {expense.description}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/statement">
            <button className='btn btn-primary my-2' style={{display:"flex", marginLeft:"35%"}}>View All Expenses</button>
          </Link>
        </div>
      </div>
    </>
  );
}
