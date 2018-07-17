import * as actions from '../constants/action_types'

const INITIAL_STATE = {
    history: []
}

function historyReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
        case actions.PUSH_RECORD:
            return { ...state, history: [...state.history, action.record] }
        default: return state
    }
}

export default historyReducer