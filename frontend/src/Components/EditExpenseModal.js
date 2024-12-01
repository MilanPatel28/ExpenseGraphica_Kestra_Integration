import React, { useState } from 'react';
import '../Styles/editmodal.css';

export default function EditExpenseModal({ expense, onSave, onClose }) {
  const [editedExpense, setEditedExpense] = useState(expense);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedExpense({ ...editedExpense, [name]: value });
  };

  const handleSave = () => {
    onSave(editedExpense);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h4>Edit Expense</h4>
        <div>Amount: 
          <input type="text" name="amount" value={editedExpense.amount} onChange={handleChange} />
        </div>
        <div>Category: 
          <input type="text" name="category" value={editedExpense.category} onChange={handleChange} />
        </div>
        <div>Mode of Expense: 
          <input type="text" name="modeOfExpense" value={editedExpense.modeOfExpense} onChange={handleChange} />
        </div>
        <div>Date: 
          <input type="text" name="date" value={editedExpense.date} onChange={handleChange} />
        </div>
        <div>Description: 
          <input type="text" name="description" value={editedExpense.description} onChange={handleChange} />
        </div>
        <button className='modal-btn' onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}
