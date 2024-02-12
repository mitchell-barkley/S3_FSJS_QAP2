const http = require('http');
const fs = require('fs');
const path = require('path');
const routes = require('./routes.js');

const EventEmitter = require('events');
class MyEmitter extends EventEmitter {};
const myEmitter = new EventEmitter();
const port = 3000;

global.DEBUG = true;

myEmitter.on('route', (url) => {
    const d = new Date();
    if(DEBUG) console.log(`Route Event on: ${url} at ${d}`);
    if(!fs.existsSync(path.join(__dirname, 'logs'))) {
        fs.mkdirSync(path.join(__dirname, 'logs'));
    }
    fs.appendFile(path.join(__dirname, 'logs', 'route.log'), `Route Event on ${url} at ${d}\n`, (error) => {
        if(error) throw error;
    });
});

const server = http.createServer((request, response) => {

    if(DEBUG) console.log('Request URL', request.url);
    let path = './views/';
    switch (request.url) {
        case '/':
        case '/index':
        case '/home':
            path += 'index.html';
            myEmitter.emit('route', path);
            routes.indexPage(path, response);
            console.log('Home Page');
            break;
        case '/products':
            path += 'products.html';
            myEmitter.emit('route', path);
            routes.productsPage(path, response);
            console.log('Products Page');
            break;
        case '/technews':
            path += 'technews.html';
            myEmitter.emit('route', path);
            routes.technewsPage(path, response);
            console.log('Tech News Page');
            break;
        case '/subscribe':
            path += 'subscribe.html';
            myEmitter.emit('route', path);
            routes.subscribePage(path, response);
            console.log('Subscribe Page');
            break;
        case '/about':
            path += 'about.html';
            myEmitter.emit('route', path);
            routes.aboutPage(path, response);
            console.log('About Page');
            break;
        case '/contact':
            path += 'contact.html';
            myEmitter.emit('route', path);
            routes.contactPage(path, response);
            console.log('Contact Page');
            break;
        case '/events':
            myEmitter.emit('event', request.url, 'INFO', 'An event route was requested');
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            response.end('An event route was requested');
            break;
        case '/folder':
            routes.createFolder(request, response);
            break;
        default:
            if(DEBUG) console.log('404 Route')
            response.writeHead(404, { 'Content-Type': 'text/html' });
            response.end('404 Page Not Found.');
            break;
    }
});

server.listen(3000, () => {
    console.log(`Server running at ` + port);
});
