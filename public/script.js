
const socket = io('/'); //import 

const myVideo = document.createElement('video') //create a video element
myVideo.muted = true; 

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
}); 

const videogrid = document.getElementById('video-grid') //get the element for video grid


let myvideo;
navigator.mediaDevices.getUserMedia({ //get video and audio access from browser
    video: true,
    audio: true
}).then(stream => { //we do this if we get access to video permission
    myvideo = stream; //we have our video stream imported here
    addvideostream(myVideo, stream)

    peer.on('call', call => {
        call.answer(stream) //answer the call when the user calls us and add it to our video stream
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
          addvideostream(video, userVideoStream)
        })
      })

    socket.on('user-connected', (userid) => { //listening to user-connected on user id
        connectnewuser(userid, stream);
    })
    let text = $('input') //take message input

    $('html').keydown((e) => {  //e is the event of typing 
      if(e.which == 13 && text.val().length !== 0) { //enter has key 13 and no empty tag
        socket.emit('message',text.val()); //emit will send message 
        text.val('') //input is cleared
      } 
    })

    socket.on('sendMessage', message =>{ //we receive the message back here
      $("ul").append(`<li class="message"><b>Participant</b><br/>${message}</li>`); //append every time a message comes in
      scrollToBottom()
    })
} )

peer.on('open', id => {
    socket.emit('join-room', room_id, id); //telling that the person has joined the room
})

 


const connectnewuser = (userid, stream) => {
    const call = peer.call(userid, stream) //call the other user and send him my stream
    const video = document.createElement('video') //create new video element
    call.on('stream', userVideoStream => {
      addvideostream(video, userVideoStream) //add video stream when you receive it
    })
}


const addvideostream = (video, stream) => {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videogrid.append(video) //put video in the grid
}

const scrollToBottom = () => { //for scrolling in the chat window
  let d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}

//mute our video
const muteUnmute = () => {
  const enabled = myvideo.getAudioTracks()[0].enabled; //get our current stream
  if (enabled) { //if enabled, then disable
    myvideo.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myvideo.getAudioTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone-alt"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="fas fa-microphone-alt-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const playStop = () => {
  let enabled = myvideo.getVideoTracks()[0].enabled;
  if (enabled) {
    myvideo.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myvideo.getVideoTracks()[0].enabled = true;
  }
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}
function myFunction() {
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
}