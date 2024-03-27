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

    close = () => {
        HolisticLandmarkManager.instance.holisticLandmarker?.close();
    };

    static getInstance(): HolisticLandmarkManager {
        return HolisticLandmarkManager.instance;
    }

    initializeModel = async () => {
        this.holisticLandmarker = null;
        const filesetResolver = await FilesetResolver.forVisionTasks(
            "/assets/demo/wasm"
        );
        this.holisticLandmarker = await HolisticLandmarker.createFromOptions(
            filesetResolver,
            {
                baseOptions: {
                    modelAssetPath: `/assets/demo/holistic_landmarker.task`,
                    // delegate: "GPU",
                },

                minFaceDetectionConfidence: 0.5,
                minPoseDetectionConfidence: 0.5,
                minFacePresenceConfidence: 0.5,
                minPosePresenceConfidence: 0.5,
                minHandLandmarksConfidence: 0.5,
                outputFaceBlendshapes: true,
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
        const lineWidth = 3;

        const leftEye = "#FF3030";
        const rightEye = "#FF3030";

        for (const landmarks of this.results.faceLandmarks) {
            drawingUtils.drawConnectors(
                landmarks,
                HolisticLandmarker.FACE_LANDMARKS_TESSELATION,
                { color: "#C0C0C070", lineWidth: lineWidth }
            );
            drawingUtils.drawConnectors(
                landmarks,
                HolisticLandmarker.FACE_LANDMARKS_RIGHT_EYE,
                { color: rightEye, lineWidth: lineWidth }
            );
            drawingUtils.drawConnectors(
                landmarks,
                HolisticLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
                { color: rightEye, lineWidth: lineWidth }
            );
            drawingUtils.drawConnectors(
                landmarks,
                HolisticLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
                { color: rightEye, lineWidth: lineWidth }
            );
            drawingUtils.drawConnectors(
                landmarks,
                HolisticLandmarker.FACE_LANDMARKS_LEFT_EYE,
                { color: leftEye, lineWidth: lineWidth }
            );
            drawingUtils.drawConnectors(
                landmarks,
                HolisticLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
                { color: leftEye, lineWidth: lineWidth }
            );
            drawingUtils.drawConnectors(
                landmarks,
                HolisticLandmarker.FACE_LANDMARKS_LEFT_IRIS,
                { color: leftEye, lineWidth: lineWidth }
            );
            drawingUtils.drawConnectors(
                landmarks,
                HolisticLandmarker.FACE_LANDMARKS_FACE_OVAL,
                { color: "#8e2710", lineWidth: lineWidth }
            );
            drawingUtils.drawConnectors(
                landmarks,
                HolisticLandmarker.FACE_LANDMARKS_LIPS,
                { color: "#8e2710", lineWidth: lineWidth }
            );
        }

        // left hand landmarks
        drawingUtils.drawConnectors(
            this.results.leftHandLandmarks[0],
            HolisticLandmarker.HAND_CONNECTIONS,
            { color: "#212121", lineWidth: 4 }
        );
        drawingUtils.drawLandmarks(this.results.leftHandLandmarks[0], {
            color: "#0f0",
            radius: 2,
        });

        // right hand landmarks
        drawingUtils.drawConnectors(
            this.results.rightHandLandmarks[0],
            HolisticLandmarker.HAND_CONNECTIONS,
            { color: "#212121", lineWidth: 4 }
        );
        drawingUtils.drawLandmarks(this.results.rightHandLandmarks[0], {
            color: "#0f0",
            radius: 2,
        });

        // pose landmarks
        // skip first 9 and then 16,18,20 and 17, 19, 21
        const toSkip = [0, 1, 2, 3, 4, 5, 6, 7, 8, 13, 14, 15, 18, 19, 20, 21];
        const filteredConns = HolisticLandmarker.POSE_CONNECTIONS.filter(
            (_connection, index) => !toSkip.includes(index)
        );

        // skip toSkip from this.results.poseLandmarks[0]
        // const newP = [0, 1, 2];
        // const filteredPose = this.results.poseLandmarks[0].filter(
        //     (_landmark, index) => !newP.includes(index)
        // );

        drawingUtils.drawConnectors(
            this.results.poseLandmarks[0],
            filteredConns,
            {
                color: "#F00000",
                lineWidth: lineWidth,
            }
        );
    };
}

export default HolisticLandmarkManager;
