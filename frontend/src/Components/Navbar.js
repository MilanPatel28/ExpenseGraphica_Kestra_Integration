// import React from 'react';
// import { Link } from 'react-router-dom';
// import '../Styles/navbar.css';

// export default function Navbar() {
//     return (
//         <>
//             <div>
//                 <div id="nav-bar">
//                     <input type="checkbox" id="nav-toggle" />
//                     <div id="nav-header">
//                         <label htmlFor="nav-toggle"><span id="nav-toggle-burger"></span></label>
//                         <Link id="nav-title" to="/home">ExpenseGraphica</Link>
//                         <hr />
//                     </div>
//                     <div id="nav-content">
//                         <Link to="/add-expense">
//                             <div className="nav-button"><i className="bi bi-plus-square"></i><span>Add Expense</span></div>
//                         </Link>
//                         <Link to="/statement">
//                             <div className="nav-button"><i className="bi bi-cash"></i><span>Statement</span></div>
//                         </Link>
//                         <Link to="/detailed-report">
//                             <div className="nav-button"><i className="bi bi-bar-chart-line-fill"></i><span>Detailed Report</span></div>
//                         </Link>
//                         <Link to="/">
//                             <div className="nav-button"><i className="bi bi-box-arrow-left"></i><span>Log Out</span></div>
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/navbar.css'; // Assuming you have CSS for styling

export default function Navbar() {
    const navContentRef = useRef(null);

    const toggleNavbar = () => {
        const navContent = navContentRef.current;
        if (navContent) {
            navContent.classList.toggle('open');
        }
    };

    return (
        <div id="nav-bar" style={{zIndex:1}}>
            <input id="nav-toggle" type="checkbox" defaultChecked />
            <div id="nav-header">
                <Link to="/home">
                    <span id="nav-title">ExpenseGraphica</span>
                </Link>
                <label htmlFor="nav-toggle" onClick={toggleNavbar}><span id="nav-toggle-burger"></span></label>
                <hr/>
            </div>
            <div id="nav-content">
                <Link to="/add-expense">
                    <div className="nav-button"><i className="bi bi-plus-square"></i><span>Add Expense</span></div>
                </Link>
                <Link to="/statement">
                    <div className="nav-button"><i className="bi bi-cash"></i><span>Statement</span></div>
                </Link>
                <Link to="/detailed-report">
                    <div className="nav-button"><i className="bi bi-bar-chart-line-fill"></i><span>Detailed Report</span></div>
                </Link>
                <Link to="/">
                        <div className="nav-button"><i className="bi bi-box-arrow-left"></i><span>Log Out</span></div>
                </Link>
            </div>
        </div>
    );
}