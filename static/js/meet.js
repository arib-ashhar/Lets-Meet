const APP_ID = '54cb0fb3b05e41c785a318ce37509239'
const CHANNEL = sessionStorage.getItem('meetName')
const TOKEN = sessionStorage.getItem('token')
let UserID = Number(sessionStorage.getItem('UserID'))
let userName = sessionStorage.getItem('userName')


const client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})

let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalStream = async () => {
    document.getElementById('meet-name').innerText = CHANNEL
    
    client.on('user-published', handleNewJoinedUser)
    client.on('user-left', handleUserLeft)

    try{
        await client.join(APP_ID, CHANNEL, TOKEN, UserID)
    }catch(error){
        console.log('Error in joining!')
        window.open('/', '_self')
    }

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()
    let member = await createMeetMember()

    let player = `<div class="video-container" id="user-container-${UserID}">
                    <div class="username-wrapper"><span class="username">${member.userName}</span></div>
                    <div class="video-player" id="user-${UserID}"></div>
                </div>`
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

    localTracks[1].play(`user-${UserID}`)
    await client.publish([localTracks[0], localTracks[1]])
}

let handleNewJoinedUser = async (user, mediaType) => {
    remoteUsers[user.uid] = user
    await client.subscribe(user, mediaType)

    if(mediaType === 'video'){
        let player = document.getElementById(`user-conatainer-${user.uid}`)
        if(player != null){
            player.remove()
        }
        let member = await getMember(user)
        player = `<div class="video-container" id="user-container-${user.uid}">
                    <div class="username-wrapper"><span class="username">${member.userName}</span></div>
                    <div class="video-player" id="user-${user.uid}"></div>
                </div>`
        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)
        user.videoTrack.play(`user-${user.uid}`)
    }

    if(mediaType === 'audio'){
        user.audioTrack.play()
    }
}

let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}


let leaveAndRemoveLocalStream = async () => {
    for(let i=0;i < localTracks.length; i++){
        localTracks[i].stop()
        localTracks[i].close()
    }
    await client.leave()
    deleteMember()
    window.open('/', '_self')
}

let toggleCamera = async (e) => {
    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }
    else{
        await localTracks[1].setMuted(true)
        e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'
    }
}

let toggleMic = async (e) => {
    if(localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }
    else{
        await localTracks[0].setMuted(true)
        e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'
    }
}

let createMeetMember = async () => {
    let response = await fetch('/create_member/', {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({'userName':userName, 'meetName':CHANNEL, 'UserID':UserID})
    })
    let member = await response.json()
    return member
}

let getMember = async (user) => {
    let response = await fetch(`/get_member/?UserID=${user.uid}&meetName=${CHANNEL}`)
    let member = await response.json()
    return member
}

let deleteMember = async () => {
    let response = await fetch('/delete_member/', {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({'userName':userName, 'meetName':CHANNEL, 'UserID':UserID})
    })
    let member = await response.json()
}



joinAndDisplayLocalStream()

window.addEventListener("beforeunload", deleteMember)

document.getElementById('leave-btn').addEventListener('click', leaveAndRemoveLocalStream)
document.getElementById('camera-btn').addEventListener('click', toggleCamera)
document.getElementById('mic-btn').addEventListener('click', toggleMic)




//console.log('meet working!')