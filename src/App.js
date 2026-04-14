import React, { useEffect } from 'react'
import './App.css'
import * as faceapi from 'face-api.js'

function App() {

	useEffect(() => {
		const video = document.getElementById("video");

		// 🎥 Start camera
		navigator.mediaDevices.getUserMedia({ video: true })
			.then((stream) => {
				video.srcObject = stream;
			})
			.catch((err) => {
				console.error("Camera error:", err);
			});

		// 📦 Load models
		const loadModels = async () => {
			const MODEL_URL = process.env.PUBLIC_URL + "/models";

			await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
			await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

			startDetection();
		};

		// 🎯 Emotion detection loop
		const startDetection = () => {
			setInterval(async () => {
				const detections = await faceapi
					.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
					.withFaceExpressions();

				if (detections.length > 0) {
					const expressions = detections[0].expressions;

					const max = Object.keys(expressions).reduce((a, b) =>
						expressions[a] > expressions[b] ? a : b
					);

					document.getElementById("textStatus").innerText = max;
					document.getElementById("emoji").innerText = getEmoji(max);
					setBackground(max); // 🔥 background change
				}
			}, 500);
		};

		// 😊 Emoji mapping
		const getEmoji = (emotion) => {
			switch (emotion) {
				case "happy": return "😄";
				case "sad": return "😢";
				case "angry": return "😠";
				case "surprised": return "😲";
				case "neutral": return "😐";
				default: return "🙂";
			}
		};

		// 🎨 Background change
		const setBackground = (emotion) => {
			const app = document.getElementById("app");

			switch (emotion) {
				case "happy":
					app.style.background = "linear-gradient(135deg, #FFD700, #FFA500)";
					break;

				case "sad":
					app.style.background = "linear-gradient(135deg, #4facfe, #00f2fe)";
					break;

				case "angry":
					app.style.background = "linear-gradient(135deg, #ff4e50, #ff0000)";
					break;

				case "surprised":
					app.style.background = "linear-gradient(135deg, #f7971e, #ffd200)";
					break;

				case "neutral":
					app.style.background = "linear-gradient(135deg, #43cea2, #185a9d)";
					break;

				default:
					app.style.background = "#2c3e50";
			}
		};

		loadModels();

	}, []);

	return (
		<>
			<div id="app" className="app">
			<div className="icon1">
  <span role="img" aria-label="camera">📷</span>
</div>

<div className="icon2">
  <span role="img" aria-label="love">❤️</span>
</div>
				<div className="overlay"></div>

				<div className="text">
					<span aria-label="emoji" role="img" id="emoji">
						😐
					</span>
					You look <span id="textStatus">...</span>!
				</div>

				<div className="mockup">
					<div id="browser" className="browser">
						<div className="browserChrome">
							<div className="browserActions"></div>
						</div>

						<canvas id="canvas"></canvas>
						<video id="video" width="800" height="600" muted autoPlay></video>
					</div>
				</div>

				<p className="note">
					You are not being recorded, it all happens in your own browser!
				</p>
			</div>
		</>
	)
}

export default App