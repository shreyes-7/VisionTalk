import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, TextField, Typography, Box, Paper, Divider, Tooltip } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import server from '../environment';

const server_url = server;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

const darkBackground = '#121212';
const darkPaper = '#1e1e1e';
const darkAccent = '#bb86fc';
const darkTextPrimary = '#e0e0e0';
const darkTextSecondary = '#a0a0a0';
const darkButtonBg = '#333333';
const darkButtonHover = '#444444';
const darkChatUserBg = '#3700b3';
const darkChatOtherBg = '#2c2c2c';

export default function VideoMeetComponent() {

    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState([]);

    let [audio, setAudio] = useState();

    let [screen, setScreen] = useState();

    let [showModal, setModal] = useState(true);

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([])

    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(3);

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState("");

    const videoRef = useRef([])

    let [videos, setVideos] = useState([])

    useEffect(() => {
        getPermissions();
    }, [])

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
            } else {
                setVideoAvailable(false);
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
            } else {
                setAudioAvailable(false);
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
        }
    }, [video, audio])

    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    }

    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }

    let getDislayMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia()
        })
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }

    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    connections[socketListId].onaddstream = (event) => {
                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };

                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillStyle = '#000000';
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => {
        setVideo(!video);
    }
    let handleAudio = () => {
        setAudio(!audio)
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])
    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/"
    }

    let openChat = () => {
        setModal(true);
        setNewMessages(0);
    }
    let closeChat = () => {
        setModal(false);
    }
    let handleMessage = (e) => {
        setMessage(e.target.value);
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };

    let sendMessage = () => {
        socketRef.current.emit('chat-message', message, username)
        setMessage("");
    }

    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }

    return (
        <Box sx={{ height: '100vh', bgcolor: darkBackground, color: darkTextPrimary, display: 'flex', flexDirection: 'column', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            {askForUsername ? (
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 3, bgcolor: darkPaper, m: 4, borderRadius: 3, boxShadow: '0 0 15px #000' }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: darkAccent }}>
                        Enter Lobby
                    </Typography>
                    <TextField
                        id="username-input"
                        label="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        variant="outlined"
                        sx={{
                            mb: 3,
                            width: '300px',
                            '& .MuiInputBase-root': {
                                color: darkTextPrimary,
                                backgroundColor: darkButtonBg,
                                borderRadius: 1,
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#555',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: darkAccent,
                            }
                        }}
                        autoFocus
                    />
                    <Button variant="contained" onClick={connect} disabled={!username.trim()} sx={{ px: 5, py: 1.5, fontWeight: 'bold', fontSize: '1rem', bgcolor: darkAccent, color: darkTextPrimary, '&:hover': { bgcolor: '#9a67ea' } }}>
                        Connect
                    </Button>
                    <Box sx={{ mt: 4, width: '320px', borderRadius: 2, overflow: 'hidden', boxShadow: '0 0 20px #000' }}>
                        <video ref={localVideoref} autoPlay muted playsInline style={{ width: '100%', borderRadius: 8, backgroundColor: '#000' }} />
                    </Box>
                </Box>
            ) : (
                <Box sx={{ flexGrow: 1, display: 'flex', height: '100%', bgcolor: darkBackground }}>
                    {/* Video and Controls Section */}
                    <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', p: 2, bgcolor: darkPaper, borderRadius: 3, boxShadow: '0 0 20px #000', mr: 2 }}>
                        <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold', color: darkAccent }}>
                            Video Conference
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', overflowY: 'auto', bgcolor: '#222', p: 1, borderRadius: 2 }}>
                            <Box sx={{ position: 'relative', width: { xs: '100%', sm: '48%', md: '32%' }, aspectRatio: '16/9', borderRadius: 2, overflow: 'hidden', boxShadow: 2, bgcolor: '#000' }}>
                                <video
                                    ref={localVideoref}
                                    autoPlay
                                    muted
                                    playsInline
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                                />
                                <Typography
                                    variant="caption"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 8,
                                        left: 8,
                                        bgcolor: 'rgba(0,0,0,0.6)',
                                        color: darkTextPrimary,
                                        px: 1,
                                        borderRadius: 1,
                                        fontWeight: 'bold',
                                        userSelect: 'none'
                                    }}
                                >
                                    You
                                </Typography>
                            </Box>
                            {videos.map((video) => (
                                <Box
                                    key={video.socketId}
                                    sx={{
                                        position: 'relative',
                                        width: { xs: '100%', sm: '48%', md: '32%' },
                                        aspectRatio: '16/9',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        boxShadow: 2,
                                        bgcolor: '#000'
                                    }}
                                >
                                    <video
                                        data-socket={video.socketId}
                                        ref={ref => {
                                            if (ref && video.stream) {
                                                ref.srcObject = video.stream;
                                            }
                                        }}
                                        autoPlay
                                        playsInline
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                                    />
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            position: 'absolute',
                                            bottom: 8,
                                            left: 8,
                                            bgcolor: 'rgba(0,0,0,0.6)',
                                            color: darkTextPrimary,
                                            px: 1,
                                            borderRadius: 1,
                                            fontWeight: 'bold',
                                            userSelect: 'none'
                                        }}
                                    >
                                        Participant
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                        <Divider sx={{ my: 2, borderColor: '#444' }} />
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                            <Tooltip title={video ? "Turn off video" : "Turn on video"}>
                                <IconButton onClick={handleVideo} size="large" sx={{ bgcolor: video ? darkAccent : darkButtonBg, color: darkTextPrimary, '&:hover': { bgcolor: '#9a67ea' } }}>
                                    {video ? <VideocamIcon /> : <VideocamOffIcon />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="End Call">
                                <IconButton onClick={handleEndCall} size="large" sx={{ bgcolor: '#cf6679', color: darkTextPrimary, '&:hover': { bgcolor: '#b00020' } }}>
                                    <CallEndIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={audio ? "Mute microphone" : "Unmute microphone"}>
                                <IconButton onClick={handleAudio} size="large" sx={{ bgcolor: audio ? darkAccent : darkButtonBg, color: darkTextPrimary, '&:hover': { bgcolor: '#9a67ea' } }}>
                                    {audio ? <MicIcon /> : <MicOffIcon />}
                                </IconButton>
                            </Tooltip>
                            {screenAvailable && (
                                <Tooltip title={screen ? "Stop screen sharing" : "Share screen"}>
                                    <IconButton onClick={handleScreen} size="large" sx={{ bgcolor: screen ? darkAccent : darkButtonBg, color: darkTextPrimary, '&:hover': { bgcolor: '#9a67ea' } }}>
                                        {screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                                    </IconButton>
                                </Tooltip>
                            )}
                            <Badge badgeContent={newMessages} max={999} color='warning'>
                                <Tooltip title={showModal ? "Close chat" : "Open chat"}>
                                    <IconButton onClick={() => setModal(!showModal)} size="large" sx={{ bgcolor: darkAccent, color: darkTextPrimary, '&:hover': { bgcolor: '#9a67ea' } }}>
                                        <ChatIcon />
                                    </IconButton>
                                </Tooltip>
                            </Badge>
                        </Box>
                    </Box>

                    {/* Chat Section */}
                    {showModal && (
                        <Paper elevation={6} sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: darkPaper, borderRadius: 3, p: 2, maxWidth: 360, boxShadow: '0 0 20px #000' }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: darkAccent }}>
                                Chat Room
                            </Typography>
                            <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, pr: 1 }}>
                                {messages.length > 0 ? (
                                    messages.map((item, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                mb: 1.5,
                                                p: 1.5,
                                                bgcolor: item.sender === username ? darkChatUserBg : darkChatOtherBg,
                                                color: darkTextPrimary,
                                                borderRadius: 2,
                                                alignSelf: item.sender === username ? 'flex-end' : 'flex-start',
                                                maxWidth: '80%',
                                                wordBreak: 'break-word',
                                                boxShadow: 1,
                                                userSelect: 'none'
                                            }}
                                        >
                                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                {item.sender}
                                            </Typography>
                                            <Typography variant="body2">{item.data}</Typography>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: darkTextSecondary }}>
                                        No messages yet
                                    </Typography>
                                )}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    value={message}
                                    onChange={handleMessage}
                                    label="Enter your message"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            color: darkTextPrimary,
                                            backgroundColor: darkButtonBg,
                                            borderRadius: 1,
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#555',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: darkAccent,
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && message.trim()) {
                                            sendMessage();
                                        }
                                    }}
                                />
                                <Button variant="contained" onClick={sendMessage} disabled={!message.trim()} sx={{ px: 3, bgcolor: darkAccent, color: darkTextPrimary, '&:hover': { bgcolor: '#9a67ea' } }}>
                                    Send
                                </Button>
                            </Box>
                        </Paper>
                    )}
                </Box>
            )}
        </Box>
    )
}
