import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const ColumnChart = () => {
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
    const monthlyExpenses = new Array(12).fill(0);

    expenseData.forEach(expense => {
      const month = new Date(expense.date).getMonth();
      monthlyExpenses[month] += expense.amount;
    });

    return monthlyExpenses;
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
        colors: {
          ranges: [{
              from: 0.00,
              to: 2532.00,
              color: '#1260ff'
          }],
          backgroundBarColors: [],
          backgroundBarOpacity: 1,
          backgroundBarRadius: 0,
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
        fontSize: '12px',
        colors: ["#000"]
      }
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      position: 'bottom',
      axisBorder: {
        show: true
      },
      axisTicks: {
        show: true
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
          colors: ["#000","#000","#000","#000","#000","#000","#000","#000","#000","#000","#000","#000"],
          fontSize: '16px',
        }
      }
    },
    yaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: true,
      },
      labels: {
        show: true,
        formatter: function (val) {
          return val.toFixed(2); // Format to two decimal places
        },
        style: {
          colors: ["#000","#000","#000","#000","#000","#000","#000","#000","#000","#000","#000","#000"],
          fontSize: '16px',
        }
      }
    },
  };

  return (
    <div>
      <div id="chart" style={{padding:"10px", margin:"10px"}}>
        <ReactApexChart options={options} series={series} type="bar" height={400} width={600} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ColumnChart;
