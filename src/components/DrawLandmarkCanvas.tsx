import HolisticLandmarkManager from "@/class/LandmarkManager";
import { useAvatarStore } from "@/store/AvatarStore";
import { useEffect, useRef } from "react";

interface DrawLandmarkCanvasProps {
    width: number;
    height: number;
}
const DrawLandmarkCanvas = ({ width, height }: DrawLandmarkCanvasProps) => {
    const drawCanvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef(0);
    const videoURL = useAvatarStore((state) => state.videoURL);

    const animate = () => {
        if (drawCanvasRef.current) {
            drawCanvasRef.current.width = width;
            drawCanvasRef.current.height = height;
            const landmarker = HolisticLandmarkManager.getInstance();
            landmarker.drawLandmarks(drawCanvasRef.current);
        }
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    return (
        <canvas
            className="w-full"
            // style={{ transform: "scaleX(-1)" }}
            ref={drawCanvasRef}
            style={{
                opacity: videoURL === "/assets/demo/howareyou.mp4" ? 0 : 1,
            }}
        ></canvas>
    );
};

export default DrawLandmarkCanvas;
