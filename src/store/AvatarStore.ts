import { create } from "zustand";

type StoreType = {
    input: string;
    setInput: (input: string) => void;

    modelUrl: string;
    setModelUrl: (modelUrl: string) => void;

    avatarMode: boolean;
    toggleAvatarMode: () => void;

    showAvatarCreator: boolean;
    setShowAvatarCreator: (isModalShown: boolean) => void;

    toggleAvatarCreatorView: () => void;
};

export const useAvatarStore = create<StoreType>((set) => ({
    input: "",
    setInput: (input) => set({ input }),

    modelUrl:
        "https://models.readyplayer.me/65c0915599ee375dcfb82b6f.glb?morphTargets=ARKit",
    setModelUrl: (modelUrl) => set({ modelUrl }),

    avatarMode: true,
    toggleAvatarMode: () => set((state) => ({ avatarMode: !state.avatarMode })),

    showAvatarCreator: false,
    setShowAvatarCreator: (showAvatarCreator) => set({ showAvatarCreator }),

    toggleAvatarCreatorView: () =>
        set((state) => ({ showAvatarCreator: !state.showAvatarCreator })),
}));
