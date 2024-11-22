import Mapscreen from "../../mapScreens"

import { Provider } from "react-redux";
import { store } from "../../redux/store";


export default function () {
    return (
        <Provider store={store}>
            <Mapscreen />
        </Provider>
    );
}