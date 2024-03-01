import PoseLandmarkCanvas from "@/components/PoseLandmarkCanvas";
import { Textarea } from "@/components/ui/textarea";

const Home = () => {
    return (
        <section className="flex my-10 border rounded-lg mx-auto w-3/4 justify-center items-center md:h-[600px]">
            <div className="size-full">
                <Textarea
                    className="size-full bg-slate-200 text-lg"
                    placeholder="Type your text..."
                />
            </div>
            <div className="size-full">
                <PoseLandmarkCanvas />
            </div>
        </section>
    );
};
export default Home;
