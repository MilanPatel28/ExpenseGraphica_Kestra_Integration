import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './Components/LoginForm';
import SignupForm from './Components/SignupForm';
import HomePage from './Components/HomePage'; // Create HomePage component
import AddExpense from './Components/AddExpense'; // Create AddExpense component
import StatementPage from './Components/StatementPage'; // Create Statement component
import DetailedReport from './Components/DetailedReport'; // Create DetailedReport component
import logo from './logo.svg';
// import './App.css';
// import './Styles/navbar.css'
// import './Styles/enterexpense.css'
// function App() {
//   return (
//     // <Navbar/>
//     <EnterExpense/>
//   );
// }

// export default App;
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (userData) => {
    // Implement login functionality here, e.g., make API call to backend
    console.log('Logging in with:', userData);
    // Set isLoggedIn to true if login is successful
    setIsLoggedIn(true);
  };

  const handleSignup = (userData) => {
    // Implement signup functionality here, e.g., make API call to backend
    console.log('Signing up with:', userData);
    // Set isLoggedIn to true if signup is successful
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm onLogin={handleLogin} />} />
        {/* <Route path="/login" element={<LoginForm onLogin={handleLogin} />} /> */}
        <Route path="/signup" element={<SignupForm onSignup={handleSignup} />} />
        <Route path="/add-expense" element={<AddExpense/>} />
        <Route path="/statement" element={<StatementPage/>} />
        <Route path="/detailed-report" element={<DetailedReport/>} />
        <Route path="/home" element={<HomePage /> } />
      </Routes>
    </Router>
  );
};

export default App;