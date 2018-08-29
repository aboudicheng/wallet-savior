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
    },
    password_forget: {
        password_forget: "Password Forget",
        ask: "Forgot password?",
        reset: "Reset Password"
    },
    sign_up: {
        sign_up: "Sign Up",
        username: "Username",
        confirm_password: "Confirm password",
        no_account: "Don't have an account?"
    },
    first_use: {
        welcome: "Welcome to Wallet $avior!!",
        text: "You will now be able to keep track of your own expenditures as well as any organization you belong to. Feel free to form your own groups and invite your friends in!!",
        alright: "Alright!"
    },
    nav: {
        personal: "Personal",
        group: "Group",
        add_wallet: "Add Wallet",
        create_group: "Create Group",
        history: "History",
        account: "Account",
        sign_out: "Sign Out"
    },
    home: {
        check: "Check",
        history: "history",
        edit_wallet_name: "Edit wallet name",
    },
    operations: {
        insert: "Insert",
        withdraw: "Withdraw",
        reset: "Reset",
        delete: "Delete",
        operation_successful: "Operation succefful!"
    },
    dialogs: {
        insert: {
            title: "Add Money",
            text: "Please enter the amount of money you are going add to your wallet:",
            money_amount: "Money amount",
            description: "Description (optional)",
            cancel: "Cancel",
            insert: "Add"
        },
        withdraw: {
            title: "Withdraw Money",
            text: "Please enter the amount of money you are going to take out from your wallet:",
            money_amount: "Money amount",
            description: "Description (optional)",
            cancel: "Cancel",
            withdraw: "Withdraw"
        },
        reset:{
            title: "Reset Wallet",
            text: "Please enter the amount of money you are going to initialize for your wallet:",
            money_amount: "Money amount",
            cancel: "Cancel",
            reset: "Reset"
        },
        rename: {
            title: "Rename Wallet",
            text: "Please enter a new name for your wallet:",
            name:"Name",
            cancel: "Cancel",
            rename: "Rename"
        },
        delete: {
            title: "Delete Wallet",
            text: "You won't be able to undo once you delete your wallet. Are you sure to delete it?",
            no: "No",
            yes: "Yes"
        }
    }
})