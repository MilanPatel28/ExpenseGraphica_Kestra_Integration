import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const DonutChart = () => {
  const [expenseData, setExpenseData] = useState([]);

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
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const getCategoryCounts = () => {
    const categoryCounts = {
      Food: 0,
      Bills: 0,
      Health: 0,
      Transportation: 0,
      Shopping: 0,
      Entertainment: 0
    };

    expenseData.forEach(expense => {
      categoryCounts[expense.category] += 1;
    });

    return Object.values(categoryCounts);
  };

  const series = getCategoryCounts();

  const options = {
    chart: {
      type: 'donut',
    },
    labels: ['Food', 'Bills', 'Health', 'Transportation', 'Shopping', 'Entertainment'],
    fill: {
      colors: ['#50BD12', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#00FFFF'],
    },
    legend: {
      markers: {
        fillColors: ['#50BD12', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#00FFFF'],
      },
      position: 'bottom',
      fontSize: '18px',
      labels: {
          colors: ['#000','#000','#000','#000','#000','#000'],
          useSeriesColors: false
      },
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  return (
    <div>
      <div id="chart" style={{adding:"10px", margin:"10px"}}>
        <ReactApexChart options={options} series={series} type="donut" height={447} width={600} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default DonutChart;
