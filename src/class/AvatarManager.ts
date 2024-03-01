import * as THREE from "three";
import { HolisticLandmarkerResult } from "@mediapipe/tasks-vision";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { rigPosition, rigRotation } from "@/utils/rig";
import { Face, Hand, Pose } from "kalidokit";

class AvatarManager {
    private static instance: AvatarManager = new AvatarManager();
    private scene!: THREE.Scene;
    private positionOffset = {
        x: 0,
        y: 1.4,
        z: 2,
    };
    isModelLoaded = false;

    private skeletonHelper!: THREE.SkeletonHelper;

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
        this.skeletonHelper = new THREE.SkeletonHelper(this.scene);
        this.skeletonHelper.visible = false;

        // if (this.scene.children.length === 1) {
        //     this.scene.children[0].removeFromParent();
        // }
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(url);

        gltf.scene.traverse((obj: THREE.Object3D) => {
            obj.frustumCulled = false;

            // console.log(obj.name);
        });
        this.scene = new THREE.Scene();

        this.scene.add(gltf.scene);
        this.isModelLoaded = true;
    };

    animateBody = (results: HolisticLandmarkerResult) => {
        if (!results || !this.isModelLoaded) return;

        console.log({ results });

        let riggedPose, riggedLeftHand, riggedRightHand, riggedFace;
        const pose2DLandmarks = results.poseLandmarks;
        const pose3DLandmarks = results.poseWorldLandmarks;
        const faceLandmarks = results.faceLandmarks;
        const leftHandLandmarks = results.rightHandLandmarks;
        const rightHandLandmarks = results.leftHandLandmarks;

        riggedPose = Pose.solve(pose3DLandmarks[0], pose2DLandmarks[0], {
            runtime: "mediapipe",
            // video: this.videoElement,
            enableLegs: true,
        });

        if (faceLandmarks) {
            riggedFace = Face.solve(faceLandmarks[0], {
                runtime: "mediapipe",
                // video: this.videoElement,
            });
        }

        if (leftHandLandmarks) {
            riggedLeftHand = Hand.solve(leftHandLandmarks[0], "Left");
        }

        if (rightHandLandmarks) {
            riggedRightHand = Hand.solve(rightHandLandmarks[0], "Right");
        }

        const riggedResult = {
            pose: riggedPose,
            face: riggedFace,
            leftHand: riggedLeftHand,
            rightHand: riggedRightHand,
        };

        this.animateCharacter(riggedResult);
    };

    animateCharacter(results: any) {
        const riggedPose = results.pose;
        const riggedFace = results.face;
        const riggedLeftHand = results.leftHand;
        const riggedRightHand = results.rightHand;
        var hipRotationOffset = 0.0;

        // Animate Pose
        rigRotation(
            "Hips",
            this.skeletonHelper,
            {
                x: riggedPose.Hips.rotation.x,
                y: riggedPose.Hips.rotation.y,
                z: riggedPose.Hips.rotation.z + hipRotationOffset,
            },
            0.7
        );
        rigPosition(
            "Hips",
            this.skeletonHelper,
            {
                x: riggedPose.Hips.position.x + this.positionOffset.x, // Reverse direction
                y: riggedPose.Hips.position.y + this.positionOffset.y, // Add a bit of height
                z: -riggedPose.Hips.position.z + this.positionOffset.z, // Reverse direction
            },
            1,
            0.07
        );

        rigRotation("Chest", this.skeletonHelper, riggedPose.Chest, 0.25, 0.3);
        rigRotation("Spine", this.skeletonHelper, riggedPose.Spine, 0.45, 0.3);

        rigRotation(
            "RightUpperArm",
            this.skeletonHelper,
            riggedPose.RightUpperArm
        );
        rigRotation(
            "RightLowerArm",
            this.skeletonHelper,
            riggedPose.RightLowerArm
        );
        rigRotation(
            "LeftUpperArm",
            this.skeletonHelper,
            riggedPose.LeftUpperArm
        );
        rigRotation(
            "LeftLowerArm",
            this.skeletonHelper,
            riggedPose.LeftLowerArm
        );

        // rigRotation(
        //     "LeftUpperLeg",
        //     this.skeletonHelper,
        //     riggedPose.LeftUpperLeg
        // );
        // rigRotation(
        //     "LeftLowerLeg",
        //     this.skeletonHelper,
        //     riggedPose.LeftLowerLeg
        // );
        // rigRotation(
        //     "RightUpperLeg",
        //     this.skeletonHelper,
        //     riggedPose.RightUpperLeg
        // );
        // rigRotation(
        //     "RightLowerLeg",
        //     this.skeletonHelper,
        //     riggedPose.RightLowerLeg
        // );

        // animate face
        // if (riggedFace) {
        //   rigRotation('Neck', riggedFace.head, 0.7);
        //   rigFace(riggedFace);
        // }

        // animate hands
    }
}

export default AvatarManager;
