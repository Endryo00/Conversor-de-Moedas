import { useState, useEffect } from 'react';
import { fetchExchangeRate } from './services/api';
import { logger } from './utils/logger';

const COIN_IMAGES: Record<string, string> = {
  USD: '/usd.png',
  BRL: '/brl.png',
  EUR: '/eur.png',
  BTC: '/btc.png',
  JPY: '/jpy.png',
  CNY: '/cny.png',
  VBUCK: '/vbuck.png',
  ROBUX: '/robux.png',
  EMERALD: '/emerald.png',
};

function App() {
  const [amount, setAmount] = useState<number>(1);
  const [fromCoin, setFromCoin] = useState<string>('USD');
  const [toCoin, setToCoin] = useState<string>('BRL');
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const [shouldShake, setShouldShake] = useState<boolean>(false);

  useEffect(() => {
    logger.info('Componente App carregado com novo design.');
  }, []);

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    logger.info('Botão de conversão clicado pelo usuário', { amount, fromCoin, toCoin });

    if (fromCoin === toCoin) {
      setResult(amount);
      setLoading(false);
      triggerLogoShake();
      return;
    }

    const rate = await fetchExchangeRate(fromCoin, toCoin);
    if (rate) {
      setResult(amount * rate);
    } else {
      logger.warn('Não foi possível calcular o resultado devido a uma falha na cotação.');
    }
    
    setLoading(false);
    triggerLogoShake();
  };

  const triggerLogoShake = () => {
    setShouldShake(true);
    setTimeout(() => setShouldShake(false), 500);
  };

  return (
    <div style={{
      backgroundImage: "url('/background.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#fff',
      overflowX: 'hidden',
      padding: '20px'
    }}>
      
      <style>{`
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(0px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(2px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(2px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(0deg); }
        }
        .shake-animation {
          animation: shake 0.5s;
        }
      `}</style>

      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <img 
          src="/logo.png" 
          alt="Logo do Conversor" 
          className={shouldShake ? 'shake-animation' : ''}
          style={{ maxWidth: '250px', height: 'auto', transition: 'transform 0.1s' }}
        />
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '60px',
        width: '100%',
        maxWidth: '1200px'
      }}>
        
        <div style={{ width: '200px', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img 
            src={COIN_IMAGES[fromCoin] || '/default.png'} 
            alt={`Moeda ${fromCoin}`} 
            style={{ maxWidth: '100%', maxHeight: '200%', objectFit: 'contain', filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.5))' }}
          />
        </div>

        <div style={{
          background: 'linear-gradient(180deg, #1f1f1f 0%, #0d0d0d 100%)',
          padding: '40px 30px',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)',
          border: '1px solid #333',
          width: '360px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ margin: '0 0 25px 0', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px', color: '#e0e0e0' }}>
            Painel de Conversão
          </h3>
          
          <form onSubmit={handleConvert}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#aaa' }}>VALOR:</label>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(Number(e.target.value))}
                min="0.01" 
                step="any"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  fontSize: '16px',
                  fontWeight: '600',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#aaa' }}>DE:</label>
              <select 
                value={fromCoin} 
                onChange={(e) => setFromCoin(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  fontSize: '16px',
                  fontWeight: '600',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <optgroup label="Moedas Reais">
                  <option value="USD">Dólar (USD)</option>
                  <option value="BRL">Real (BRL)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="JPY">Iene (JPY)</option>
                  <option value="CNY">Yuan (CNY)</option>
                </optgroup>
                <optgroup label="Moedas de Jogos">
                  <option value="VBUCK">V-Bucks (Fortnite)</option>
                  <option value="ROBUX">Robux (Roblox)</option>
                  <option value="EMERALD">Esmeraldas (Minecraft)</option>
                </optgroup>
              </select>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#aaa' }}>PARA:</label>
              <select 
                value={toCoin} 
                onChange={(e) => setToCoin(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  fontSize: '16px',
                  fontWeight: '600',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <optgroup label="Moedas Reais">
                  <option value="USD">Dólar (USD)</option>
                  <option value="BRL">Real (BRL)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="JPY">Iene (JPY)</option>
                  <option value="CNY">Yuan (CNY)</option>
                </optgroup>
                <optgroup label="Moedas de Jogos">
                  <option value="VBUCK">V-Bucks (Fortnite)</option>
                  <option value="ROBUX">Robux (Roblox)</option>
                  <option value="EMERALD">Esmeraldas (Minecraft)</option>
                </optgroup>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(90deg, #555 0%, #222 100%)',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.2)'}
              onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
            >
              {loading ? 'Processando...' : 'Converter'}
            </button>
          </form>

          {result !== null && (
            <div style={{ 
              marginTop: '25px', 
              padding: '15px', 
              background: 'rgba(255, 255, 255, 0.1)', 
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.15)',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '13px', color: '#aaa', display: 'block', marginBottom: '5px' }}>RESULTADO:</span>
              <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                {amount} {fromCoin} = <span style={{ color: '#00ff88' }}>{result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span> {toCoin}
              </p>
            </div>
          )}
        </div>

        <div style={{ width: '200px', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img 
            src={COIN_IMAGES[toCoin] || '/default.png'} 
            alt={`Moeda ${toCoin}`} 
            style={{ maxWidth: '100%', maxHeight: '200%', objectFit: 'contain', filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.5))' }}
          />
        </div>

      </div>
    </div>
  );
}

export default App;