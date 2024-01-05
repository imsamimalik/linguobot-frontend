import PoseLandmarkCanvas from "@/components/PoseLandmarkCanvas";

const App = () => {
    return (
        <div className="bg-slate-400 flex flex-col items-center min-h-screen px-2 pt-10 text-white">
            <h1 className="md:text-4xl text-shadow mb-2 text-xl font-bold text-center">
                LinguoBot Demo
            </h1>
            <div className="flex justify-center w-full">
                <PoseLandmarkCanvas />
            </div>
        </div>
    );
};
export default App;
