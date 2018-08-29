import * as actions from "../constants/action_types";

const INITIAL_STATE = {
    language: "",
    messages: {}
}

function languageReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case actions.SET_LANGUAGE:
            return { ...state, language: action.language, messages: action.messages}
        default: return state;
    }
}

export default languageReducer;