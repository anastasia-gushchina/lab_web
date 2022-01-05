import * as net from 'net'
import * as fs from 'fs'

import { getParsedCommandLineOfConfigFile } from 'typescript'
const PORT = 3000
const IP = '127.0.0.1'
const BACKLOG = 100
const dir = "C:/Users/Stasya/source/repos/lab_web/src/"


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
				body: "Hello"
			})
			);
			/*if(request.url.includes("icons")){
				sendFile(request.url.substring(9),socket);
			}
			else{
				sendFile("main.html",socket);
				
			}*/
			//socket.pipe(socket);
			socket.end();
		})
		
		
		}	
	)
	
function sendFile(path:string, socket: net.Socket){
	fs.readFile(dir + path, (err: NodeJS.ErrnoException, data: Buffer) => {
		
		if(data!=undefined){
		const page = data.toString();
		
			socket.write(compileResponse({
				protocol: 'HTTP/1.1',
				headers: new Map(),
				status: 'OK',
				statusCode: 200,
				body: page
			})
			);
			console.log(path);
		}
		
		
	})
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
