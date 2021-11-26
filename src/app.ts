import * as net from 'net'
const PORT = 3000
const IP = '127.0.0.1'
const BACKLOG = 100
net.createServer()
  .listen(PORT, IP, BACKLOG)
  .on('connection', socket => socket
    .on('data',buffer =>{
		const request = buffer.toString()
		socket.write(compileResponse({
			protocol: 'HTTP/1.1',
			headers: new Map(),
			status: 'OK',
			statusCode: 200,
			body: `<html><body><h1>Greetings</h1></body></html>`})
		)
		socket.end()
		})
  )
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