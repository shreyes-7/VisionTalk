
# VisionTalk

**Live Demo:** [vision-talk-gules.vercel.app](https://vision-talk-gules.vercel.app)

VisionTalk is a real-time video communication platform leveraging WebRTC for peer-to-peer media streaming and WebSocket for efficient signaling. Designed for seamless browser-based interactions, it offers high-quality video calls without the need for additional plugins or installations.

## Features

### 🔹 Real-Time Video Communication
- **Peer-to-Peer Streaming:** Utilizes WebRTC to establish direct connections between users, ensuring low-latency and high-quality video and audio transmission.
- **Adaptive Quality:** Automatically adjusts media quality based on network conditions for optimal performance.

### 🔹 Efficient Signaling with WebSocket
- **Session Management:** Employs WebSocket for the exchange of signaling data (SDP and ICE candidates), facilitating the setup and management of WebRTC connections.
- **Low Latency:** Ensures rapid message delivery for initiating and terminating calls.

### 🔹 User-Friendly Interface
- **Intuitive Design:** Clean and responsive UI for easy navigation and interaction.
- **Cross-Platform Compatibility:** Accessible via modern web browsers without additional installations.

## Technologies Used

- **Frontend:**
  - HTML, CSS, JavaScript
  - WebRTC APIs for media handling

- **Backend:**
  - Node.js
  - WebSocket for signaling

## Advantages of Using WebRTC and WebSocket

- **WebRTC:**
  - Enables direct peer-to-peer communication, reducing server load.
  - Provides high-quality audio and video streaming with minimal latency.
  - Supports NAT traversal using STUN/TURN servers for reliable connectivity.

- **WebSocket:**
  - Maintains a persistent, full-duplex communication channel between client and server.
  - Facilitates real-time signaling required for establishing WebRTC connections.
  - Offers efficient message exchange, crucial for session control and management.

## Getting Started

### Prerequisites

- Node.js installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shreyes-7/VisionTalk.git
   cd VisionTalk
   ```

2. **Navigate to the backend directory and install dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Start the signaling server:**
   ```bash
   node app.js
   ```

4. **Open the frontend:**
   - Navigate to the `frontend` directory.
   ```bash
    cd frontend
   npm install
    ```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.
