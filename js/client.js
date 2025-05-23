const socket = io('http://127.0.0.1:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value; 
    append(`You : ${message}`, 'right');
    socket.emit('send',message);
    messageInput.value = '';
})

var audio = new Audio('iphone_ding.mp3');

const append = (message,position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message')
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
}
const name1 = prompt("Enter your name to join");

socket.emit('new-user-joined', name1)

socket.on('user-joined', (name)=>{
    append(`${name} joined the chat`, 'right')
})

socket.on('receive', (data)=>{
    append(`${data.name} : ${data.message}`, 'left')
})

socket.on("user-leave",(user)=>{
    append(`${user} left the chat`, 'left');
})