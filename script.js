const PRE = "DELTA"
const SUF = "MEET"
let room_id;
let getUserMedia = window.navigator.getUserMedia || window.navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;

let local_stream;
//funcion for creating room
function createRoom() {

    console.log("Creating Room")
    //room from the input
    let room = document.getElementById("room-input").value;
    //if room is empty
    if (room == " " || room == "") {
        alert("Please enter room number")
        return;
    }
    //global room_id
    room_id = PRE + room + SUF;
    //making a peer variable taking room_id as id
    let peer = new Peer(room_id)

    //open a peer for connection here id will be same as roomid
    peer.on('open', (id) => {
        console.log("Peer Connected with ID: ", id)

        //hiding the box of enter the room number
        hideModal()

        //calling function expression for media and it return promise
        //parameter being what you required
        getUserMedia({ video: true, audio: true }, (stream) => {
            local_stream = stream;
            //function to set localstream at right
            setLocalStream(local_stream)
        }, (err) => {
            console.log(err)
        })
        //orange notification setting
        notify("Waiting for peer to join.")
    })

    // when we get a call request from the other peer
    peer.on('call', (call) => {
        //answer the call and gives our stream to the other pear
        call.answer(local_stream);
        //recieve the stream and set it to the division
        let i = 0;
        call.on('stream', (stream) => {
            console.log(i);
            i++;
            console.log('getting the stream of th person');
            if (i == 1) {
                setremotestreamonserverside(stream);
            }
        })
    })
}

function setLocalStream(stream) {
    let video = document.getElementById("local-video");
    //setting src object to stream
    video.srcObject = stream;
    video.muted = true;
    //play the video
    video.play();
    return;
}

//video for the peer
function setRemoteStream(stream) {
    let video = document.getElementById("remote-video");
    video.srcObject = stream;
    video.play();
}

function setremotestreamonserverside(stream) {
    let makevideo = document.createElement("video");
    makevideo.srcObject = stream;
    let temp_div = document.querySelector("#temp");
    console.log(temp_div);
    //  console.log(stream);
    makevideo.autoplay = true;
    temp_div.appendChild(makevideo);
    // document.querySelector("#alag").srcObject = stream;
}


//hide the box after connecting
function hideModal() {
    document.getElementById("entry-modal").hidden = true
}

//shows the  orange msg
function notify(msg) {
    let notification = document.getElementById("notification")
    notification.innerHTML = msg
    notification.hidden = false
    //it waits for 3 sec
    setTimeout(() => {
        notification.hidden = true;
    }, 3000)
}

//when person who joins the room enters 
function joinRoom() {

    console.log("Joining Room")
    //finds room and make id using it
    let room = document.getElementById("room-input").value;
    if (room == " " || room == "") {
        alert("Please enter room number")
        return;
    }

    room_id = PRE + room + SUF;
    hideModal()
    //making peer object with random id
    let peer = new Peer()
    // it returns it (random)id in call back function
    peer.on('open', (id) => {

        console.log("Connected with Id: " + id)
        //getting the stream of the computer it returns the promise
        getUserMedia({ video: true, audio: true }, (stream) => {
            local_stream = stream;
            //setting the localstream
            setLocalStream(local_stream)
            notify("Joining peer")
            //calling the peer which has room id and showing the stream 
            let call = peer.call(room_id, stream)
            //getting the stream of the other user
            call.on('stream', (stream) => {
                setRemoteStream(stream);
            })
        }, (err) => {
            console.log(err)
        })
    })
}