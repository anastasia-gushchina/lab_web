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
	.on('connection', socket => 
		{// socket.allowHalfOpen=true;
		socket
		.on('data', buffer => {
			const request = parseRequest(buffer.toString())
			console.log(request);
			socket.write(compileResponse({
				protocol: 'HTTP/1.1',
				headers: new Map(),
				status: 'OK',
				statusCode: 200,
				body: f()
			})
			);
			
			socket.end();
		})
		
		
		}	
	)
async function get() {
	const conn = await mysql.createConnection(config);
	const [rows, fields]= await conn.execute('SELECT * FROM user');
	console.log(rows);
	conn.end();
	return rows;
}
	
	
	function f()  {
		let a = get();
		return JSON.stringify(a).toString();
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
