import * as actions from '../constants/action_types';

export function initializeLogin() {
    return {
        type: actions.INITIALIZE_LOGIN
    }
}

export function setLoginError(error) {
    return {
        type: actions.SET_LOGIN_ERROR,
        error
    }
}

export function setLoginEmail(email) {
    return {
        type: actions.SET_LOGIN_EMAIL,
        email
    }
}

export function setLoginPassword(password) {
    return {
        type: actions.SET_LOGIN_PASSWORD,
        password
    }
}