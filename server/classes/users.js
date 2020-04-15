class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        this.users.push({ id, name, room });

        return this.users;
    }

    removeUser(id) {
        let removedUser = this.getUser(id);
        this.users = this.users.filter(user => user.id !== id);

        return removedUser;
    }

    getUsers() {
        return this.users;
    }

    getUser(id) {
        return this.users.filter(user => user.id === id)[0];
    }

    getUsersByChatRoom(room) {
        return this.users.filter(user => user.room === room);
    }
}

module.exports = {
    Users
};