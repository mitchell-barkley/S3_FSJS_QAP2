const fs = require('fs');
const myEmitter = require('./events');

function indexPage(path, response) {
    myEmitter.emit('route', path);
    fetchFile(path, response);
}
function productsPage(path, response) {
    myEmitter.emit('route', path);
    fetchFile(path, response);
}
function servicesPage(path, response) {
    myEmitter.emit('route', path);
    fetchFile(path, response);
}
function subscribePage(path, response) {
    myEmitter.emit('route', path);
    fetchFile(path, response);
}
function aboutPage(path, response) {
    myEmitter.emit('route', path);
    fetchFile(path, response);
}
function contactPage(path, response) {
    myEmitter.emit('route', path);
    fetchFile(path, response);
}
function createFolder(request, response) {
    const folderName = 'newFolder';
    fs.mkdir(folderName, (error) => {
        if(error) {
            console.error(error);
            myEmitter.emit('event', request.url, 'ERROR', 'A new folder was NOT created');
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.end('500 Internal Server Error');
        } else {
            myEmitter.emit('event', request.url, 'SUCCESS', 'A new folder was created');
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            response.end('New folder created');
        }
    });
}

function fetchFile(fileName, response) {
    fs.readFile(fileName, (error, content) => {
        if (error) {
            response.writeHead(500, { 'Content-Type': 'text/html' });
            response.end('500 Internal Server Error');
        } else {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(content, 'utf-8');
        }
    });
}

module.exports = {
    indexPage,
    productsPage,
    servicesPage,
    subscribePage,
    aboutPage,
    contactPage,
    createFolder
};