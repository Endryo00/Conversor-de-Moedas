import { logger } from '../utils/logger';

export interface CoinData {
  bid: string;
  name: string;
}

export async function fetchExchangeRate(fromCoin: string, toCoin: string): Promise<number | null> {
  const pair = `${fromCoin}-${toCoin}`;
  logger.info(`Iniciando busca de cotação para o par: ${pair}`);

  try {
    const response = await fetch(`https://economia.awesomeapi.com.br/last/${pair}`);
    
    if (!response.ok) {
      throw new Error(`Erro na API externa: Status ${response.status}`);
    }

    const data = await response.json();
    const key = `${fromCoin}${toCoin}`;
    const rate = parseFloat(data[key].bid);

    logger.info(`Cotação obtida com sucesso para ${pair}: ${rate}`);
    return rate;
  } catch (error: any) {
    logger.error(`Falha ao buscar cotação para ${pair}`, { error: error.message });
    return null;
  }
}