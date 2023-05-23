import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import Converter from "./Converter";
import axios from 'axios';

const SAVE = "SAVE";
const REMOVE = "REMOVE";
const LOAD = "LOAD";

const DEFAULT = {
    //saved: localStorage.getItem('convertidorSaved') == null ? [] : JSON.parse(localStorage.getItem('convertidorSaved'))
    saved: [],
    loading: true
}

function save(x) {
    return {
        type: SAVE,
        value: x
    };
}

function remove(x) {
    console.log("remove" + JSON.stringify(x));
    return {
        type: REMOVE,
        value: x
    };
}

function load(x) {
    return {
        type: LOAD,
        saved: x
    };
}

function reducer(state = DEFAULT, action) {
    let x = [...state.saved];
    switch (action.type) {
        case SAVE:
            //localStorage.setItem("convertidorSaved", JSON.stringify(x));
            axios.post("http://localhost:4000/save", action.value).then((res) => { console.log(res.data.status) }).catch(err => { console.log(err) });
            return { saved: x, loading: true };
        case REMOVE:
            //x.splice(action.index, 1)
            //localStorage.setItem("convertidorSaved", JSON.stringify(x));
            axios.delete("http://localhost:4000/delete/" + encodeURI(JSON.stringify(action.value))).then((res) => { console.log(res.data.status) }).catch(err => { console.log(err) });
            return { saved: x, loading: true };
        case LOAD:
            return { saved: action.saved, loading: false };
        default:
            return state;
    }
}

const store = createStore(reducer);

function mapStateToProps(state) {
    return {
        saved: state.saved,
        loading: state.loading
    };
};

function mapDispatchToProps(dispatch) {
    return {
        save: (x) => {
            return dispatch(save(x));
        },
        remove: (x) => {
            return dispatch(remove(x));
        },
        load: (x) => {
            return dispatch(load(x));
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