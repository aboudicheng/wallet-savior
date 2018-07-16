import * as actions from '../constants/action_types'

const INITIAL_STATE = {
    firstUse: false,

    //used for firstUSe Dialog
    open: true,
    totalAmount: parseFloat(0).toFixed(2),
    anchorEl: null,

    //used for Menu Dialog
    modifyOpen: false,
    insert: false,
    withdraw: false,
    reset: false,
}

function homeReducer(state = INITIAL_STATE, action) {
    console.log(action)
    switch(action.type) {
        case actions.SET_FIRST_USE:
            return { ...state, firstUse: action.firstUse }
        case actions.LOAD_TOTAL_AMOUNT:
            return { ...state, totalAmount: parseFloat(action.totalAmount).toFixed(2) }
        case actions.SET_ANCHOR_EL:
            return { ...state, anchorEl: action.anchorEl }
        case actions.SET_OPEN_DIALOG:
            return { ...state, open: action.open }
        case actions.SET_MODIFY_OPEN_DIALOG:
            return { ...state, modifyOpen: action.modifyOpen }
        case actions.SET_TOTAL_AMOUNT:
            switch(action.payload.operation) {
                case "insert":
                    return { ...state, totalAmount: parseFloat(parseFloat(state.totalAmount) + parseFloat(action.payload.amount)).toFixed(2) }
                case "withdraw":
                    return { ...state, totalAmount: parseFloat(parseFloat(state.totalAmount) - parseFloat(action.payload.amount)).toFixed(2) }
                case "reset":
                    return { ...state, totalAmount: parseFloat(action.payload.amount).toFixed(2) }
                default: return state
            }
        default: return state
    }
}

export default homeReducer