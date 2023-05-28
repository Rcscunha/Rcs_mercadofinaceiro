// app.js

document.addEventListener('DOMContentLoaded', () => {
    const countryFilter = document.getElementById('country-filter');
    const errorMessage = document.getElementById('error-message');
    const stockTableBody = document.getElementById('stock-table-body');
  
    const apiKeyAlphaVantage = '0KD285BZV25QIM4C'; // Insira sua chave de API Alpha Vantage aqui
    const apiKeyFinancialModelingPrep = '3b7150f92563ee1f3647e01f83c52119'; // Insira sua chave de API Financial Modeling Prep aqui
  
    let stockData = [];
  
    const fetchStockData = async (country) => {
      try {
        const responseAlphaVantage = await fetch(
          `https://www.alphavantage.co/query?function=LISTING_STATUS&state=${country}&apikey=${apiKeyAlphaVantage}`
        );
        const dataAlphaVantage = await responseAlphaVantage.json();
  
        if (dataAlphaVantage.data) {
          const symbols = dataAlphaVantage.data.map((item) => item.symbol);
          await Promise.all(
            symbols.map(async (symbol) => {
              const responseFinancialModelingPrep = await fetch(
                `https://financialmodelingprep.com/api/v3/company/profile/${symbol}?apikey=${apiKeyFinancialModelingPrep}`
              );
              const dataFinancialModelingPrep = await responseFinancialModelingPrep.json();
  
              if (dataFinancialModelingPrep.profile) {
                const stock = {
                  symbol: symbol,
                  price: parseFloat(dataFinancialModelingPrep.profile.price).toFixed(2),
                  change: parseFloat(dataFinancialModelingPrep.profile.changesPercentage).toFixed(2),
                  changePercent: parseFloat(dataFinancialModelingPrep.profile.changes).toFixed(2),
                  country: country === 'br' ? 'Brasil' : 'Estados Unidos',
                };
                stockData.push(stock);
              }
            })
          );
          displayStockData();
          clearErrorMessage();
        } else {
          displayErrorMessage('Não foi possível obter as ações do país selecionado. Por favor, tente novamente.');
        }
      } catch (error) {
        displayErrorMessage('Ocorreu um erro ao buscar as informações das ações.');
      }
    };
  
    const displayStockData = () => {
      stockTableBody.innerHTML = '';
  
      const filteredStockData = filterStockData(stockData, countryFilter.value);
  
      filteredStockData.forEach((stock) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${stock.symbol}</td>
          <td>${stock.price}</td>
          <td>${stock.change}</td>
          <td>${stock.changePercent}%</td>
          <td>${stock.country}</td>
        `;
        stockTableBody.appendChild(row);
      });
    };
  
    const filterStockData = (data, country) => {
      if (country === 'all') {
        return data;
      } else {
        return data.filter((stock) => stock.country.toLowerCase() === country.toLowerCase());
      }
    };
  
    const displayErrorMessage = (message) => {
      errorMessage.textContent = message;
    };
  
    const clearErrorMessage = () => {
      errorMessage.textContent = '';
    };
  
    const handleCountryFilter = () => {
      fetchStockData(countryFilter.value);
    };
  
    countryFilter.addEventListener('change', handleCountryFilter);
  
    fetchStockData('br'); // Carregar inicialmente as ações do Brasil
  });
  