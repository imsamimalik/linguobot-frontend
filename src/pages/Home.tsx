import Microphone from "@/components/Microphone";
import PoseLandmarkCanvas from "@/components/PoseLandmarkCanvas";
import { Textarea } from "@/components/ui/textarea";
import { useAvatarStore } from "@/store/AvatarStore";

const Home = () => {
    const input = useAvatarStore((state) => state.input);
    const setInput = useAvatarStore((state) => state.setInput);

    return (
        <section className="flex my-10 border rounded-lg mx-auto w-3/4 justify-center items-center md:h-[600px]">
            <div className="size-full relative">
                <Textarea
                    className="size-full bg-slate-200 overflow-hidden text-lg resize-none"
                    placeholder="Type your text..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />

                <Microphone />
            </div>
            <div className="size-full">
                <PoseLandmarkCanvas />
            </div>
        </section>
    );
};
export default Home;
