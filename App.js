// app.js

document.addEventListener('DOMContentLoaded', () => {
  const countryFilter = document.getElementById('country-filter');
  const errorMessage = document.getElementById('error-message');
  const stockTableBody = document.getElementById('stock-table-body');

  const apiKeyAlphaVantage = '0KD285BZV25QIM4C'; // INSIRA SUA CHAVE DE API ALPHA VANTAGE AQUI
  const apiKeyFinancialModelingPrep = '3b7150f92563ee1f3647e01f83c52119'; // INSIRA SUA CHAVE DE API FINANCIAL MODELING PREP AQUI

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
              `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${apiKeyFinancialModelingPrep}`
            );
            const dataFinancialModelingPrep = await responseFinancialModelingPrep.json();

            if (dataFinancialModelingPrep.length > 0) {
              const stock = {
                symbol: dataFinancialModelingPrep[0].symbol,
                price: dataFinancialModelingPrep[0].price,
                change: dataFinancialModelingPrep[0].changesPercentage,
                changePercent: dataFinancialModelingPrep[0].changes,
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

    stockData.forEach((stock) => {
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
  fetchStockData('us'); // Carregar as ações dos Estados Unidos
});
