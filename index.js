const cors =require('cors');
const http = require('http');
const express =require('express');
const socketIO = require('socket.io');
const { db } = require('./db.js');
const Route =require('./routes.js');

const PORT =5500;
const app =express();

const server = http.createServer(app);
const io = socketIO(server);

// middlewares
app.use(cors());
app.use(express.json({limit: '30mb'}));
app.use(express.urlencoded({limit: '30mb', extended: true}));

// routes
app.use('/', Route);


io.on('connection', ({id}) => {
  socket.on('new message', async (message) => {
    console.log(message);
    io.emit('new message');
  });

  socket.on('disconnect', () => {
    console.log('User Offline:', socket.id);
  });
});


app.listen(PORT, '0.0.0.0',async () =>{
    try {
        await db.query('SELECT 1');
        console.log(`[+] Server Running On ${PORT}`)
    } catch ({message}) {
        console.log(`[-] Error ${message}`);
    }
})
