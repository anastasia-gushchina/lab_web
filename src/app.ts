import * as net from 'net'
import * as fs from 'fs'

import { getParsedCommandLineOfConfigFile } from 'typescript'
const PORT = 3000
const IP = '127.0.0.1'
const BACKLOG = 100
const dir = "C:/Users/Stasya/source/repos/lab_web/src"

net.createServer()
  .listen(PORT, IP, BACKLOG)
  .on('connection', socket => socket
    .on('data',buffer =>{
		fs.readFile(dir+"/main.html",(err:NodeJS.ErrnoException, data:Buffer)=>{
		const page = data.toString()
		const request = buffer.toString()
		if(request =="okbutton=OK"){
			var map = document.getElementsByName('map');
			
		}
		else
		socket.write(compileResponse({
			protocol: 'HTTP/1.1',
			headers: new Map(),
			status: 'OK',
			statusCode: 200,
			body: page})
		)
		socket.end()
		})
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
