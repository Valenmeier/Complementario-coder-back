const socket = io();

socket.on("messages",(allMessages)=>{
    console.log(allMessages)
})
