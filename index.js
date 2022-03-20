import express from 'express'
import dotenv from "dotenv"
import http from 'http'
// import fs from 'fs-extra'
import SocketIO from "socket.io";

import { MongoClient } from 'mongodb'

import router_logmng from './routers/logmng'
import router_users from './routers/users'
import router_auth from './routers/auth'
import auth from './routers/auth';



dotenv.config({ path: '.env' }); //환경 변수에 등록 
console.log(`run mode : ${process.env.NODE_ENV}`);

console.log(`current dir ${__dirname}`);
console.log(`db url ${process.env.MONGO_URL}`);


(async function () {

  try {
    //mongodb 연결
    const mongoUrl = process.env.MONGO_URL;

    const dbclient = await new Promise((resolve, reject) => {
      MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, (err, client) => {
        if (err) {
          console.log(err);
          // return;
          reject(err);
        }
        else {
          console.log(`Connected successfully to server ${mongoUrl}`);
          resolve(client);
        }

      });
    });


    // express setup
    const app = express()

    //ejs setup
    app.set('view engine', 'ejs');
    app.set('views', `${__dirname}/views`);
    app.get('/logmng', (req,res)=> {
      // console.log(req.query)
      res.render(`logmng`,{title:'logmng'});
    });

    //라우팅    
    app.use('/', express.static(`./public`));

    
    app.use('/api/auth', auth(dbclient));
    // app.use('/api', verifyToken);
    app.use('/api/log', router_logmng(dbclient));
    app.use('/api/users', router_users(dbclient));

    //순서 주의 맨 마지막에 나온다.
    app.all('*', (req, res) => {
      res
        .status(404)
        .send('oops! resource not found')
    });

    const httpServer = http.createServer({}, app)

    await new Promise((resolve, reject) => {
      httpServer.listen(process.env.PORT, () => {
        // console.log(`server run at : ${process.env.PORT}`)
        resolve();
      });
    })

    console.log(`server run at : ${process.env.PORT}`)

    //socket io
    const wsServer = SocketIO(httpServer);

    wsServer.on("connection", (socket) => {

      const io = wsServer;

      console.log('connected', socket.id, socket.handshake.address);

      socket.on("disconnect", () => {
        console.log('disconnect', socket.id);
      });
    });

  }
  catch (err) {
    console.log(err);
  }


})();

