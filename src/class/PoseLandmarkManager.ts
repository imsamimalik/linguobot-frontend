import {
    FilesetResolver,
    DrawingUtils,
    PoseLandmarker,
    PoseLandmarkerResult,
} from "@mediapipe/tasks-vision";

class PoseLandmarkManager {
    private static instance: PoseLandmarkManager = new PoseLandmarkManager();
    private results!: PoseLandmarkerResult;
    poseLandmarker!: PoseLandmarker | null;

    private constructor() {
        this.initializeModel();
    }

    static getInstance(): PoseLandmarkManager {
        return PoseLandmarkManager.instance;
    }

    initializeModel = async () => {
        this.poseLandmarker = null;
        const filesetResolver = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        this.poseLandmarker = await PoseLandmarker.createFromOptions(
            filesetResolver,
            {
                baseOptions: {
                    // modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                    modelAssetPath: `/assets/demo/pose_landmarker_heavy.task`,
                    delegate: "GPU",
                },

                outputSegmentationMasks: false,               
                runningMode: "VIDEO",
                numPoses: 1,
            }
        );
    };

    getResults = () => {
        return this.results;
    };

    detectLandmarks = (videoElement: HTMLVideoElement, time: number) => {
        if (!this.poseLandmarker) return;

        const results = this.poseLandmarker.detectForVideo(videoElement, time);
        this.results = results;
        return results;
    };

    drawLandmarks = (canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext("2d");
        if (!ctx || !this.results?.landmarks) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const drawingUtils = new DrawingUtils(ctx);

        // const lineWidth = 1.3;


        for (const landmarks of this.results.landmarks) {

            drawingUtils.drawConnectors(
                landmarks,
                PoseLandmarker.POSE_CONNECTIONS
            );

            // drawingUtils.drawConnectors(
            //     landmarks,
            //     FaceLandmarker.FACE_LANDMARKS_TESSELATION,
            //     { color: "#C0C0C070", lineWidth: lineWidth }
            // );
            // drawingUtils.drawConnectors(
            //     landmarks,
            //     FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
            //     { color: "#FF3030", lineWidth: lineWidth }
            // );
            // drawingUtils.drawConnectors(
            //     landmarks,
            //     FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
            //     { color: "#FF3030", lineWidth: lineWidth }
            // );
            // drawingUtils.drawConnectors(
            //     landmarks,
            //     FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
            //     { color: "#30FF30", lineWidth: lineWidth }
            // );
            // drawingUtils.drawConnectors(
            //     landmarks,
            //     FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
            //     { color: "#30FF30", lineWidth: lineWidth }
            // );
            // drawingUtils.drawConnectors(
            //     landmarks,
            //     FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
            //     { color: "#E0E0E0", lineWidth: lineWidth }
            // );
            // drawingUtils.drawConnectors(
            //     landmarks,
            //     FaceLandmarker.FACE_LANDMARKS_LIPS,
            //     { color: "#E0E0E0", lineWidth: lineWidth }
            // );
            // drawingUtils.drawConnectors(
            //     landmarks,
            //     FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
            //     { color: "#FF3030", lineWidth: lineWidth }
            // );
            // drawingUtils.drawConnectors(
            //     landmarks,
            //     FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
            //     { color: "#30FF30", lineWidth: lineWidth }
            // );
        }
    };
}

export default PoseLandmarkManager;
