import * as net from 'net'
import * as sql from 'mysql2'

import { getParsedCommandLineOfConfigFile } from 'typescript'
const PORT = 3000
const IP = '127.0.0.1'
const BACKLOG = 100
const dir = "/"

const connection = sql.createConnection({
	host: "localhost",
	user: "root",
	database: "catalina",
	password: "123"
  });
  connection.connect(function(err){
    if (err) {
      return console.error("Ошибка: " + err.message);
    }
    else{
      console.log("Подключение к серверу MySQL успешно установлено");
    }
 });

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
				body: '<html><body>'+getData()+'</body></html>'
			})
			);
			socket.end();
		})
		
		
		}	
	)

function getData(){
var result={};
	const sql = 'SELECT * FROM users';
	connection.query(sql,function(err, results) {
		if(err) console.log(err);
		console.log(results);
		result = results;
	});

return result[0];
}
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
