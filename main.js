let localStream;
let remoteStream;
let peerConnection;

const servers ={ 
   iceServers :[ {
    urls:['stun:stun.l.google.com:19302','stun:stun2.l.google.com:19302']
   }]
};

let init = async()=>{
 localStream= await navigator.mediaDevices.getUserMedia({video:true, audio:true});
 document.getElementById('user-1').srcObject=localStream;
 createOffer();
}

const createOffer = async()=>{
    peerConnection = new RTCPeerConnection(servers);
    remoteStream= new MediaStream();
    document.getElementById('user-2').srcObject=remoteStream;

    localStream.getTracks().forEach(track=>{
        peerConnection.addTrack(track,localStream);
    });

    peerConnection.ontrack = event=>{
        event.streams[0].getTracks().forEach(track=>{
            remoteStream.addTrack(track);
        });
    }
    peerConnection.onicecandidate = async (event) =>{
        if(event.candidate){
            console.log('candidate', event.candidate);
        }
    }
    
    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log('offer',offer);
}
init();