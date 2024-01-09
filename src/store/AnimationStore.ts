import { create } from "zustand";

type AnimationStoreType = {
    animation: string;
    setAnimation: (value: string) => void;
};

export const useAnimationStore = create<AnimationStoreType>((set) => ({
    animation: "",
    setAnimation: (value: string) => set({ animation: value }),
}));
