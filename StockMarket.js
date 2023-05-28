// StockMarket.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StockMarket() {
  const [stockData, setStockData] = useState([]);
  const [newStockSymbol, setNewStockSymbol] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (newStockSymbol.trim() === '') return;

      try {
        const apiKey = '0KD285BZV25QIM4C'; // Insira sua chave de API Alpha Vantage aqui
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${newStockSymbol}&apikey=${apiKey}`
        );

        const { data } = response;
        if (data['Global Quote']) {
          const stock = {
            symbol: data['Global Quote']['01. symbol'],
            price: data['Global Quote']['05. price'],
          };
          setStockData((prevData) => [...prevData, stock]);
          setError('');
        } else if (data['Note']) {
          setError(
            'Limite de API atingido. Aguarde um momento e tente novamente.'
          );
        } else {
          setError('Símbolo de ação inválido. Verifique e tente novamente.');
        }
      } catch (error) {
        setError('Ocorreu um erro ao buscar as informações da ação.');
      }
    };

    const interval = setInterval(fetchData, 5000); // Atualizar a cada 5 segundos

    return () => {
      clearInterval(interval); // Limpar o intervalo quando o componente é desmontado
    };
  }, [newStockSymbol]);

  const handleAddStock = () => {
    if (newStockSymbol.trim() === '') {
      setError('Por favor, insira um símbolo de ação válido.');
      return;
    }

    setError('');
    setNewStockSymbol('');
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={newStockSymbol}
          onChange={(event) => setNewStockSymbol(event.target.value)}
          placeholder="VIIA3"
        />
        <button onClick={handleAddStock}>Adicionar</button>
      </div>

      {error && <p>{error}</p>}

      {stockData.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Símbolo</th>
              <th>Preço Atual</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map((stock) => (
              <tr key={stock.symbol}>
                <td>{stock.symbol}</td>
                <td>{stock.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>VIIA3        .</p>
      )}
    </div>
  );
}

export default StockMarket;
