import { useEffect, useRef, useState } from "react";
import DrawLandmarkCanvas from "./DrawLandmarkCanvas";
import AvatarCanvas from "./AvatarCanvas";
import HolisticLandmarkManager from "@/class/LandmarkManager";
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
                const faceLandmarkManager =
                    HolisticLandmarkManager.getInstance();
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
            width: 16 * 70,
            height: 9 * 70,
        });

        requestRef.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    return (
        <div className="size-full flex flex-col items-center">
            <div className="size-full flex justify-center">
                <video
                    className="bottom-2 right-2 absolute w-[200px]"
                    ref={videoRef}
                    loop={true}
                    muted={true}
                    autoPlay={true}
                    playsInline={true}
                >
                    <source src="/assets/demo/howareyou.mp4" type="video/mp4" />
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
                            <AvatarCanvas url={modelUrl} />
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
