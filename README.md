
# Wallet $avior
![https://david-dm.org/aboudicheng/wallet-savior.](https://img.shields.io/david/aboudicheng/wallet-savior.svg)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/4b35277dafad4f34abddd5161ec6f8e3)](https://www.codacy.com/project/aboudicheng/wallet-savior/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=aboudicheng/wallet-savior&amp;utm_campaign=Badge_Grade_Dashboard)
## Live Demo
[https://aboudicheng.github.io/wallet-savior/](https://aboudicheng.github.io/wallet-savior/)

## Overview

A single page web application that allows users to keep track of their expenditures with every action (e.g insert, withdraw) recorded into history. Users may also create their own groups and add other users in by selecting their e-mail addresses.

## Highlighted Features
- Sign up methods using OAuth (Facebook and Google) and Email authentication
- Create as many wallets as needed
- Create groups, join in to groups, invite people to groups
- Check online status of other members
- Every action made in a group will be recorded to the history
- Multi-language support + remembering user's preferences
- Responsive Web Design
- PWA support
## Tools & Libraries

- React
- Redux
- Firebase
- Material-UI v1
- React router v4
- React-intl

## Installation
```
// Clone repository from github
git clone https://github.com/aboudicheng/wallet-savior.git

// Change directory
cd wallet-savior

// Create .env in root directory and set up variables with your own Firebase credentials used in src/firebase/firebase.js
touch .env

// Install required dependencies
npm install

// Start development server on http://localhost:3000
npm start
```

## Contributing
Feel free to submit any issue or PR.

## TODO List

* Group visibility limited to members
* Allow PWA supporting OAuth redirect on iOS
