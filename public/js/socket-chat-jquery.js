var params = new URLSearchParams(window.location.search);

var usersDiv = $('#divUsuarios');
var chatboxDiv = $('#divChatbox');
var sendForm = $('#sendForm');
var messageText = $('#messageText');

function renderUsers(users) {
    console.log(users);
    var html = '';

    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('room') + '</span></a>';
    html += '</li>';

    for (var i = 0; i < users.length; i++) {
        html += '<li>';
        html += '    <a href="javascript:void(0)" data-id="' + users[i].id + '"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + users[i].name + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    usersDiv.html(html);
}

function renderMessage(data, me) {
    var html = '';
    var date = new Date(data.date);
    var published_at = date.getHours() + ':' + date.getMinutes();

    if (!me) {
        html += '<li class="animated fadeIn">';
        html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        html += '    <div class="chat-content">';
        html += '        <h5>' + data.name + '</h5>';
        html += '        <div class="box bg-light-info">' + data.message + '</div>';
        html += '    </div>';
        html += '    <div class="chat-time">' + published_at + '</div>';
        html += '</li>';
    } else {
        html += '<li class="animated fadeIn reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + data.name + '</h5>';
        html += '        <div class="box bg-light-inverse">' + data.message + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">' + published_at + '</div>';
        html += '</li>';
    }

    chatboxDiv.append(html);
}

function scrollBottom() {
    // selectors
    var newMessage = chatboxDiv.children('li:last-child');

    // heights
    var clientHeight = chatboxDiv.prop('clientHeight');
    var scrollTop = chatboxDiv.prop('scrollTop');
    var scrollHeight = chatboxDiv.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        chatboxDiv.scrollTop(scrollHeight);
    }
}

usersDiv.on('click', 'a[data-id]', function () {
    var id = $(this).data('id');
    console.log(id);
});

sendForm.on('submit', function (e) {
    e.preventDefault();

    if (!messageText.val().trim()) {
        return;
    }

    var data = {
        name: params.get('name'),
        message: messageText.val()
    };

    socket.emit('chat:message', data, function (message) {
        messageText.val('').focus();
        renderMessage(message, true);
        scrollBottom();
    });
});
