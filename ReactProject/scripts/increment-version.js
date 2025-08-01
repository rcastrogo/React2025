
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; 


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFilePath = path.resolve(__dirname, '../.env.production');

try {
    let envContent = fs.readFileSync(envFilePath, 'utf8');
    let newVersion = '0.1'; // Valor por defecto si no se encuentra la versión

    const versionRegex = /^VITE_APP_VERSION=(\d+)\.(\d+)$/m;
    const match = envContent.match(versionRegex);

    if (match) {
        let major = parseInt(match[1], 10);
        let minor = parseInt(match[2], 10);
        minor++; 

        if (minor >= 100) { 
            major++;
            minor = 0;
        }
        newVersion = `${major}.${minor}`;

        envContent = envContent.replace(versionRegex, `VITE_APP_VERSION=${newVersion}`);
        console.log(`Versión de VITE_APP_VERSION actualizada a: ${newVersion}`);
    } else {
        envContent += `\nVITE_APP_VERSION=${newVersion}`;
        console.warn(`VITE_APP_VERSION no encontrada en ${envFilePath}. Añadiéndola con valor inicial: ${newVersion}`);
    }

    fs.writeFileSync(envFilePath, envContent, 'utf8');
} catch (error) {
    if (error.code === 'ENOENT') {
        console.warn(`El archivo .env.production no existe en ${envFilePath}. Creándolo con VITE_APP_VERSION=0.0.1.`);
        fs.writeFileSync(envFilePath, 'VITE_APP_VERSION=0.0.1\n', 'utf8');
    } else {
        console.error('Error al actualizar la versión en .env.production:', error);
        process.exit(1);
    }
}