import * as actions from '../constants/action_types';

export function initializeSignup() {
    return {
        type: actions.INITIALIZE_SIGNUP
    }
}

export function setSignupError(error) {
    return {
        type: actions.SET_SIGNUP_ERROR,
        error
    }
}

export function setSignupUsername(username) {
    return {
        type: actions.SET_SIGNUP_USERNAME,
        username
    }
}

export function setSignupEmail(email) {
    return {
        type: actions.SET_SIGNUP_EMAIL,
        email
    }
}

export function setSignupPasswordOne(passwordOne) {
    return {
        type: actions.SET_SIGNUP_PASSWORD1,
        passwordOne
    }
}

export function setSignupPasswordTwo(passwordTwo) {
    return {
        type: actions.SET_SIGNUP_PASSWORD2,
        passwordTwo
    }
}