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

    videoURL: string;
    setVideoURL: (videoURL: string) => void;

    loading: boolean;
    setLoading: (loading: boolean) => void;

    lang: string;
    setLang: (lang: string) => void;
    toggleLang: () => void;

    devMode: boolean;
    setDevMode: (devMode: boolean) => void;
    toggleDevMode: () => void;

    outputText: string;
    setOutputText: (outputText: string) => void;
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

    videoURL: "/assets/demo/howareyou.mp4",
    setVideoURL: (videoURL) => set({ videoURL }),

    loading: false,
    setLoading: (loading) => set({ loading }),

    lang: "en",
    setLang: (lang) => set({ lang }),
    toggleLang: () =>
        set((state) => ({ lang: state.lang === "en" ? "ur" : "en" })),

    devMode: false,
    setDevMode: (devMode) => set({ devMode }),
    toggleDevMode: () => set((state) => ({ devMode: !state.devMode })),

    outputText: "",
    setOutputText : (outputText) => set({ outputText }),
}));
