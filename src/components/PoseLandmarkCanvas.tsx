import { useEffect, useRef, useState } from "react";
import DrawLandmarkCanvas from "./DrawLandmarkCanvas";
import AvatarCanvas from "./AvatarCanvas";
import HolisticLandmarkManager from "@/class/LandmarkManager";
import { useAvatarStore } from "@/store/AvatarStore";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

const PoseLandmarkCanvas = () => {
    const modelUrl = useAvatarStore((state) => state.modelUrl);

    const avatarMode = useAvatarStore((state) => state.avatarMode);
    const toggleAvatarMode = useAvatarStore((state) => state.toggleAvatarMode);
    const videoURL = useAvatarStore((state) => state.videoURL);
    const devMode = useAvatarStore((state) => state.devMode);

    const videoRef = useRef<HTMLVideoElement>(null);
    const lastVideoTimeRef = useRef(-1);
    const requestRef = useRef(0);

    const [videoSize, setVideoSize] = useState<{
        width: number;
        height: number;
    }>({
        width: 0,
        height: 0,
    });

    const landmarkManager = HolisticLandmarkManager.getInstance();
    const animate = () => {
        if (
            videoRef.current &&
            videoRef.current.currentTime !== lastVideoTimeRef.current
        ) {
            lastVideoTimeRef.current = videoRef.current.currentTime;
            try {
                landmarkManager.detectLandmarks(
                    videoRef.current,
                    performance.now()
                );
            } catch (e) {
                console.log("PoseLandmarkCanvas.tsx ==>> ", e);
            }
        }
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (videoURL !== "/assets/demo/howareyou.mp4" && videoRef.current) {
            cancelAnimationFrame(requestRef.current);
            const video = videoRef.current;
            video!.load();
            video!.play().then(() => {
                console.log("video is playing");
                animate();
            });

            return () => {
                // video!.pause();
                // video!.removeAttribute("src");
                // video!.load();
            };
        }
    }, [videoURL]);

    useEffect(() => {
        setVideoSize({
            // width: videoRef.current!.offsetWidth,
            // height: videoRef.current!.offsetHeight,
            width: 16 * 70,
            height: 9 * 70,
        });

        requestRef.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    return (
        <div className="size-full flex flex-col items-center">
            <video
                className="bottom-2 right-2 absolute w-[200px]"
                ref={videoRef}
                loop={true}
                muted={true}
                autoPlay={true}
                playsInline={true}
                crossOrigin="anonymous"
                style={{
                    opacity: (videoURL === "/assets/demo/howareyou.mp4" || !devMode) ? 0 : 1,
                }}
            >
                <source src={videoURL} type="video/mp4" />
            </video>
            <div className="size-full relative flex justify-center">
                {videoSize && (
                    <>
                        {avatarMode ? (
                            <AvatarCanvas url={modelUrl} />
                        ) : (
                            <DrawLandmarkCanvas
                                width={videoSize.width}
                                height={videoSize.height}
                            />
                        )}
                    </>
                )}
                <div className="-bottom-10 absolute right-0 flex items-center p-2 space-x-2">
                    <Label className="text-xs" htmlFor="mode">
                        Skeleton
                    </Label>
                    <Switch
                        className="scale-75"
                        checked={avatarMode}
                        onCheckedChange={toggleAvatarMode}
                        id="mode"
                    />
                    <Label className="text-xs" htmlFor="mode">
                        Avatar
                    </Label>
                </div>
            </div>
        </div>
    );
};

export default PoseLandmarkCanvas;
