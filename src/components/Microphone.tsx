import { cn } from "@/lib/utils";
import { useAvatarStore } from "@/store/AvatarStore";
import { Mic } from "lucide-react";
import { useState } from "react";

const Microphone = () => {
    const setInput = useAvatarStore((state) => state.setInput);

    const [isListening, setIsListening] = useState(false);

    const recognition = new window.webkitSpeechRecognition();
    // recognition.lang = "ur-PK";

    // Event handler for when speech recognition starts
    recognition.onstart = () => {
        console.log("Speech recognition started");
        setIsListening(true);
    };

    // Event handler for when speech recognition ends
    recognition.onend = () => {
        console.log("Speech recognition ended");
        setIsListening(false);
    };

    // Event handler for when speech is recognized
    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("Speech recognized:", transcript);

        setInput(transcript);
    };
    // Function to start/stop speech recognition
    const toggleListening = () => {
        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    return (
        <Mic
            className={cn(
                "right-4 bottom-4 absolute cursor-pointer",
                isListening ? "text-green-500" : "text-slate-500"
            )}
            size={32}
            onClick={toggleListening}
        />
    );
};
export default Microphone;
