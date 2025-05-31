import { exec } from 'child_process';
import fs from 'fs/promises';

function runCommand(command) {
  return new Promise((resolve, reject) => {
    const proc = exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        console.error(stderr);
      }
      console.log(stdout);
      resolve();
    });
  });
}

async function fixQuotes(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    const regex = /generatedAlwaysAsIdentity\(\{([^}]+)\}\)/g;
    content = content.replace(regex, (match) => match.replace(/""/g, '"'));
    await fs.writeFile(filePath, content, 'utf8');
    console.log(`Arquivo corrigido: ${filePath}`);
  } catch (err) {
    console.error('Erro ao corrigir o arquivo:', err);
  }
}

async function main() {
  try {
    console.log('Executando drizzle-kit pull...');
    await runCommand('npx drizzle-kit pull');
    await fixQuotes('./drizzle/schema.ts'); // ajuste o caminho aqui
  } catch (err) {
    console.error('Erro no script:', err);
    process.exit(1);
  }
}

main();
