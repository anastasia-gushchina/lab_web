import * as net from 'net'
const mysql = require('mysql2/promise');

import { getParsedCommandLineOfConfigFile } from 'typescript'
const PORT = 3000
const IP = '127.0.0.1'
const BACKLOG = 100


const config = {
	host: "localhost",
	user: "root",
	database: "catalina",
	password: "123"
};


net.createServer()
	.listen(PORT, IP, BACKLOG)
	.on('connection', socket => {// socket.allowHalfOpen=true;
		socket
			.on('data', buffer => {
				const request = parseRequest(buffer.toString())
				console.log(request);
				f(request.body, request.url).then(res => {
					console.log(res);
					socket.write(compileResponse({
						protocol: 'HTTP/1.1',
						headers: new Map(),
						status: 'OK',
						statusCode: 200,
						body: res
					})
					);
					socket.end();
				})

			})


	}
	)
async function get(query: string) {
	const conn = await mysql.createConnection(config);
	const [rows, fields] = await conn.execute(query);
	conn.end();
	return rows;
}


async function f(body: string, url: string) {
	var a = "";

	if (url.includes("/?login=")) {
		try {
			var t = JSON.parse(body);
			await get(`SELECT name,role FROM catalina.user WHERE login='${t.login}' AND password='${t.password}'`).then(res => { a = res });
		} catch (err) {console.log("JSON is invalid") ;};
	}

	else if(url.includes("/?salons")) {
		await get(`SELECT coordinate_x, coordinate_y, address, caption FROM catalina.salon`).then(res => { a = res });

	 }
	else{}

	return JSON.stringify(a);
};


export interface Request {
	protocol: string
	method: string
	url: string
	headers: Map<string, string>
	body: string
}
const parseRequest = (s: string): Request => {
	const [firstLine, rest] = divideStringOn(s, '\r\n')
	const [method, url, protocol] = firstLine.split(' ', 3)
	const [headers, body] = divideStringOn(rest, '\r\n\r\n')
	const parsedHeaders = headers.split('\r\n').reduce((map, header) => {
		const [key, value] = divideStringOn(header, ': ')
		return map.set(key, value)
	}, new Map())
	return { protocol, method, url, headers: parsedHeaders, body }
}
const divideStringOn = (s: string, search: string) => {
	const index = s.indexOf(search)
	const first = s.slice(0, index)
	const rest = s.slice(index + search.length)
	return [first, rest]
}

export interface Response {
	status: string
	statusCode: number
	protocol: string
	headers: Map<string, string>
	body: string
}
const compileResponse = (r: Response): string =>
	`${r.protocol} ${r.statusCode} ${r.status}
${Array.from(r.headers).map(kv => `${kv[0]}: 
${kv[1]}`).join('\r\n')}
${r.body}`

console.log(`server is listening on ${PORT}`);
