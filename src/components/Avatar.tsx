import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useAnimationStore } from "@/store/AnimationStore";

type GLTFResult = GLTF & {
    nodes: {
        EyeLeft002: THREE.SkinnedMesh;
        EyeRight002: THREE.SkinnedMesh;
        Wolf3D_Body002: THREE.SkinnedMesh;
        Wolf3D_Hair002: THREE.SkinnedMesh;
        Wolf3D_Head002: THREE.SkinnedMesh;
        Wolf3D_Outfit_Bottom002: THREE.SkinnedMesh;
        Wolf3D_Outfit_Footwear002: THREE.SkinnedMesh;
        Wolf3D_Outfit_Top002: THREE.SkinnedMesh;
        Wolf3D_Teeth002: THREE.SkinnedMesh;
        Hips: THREE.Bone;
    };
    materials: {
        ["Wolf3D_Eye.003"]: THREE.MeshStandardMaterial;
        ["Wolf3D_Body.003"]: THREE.MeshStandardMaterial;
        ["Wolf3D_Hair.003"]: THREE.MeshStandardMaterial;
        ["Wolf3D_Skin.003"]: THREE.MeshStandardMaterial;
        ["Wolf3D_Outfit_Bottom.003"]: THREE.MeshStandardMaterial;
        ["Wolf3D_Outfit_Footwear.003"]: THREE.MeshStandardMaterial;
        ["Wolf3D_Outfit_Top.003"]: THREE.MeshStandardMaterial;
        ["Wolf3D_Teeth.003"]: THREE.MeshStandardMaterial;
    };
};

type ActionName = "10,000" | "happybirthday" | "Hi!";
type GLTFActions = Record<ActionName, THREE.AnimationAction>;

export function Avatar(props: JSX.IntrinsicElements["group"]) {
    const group = useRef<THREE.Group>();
    const { nodes, materials, animations } = useGLTF(
        "/animation.glb"
    ) as GLTFResult;
    const { actions } = useAnimations(animations, group);
    const animation = useAnimationStore((state) => state.animation);

    useEffect(() => {
        if (!actions[animation]) return;
        actions[animation]!.play();
        return () => {
            if (!actions[animation]) return;
            actions[animation]!.fadeOut(0);
        };
    }, [animation]);

    return (
        <group ref={group} {...props} dispose={null}>
            <group name="Scene">
                <group name="Armature002">
                    <skinnedMesh
                        name="EyeLeft002"
                        geometry={nodes.EyeLeft002.geometry}
                        material={materials["Wolf3D_Eye.003"]}
                        skeleton={nodes.EyeLeft002.skeleton}
                        morphTargetDictionary={
                            nodes.EyeLeft002.morphTargetDictionary
                        }
                        morphTargetInfluences={
                            nodes.EyeLeft002.morphTargetInfluences
                        }
                    />
                    <skinnedMesh
                        name="EyeRight002"
                        geometry={nodes.EyeRight002.geometry}
                        material={materials["Wolf3D_Eye.003"]}
                        skeleton={nodes.EyeRight002.skeleton}
                        morphTargetDictionary={
                            nodes.EyeRight002.morphTargetDictionary
                        }
                        morphTargetInfluences={
                            nodes.EyeRight002.morphTargetInfluences
                        }
                    />
                    <skinnedMesh
                        name="Wolf3D_Body002"
                        geometry={nodes.Wolf3D_Body002.geometry}
                        material={materials["Wolf3D_Body.003"]}
                        skeleton={nodes.Wolf3D_Body002.skeleton}
                    />
                    <skinnedMesh
                        name="Wolf3D_Hair002"
                        geometry={nodes.Wolf3D_Hair002.geometry}
                        material={materials["Wolf3D_Hair.003"]}
                        skeleton={nodes.Wolf3D_Hair002.skeleton}
                    />
                    <skinnedMesh
                        name="Wolf3D_Head002"
                        geometry={nodes.Wolf3D_Head002.geometry}
                        material={materials["Wolf3D_Skin.003"]}
                        skeleton={nodes.Wolf3D_Head002.skeleton}
                        morphTargetDictionary={
                            nodes.Wolf3D_Head002.morphTargetDictionary
                        }
                        morphTargetInfluences={
                            nodes.Wolf3D_Head002.morphTargetInfluences
                        }
                    />
                    <skinnedMesh
                        name="Wolf3D_Outfit_Bottom002"
                        geometry={nodes.Wolf3D_Outfit_Bottom002.geometry}
                        material={materials["Wolf3D_Outfit_Bottom.003"]}
                        skeleton={nodes.Wolf3D_Outfit_Bottom002.skeleton}
                    />
                    <skinnedMesh
                        name="Wolf3D_Outfit_Footwear002"
                        geometry={nodes.Wolf3D_Outfit_Footwear002.geometry}
                        material={materials["Wolf3D_Outfit_Footwear.003"]}
                        skeleton={nodes.Wolf3D_Outfit_Footwear002.skeleton}
                    />
                    <skinnedMesh
                        name="Wolf3D_Outfit_Top002"
                        geometry={nodes.Wolf3D_Outfit_Top002.geometry}
                        material={materials["Wolf3D_Outfit_Top.003"]}
                        skeleton={nodes.Wolf3D_Outfit_Top002.skeleton}
                    />
                    <skinnedMesh
                        name="Wolf3D_Teeth002"
                        geometry={nodes.Wolf3D_Teeth002.geometry}
                        material={materials["Wolf3D_Teeth.003"]}
                        skeleton={nodes.Wolf3D_Teeth002.skeleton}
                        morphTargetDictionary={
                            nodes.Wolf3D_Teeth002.morphTargetDictionary
                        }
                        morphTargetInfluences={
                            nodes.Wolf3D_Teeth002.morphTargetInfluences
                        }
                    />
                    <primitive object={nodes.Hips} />
                </group>
            </group>
        </group>
    );
}

useGLTF.preload("/animation.glb");
