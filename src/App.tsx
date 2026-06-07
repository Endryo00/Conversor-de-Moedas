import { useState, useEffect } from 'react';
import { fetchExchangeRate } from './services/api';
import { logger } from './utils/logger';

function App() {
  const [amount, setAmount] = useState<number>(1);
  const [fromCoin, setFromCoin] = useState<string>('USD');
  const [toCoin, setToCoin] = useState<string>('BRL');
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    logger.info('Componente App carregado.');
  }, []);

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    logger.info('Botão de conversão clicado pelo usuário', { amount, fromCoin, toCoin });

    if (fromCoin === toCoin) {
      setResult(amount);
      setLoading(false);
      return;
    }

    const rate = await fetchExchangeRate(fromCoin, toCoin);
    if (rate) {
      setResult(amount * rate);
    } else {
      logger.warn('Não foi possível calcular o resultado devido a uma falha na cotação.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Conversor de Moedas Pro</h2>
      <form onSubmit={handleConvert}>
        <div style={{ marginBottom: '15px' }}>
          <label>Valor: </label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(Number(e.target.value))}
            min="0.01" 
            step="any"
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>De: </label>
          <select value={fromCoin} onChange={(e) => setFromCoin(e.target.value)}>
            <option value="USD">Dólar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="BTC">Bitcoin (BTC)</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Para: </label>
          <select value={toCoin} onChange={(e) => setToCoin(e.target.value)}>
            <option value="BRL">Real (BRL)</option>
            <option value="USD">Dólar (USD)</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Convertendo...' : 'Converter'}
        </button>
      </form>

      {result !== null && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '4px' }}>
          <h3>Resultado:</h3>
          <p>{amount} {fromCoin} = <strong>{result.toFixed(2)} {toCoin}</strong></p>
        </div>
      )}
    </div>
  );
}

export default App;