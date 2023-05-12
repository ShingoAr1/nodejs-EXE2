const http = require('http');
const server = http.createServer()
const fs = require('fs')
const path = require('path')

server.on('request',(req, res)=>{
    if (req.url === '/') {
        res.status = 200
        res.setHeader('Content-Type', 'text/html')
        res.write(`
        <html>
         <body>
          <h1>Hello Node!</h1>
          <a href="/read-message">Read the messages</a>
          <a href="/write-message">Write message</a>
         </body>
          

        </html>
        `)
    }
    if (req.url === '/read-message' && req.method === 'GET') {
        const messagePath = path.join(__dirname, 'message.txt')
        fs.readFile(messagePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    //404 - page not found
                    res.statusCode = 404
                    res.setHeader('Content-Type', 'text/html') //MIME
                    res.write(`
                        <html>
                            <body>
                                <h1>Opps! Page not found!</h1>
                            </body>
                        </html>
                    `)
                    res.end()
                } else {
                    //500
                    res.statusCode = 500
                    res.setHeader('Content-Type', 'text/html') //MIME
                    res.write(`
                        <html>
                            <body>
                                <h1>Opps! A Server Error has occurred</h1>
                            </body>
                        </html>
                    `)
                    res.end()
                }
            }else{
                //Success
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.end(content, 'utf8')
            }
    })
}
    if (req.url === '/write-message' && req.method === 'GET') {
        res.writeHead(200, {'Content-Type': 'text/html'})
                res.write(`
                <html>
                 <form method="post" action="/write-message">
                 <input type="text" name="message"><input type="submit" value="Submit">
                 </form> 
                </html> `)
    }
            

    if (req.url === '/write-message' && req.method === 'POST') {
        const body = []

        req.on('data', (chunk) => {
            body.push(chunk) 
        })
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString()

            console.log('>>> ',parsedBody)

            const message = parsedBody.split("=")[1].split('+').join(' ')
            const filePath = path.join(__dirname, 'message.txt')

            fs.writeFile(filePath, message, (err) => {
                if(err) throw err
                res.statusCode = 302
                res.setHeader('Location', '/')
                return res.end()
            })
        })
        
    }
}
)

server.on('listening', ()=>{
    console.log('Server is listening...');
})

server.listen(8000)