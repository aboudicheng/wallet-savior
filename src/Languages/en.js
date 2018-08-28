const flatten = require('flat')

export const EN = flatten({
    wallet_savior: "Wallet $avior",
    language: "Language",
    languages: {
        en: "English",
        zh: "Chinese (Traditional)",
        zh_cn: "Chinese (Simplified)"
    },
    sign_in: {
        login: "login",
        email_address: "Email address",
        password: "Password",
        already_have_an_account: "Already have an account?",
        click: "Click",
        here: "here",
        to_login: "to login",
        login_with_facebook: "Login with Facebook",
        login_with_google: "Login with Google"
    }
})