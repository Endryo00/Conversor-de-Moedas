import { logger } from '../utils/logger';

const GAME_CURRENCIES: Record<string, number> = {
  VBUCK: 0.035, 
  ROBUX: 0.055, 
  EMERALD: 5.0, 
};

async function getRateToBrl(coin: string): Promise<number> {
  if (coin === 'BRL') return 1;

  if (GAME_CURRENCIES[coin] !== undefined) {
    logger.info(`[GameCurrency] Usando cotação fixa local para a moeda de jogo: ${coin}`);
    return GAME_CURRENCIES[coin];
  }
  
  const response = await fetch(`https://economia.awesomeapi.com.br/last/${coin}-BRL`);
  if (!response.ok) throw new Error(`Falha ao buscar ${coin}-BRL`);
  
  const data = await response.json();
  return parseFloat(data[`${coin}BRL`].bid);
}

export async function fetchExchangeRate(fromCoin: string, toCoin: string): Promise<number | null> {
  const pair = `${fromCoin}-${toCoin}`;
  logger.info(`Iniciando busca de cotação para o par: ${pair}`);

  try {
    if (toCoin === 'BRL') {
      const rate = await getRateToBrl(fromCoin);
      logger.info(`Cotação obtida com sucesso para ${pair}: ${rate}`);
      return rate;
    }

    if (fromCoin === 'BRL') {
      const rateToBrl = await getRateToBrl(toCoin);
      const rate = 1 / rateToBrl;
      logger.info(`Cotação obtida via cálculo inverso para ${pair}: ${rate}`);
      return rate;
    }

    logger.info(`Fazendo ponte via BRL para o par cruzado: ${pair}`);
    
    const fromToBrl = await getRateToBrl(fromCoin); 
    const toToBrl = await getRateToBrl(toCoin);     

    const crossRate = fromToBrl / toToBrl;

    logger.info(`Cotação cruzada calculada com sucesso para ${pair}: ${crossRate}`);
    return crossRate;

  } catch (error: any) {
    logger.error(`Falha ao processar cotação para ${pair}`, { error: error.message });
    return null;
  }
}