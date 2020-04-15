var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('name') && !params.has('room')) {
    window.location = 'index.html';
    throw new Error('El nombre y la sala son necesarios');
}

var user = {
    name: params.get('name'),
    room: params.get('room')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('chat:enter', user, (resp) => {
        renderUsers(resp);
    });
});

// Desconectar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

// Recibir mensaje
socket.on('chat:message', (resp) => {
    renderMessage(resp, false);
    scrollBottom();
});

// Mensaje privado
socket.on('chat:message:private', (data) => {
    console.log('Mensaje privado: ', data);
});

// Un usuario ha abandonado el chat
socket.on('chat:user:exit', (resp) => {
    console.log('Servidor: ', resp);
});

// Personas conectadas al chat
socket.on('chat:users', (resp) => {
    renderUsers(resp);
});
