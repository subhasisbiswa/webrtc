// const createuser=document.getElementById("create-user");
// console.log(createuser)
// const username=document.getElementById("username");
// console.log(username);
// const allusers=document.getElementById("allusers");
// console.log(allusers);
// const usernameinput=document.querySelector(".username-input");
// console.log(usernameinput);
// const ul=document.querySelector(".caller-list");
// console.log(ul);
// const socket=io()
// let localvideo=document.getElementById("localVideo");
// let remotevideo=document.getElementById("remoteVideo");
// let localstream;
// //singleton method for  peer conection
// const Peerconnection=(()=>{
//    let peerconnection;
//    const createpeerconnection=()=>{
//       const config={
//          iceserver:[
//             {
//                urls:"stun:stun.l.google.com:19302"
//             }
//          ]
//       }
//        peerconnection=new RTCPeerConnection(config);
//       //  console.log("peer connection created", {peerconnection});
//       //add local stream to peer connection
//       localstream.getTracks().forEach(track => {
//          peerconnection.addTrack(track, localstream);
//       });
//       //listen to remote stream event and addto remote video tag
//       peerconnection.ontrack = (event) => {
//          console.log("Remote track received", event);
//          remotevideo.srcObject = event.streams[0];
//       }
//       //listen to ice candidate event
//       peerconnection.onicecandidate = (event) => {
//          if (event.candidate) {
//             console.log("New ICE candidate", event.candidate);
//             // Here you would typically send the candidate to the remote peer
//             socket.emit("new-ice-candidate", event.candidate);
//          }
//       };
//       return peerconnection;
//    }
// return{
//    getinstance:function(){
//       if(!peerconnection){
//          peerconnection=createpeerconnection();
//       }
//       return peerconnection;
//    }
// }
// })()


// createuser.addEventListener("click",(e)=>{
//    // const user= username.value;
//    if(username.value) {
//        socket.emit("create-user", username.value);
        
//             usernameinput.style.display = "none";
    
//    }
// })
// socket.on("user-joined", (allusers) => {
//    console.log( {allusers} );
//    const listofusers=()=>{

//       ul.innerHTML="";
//       for(user in allusers){
//          const li = document.createElement("li");
//          li.textContent = `${user} ${user == username.value ? "(you)" : ""}`;

//          li.classList.add("user-item");

//          if(user != username.value) {
//          const btn=document.createElement("button");
//          // btn.textContent = "Send Message";   
//          btn.classList.add("call-btn");
// // button event triger
//          btn.addEventListener("click", (e) => {
//             startcall(user);
//          });

//          const img= document.createElement("img");
//          img.setAttribute("src", "/images/phone.png");
//          img.setAttribute("width",20);
//          btn.appendChild(img);

//       li.appendChild(btn);
//          }
         
//  ul.appendChild(li);
//       }
     
//    }
//    listofusers()

// })
// const startcall=async (user)=>{
//    console.log("call to", {user});
//    const pc=Peerconnection.getinstance();
//    const offer=await pc.createOffer();
//    console.log(offer)
//    await pc.setLocalDescription(offer);
//    socket.emit("offer",{from:username.value,to:user,offer:pc.LocalDescription})
// }


// // const single=(()=>{console.log("goodmorning")})()
// // console.log(Peerconnection.getinstance());
// // const Hlw=async()=>{
// // const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

// // console.log(stream)
// // }
// // Hlw()

// socket.on("offer",async({from,to,offer})=>{
//    const pc=Peerconnection.getinstance();
//    //set remotedescription

//    await pc.setRemoteDescription(offer);
//    const answer=await pc.createAnswer();
//    await pc.setLocalDescription(answer);  
//    socket.emit("answer",{from:username.value,to,answer:pc.localDescription});
// })
// socket.on("answer",async ({from,to,answer})=>{
//    const pc=Peerconnection.getinstance();
//    //set remote description
//    await pc.setRemoteDescription(answer);
//    console.log("answer received", {from,to,answer});
// })
   
// socket.on("New ICE candidate", async (candidate) => {
//    const pc = Peerconnection.getinstance();
//   await pc.addIceCandidate(new RTCIceCandidate(candidate))
// })



// //initial my app
// const startvideo=async()=>{
//    try{
//       const stream= await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       console.log(stream);
//       localstream=stream;
//       localvideo.srcObject=stream;
//       console.log(localstream.getTracks())
      
// stream.getTracks().forEach(track => {
//   console.log("Track kind:", track);         // "video" or "audio"
 
// });
//    }catch(error){console.log (error)}
// }
// startvideo()
//githubcode
const createUserBtn = document.getElementById("create-user");
const username = document.getElementById("username");
const allusersHtml = document.getElementById("allusers");
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const endCallBtn = document.getElementById("end-call-btn");
const socket = io();
let localStream;
let caller = [];

// Single Method for peer connection
const PeerConnection = (function(){
    let peerConnection;

    const createPeerConnection = () => {
        const config = {
            iceServers: [
                {
                    urls: 'stun:stun.l.google.com:19302'
                }
            ]
        };
        peerConnection = new RTCPeerConnection(config);

        // add local stream to peer connection
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        })
        // listen to remote stream and add to peer connection
        peerConnection.ontrack = function(event) {
            remoteVideo.srcObject = event.streams[0];
        }
        // listen for ice candidate
        peerConnection.onicecandidate = function(event) {
            if(event.candidate) {
                socket.emit("icecandidate", event.candidate);
            }
        }

        return peerConnection;
    }

    return {
        getInstance: () => {
            if(!peerConnection){
                peerConnection = createPeerConnection();
            }
            return peerConnection;
        }
    }
})();

// handle browser events
createUserBtn.addEventListener("click", (e) => {
    if(username.value !== "") {
        const usernameContainer = document.querySelector(".username-input");
        socket.emit("join-user", username.value);
        usernameContainer.style.display = 'none';
    }
});
endCallBtn.addEventListener("click", (e) => {
    socket.emit("call-ended", caller)
})

// handle socket events
socket.on("joined", allusers => {
    console.log({ allusers });
    const createUsersHtml = () => {
        allusersHtml.innerHTML = "";

        for(const user in allusers) {
            const li = document.createElement("li");
            li.textContent = `${user} ${user === username.value ? "(You)" : ""}`;

            if(user !== username.value) {
                const button = document.createElement("button");
                button.classList.add("call-btn");
                button.addEventListener("click", (e) => {
                    startCall(user);
                });
                const img = document.createElement("img");
                img.setAttribute("src", "/images/phone.png");
                img.setAttribute("width", 20);

                button.appendChild(img);

                li.appendChild(button);
            }

            allusersHtml.appendChild(li);
        }
    }

    createUsersHtml();

})
socket.on("offer", async ({from, to, offer}) => {
    const pc = PeerConnection.getInstance();
    // set remote description
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit("answer", {from, to, answer: pc.localDescription});
    caller = [from, to];
});
socket.on("answer", async ({from, to, answer}) => {
    const pc = PeerConnection.getInstance();
    await pc.setRemoteDescription(answer);
    // show end call button
    endCallBtn.style.display = 'block';
    socket.emit("end-call", {from, to});
    caller = [from, to];
});
socket.on("icecandidate", async candidate => {
    console.log({ candidate });
    const pc = PeerConnection.getInstance();
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
});
socket.on("end-call", ({from, to}) => {
    endCallBtn.style.display = "block";
});
socket.on("call-ended", (caller) => {
    endCall();
})


// start call method
const startCall = async (user) => {
    console.log({ user })
    const pc = PeerConnection.getInstance();
    const offer = await pc.createOffer();
    console.log({ offer })
    await pc.setLocalDescription(offer);
    socket.emit("offer", {from: username.value, to: user, offer: pc.localDescription});
}

const endCall = () => {
    const pc = PeerConnection.getInstance();
    if(pc) {
        pc.close();
        endCallBtn.style.display = 'none';
    }
}

// initialize app
const startMyVideo = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        console.log({ stream });
        localStream = stream;
        localVideo.srcObject = stream;
    } catch(error) {}
}

startMyVideo();