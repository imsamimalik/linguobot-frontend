import { cn } from "@/lib/utils";
import { useAvatarStore } from "@/store/AvatarStore";
import { Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";
// @ts-ignore
import useSound from "use-sound";
import MicON from "/assets/audio/ON.mp3";
import MicOFF from "/assets/audio/OFF.mp3";

const Microphone = () => {
    const setInput = useAvatarStore((state) => state.setInput);
    const lang = useAvatarStore((state) => state.lang);

    const [isListening, setIsListening] = useState(false);
    const recognition = useRef<SpeechRecognition | null>(null);
    const [playMicSound] = useSound(MicON);
    const [stopMicSound] = useSound(MicOFF);

    recognition.current = new window.webkitSpeechRecognition();

    // Event handler for when speech recognition starts
    recognition.current.onstart = () => {
        console.log("Speech recognition started");
        playMicSound();
        setIsListening(true);
    };

    // Event handler for when speech recognition ends
    recognition.current.onend = () => {
        console.log("Speech recognition ended");
        stopMicSound();
        setIsListening(false);
    };

    // Event handler for when speech is recognized
    recognition.current.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("Speech recognized:", transcript);
        // appends the recognized speech to the input with a space
        setInput(transcript);
    };

    // useEffect to set the language of the speech recognition

    useEffect(() => {
        if (recognition.current === null) return;
        if (lang === "ur") {
            recognition.current.lang = "ur-PK";
        } else {
            recognition.current.lang = "en-US";
        }
    }, [lang]);

    const toggleListening = () => {
        if (recognition.current === null) return;

        if (isListening) {
            recognition.current.stop();
        } else {
            recognition.current.start();
        }
    };

    return (
        <Mic
            className={cn(
                "hover:text-blue-500 right-2 cursor-pointer bottom-2 absolute",
                isListening ? "text-blue-500" : "text-slate-500"
            )}
            size={25}
            onClick={toggleListening}
        />
    );
};
export default Microphone;
