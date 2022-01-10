"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const net = __importStar(require("net"));
const mysql = require('mysql2/promise');
const PORT = 3000;
const IP = '127.0.0.1';
const BACKLOG = 100;
const config = {
    host: "localhost",
    user: "root",
    database: "catalina",
    password: "123"
};
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
            body: '<html><body>' + f() + '</body></html>'
        }));
        socket.end();
    });
});
function get() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield mysql.createConnection(config);
        const [rows, fields] = yield conn.execute('SELECT * FROM users');
        console.log(rows);
        conn.end();
        return rows;
    });
}
function f() {
    return __awaiter(this, void 0, void 0, function* () {
        let a = yield get();
        console.log(a);
    });
}
;
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