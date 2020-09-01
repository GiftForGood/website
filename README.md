# GiftforGood
Giftforgood is your friendly neighborhood in-kind donations platform. 

## Setting up

Run `npm install` in the root directory to install all the relevant dependencies such as React, Next.js etc.   

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Hot reloading is available in this mode, i.e. the page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run lint`

Runs a series of checks on the code formatting according to the `.prettierrc.json` configuration file. 

### `npm run format`

Automatically formats the code according to the `.prettierrc.json` configuration file.

### `npm run dev-local`

Runs the app in the development mode.<br />
Open `http://[ip-address]:3000` to view it in the browser.

## Environment Variables 
To use environment variables within the project:
1. `mv .env.sample .env`
2. Add environment variables inside `.env` 
3. Add environment variables inside `next.config.js`

## Services used 
- [Firebase](https://firebase.google.com/)
  - Auth, Storage, Realtime DB, Firestore
- [Algolia](https://www.algolia.com/)
  - Search
- [Cloudflare](https://www.cloudflare.com/)
  - DDOS protection
- [Cloudinary](https://cloudinary.com/)
  - Assets
- [SendGrid](https://sendgrid.com/)
  - Emailing
- [1Password](https://1password.com/)
  - Password Manager
- [Heroku](https://heroku.com)
  - Web Server
