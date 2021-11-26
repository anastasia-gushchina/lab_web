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
const PORT = 3000;
const IP = '127.0.0.1';
const BACKLOG = 100;
net.createServer()
    .listen(PORT, IP, BACKLOG)
    .on('connection', socket => socket
    .on('data', buffer => {
    const request = buffer.toString();
    socket.write(compileResponse({
        protocol: 'HTTP/1.1',
        headers: new Map(),
        status: 'OK',
        statusCode: 200,
        body: `<html><body><h1>Greetings</h1></body></html>`
    }));
    socket.end();
}));
const compileResponse = (r) => `${r.protocol} ${r.statusCode} ${r.status}
${Array.from(r.headers).map(kv => `${kv[0]}: 
${kv[1]}`).join('\r\n')}
${r.body}`;
console.log(`server is listening on ${PORT}`);
//# sourceMappingURL=app.js.map