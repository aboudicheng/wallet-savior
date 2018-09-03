const flatten = require('flat')

export const EN = flatten({
    wallet_savior: "Wallet $avior",
    language: "Language",
    languages: {
        en: "English",
        zh: "Chinese (Traditional)",
    },
    sign_in: {
        login: "Login",
        email_address: "Email address",
        password: "Password",
        already_have_an_account: "Already have an account?",
        click: "Click",
        here: "here",
        to_login: "to login",
        login_with_facebook: "Login with Facebook",
        login_with_google: "Login with Google"
    },
    password_change: {
        new_password: "New Password",
        confirm: "Confirm New Password",
        reset: "Reset Password"
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
        language: "Language",
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
        quit: "Quit",
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
            no: "Cancel",
            yes: "Delete"
        },
        create: {
            wallet_title: "Add a new Wallet",
            group_title: "Create a Group",
            wallet_text: "Please provide a name for this wallet:",
            group_text: "Please provide a name for this group:",
            name: "Name",
            cancel: "Cancel",
            create: "Create"
        },
        members: {
            title: "Members",
            you: "You",
            add: "add member"
        },
        invite: {
            error: {
                not_found: "User not found!",
                already_in: "The user is already in the group!"
            },
            title: "Add Member",
            text: "Please enter the email of the user you would like to add in:",
            email: "Email",
            cancel: "Cancel",
            add: "Add"
        },
        quit: {
            title: "Quit",
            text: "Are you sure to quit this group?",
            no: "Cancel",
            yes: "Quit"
        }
    },
    group: {
        edit_wallet_name: "Edit wallet name",
        members: "Members",
        invite: "Invite",
        history: "History",
        no_records: "This group has no records yet.",
        user: "User",
        type: "Type",
        amount: "Amount",
        description: "Description"
    },
    history: {
        title: "History",
        no_records: "You have no records yet.",
        wallet: "Wallet",
        type: "Type",
        amount: "Amount",
        description: "Description",
        delete_all: "Delete all history",
        text: "Are you sure to delete all history?",
        no: "Cancel",
        yes: "Delete"
    },
    account: {
        email: "Email",
        username: "Username",
        reset: "Reset",
        change_password: "Change Password",
        delete: "Delete",
        title: "WARNING",
        text: "Everything that you have stored on this platform will be erased. Are you sure to delete this account?",
        no: "Cancel",
        yes: "Delete"
    },
    not_found: "Oh No! Page Not Found!"
})