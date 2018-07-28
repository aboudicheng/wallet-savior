# Wallet $avior
![https://david-dm.org/aboudicheng/wallet-savior.](https://img.shields.io/david/aboudicheng/wallet-savior.svg)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/4b35277dafad4f34abddd5161ec6f8e3)](https://www.codacy.com/project/aboudicheng/wallet-savior/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=aboudicheng/wallet-savior&amp;utm_campaign=Badge_Grade_Dashboard)
## Live Demo
[https://aboudicheng.github.io/wallet-savior/](https://aboudicheng.github.io/wallet-savior/)

## Overview

A single page web application that allows users to keep track of their expenditures with every action (e.g insert, withdraw) recorded into history. Users may also create their own groups and add other users in by selecting their e-mail addresses.

## Tools & Libraries

* React
* Redux
* Firebase
* Material-UI v1
* react-router v4

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
Feel free to submit any issue or PR. If needed to access the database, please contact [aboudicheng@gmail.com](mailto:aboudicheng@gmail.com)

## TODO List

* Group visibility limited to members
* History for groups
* Delete single history
* Delete account
