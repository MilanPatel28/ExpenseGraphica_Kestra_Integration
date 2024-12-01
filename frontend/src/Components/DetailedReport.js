// import React from 'react'
// import Navbar from './Navbar'
// import ColumnChart from './ColumnChart'
// import DonutChart from './DonutChart'
// import Heading from './Heading'
// import styles from '../Styles/detailedreport.module.css'
// export default function DetailedReport() {
//   return (
//     <>
//     <div>
//       <Navbar />
//       <Heading text="Detailed Report" />
//       <div className={styles.div1} >
//         <h3>Month-wise Expenses</h3>
//         <ColumnChart/>
//       </div>
//       <div className={styles.div2} >
//         <h3>Category-wise Expenses</h3>
//         <DonutChart/>
//       </div>
//     </div>
//     </>
//   )
// }


import React from 'react';
import Navbar from './Navbar';
import ColumnChart from './ColumnChart';
import DonutChart from './DonutChart';
import Heading from './Heading';
import styles from '../Styles/detailedreport.module.css';
import axios from 'axios'; // For API calls

export default function DetailedReport() {
  const handleSendReport = async () => {
    try {
      const token = localStorage.getItem('x-auth-token'); // Assuming you're storing the token in localStorage
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASEURL}/expenses/sendReport`,
        {}, // No body required, as the user ID is derived from the token
        {
          headers: {
              'Content-Type': 'application/json',
              'x-auth-token': `${token}`
          },
        }
      );
      if (response.status === 200) {
        alert('Report request sent successfully!');
      } else {
        alert('Failed to send report request.');
      }
    } catch (error) {
      console.error('Error sending report:', error);
      alert('An error occurred while sending the report.');
    }
  };

  return (
    <>
      <div>
        <Navbar />
        <Heading text="Detailed Report" />
        <div className={styles.div1}>
          <h3>Month-wise Expenses</h3>
          <ColumnChart />
        </div>
        <div className={styles.div2}>
          <h3>Category-wise Expenses</h3>
          <DonutChart />
        </div>
      </div>
        <button type="submit" className="btn btn-primary" onClick={handleSendReport}>
          Send Me Report
        </button>
    </>
  );
}