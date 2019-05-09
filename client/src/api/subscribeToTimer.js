import io from 'socket.io-client';

const socket = io.connect('http://localhost:8000');

export function subscribeToTimer(cb) {
  socket.on('timer', timestamp => cb(null, timestamp));
  socket.emit('subscribeToTimer', 2000);
}