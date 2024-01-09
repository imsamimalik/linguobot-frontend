import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import AvatarManager from "@/class/AvatarManager";
import { OrbitControls } from "@react-three/drei";
import PoseLandmarkManager from "@/class/PoseLandmarkManager";
import { Float, Text3D } from "@react-three/drei";
import { useAvatarStore } from "@/store/AvatarStore";
import { Avatar } from "./Avatar";
import { useAnimationStore } from "@/store/AnimationStore";

interface AvatarCanvasProps {
    width: number;
    height: number;
    url: string;
}

const AvatarCanvas = ({ width, height, url }: AvatarCanvasProps) => {
    const [scene, setScene] = useState<THREE.Scene | null>();
    const [isLoading, setIsLoading] = useState(true);
    const avatarManagerRef = useRef<AvatarManager>(AvatarManager.getInstance());
    const requestRef = useRef(0);

    const modelUrl = useAvatarStore((state) => state.modelUrl);
    const setAnimation = useAnimationStore((state) => state.setAnimation);

    // const animate = () => {
    //     const results = PoseLandmarkManager.getInstance().getResults();
    //     avatarManagerRef.current.animateBody(results);
    //     requestRef.current = requestAnimationFrame(animate);
    // };

    // useEffect(() => {
    //     requestRef.current = requestAnimationFrame(animate);
    //     return () => {
    //         cancelAnimationFrame(requestRef.current);
    //     };
    // }, []);

    useEffect(() => {
        setIsLoading(true);
        const avatarManager = AvatarManager.getInstance();

        avatarManager
            .loadModel(url)
            .then(() => {
                setScene(avatarManager.getScene());
                setIsLoading(false);
            })
            .catch((e) => {
                alert(e);
            });
    }, [url]);

    return (
        <div className="absolute" style={{ width: width, height: height }}>
            <Canvas camera={{ fov: 30, position: [0, 2, 5] }}>
                <ambientLight intensity={2} />
                <directionalLight position={[0, 0, 5]} intensity={2} />
                <OrbitControls
                    target={[0, 0.6, 0]}
                    enableDamping={true}
                    enableRotate={true}
                    enableZoom={true}
                    enablePan={true}
                />
                {modelUrl === "/assets/demo/model.glb" ? (
                    <Avatar />
                ) : (
                    !isLoading && scene && <primitive object={scene} />
                )}

                {/* {scene && <primitive object={scene} />} */}
                {isLoading && (
                    <Float floatIntensity={1} speed={1}>
                        <Text3D
                            font={"/assets/fonts/Open_Sans_Condensed_Bold.json"}
                            scale={0.1}
                            position={[-0.1, 0.6, 0]}
                            bevelEnabled
                            bevelSize={0.05}
                        >
                            Loading...
                            <meshNormalMaterial />
                        </Text3D>
                    </Float>
                )}
            </Canvas>

            <div className="flex items-center justify-center mt-10">
                <div className="flex items-center gap-6">
                    <button
                        className="hover:bg-blue-700 px-4 py-2 font-bold text-white bg-blue-500 rounded-full"
                        onClick={() => setAnimation("Hi!")}
                    >
                        Hi!
                    </button>

                    <button
                        className="hover:bg-blue-700 px-4 py-2 font-bold text-white bg-blue-500 rounded-full"
                        onClick={() => setAnimation("happybirthday")}
                    >
                        Happy Birthday!
                    </button>
                    <button
                        className="hover:bg-blue-700 px-4 py-2 font-bold text-white bg-blue-500 rounded-full"
                        onClick={() => setAnimation("10,000")}
                    >
                        10000
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AvatarCanvas;
