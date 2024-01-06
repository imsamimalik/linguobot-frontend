import * as THREE from "three";
import { loadGltf } from "@/utils/loaders";
import { PoseLandmarkerResult } from "@mediapipe/tasks-vision";
import { decomposeMatrix } from "@/utils/decomposeMatrix";

// Scene;
// Armature;
// Hips;
// Spine;
// Spine1;
// Spine2;
// Neck;
// Head;
// HeadTop_End;
// LeftEye;
// RightEye;
// LeftShoulder;
// LeftArm;
// LeftForeArm;
// LeftHand;
// LeftHandThumb1;
// LeftHandThumb2;
// LeftHandThumb3;
// LeftHandThumb4;
// LeftHandIndex1;
// LeftHandIndex2;
// LeftHandIndex3;
// LeftHandIndex4;
// LeftHandMiddle1;
// LeftHandMiddle2;
// LeftHandMiddle3;
// LeftHandMiddle4;
// LeftHandRing1;
// LeftHandRing2;
// LeftHandRing3;
// LeftHandRing4;
// LeftHandPinky1;
// LeftHandPinky2;
// LeftHandPinky3;
// LeftHandPinky4;
// RightShoulder;
// RightArm;
// RightForeArm;
// RightHand;
// RightHandThumb1;
// RightHandThumb2;
// RightHandThumb3;
// RightHandThumb4;
// RightHandIndex1;
// RightHandIndex2;
// RightHandIndex3;
// RightHandIndex4;
// RightHandMiddle1;
// RightHandMiddle2;
// RightHandMiddle3;
// RightHandMiddle4;
// RightHandRing1;
// RightHandRing2;
// RightHandRing3;
// RightHandRing4;
// RightHandPinky1;
// RightHandPinky2;
// RightHandPinky3;
// RightHandPinky4;
// LeftUpLeg;
// LeftLeg;
// LeftFoot;
// LeftToeBase;
// LeftToe_End;
// RightUpLeg;
// RightLeg;
// RightFoot;
// RightToeBase;
// RightToe_End;
// EyeLeft;
// EyeRight;
// Wolf3D_Head;
// Wolf3D_Teeth;
// Wolf3D_Hair;
// Wolf3D_Body;
// Wolf3D_Outfit_Bottom;
// Wolf3D_Outfit_Footwear;
// Wolf3D_Outfit_Top;

class AvatarManager {
    private static instance: AvatarManager = new AvatarManager();
    private scene!: THREE.Scene;
    isModelLoaded = false;

    private constructor() {
        this.scene = new THREE.Scene();
    }

    static getInstance(): AvatarManager {
        return AvatarManager.instance;
    }

    getScene = () => {
        return this.scene;
    };

    loadModel = async (url: string) => {
        this.isModelLoaded = false;

        // if (this.scene.children.length === 1) {
        //     this.scene.children[0].removeFromParent();
        // }
        const gltf = await loadGltf(url);
        gltf.scene.traverse((obj: THREE.Object3D) => {
            obj.frustumCulled = false;

            // console.log(obj.name);
        });
        this.scene = new THREE.Scene();

        this.scene.add(gltf.scene);
        this.isModelLoaded = true;
    };

    animateBody = (results: PoseLandmarkerResult) => {
        if (!results || !this.isModelLoaded) return;

        this.updateBodyTransforms(results);
    };

    // POSE LANDMARKS NAME to INDEX  MAPPING
    partToIndex: { [key: string]: number } = {
        Nose: 0,
        LeftEyeInner: 1,
        LeftEye: 2,
        LeftEyeOuter: 3,
        RightEyeInner: 4,
        RightEye: 5,
        RightEyeOuter: 6,
        LeftEar: 7,
        RightEar: 8,
        MouthLeft: 9,
        MouthRight: 10,
        LeftShoulder: 11,
        RightShoulder: 12,
        LeftElbow: 13,
        RightElbow: 14,
        LeftWrist: 15,
        RightWrist: 16,
        LeftPinky: 17,
        RightPinky: 18,
        LeftIndex: 19,
        RightIndex: 20,
        LeftThumb: 21,
        RightThumb: 22,
        LeftHip: 23,
        RightHip: 24,
        LeftKnee: 25,
        RightKnee: 26,
        LeftAnkle: 27,
        RightAnkle: 28,
        LeftHeel: 29,
        RightHeel: 30,
        LeftFootIndex: 31,
        RightFootIndex: 32,
    };

    // Mapping between PoseLandmarker -> GLB object names
    poseToGLBMapping: { [key: string]: string } = {
        Nose: "Head",

        LeftElbow: "LeftArm",
        RightElbow: "RightArm",

        RightEye: "EyeRight",
        LeftEye: "EyeLeft",

        LeftEar: "LeftEar",
        RightEar: "RightEar",

        LeftShoulder: "LeftShoulder",
        RightShoulder: "RightShoulder",

        LeftWrist: "LeftForeArm",
        RightWrist: "RightForeArm",
    };

    updateBodyTransforms = (results: PoseLandmarkerResult) => {
        if (!results.landmarks) return;

        const landmarks = results.landmarks[0];
        if (!landmarks) return;

        // Normalize landmarks
        const normalizedLandmarks = landmarks.map((landmark) => {
            return {
                x: landmark.x * 0.03,
                y: landmark.y * 0.4,
                z: landmark.z * 0.2,
            };
        });

        // Required poses that we have to animate
        const requiredPoses = [
            "Nose",
            "LeftShoulder",
            "RightShoulder",
            "LeftElbow",
            "RightElbow",
            "LeftWrist",
            "RightWrist",
            // "LeftEye",
            // "RightEye",
        ];

        // Update the respective GLB objects for the required poses
        requiredPoses.forEach((pose) => {
            const poseIndex = this.getLandmarkIndex(pose); //11
            const glbObjectName = this.poseToGLBMapping[pose]; //Left Shoulder
            const glbObject = this.scene.getObjectByName(glbObjectName); //Left Shoulder scene
            const poseLandmark = normalizedLandmarks[poseIndex]; //landmark

            if (glbObject && poseLandmark) {
                // //! METHOD 1
                // const pos = new THREE.Vector3(
                //     poseLandmark.x,
                //     poseLandmark.y,
                //     poseLandmark.z
                // );
                // glbObject.position.copy(pos);


                
                // SHOULD WORK BUT DOESN'T
                const { translation, rotation } = decomposeMatrix(
                    glbObject.matrixWorld.toArray()
                );
                const euler = new THREE.Euler(
                    rotation.x,
                    rotation.y,
                    rotation.z,
                    "ZYX"
                );
                const quaternion = new THREE.Quaternion().setFromEuler(euler);
                glbObject.quaternion.copy(quaternion);

                glbObject.position.lerp(
                    new THREE.Vector3(
                        translation.x,
                        translation.y,
                        translation.z
                    ),
                    0.9
                );

                //! METHOD 2
                // const { translation, rotation, scale } = decomposeMatrix(
                //     glbObject.matrix.toArray()
                // );
                // const euler = new THREE.Euler(
                //     rotation.x,
                //     rotation.y,
                //     rotation.z,
                //     "ZYX"
                // );
                // const quaternion = new THREE.Quaternion().setFromEuler(euler);
                // glbObject?.quaternion.slerp(quaternion, 1.0);
                // glbObject?.position.set(
                //     translation.x,
                //     translation.y,
                //     translation.z
                // );

                //! METHOD 3
                // let vector = new THREE.Vector3(
                //     poseLandmark.x,
                //     poseLandmark.y,
                //     poseLandmark.z
                // );
                // glbObject.position.lerp(vector, 0.9); // interpolate
            }
        });
    };

    getLandmarkIndex = (part: string): number => {
        // Define a mapping of body part names to landmark indices
        return this.partToIndex[part] || 0;
    };

    // updateFacialTransforms = (
    //     results: PoseLandmarkerResult
    //     // flipped = true
    // ) => {
    //     if (!results || !this.isModelLoaded) return;

    //     // this.updateBlendShapes(results, flipped);
    //     // this.updateTranslation(results, flipped);
    // };

    // updateBlendShapes = (results: PoseLandmarkerResult, flipped = true) => {
    //     if (!results.faceBlendshapes) return;

    //     const blendShapes = results.faceBlendshapes[0]?.categories;
    //     if (!blendShapes) return;

    //     this.scene.traverse((obj) => {
    //         if (
    //             "morphTargetDictionary" in obj &&
    //             "morphTargetInfluences" in obj
    //         ) {
    //             const morphTargetDictionary = obj.morphTargetDictionary as {
    //                 [key: string]: number;
    //             };
    //             const morphTargetInfluences =
    //                 obj.morphTargetInfluences as Array<number>;

    //             for (const { score, categoryName } of blendShapes) {
    //                 let updatedCategoryName = categoryName;
    //                 if (flipped && categoryName.includes("Left")) {
    //                     updatedCategoryName = categoryName.replace(
    //                         "Left",
    //                         "Right"
    //                     );
    //                 } else if (flipped && categoryName.includes("Right")) {
    //                     updatedCategoryName = categoryName.replace(
    //                         "Right",
    //                         "Left"
    //                     );
    //                 }
    //                 const index = morphTargetDictionary[updatedCategoryName];
    //                 morphTargetInfluences[index] = score;
    //             }
    //         }
    //     });
    // };

    // updateTranslation = (results: FaceLandmarkerResult, flipped = true) => {
    //     if (!results.facialTransformationMatrixes) return;

    //     const matrixes = results.facialTransformationMatrixes[0]?.data;
    //     if (!matrixes) return;

    //     const { translation, rotation, scale } = decomposeMatrix(matrixes);

    //     const euler = new THREE.Euler(
    //         rotation.x,
    //         rotation.y,
    //         rotation.z,
    //         "ZYX"
    //     );
    //     const quaternion = new THREE.Quaternion().setFromEuler(euler);
    //     if (flipped) {
    //         // flip to x axis
    //         quaternion.y *= -1;
    //         quaternion.z *= -1;
    //         translation.x *= -1;
    //     }

    //     const Head = this.scene.getObjectByName("Head");
    //     Head?.quaternion.slerp(quaternion, 1.0);

    //     const root = this.scene.getObjectByName("AvatarRoot");
    //     // values empirically calculated
    //     root?.position.set(
    //         translation.x * 0.01,
    //         translation.y * 0.01,
    //         (translation.z + 50) * 0.02
    //     );
    // };
}

export default AvatarManager;
