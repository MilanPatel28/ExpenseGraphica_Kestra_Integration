import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const RecentExpensesChart = () => {
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

  const getMonthlyExpenses = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const latestTwoMonthsExpenses = new Array(2).fill(0);

    expenseData.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const expenseMonth = expenseDate.getMonth();
      const expenseYear = expenseDate.getFullYear();

      if (
        (expenseYear === currentYear && expenseMonth === currentMonth) ||
        (expenseYear === currentYear && expenseMonth === currentMonth - 1)
      ) {
        // Adding expense amount to the respective month's total
        const index = expenseMonth === currentMonth ? 0 : 1;
        latestTwoMonthsExpenses[index] += expense.amount;
      }
    });

    return latestTwoMonthsExpenses;
  };

  const series = [{
    name: 'Expenses',
    data: getMonthlyExpenses()
  }];

  const options = {
    chart: {
      type: 'bar',
    },
    plotOptions: {
      bar: {
        borderRadius: 3,
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(2); // Format to two decimal places
      },
      offsetY: -20,
      style: {
        fontSize: '16px',
        colors: ["#000"]
      }
    },
    xaxis: {
      categories: ["Current Month", "Previous Month"],
      position: 'bottom',
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      crosshairs: {
        fill: {
          type: 'gradient',
          gradient: {
            colorFrom: '#D8E3F0',
            colorTo: '#BED1E6',
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          }
        }
      },
      tooltip: {
        enabled: true,
      },
      labels: {
        style: {
          colors: ["#000","#000"],
          fontSize: '16px',
        },
      }
    },
    yaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: ["#000","#000"],
          fontSize: '16px',
        },
      }
    },
    title: {
      text: 'Monthly Expenses',
      floating: true,
      offsetY: 500,
      align: 'center',
      style: {
        color: '#444'
      }
    }
  };

  return (
    <div>
      <div id="chart" className='d-flex justify-content-center'>
        <ReactApexChart options={options} series={series} type="bar" height={415} width={450} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default RecentExpensesChart;
