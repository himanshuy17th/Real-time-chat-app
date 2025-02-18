const socket = io('http://localhost:3000');


const form = document.getElementById('send-container');

const messageInput = document.getElementById('messageInp')

const messageContainer = document.querySelector(".container")

//audio play while receiving messages
var audio = new Audio('ting.mp3');

const append =(message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left')
    {
        audio.play();
    }
    
}

// Ask new user for his /her name and let the server know
const uname = prompt("Enter your name to join");
socket.emit('new-user-joined', uname);


// If a new user joins , receive his/her name from the server
socket.on('user-joined', uname=>{
    append(`${uname} joined the chat`, 'right')
});


// If server sends a message , receive it
socket.on('receive', data=>{
    append(`${data.uname}: ${data.message}`, 'left')
});


// If a user leaves the chat, append the info to tthe container
socket.on('user-left', uname => {
    append(`${uname} left the chat`, 'left'); // Display message when a user leaves
});


// If the form gets submitted , send server the message
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});