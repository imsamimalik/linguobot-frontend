import { create } from "zustand";

type StoreType = {
    input: string;
    setInput: (input: string) => void;
    setVoiceInput: (updateFunction: (prev: string) => string) => void;

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
    setVoiceInput: (newInput) =>
        set((state) => ({ input: state.input + " " + newInput })),
    modelUrl:
        "https://models.readyplayer.me/65c0915599ee375dcfb82b6f.glb?morphTargets=ARKit",
    setModelUrl: (modelUrl) => set({ modelUrl }),

    avatarMode: false,
    toggleAvatarMode: () => set((state) => ({ avatarMode: !state.avatarMode })),

    showAvatarCreator: false,
    setShowAvatarCreator: (showAvatarCreator) => set({ showAvatarCreator }),

    toggleAvatarCreatorView: () =>
        set((state) => ({ showAvatarCreator: !state.showAvatarCreator })),
}));
