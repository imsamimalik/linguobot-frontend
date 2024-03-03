import { AvatarCreator, EditorConfig } from "@readyplayerme/rpm-react-sdk";

const config: EditorConfig = {
    clearCache: true,
    bodyType: "fullbody",
    quickStart: false,
    language: "en",
};

interface ReadyPlayerCreatorProps {
    handleComplete: (url: string) => void;
}

const ReadyPlayerCreator = ({ handleComplete }: ReadyPlayerCreatorProps) => {
    return (
        <div
            className=" absoluteCenter h-5/6 w-5/6 m-auto"
            style={{ zIndex: 1 }}
        >
            <AvatarCreator
                subdomain="demo"
                editorConfig={config}
                onAvatarExported={handleComplete}
            />
        </div>
    );
};

export default ReadyPlayerCreator;
