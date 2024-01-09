import { useEffect, useRef, useState } from "react";
import {
    FACEMESH_TESSELATION,
    HAND_CONNECTIONS,
    Holistic,
    POSE_CONNECTIONS,
    Results,
} from "@mediapipe/holistic";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

let URL = "https://cdn.jsdelivr.net/npm/@mediapipe";
// URL = "";

function LandmarkCanvas() {
    const webcamRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [input, setInput] = useState("");
    const [holistic, setHolistic] = useState<Holistic | null>(null);

    const [loading, setLoading] = useState(true);

    const onResults = (results: Results) => {
        if (!webcamRef.current || !canvasRef.current) return;
        setLoading(false);
        webcamRef.current.play();
        canvasRef.current.width = 1080;
        canvasRef.current.height = 720;

        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext("2d");
        if (canvasCtx == null) throw new Error("Could not get context");
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 4,
        });
        drawLandmarks(canvasCtx, results.poseLandmarks, {
            color: "#FF0000",
            lineWidth: 2,
        });
        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
            color: "#C0C0C070",
            lineWidth: 1,
        });
        drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
            color: "#CC0000",
            lineWidth: 5,
        });
        drawLandmarks(canvasCtx, results.leftHandLandmarks, {
            color: "#00FF00",
            lineWidth: 2,
        });
        drawConnectors(
            canvasCtx,
            results.rightHandLandmarks,
            HAND_CONNECTIONS,
            { color: "#00CC00", lineWidth: 5 }
        );
        drawLandmarks(canvasCtx, results.rightHandLandmarks, {
            color: "#FF0000",
            lineWidth: 2,
        });
        canvasCtx.restore();
    };

    const animate = async () => {
        if (webcamRef.current !== null && holistic !== null) {
            try {
                await holistic.send({ image: webcamRef.current });
            } catch (e) {
                console.log("unable to load ML module!");
            }
        }

        requestAnimationFrame(animate);
    };

    useEffect(() => {
        const newHolistic = new Holistic({
            locateFile: (file: string) => {
                return `${URL}/holistic/${file}`;
            },
        });

        newHolistic.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: true,
            smoothSegmentation: true,
            refineFaceLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });
        newHolistic.onResults(onResults);
        setHolistic(newHolistic);
    }, []);

    useEffect(() => {
        const onVideoCanPlay = () => {
            if (holistic) {
                holistic.close();
            }
            webcamRef.current!.pause();
            setLoading(true);

            const newHolistic = new Holistic({
                locateFile: (file: string) => {
                    return `${URL}/holistic/${file}`;
                },
            });

            newHolistic.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                enableSegmentation: true,
                smoothSegmentation: true,
                refineFaceLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });
            newHolistic.onResults(onResults);
            setHolistic(newHolistic);

            requestAnimationFrame(animate);
        };
        if (webcamRef.current) {
            webcamRef.current.addEventListener("canplay", onVideoCanPlay);
        }
        return () => {
            if (webcamRef.current) {
                webcamRef.current.removeEventListener(
                    "canplay",
                    onVideoCanPlay
                );
            }

            if (holistic) {
                holistic.close();
            }
        };
    }, [webcamRef, holistic]);

    useEffect(() => {
        // Change video source when input changes
        if (webcamRef.current) {
            webcamRef.current.src = `/assets/demo/${input}`;
        }
    }, [input]);

    return (
        <div className="my-10">
            <video
                ref={webcamRef}
                style={{
                    position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    right: 10,
                    bottom: 10,
                    zIndex: 9,
                    width: 1080 / 4,
                    height: 720 / 4,
                }}
                autoPlay
                muted
                playsInline
                loop
                src={!!input ? `/assets/demo/${input}` : undefined}
            />
            <canvas
                ref={canvasRef}
                style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: 1080,
                    height: 720,
                }}
            />

            <h3 className="absoluteCenter text-xl font-bold text-white">
                {input !== "" && loading && "Loading Model..."}
            </h3>

            <div className="flex items-center justify-center mt-10">
                <div className="flex items-center gap-6">
                    <button
                        className="hover:bg-blue-700 px-4 py-2 font-bold text-white bg-blue-500 rounded-full"
                        onClick={() => setInput("hi.mp4")}
                    >
                        Hi!
                    </button>
                    <button
                        className="hover:bg-blue-700 px-4 py-2 font-bold text-white bg-blue-500 rounded-full"
                        onClick={() => setInput("howareyou.mp4")}
                    >
                        How Are You?
                    </button>
                    <button
                        className="hover:bg-blue-700 px-4 py-2 font-bold text-white bg-blue-500 rounded-full"
                        onClick={() => setInput("whatsyourname.mp4")}
                    >
                        What's Your Name?
                    </button>

                    <button
                        className="hover:bg-blue-700 px-4 py-2 font-bold text-white bg-blue-500 rounded-full"
                        onClick={() => setInput("happybirthday.mp4")}
                    >
                        Happy Birthday!
                    </button>
                    <button
                        className="hover:bg-blue-700 px-4 py-2 font-bold text-white bg-blue-500 rounded-full"
                        onClick={() => setInput("10000.mp4")}
                    >
                        10000
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LandmarkCanvas;
