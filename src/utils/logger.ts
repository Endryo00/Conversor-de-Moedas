import log from 'loglevel';

// Vai mostrar todos os detalhes no desenvolvimento local, mas só os erro e avisos na versão normal 
log.setLevel(import.meta.env.DEV ? 'debug' : 'warn');

export const logger = {
  info: (message: string, context?: any) => log.info(`[INFO] ${message}`, context || ''),
  warn: (message: string, context?: any) => log.warn(`[WARN] ${message}`, context || ''),
  error: (message: string, context?: any) => log.error(`[ERROR] ${message}`, context || ''),
};