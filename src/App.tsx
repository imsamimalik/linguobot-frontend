import Router from "./router";
import { useKeyPress } from 'ahooks';
import { useAvatarStore } from "./store/AvatarStore";

const App = () => {

    const toggleDevMode = useAvatarStore((state) => state.toggleDevMode);

    useKeyPress(['ctrl.alt.k'], () => toggleDevMode(), {
        exactMatch: true,
    });

    return (
        <Router />
    );
};
export default App;
