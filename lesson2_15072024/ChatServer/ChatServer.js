const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server =http.createServer((request,response) => {
     // 3.1- Parse URL and determine filename
     console.log(`Request URL: ${request.url}`);

     // http://localhost:3006 => c:\...\fileName.html
     // comment
 
     // 3.2- If no 'path' is defined, return 'index.html'
     const url = request.url === '/' ? 'index.html' : request.url;
 
     const filePath = path.join(__dirname, "public", url);
     console.log(`FilePath: ${filePath}`);
 
     const fileExt = path.extname(filePath);
 
     // Set the correct response content type
     let contentType = '';
     switch (fileExt) {
         case '.html':
             contentType = 'text-html';
             break;
         case '.jpg':
             contentType = 'image/jpeg';
             break;
         case '.css':
             contentType = 'text/css';
             break;
         case '.mp3':
             contentType = 'audio/mpeg';
             break;
         case '.mp4':
             contentType = 'video/mp4';
             break;
         default:
             contentType = 'text-html';
             break;
     }
 
     // 3.3- Else look for the desired file
     // Read file async
     fs.readFile(filePath, (error, content) => {
         // 1. Check for errors, if error exists return 404.html
         if (error) {
             // Check if file exists
             if (error.code === 'ENOENT') {
                 const errorFile = path.join(__dirname, "public", '404.html');
                 fs.readFile(errorFile, (err, data) => {
                     // Assumption all is well
                     response.writeHead(404, { 'Content-Type': contentType });
                     response.end(data, 'utf8');
                 })
             } else {
                 // DEFAULT error handling
                 response.writeHead(500);
                 response.end(`Server error: ${error.code}`);
             }
         } else {
             // 2. If all is well return file
             response.writeHead(200, { 'Content-Type': contentType });
             response.end(content, 'utf8');
         }
     })
     // 3.4- If file not found - send error
     // 3.5- If file found - return file
});

//initalize the server 
const wss = new WebSocket.Server({server});

//handlers
wss.on('connection', ws => {
    ws.on('message', message =>{
        console.log(`recevied: ${message}`);
        wss.clients.forEach(c => {
            if (c.readyState === WebSocket.OPEN)
            {
                c.send(message);
            }
        });
    });
    console.log('client connected');
    ws.send('welcome to jamaica');
});

//starting the server 
const PORT = 3006;
server.listen(PORT,() =>{console.log(`server is running on port http://localhost:${PORT}`)});