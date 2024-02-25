const socket = io('http://localhost:8000');

const body = document.querySelector('.container');
const chatBox = document.getElementById('chatContainer');
const onUsers = document.getElementById('onUsers');
const messageContainer = document.getElementById('chatting')
const form = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');

const name = prompt('Enter your name to Join');

if (name === null) {
    const h1Element = document.createElement('h1');
    h1Element.classList.add('noAccess');
    h1Element.innerText = 'Sorry, You are not Allowed to access the chat 💬👋';
    chatBox.remove();
    body.append(h1Element);
    alert('Access Denied');
} else {
    alert('Access Granted');
    socket.emit('new-user-joined', name)
}


socket.on('userIncrement', data => {
    onUsers.innerText = data
})

const appendAction = (message, position) => {
    const messageElement = document.createElement('div');
    const pElement = document.createElement('p');
    pElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageElement.append(pElement);
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}


const appendMessage = (message, user, position, id) => {
    const messageElement = document.createElement('div');
    const span = document.createElement('span');
    const i = document.createElement('i');
    const p = document.createElement('p');

    i.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#eca400" stroke-width="1.5"/>
            <path d="M7.5 17C9.8317 14.5578 14.1432 14.4428 16.5 17M14.4951 9.5C14.4951 10.8807 13.3742 12 11.9915 12C10.6089 12 9.48797 10.8807 9.48797 9.5C9.48797 8.11929 10.6089 7 11.9915 7C13.3742 7 14.4951 8.11929 14.4951 9.5Z" stroke="#eca400" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
    `;

    p.innerText = message;
    span.innerText = user;

    messageElement.append(span);
    messageElement.append(i);
    messageElement.append(p);

    messageElement.classList.add(position);
    messageElement.classList.add('message');
    messageElement.setAttribute('id', id);
    messageElement.setAttribute('ondblclick', "likedMessage(this.id)");

    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
};
socket.on('user-joined', data => {
    appendAction(`${data.name} Joined the Chat`, 'center')
    onUsers.innerText = data.onUsers
})
socket.on('send', data => {
    socket.broadcast.emit('receive', { message: data.message, name: users[socket.id], id: data.id })
})

socket.on('recieve',data =>{
    appendMessage(data.message,data.name,'left',data.id)
})


const likedMessage = (id)=>{
    const likedElement = document.getElementById(id);
    likedElement.classList.add('liked');
    socket.emit('liked',id)
}

socket.on('msg-like',id =>{
    const likedElement = document.getElementById(id);
    likedElement.classList.add('liked');
})

socket.on('disconnected',data =>{
    appendAction(`${data.name} left the Chat`,'center')
    onUsers.innerHTML = data.onUsers
})



form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if (message === "") {
        return
    }
    const id = Math.round(Math.random() * 100000);
    appendMessage(message, 'You', 'right', id);
    socket.emit('send', { message, id })
    messageInput.value = "";
})