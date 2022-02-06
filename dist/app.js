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
const mysql = require("mysql2/promise");
const PORT = 3000;
const IP = "127.0.0.1";
const BACKLOG = 100;
const config = {
    host: "localhost",
    user: "root",
    database: "catalina",
    password: "123",
};
const divideStringOn = (s, search) => {
    const index = s.indexOf(search);
    const first = s.slice(0, index);
    const rest = s.slice(index + search.length);
    return [first, rest];
};
const parseRequest = (s) => {
    const [firstLine, rest] = divideStringOn(s, "\r\n");
    const [method, url, protocol] = firstLine.split(" ", 3);
    const [headers, body] = divideStringOn(rest, "\r\n\r\n");
    const parsedHeaders = headers.split("\r\n").reduce((map, header) => {
        const [key, value] = divideStringOn(header, ": ");
        return map.set(key, value);
    }, new Map());
    return { protocol, method, url, headers: parsedHeaders, body };
};
const compileResponse = (r) => `${r.protocol} ${r.statusCode} ${r.status}
  ${Array.from(r.headers)
    .map((kv) => `${kv[0]}: 
  ${kv[1]}`)
    .join("\r\n")}
  ${r.body}`;
// /
// main function start
net
    .createServer()
    .listen(PORT, IP, BACKLOG)
    .on("connection", (socket) => {
    // socket.allowHalfOpen=true;
    socket.on("data", (buffer) => {
        const request = parseRequest(buffer.toString());
        console.log(request);
        f(request.body, request.url).then((res) => {
            console.log(res);
            socket.write(compileResponse({
                protocol: "HTTP/1.1",
                headers: new Map(),
                status: "OK",
                statusCode: 200,
                body: res,
            }));
            socket.end();
        });
    });
});
function get(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield mysql.createConnection(config);
        const [rows, fields] = yield conn.execute(query);
        conn.end();
        return rows;
    });
}
function f(body, url) {
    return __awaiter(this, void 0, void 0, function* () {
        let a = "";
        if (url.includes("/?login=")) {
            try {
                const t = JSON.parse(body);
                yield get(`SELECT name,role FROM catalina.user WHERE login='${t.login}' AND password='${t.password}'`).then((res) => {
                    a = res;
                });
            }
            catch (err) {
                console.log("JSON is invalid");
            }
        }
        else if (url.includes("/?salons")) {
            yield get("SELECT coordinate_x, coordinate_y, address, caption FROM catalina.salon").then((res) => {
                a = res;
            });
        }
        else {
            // some functions
        }
        return JSON.stringify(a);
    });
}
console.log(`server is listening on ${PORT}`);
//# sourceMappingURL=app.js.map