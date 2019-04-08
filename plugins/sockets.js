import Vue from 'vue';
import io from 'socket.io-client';
const socket = io.connect(process.env.sockets);

Vue.prototype.$socket = () => {
  return socket;
};
