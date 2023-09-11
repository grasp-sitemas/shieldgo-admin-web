// websocket.js
import io from 'socket.io-client';
import Endpoints from '../common/Endpoints.vue'

// Adicione a porta 3001 à URL do socketDomain
const socket = io(`${Endpoints.socketDomain}:3001`, {
  transports: ['websocket'],
  upgrade: false,
  withCredentials: false,
  reconnection: true, // Se desejar reconexão automática
  reconnectionDelay: 1000, // Tempo de espera antes de tentar reconexão (em milissegundos)
  reconnectionAttempts: Infinity, // Número de tentativas de reconexão
});

export default socket;