import * as actions from "../constants/action_types";

const INITIAL_STATE = {
    username: "",
    email: "",
    passwordOne: "",
    passwordTwo: "",
    error: null,
};

function signupReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
        case actions.INITIALIZE_SIGNUP:
            return { ...INITIAL_STATE };
        case actions.SET_SIGNUP_ERROR:
            return { ...state, error: action.error };
        case actions.SET_SIGNUP_USERNAME:
            return { ...state, username: action.username };
        case actions.SET_SIGNUP_EMAIL:
            return { ...state, email: action.email };
        case actions.SET_SIGNUP_PASSWORD1:
            return { ...state, passwordOne: action.passwordOne };
        case actions.SET_SIGNUP_PASSWORD2:
            return { ...state, passwordTwo: action.passwordTwo };
        default: return state;
    }
}

export default signupReducer;