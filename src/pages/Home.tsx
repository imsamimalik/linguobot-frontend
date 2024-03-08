import Microphone from "@/components/Microphone";
import PoseLandmarkCanvas from "@/components/PoseLandmarkCanvas";
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from "@/components/ui/resizable";
import { Textarea } from "@/components/ui/textarea";
import { useAvatarStore } from "@/store/AvatarStore";
import axios from "axios";
import { useEffect } from "react";
import { useDebounce } from "use-debounce";
import axiosInstance from "@/lib/axios";

const Home = () => {
    const input = useAvatarStore((state) => state.input);
    const setInput = useAvatarStore((state) => state.setInput);
    const setVideoURL = useAvatarStore((state) => state.setVideoURL);
    const setLoading = useAvatarStore((state) => state.setLoading);
    const [debouncedText] = useDebounce(input, 1000);

    useEffect(() => {
        const fetchData = async () => {
            const source = axios.CancelToken.source();
            if (debouncedText) {
                setLoading(true);
                console.log("fetching data", debouncedText);

                try {
                    const res = await axiosInstance.post(
                        "/api/sign",
                        { input: debouncedText },
                        { cancelToken: source.token }
                    );
                    console.log(res.data);
                    setVideoURL(res.data.video);
                } catch (error) {
                    console.log("API error: ", error);
                } finally {
                    setLoading(false);
                }
            }

            return () => {
                source.cancel();
            };
        };

        fetchData();
    }, [debouncedText]);

    return (
        <section className="flex my-10 border rounded-lg mx-auto w-11/12 justify-center items-center md:h-[600px]">
            <ResizablePanelGroup
                className="!overflow-visible"
                direction="horizontal"
            >
                <ResizablePanel>
                    <div className="size-full relative">
                        <Textarea
                            className="bg-slate-200 size-full overflow-hidden text-xl resize-none"
                            placeholder="Type your text..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />

                        <Microphone />
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel className="!overflow-visible">
                    <PoseLandmarkCanvas />
                </ResizablePanel>
            </ResizablePanelGroup>
        </section>
    );
};
export default Home;
