import React, { useState, useEffect } from 'react';
import { Slider } from '@mui/material';

function valueText(value, index) {
  const date = new Date(value);
  return date.toLocaleDateString("pt-BR");
}

function StockData() {
  const [stockData, setStockData] = useState([]);
  const [dividendsData, setDividendsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [initialMoney, setInitialMoney] = useState(1000.00);
  const [finalMoney, setFinalMoney] = useState(1000.00);

  const [monthlyMoney, setMonthlyMoney] = useState(0.00);
  const [totalInvested, setTotalInvested] = useState(0.00);

  const [sliderValue, setSliderValue] = useState([0, 1]);
  const [sliderMin, setSliderMin] = useState(0);
  const [sliderMax, setSliderMax] = useState(1);
  const backendUrl = 'http://localhost:5000';

  const generatePlotData = (initialValue, dates) => {
    const filteredData = stockData.filter((item) => item[0] >= dates[0] && item[0] <= dates[1]);

    const newData = [];

    // Buy stocks through the days as money becomes available
    let stockAmount = 0;
    let currentMoney = initialValue;
    setTotalInvested(currentMoney);

    const filteredDividends = dividendsData.filter((item) => item.date_ex >= dates[0]);
    let curDivIndex = 0;

    for (let i = 0; i < filteredData.length; i++) {
      // Check how many stocks can be bought in this day
      if (currentMoney >= filteredData[i][1]) {
        stockAmount += Math.floor((currentMoney / filteredData[i][1]));
        currentMoney = ((currentMoney*100) % (filteredData[i][1]*100))/100;
        // console.log(`Bought stocks in ${new Date(filteredData[i][0])} for \$${filteredData[i][1]}, stocks: ${stockAmount}, money left: \$${currentMoney}`);

      }

      if (filteredData[i][0] == filteredDividends[curDivIndex].date_ex) {
        currentMoney += filteredDividends[curDivIndex].value * stockAmount;
        // console.log(`Received \$${filteredDividends[curDivIndex].value * stockAmount} dividends (${filteredDividends[curDivIndex].value}) in ${new Date(filteredData[i][0])}`);
        curDivIndex++;

        if (monthlyMoney > 0) {
          currentMoney += monthlyMoney;
          setTotalInvested((a) => a + monthlyMoney);
        }
      }

      newData.push([filteredData[i][0], filteredData[i][1] * stockAmount + currentMoney]);
    }
    setFinalMoney(newData[newData.length-1][1]);

    plotChart(newData);
  };

  const plotChart = (data) => {
    Highcharts.chart('container', {
      title: {
          text: '',
          align: 'left'
      },
  
      yAxis: {
          title: {
              text: 'Valor'
          }
      },
  
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Date Range'        
        }
      },
  
      legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle'
      },
  
      plotOptions: {
          series: {
              label: {
                  connectorAllowed: false
              },
          }
      },
  
      series: [{
          name: 'HGRE11',
          data: data
      }],
  
      responsive: {
          rules: [{
              condition: {
                  maxWidth: 500
              },
              chartOptions: {
                  legend: {
                      layout: 'horizontal',
                      align: 'center',
                      verticalAlign: 'bottom'
                  }
              }
          }]
      }
  
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `${backendUrl}/api/stock-data?stock=HGRE11&start=2020-01-01`
        );
        const data = await response.json();
        setStockData(data);

        const dividendsResponse = await fetch(
          `${backendUrl}/api/dividend-data?stock=HGRE11&start=2020-01-01`
        );
        const divData = await dividendsResponse.json();
        setDividendsData(divData);

        setSliderValue([data[0][0], data[data.length-1][0]]);
        setSliderMin(data[0][0]);
        setSliderMax(data[data.length-1][0]);
        
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    if (!loading) {
      generatePlotData(initialMoney, sliderValue);
    }
  }, [loading, initialMoney, sliderValue, monthlyMoney]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const changeInitialMoney = (event, newValue) => {
    setInitialMoney(event.target.valueAsNumber);
  };

  const changeMonthlyMoney = (event, newValue) => {
    setMonthlyMoney(event.target.valueAsNumber);
  };

  const changeDate = (event, newValue) => {
    setSliderValue(newValue);
  };

  return (
    <div>
      <h1>Stock Data</h1>
      <div id="container"></div>

      <div style={{textAlign: "center", margin: "auto", maxWidth: "50%"}}>
        <p>Initial Value</p>
        <input value={initialMoney} onChange={changeInitialMoney} type="number"></input>
        <p>Monthly Investments</p>
        <input value={monthlyMoney} onChange={changeMonthlyMoney} type="number"></input>
        <p>Period</p>
        <div>
          <Slider
            value={sliderValue}
            min={sliderMin}
            max={sliderMax}
            onChange={changeDate}
            valueLabelDisplay="auto"
            valueLabelFormat={valueText}
          />
        </div>
        <p>Result: {finalMoney.toFixed(2)} with {totalInvested.toFixed(2)} at { ((finalMoney - totalInvested) / (totalInvested/100)).toFixed(2) }% profit</p>
      </div>
    </div>
  );
}

export default StockData;