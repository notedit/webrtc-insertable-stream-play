import Server from './src/server'

const server = new Server()

server.listen(5000, '0.0.0.0', () => {
    console.log('listen on port ', 5000)
})