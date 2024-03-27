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
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import axiosInstance from "@/lib/axios";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Direction } from "node_modules/react-resizable-panels/dist/declarations/src/types";

const Home = () => {
    const input = useAvatarStore((state) => state.input);
    const setInput = useAvatarStore((state) => state.setInput);
    const setVideoURL = useAvatarStore((state) => state.setVideoURL);
    const setLoading = useAvatarStore((state) => state.setLoading);
    const lang = useAvatarStore((state) => state.lang);
    const toggleLang = useAvatarStore((state) => state.toggleLang);
    const [debouncedText] = useDebounce(input, 1000);

    const [position, setPosition] = useState("hozontal")

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1000) {
                setPosition("vertical")
            } else {
                setPosition("horizontal")
            }
        }

        handleResize()

        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const source = axios.CancelToken.source();
            if (debouncedText) {
                setLoading(true);
                console.log("fetching data", debouncedText);

                try {
                    const res = await axiosInstance.post(
                        "/api/sign",
                        { input: debouncedText, lang: lang },
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
        <section className="flex my-10 border rounded-lg mx-auto w-11/12 h-[75vh] justify-center items-center lg:h-[600px]">
            <ResizablePanelGroup
                className="!overflow-visible"
                direction={position as Direction}
            >
                <ResizablePanel className="relative !overflow-visible">
                    <div className="size-full relative">
                        <Textarea
                            className="bg-slate-200 size-full overflow-hidden text-xl resize-none"
                            placeholder="Type your text..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />

                        <Microphone />
                    </div>
                    <div className="-bottom-10 absolute right-0 flex items-center p-2 space-x-2">
                        <Label className="text-xs" htmlFor="lang">
                            English
                        </Label>
                        <Switch
                            className="scale-75"
                            checked={lang === "ur"}
                            onCheckedChange={toggleLang}
                            id="lang"
                        />
                        <Label className="text-xs" htmlFor="lang">
                            Urdu
                        </Label>
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
