import fs from 'fs';
import path from 'path';

const logFilePath = path.join(__dirname, '../../logs/app.log');

// Intervalo de logs configurable desde environment
const LOG_INTERVAL = parseInt(process.env.LOG_INTERVAL || '10200');

// Inicializar archivo de logs si no existe
if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, '');
}

// Función para escribir en el log
function writeLog(message: string, type: 'info' | 'error' | 'console' = 'info', context: string = ''): void {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${type.toUpperCase()}] ${message}\n`;

  let logContent = fs.readFileSync(logFilePath, 'utf8');
  logContent += logEntry;
  fs.writeFileSync(logFilePath, logContent, 'utf8');
}

// Middleware para interceptar console.log
export function logConsoleLogs(): NodeJS.Timeout {
  const interval = setInterval(() => {
    // Capturar console.log
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args: any[]) => {
      const message = args.map(arg => {
        if (typeof arg === 'object' && arg !== null) {
          return JSON.stringify(arg, null, 2);
        }
        return String(arg);
      }).join(' ');
      writeLog(message, 'console');
      originalLog.apply(console, args);
    };

    console.error = (...args: any[]) => {
      const message = args.map(arg => {
        if (typeof arg === 'object' && arg !== null) {
          return JSON.stringify(arg, null, 2);
        }
        return String(arg);
      }).join(' ');
      writeLog(message, 'error');
      originalError.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      const message = args.map(arg => {
        if (typeof arg === 'object' && arg !== null) {
          return JSON.stringify(arg, null, 2);
        }
        return String(arg);
      }).join(' ');
      writeLog(message, 'console');
      originalWarn.apply(console, args);
    };

    return () => {
      // Restaurar funciones originales
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, LOG_INTERVAL);

  return interval;
}

// Función para limpiar logs
export function clearLogs(): void {
  fs.writeFileSync(logFilePath, '');
}

// Función para leer logs recientes
export function getRecentLogs(count: number = 50): string {
  const content = fs.readFileSync(logFilePath, 'utf8');
  const lines = content.split('\n').filter(line => line.trim());
  return lines.slice(-count).join('\n');
}
