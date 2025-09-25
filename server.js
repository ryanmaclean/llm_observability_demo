#!/usr/bin/env node

// Simple local development server with environment variable injection
const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

// Load environment variables from .env.local first, then .env
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || 'localhost';

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

function injectEnvironmentVariables(content, filePath) {
    if (filePath.endsWith('config.js') || filePath.endsWith('config-local.js')) {
        // Replace placeholder values with actual environment variables
        const envVars = {
            OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
            DATADOG_CLIENT_TOKEN: process.env.DATADOG_CLIENT_TOKEN || '',
            DATADOG_APPLICATION_ID: process.env.DATADOG_APPLICATION_ID || '',
            DATADOG_SITE: process.env.DATADOG_SITE || 'datadoghq.com',
            DATADOG_ENV: process.env.DATADOG_ENV || 'development'
        };

        let modifiedContent = content;

        // Replace template strings with actual values
        Object.keys(envVars).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            modifiedContent = modifiedContent.replace(regex, envVars[key]);

            // Also replace YOUR_* placeholders
            const yourRegex = new RegExp(`YOUR_${key.replace('DATADOG_', '').replace('OPENAI_', '')}_HERE`, 'g');
            modifiedContent = modifiedContent.replace(yourRegex, envVars[key]);
        });

        return modifiedContent;
    }

    // Also inject environment variables into HTML files for RUM initialization
    if (filePath.endsWith('index.html')) {
        let modifiedContent = content;

        // Replace Datadog placeholders in HTML
        const datadogVars = {
            'YOUR_DATADOG_APPLICATION_ID': process.env.DATADOG_APPLICATION_ID || '',
            'YOUR_DATADOG_CLIENT_TOKEN': process.env.DATADOG_CLIENT_TOKEN || '',
            'datadoghq.com': process.env.DATADOG_SITE || 'datadoghq.com'
        };

        Object.keys(datadogVars).forEach(key => {
            const regex = new RegExp(key, 'g');
            modifiedContent = modifiedContent.replace(regex, datadogVars[key]);
        });

        return modifiedContent;
    }

    return content;
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;

    // Serve index.html for root path
    if (pathname === '/') {
        pathname = '/index.html';
    }

    const filePath = path.join(__dirname, pathname);
    const ext = path.extname(filePath);
    const mimeType = mimeTypes[ext] || 'text/plain';

    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // CORS headers for local development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <html>
                        <body>
                            <h1>404 - File Not Found</h1>
                            <p>The requested file <code>${pathname}</code> was not found.</p>
                            <p><a href="/">← Back to Home</a></p>
                        </body>
                    </html>
                `);
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }
        } else {
            let content = data.toString();

            // Inject environment variables for config files
            content = injectEnvironmentVariables(content, filePath);

            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(content);
        }
    });
});

server.listen(PORT, HOST, () => {
    console.log(`
🚀 LLM Observability Demo Server

Server running at: http://${HOST}:${PORT}
Environment: ${process.env.DATADOG_ENV || 'development'}

Configuration:
- OpenAI API Key: ${process.env.OPENAI_API_KEY ? '✅ Loaded' : '❌ Missing'}
- Datadog Client Token: ${process.env.DATADOG_CLIENT_TOKEN ? '✅ Loaded' : '❌ Missing'}
- Datadog App ID: ${process.env.DATADOG_APPLICATION_ID ? '✅ Loaded' : '❌ Missing'}

${!process.env.OPENAI_API_KEY ? '\n⚠️  Please set OPENAI_API_KEY in your .env.local file' : ''}
${!process.env.DATADOG_CLIENT_TOKEN ? '\n⚠️  Please set DATADOG_CLIENT_TOKEN in your .env.local file' : ''}
${!process.env.DATADOG_APPLICATION_ID ? '\n⚠️  Please set DATADOG_APPLICATION_ID in your .env.local file' : ''}

Press Ctrl+C to stop the server
    `);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Try a different port:`);
        console.error(`   PORT=8081 node server.js`);
    } else {
        console.error('❌ Server error:', err.message);
    }
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n👋 Shutting down server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});