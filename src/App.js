import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import Converter from "./Converter";

const SAVE = "SAVE";
const REMOVE = "REMOVE";

const DEFAULT = {
    saved: localStorage.getItem('convertidorSaved') == null ? [] : JSON.parse(localStorage.getItem('convertidorSaved'))
}

function save(x) {
    return {
        type: SAVE,
        value: x
    };
}

function remove(x) {
    return {
        type: REMOVE,
        index: x
    };
}

function reducer(state = DEFAULT, action) {
    let x = [...state.saved];
    switch (action.type) {
        case SAVE:
            x.push(action.value);
            localStorage.setItem("convertidorSaved", JSON.stringify(x));
            return { saved: x };
        case REMOVE:
            x.splice(action.index, 1);
            localStorage.setItem("convertidorSaved", JSON.stringify(x));
            return { saved: x };
        default:
            return state;
    }
}

const store = createStore(reducer);

function mapStateToProps(state) {
    return {
        saved: state.saved
    };
};

function mapDispatchToProps(dispatch) {
    return {
        save: (x) => {
            return dispatch(save(x));
        },
        remove: (x) => {
            return dispatch(remove(x));
        }
    };
};

const Container = connect(mapStateToProps, mapDispatchToProps)(Converter);

function App() {
    return (
        <Provider store={store}>
            <Container />
        </Provider>
    );
}

export default App;