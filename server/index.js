const express = require('express');
const createServer = require('http').createServer;
const Server = require('socket.io').Server;
const cors = require('cors');

const app = express();
app.use(cors());
const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    // allowedHeaders: ['my-custom-header'],
    credentials: false
  }
});

const sessions = {};

const clients = io.of('/clients');
clients.on('connect', (socket) => {
  const configs = socket.handshake?.query ?? {};
  const { userId } = configs;
  console.log('clients---handleshake', socket.handshake.query);
  socket.join(userId);

  socket.on('request_session', (data, ackFn) => {
    const { userId: id } = data;
    const session = sessions[id];
    if (session) {
      ackFn({
        code: 0,
        msg: 'success',
        data: sessions[id]
      });
    } else {
      ackFn({
        code: -1,
        msg: 'failed'
      });
    }
  });

  socket.on('active_page', (data, ackFn) => {
    const { userId } = data;
    const session = sessions[userId];
    const { helperId } = session;
    console.log('active_page', userId, helperId, session);
    helpers.to(helperId).emit('active_page', data, () => {
      console.log('active_page_ack', userId);
      clients.to(userId).emit('start_record');
    });
  });

  socket.on('user_interact', (data, ackFn) => {
    console.log('user_interact');
    const { userId } = data;
    const session = sessions[userId];
    const { helperId } = session;
    helpers.to(helperId).emit('user_interact', data, () => {});
  });

  socket.on('pause_sharing', (data, ackFn) => {
    console.log('clients--->pause_sharing', data, configs);
    const { userId } = data;
    const session = sessions[userId];
    const { helperId } = session;
    helpers.to(helperId).emit('pause_sharing', data, () => {});
  });

  socket.on('resume_sharing', (data, ackFn) => {
    console.log('clients--->resume_sharing', data);
    const { userId } = data;
    const session = sessions[userId];
    const { helperId } = session;
    helpers.to(helperId).emit('resume_sharing', data, () => {});
  });

  socket.on('close_sharing', (data, sckFn) => {
    console.log('clients--->close_sharing', data);
    const { userId } = data;
    const session = sessions[userId];
    const { helperId } = session;
    helpers.to(helperId).emit('close_sharing', data, () => {});
  });
});

const helpers = io.of('/helpers');
helpers.on('connect', (socket) => {
  const { helperId } = socket.handshake.query;
  socket.join(helperId);
  console.log('wfh---helpers>', helperId);

  socket.on('request_sharing', (data, ackFn) => {
    const { userId, helperId } = data;
    const session = {
      id: Math.floor(Math.random() * 1000),
      status: 'initial',
      userId,
      helperId
    };
    sessions[userId] = session;

    clients.to(userId).emit('start_record', data, () => {});

    if (typeof ackFn === 'function') {
      ackFn({
        code: 0,
        msg: 'success',
        daya: session
      });
    }
  });

  socket.on('client_offline', (data, ackFn) => {});

  socket.on('client_online', (data, ackFn) => {});
});

httpServer.listen(6789);
