"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const net = __importStar(require("net"));
const fs = __importStar(require("fs"));
const PORT = 3000;
const IP = '127.0.0.1';
const BACKLOG = 100;
const dir = "C:/Users/Stasya/source/repos/lab_web/src/";
net.createServer()
    .listen(PORT, IP, BACKLOG)
    .on('connection', socket => {
    socket
        .on('data', buffer => {
        const request = parseRequest(buffer.toString());
        console.log(request);
        socket.write(compileResponse({
            protocol: 'HTTP/1.1',
            headers: new Map(),
            status: 'OK',
            statusCode: 200,
            body: '<html><body><h1>Greetings</h1></body></html>'
        }));
        /*if(request.url.includes("icons")){
            sendFile(request.url.substring(9),socket);
        }
        else{
            sendFile("main.html",socket);
            
        }*/
        //socket.pipe(socket);
        socket.end();
    });
});
function sendFile(path, socket) {
    fs.readFile(dir + path, (err, data) => {
        if (data != undefined) {
            const page = data.toString();
            socket.write(compileResponse({
                protocol: 'HTTP/1.1',
                headers: new Map(),
                status: 'OK',
                statusCode: 200,
                body: page
            }));
            console.log(path);
        }
    });
}
const parseRequest = (s) => {
    const [firstLine, rest] = divideStringOn(s, '\r\n');
    const [method, url, protocol] = firstLine.split(' ', 3);
    const [headers, body] = divideStringOn(rest, '\r\n\r\n');
    const parsedHeaders = headers.split('\r\n').reduce((map, header) => {
        const [key, value] = divideStringOn(header, ': ');
        return map.set(key, value);
    }, new Map());
    return { protocol, method, url, headers: parsedHeaders, body };
};
const divideStringOn = (s, search) => {
    const index = s.indexOf(search);
    const first = s.slice(0, index);
    const rest = s.slice(index + search.length);
    return [first, rest];
};
const compileResponse = (r) => `${r.protocol} ${r.statusCode} ${r.status}
${Array.from(r.headers).map(kv => `${kv[0]}: 
${kv[1]}`).join('\r\n')}
${r.body}`;
console.log(`server is listening on ${PORT}`);
//# sourceMappingURL=app.js.map