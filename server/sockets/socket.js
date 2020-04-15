const { io } = require('../server');
const { createMessage } = require('../utils/utils');
const { Users } = require('../classes/users');

const users = new Users();

io.on('connection', (client) => {
    client.on('chat:enter', (data, callback) => {
        if (!data.name && !data.room) {
            return callback({
                error: true,
                message: 'El nombre y la sala son necesarios'
            });
        }

        client.join(data.room);

        users.addUser(client.id, data.name, data.room);

        client.broadcast.to(data.room).emit('chat:users', users.getUsersByChatRoom(data.room));
        
        callback(users.getUsersByChatRoom(data.room));
    });

    client.on('chat:message', (data, callback) => {
        let user = users.getUser(client.id);
        let message = createMessage(user.name, data.message);

        client.broadcast.to(user.room).emit('chat:message', message);

        callback(message);
    });

    client.on('chat:message:private', (data) => {
        let user = users.getUser(client.id);

        client.broadcast.to(data.to).emit('chat:message:private', createMessage(user.name, data.message));
    });

    client.on('disconnect', () => {
        let removedUser = users.removeUser(client.id);

        client.broadcast.to(removedUser.room).emit('chat:user:exit', createMessage('Administrador', `${removedUser.name} abandono el chat`));
        client.broadcast.to(removedUser.room).emit('chat:users', users.getUsersByChatRoom(removedUser.room));
    });
});
