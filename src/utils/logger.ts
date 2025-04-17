import * as fs from 'fs';
import * as path from 'path';

export function logToFile(message: string): void {
  const logFilePath = path.join(process.cwd(), 'server.log');

  fs.appendFile(logFilePath, `${new Date().toISOString()} - ${message}\n`, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
}