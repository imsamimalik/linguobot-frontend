import {
    FilesetResolver,
    DrawingUtils,
    HolisticLandmarker,
    HolisticLandmarkerResult,
} from "@mediapipe/tasks-vision";

class HolisticLandmarkManager {
    private static instance: HolisticLandmarkManager =
        new HolisticLandmarkManager();
    private results!: HolisticLandmarkerResult;
    holisticLandmarker!: HolisticLandmarker | null;

    private constructor() {
        this.initializeModel();
    }

    static getInstance(): HolisticLandmarkManager {
        return HolisticLandmarkManager.instance;
    }

    initializeModel = async () => {
        this.holisticLandmarker = null;
        const filesetResolver = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        this.holisticLandmarker = await HolisticLandmarker.createFromOptions(
            filesetResolver,
            {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/holistic_landmarker/holistic_landmarker/float16/latest/holistic_landmarker.task`,
                    delegate: "GPU",
                },

                minFaceDetectionConfidence: 0.5,
                minPoseDetectionConfidence: 0.5,
                minFacePresenceConfidence: 0.5,
                minPosePresenceConfidence: 0.5,
                minHandLandmarksConfidence: 0.5,
                runningMode: "VIDEO",
            }
        );
    };

    getResults = () => {
        return this.results;
    };

    detectLandmarks = (videoElement: HTMLVideoElement, time: number) => {
        if (!this.holisticLandmarker) return;

        const results = this.holisticLandmarker.detectForVideo(
            videoElement,
            time
        );
        this.results = results;
        return results;
    };

    drawLandmarks = (canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext("2d");
        if (!ctx || !!!this.results) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const drawingUtils = new DrawingUtils(ctx);

        // face landmarks
        const lineWidth = 1.3;
        for (const landmarks of this.results.faceLandmarks) {
            drawingUtils.drawConnectors(
                landmarks,
                HolisticLandmarker.FACE_LANDMARKS_TESSELATION,
                { color: "#C0C0C070", lineWidth: lineWidth }
            );
            drawingUtils.drawConnectors(
                landmarks,
                HolisticLandmarker.FACE_LANDMARKS_RIGHT_EYE,
                { color: "#FF3030", lineWidth: lineWidth }
            );
            drawingUtils.drawConnectors(
                landmarks,
                HolisticLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
                { color: "#FF3030", lineWidth: lineWidth }
            );
            drawingUtils.drawConnectors(
                landmarks,
                HolisticLandmarker.FACE_LANDMARKS_LEFT_EYE,
                { color: "#30FF30", lineWidth: lineWidth }
            );
            drawingUtils.drawConnectors(
                landmarks,
                HolisticLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
                { color: "#30FF30", lineWidth: lineWidth }
            );
            drawingUtils.drawConnectors(
                landmarks,
                HolisticLandmarker.FACE_LANDMARKS_FACE_OVAL,
                { color: "#E0E0E0", lineWidth: lineWidth }
            );
            drawingUtils.drawConnectors(
                landmarks,
                HolisticLandmarker.FACE_LANDMARKS_LIPS,
                { color: "#E0E0E0", lineWidth: lineWidth }
            );
            drawingUtils.drawConnectors(
                landmarks,
                HolisticLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
                { color: "#FF3030", lineWidth: lineWidth }
            );
            drawingUtils.drawConnectors(
                landmarks,
                HolisticLandmarker.FACE_LANDMARKS_LEFT_IRIS,
                { color: "#30FF30", lineWidth: lineWidth }
            );
        }

        // left hand landmarks
        for (const landmarks of this.results.leftHandLandmarks) {
            drawingUtils.drawConnectors(
                landmarks,
                HolisticLandmarker.HAND_CONNECTIONS,
                { color: "#00FF00", lineWidth: lineWidth }
            );
        }

        // right hand landmarks
        for (const landmarks of this.results.rightHandLandmarks) {
            drawingUtils.drawConnectors(
                landmarks,
                HolisticLandmarker.HAND_CONNECTIONS,
                { color: "#00FF00", lineWidth: lineWidth }
            );
        }

        // pose landmarks
        for (const landmarks of this.results.poseLandmarks) {
            drawingUtils.drawConnectors(
                landmarks,
                HolisticLandmarker.POSE_CONNECTIONS,
                { color: "#004F00", lineWidth: lineWidth }
            );
        }
    };
}

export default HolisticLandmarkManager;
