import * as actions from "../constants/action_types"

const INITIAL_STATE = {
    email: "",
    password: "",
    error: null,
};

function loginReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
        case actions.INITIALIZE_LOGIN:
            return { ...INITIAL_STATE };
        case actions.SET_LOGIN_ERROR:
            return { ...state, error: action.error };
        case actions.SET_LOGIN_EMAIL:
            return { ...state, email: action.email };
        case actions.SET_LOGIN_PASSWORD:
            return { ...state, password: action.password };
        default: return state;
    }
}

export default loginReducer;