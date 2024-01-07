import { create } from "zustand";

type StoreType = {
    modelUrl: string;
    setModelUrl: (modelUrl: string) => void;

    showAvatarCreator: boolean;
    setShowAvatarCreator: (isModalShown: boolean) => void;

    toggleAvatarCreatorView: () => void;
};

export const useAvatarStore = create<StoreType>((set) => ({
    modelUrl: "/assets/demo/model.glb",
    setModelUrl: (modelUrl) => set({ modelUrl }),

    showAvatarCreator: false,
    setShowAvatarCreator: (showAvatarCreator) => set({ showAvatarCreator }),

    toggleAvatarCreatorView: () =>
        set((state) => ({ showAvatarCreator: !state.showAvatarCreator })),
}));
