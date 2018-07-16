import * as actions from '../constants/action_types'

const INITIAL_STATE = {
    firstUse: false,

    //used for firstUSe Dialog
    open: true,
    totalAmount: 0,
    anchorEl: null,

    //used for Menu Dialog
    modifyOpen: false,
    insert: false,
    withdraw: false,
    reset: false,
}

function homeReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
        case actions.SET_FIRST_USE:
            return { ...state, firstUse: action.firstUse }
        case actions.LOAD_TOTAL_AMOUNT:
            return { ...state, totalAmount: action.totalAmount }
        case actions.SET_ANCHOR_EL:
            return { ...state, anchorEl: action.anchorEl }
        case actions.SET_OPEN_DIALOG:
            return { ...state, open: action.open }
        case actions.SET_MODIFY_OPEN_DIALOG:
            return { ...state, modifyOpen: action.modifyOpen }
        case actions.SET_TOTAL_AMOUNT:
            switch(action.operation) {
                case "insert":
                    return { ...state, totalAmount: state.totalAmount + action.amount }
                case "withdraw":
                    return { ...state, totalAmount: state.totalAmount - action.amount }
                case "reset":
                    return { ...state, totalAmount: action.amount }
                default: return state
            }
        default: return state
    }
}

export default homeReducer