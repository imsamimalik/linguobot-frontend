import { useEffect, useRef, useState } from "react";
import DrawLandmarkCanvas from "./DrawLandmarkCanvas";
import AvatarCanvas from "./AvatarCanvas";
import PoseLandmarkManager from "@/class/PoseLandmarkManager";
import ReadyPlayerCreator from "./ReadyPlayerCreator";
import { useAvatarStore } from "@/store/AvatarStore";

const PoseLandmarkCanvas = () => {
    const modelUrl = useAvatarStore((state) => state.modelUrl);
    const setModelUrl = useAvatarStore((state) => state.setModelUrl);
    const toggleAvatarCreatorView = useAvatarStore(
        (state) => state.toggleAvatarCreatorView
    );
    const showAvatarCreator = useAvatarStore(
        (state) => state.showAvatarCreator
    );

    const videoRef = useRef<HTMLVideoElement>(null);
    const lastVideoTimeRef = useRef(-1);
    const requestRef = useRef(0);
    const [avatarView, setAvatarView] = useState(true);
    // const [showAvatarCreator, setShowAvatarCreator] = useState(false);
    // const [modelUrl, setModelUrl] = useState("/assets/demo/model.glb");
    const [videoSize, setVideoSize] = useState<{
        width: number;
        height: number;
    }>();

    // const toggleAvatarView = () => setAvatarView((prev) => !prev);
    // const toggleAvatarCreatorView = () => setShowAvatarCreator((prev) => !prev);
    const handleAvatarCreationComplete = (url: string) => {
        setModelUrl(url);
        toggleAvatarCreatorView();
    };

    const animate = () => {
        if (
            videoRef.current &&
            videoRef.current.currentTime !== lastVideoTimeRef.current
        ) {
            lastVideoTimeRef.current = videoRef.current.currentTime;
            try {
                const faceLandmarkManager = PoseLandmarkManager.getInstance();
                faceLandmarkManager.detectLandmarks(
                    videoRef.current,
                    performance.now()
                );
            } catch (e) {
                console.log(e);
            }
        }
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        setVideoSize({
            // width: videoRef.current!.offsetWidth,
            // height: videoRef.current!.offsetHeight,
            width: 16 * 80,
            height: 9 * 80,
        });

        // requestRef.current = requestAnimationFrame(animate);

        // return () => cancelAnimationFrame(requestRef.current);
    }, []);

    return (
        <div className="flex flex-col items-center">
            <div className="flex justify-center">
                <video
                    className="w-full h-auto opacity-0"
                    ref={videoRef}
                    loop={true}
                    muted={true}
                    autoPlay={true}
                    playsInline={true}
                >
                    <source src="/assets/demo/test2.mp4" type="video/mp4" />
                </video>
                {videoSize && (
                    <>
                        {showAvatarCreator && (
                            <ReadyPlayerCreator
                                width={videoSize.width}
                                height={videoSize.height}
                                handleComplete={handleAvatarCreationComplete}
                            />
                        )}
                        {avatarView ? (
                            <AvatarCanvas
                                width={videoSize.width}
                                height={videoSize.height}
                                url={modelUrl}
                            />
                        ) : (
                            <DrawLandmarkCanvas
                                width={videoSize.width}
                                height={videoSize.height}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PoseLandmarkCanvas;
