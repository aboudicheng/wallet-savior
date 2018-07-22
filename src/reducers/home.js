import * as actions from '../constants/action_types'

const INITIAL_STATE = {
    firstUse: false,

    //used for firstUSe Dialog
    open: true,
    walletName: "",
    totalAmount: parseFloat(0).toFixed(2),
    anchorEl: null,

    //used for Menu Dialog
    modifyOpen: false,

    renameOpen: false,

    snackbarOpen: false,
}

function homeReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
        case actions.SET_FIRST_USE:
            return { ...state, firstUse: action.firstUse }
        case actions.LOAD_WALLET_NAME:
            return { ...state, walletName: action.walletName }
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
        case actions.SET_NEW_NAME:
            return { ...state, walletName: action.name }
        case actions.SET_RENAME_DIALOG:
            return { ...state, renameOpen: action.open }
        case actions.SET_SNACKBAR_OPEN:
            return { ...state, snackbarOpen: action.snackbarOpen }
        default: return state
    }
}

export default homeReducer