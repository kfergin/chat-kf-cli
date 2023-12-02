import path from 'path';

export const dataDir = path.join(__dirname, '../data/');
export const conversationsDir = path.join(dataDir, './conversations/');

export const isTerminal = process.stdout.isTTY;
