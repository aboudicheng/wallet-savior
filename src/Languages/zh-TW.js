const flatten = require('flat')

export const ZH_TW = flatten({
    wallet_savior: "錢包救星",
    language: "語言",
    languages: {
        en: "英文",
        zh: "中文(繁體)",
        zh_cn: "中文(簡體)"
    },
    sign_in: {
        login: "登入",
        email_address: "電子郵件地址",
        password: "密碼",
        already_have_an_account: "已經有帳號了嗎?",
        click: "點擊",
        here: "這裡",
        to_login: "以登入",
        login_with_facebook: "用Facebook登入",
        login_with_google: "用Google登入"
    },
    password_forget: {
        password_forget: "忘記密碼",
        ask: "忘記密碼?",
        reset: "重設"
    },
    sign_up: {
        sign_up: "註冊",
        username: "使用者名稱",
        confirm_password: "確認密碼",
        no_account: "尚未註冊帳號嗎?"
    }
})