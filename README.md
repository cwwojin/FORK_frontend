# FORK_frontend

## Table of contents
- [FORK\_frontend](#fork_frontend)
  - [Table of contents](#table-of-contents)
  - [This is the introduction ](#this-is-the-introduction-)
  - [Installation ](#installation-)
  - [Contribution ](#contribution-)
  - [Team ](#team-)

## This is the introduction <a name="introduction"></a>
2024 Spring CS350 Project - FORK

## Installation <a name="installation"></a>

### Setup the Expo Project
1. Clone this Repository
2. Setup [EAS-CLI](https://docs.expo.dev/build/setup/#install-the-latest-eas-cli) (run as `sudo` if necessary)
   ```shell
   $ npm i -g eas-cli
   ```
3. Login to your Expo Account
   ```shell
   $ eas login -u <username> -p <password>
   ```
4. Setup the Expo Project
   ```shell
   $ cd fork && eas init && cd ..
   ```
   This will ask you to setup a project for your Expo Account

### Option 1. Run the App Locally
1. Download [Expo GO](https://apps.apple.com/kr/app/expo-go/id982107779) on your IOS device
2. Install [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
   ```shell
   $ npm i -g yarn
   ```
3. Do the [Setup the Expo Project](#setup-the-expo-project) step.
4. Install Dependencies with Yarn
   ```shell
   $ cd fork && yarn install
   ```
5. Launch the development server with Expo CLI
   ```shell
   $ npx expo start
   ```
6. Open the app on your IOS device by scanning the QR code

### Option 2. Run the App with Docker
1. Install [Docker, Docker Compose](https://docs.docker.com/compose/install/)
2. Download [Expo GO](https://apps.apple.com/kr/app/expo-go/id982107779) on your IOS device
3. Launch Dev Container from Terminal
   ```shell
   $ 
   $ bash compose.sh -u <expo_username> -p <expo_password>
   ```
   **You must provide your Expo account (same one as your project owner)**
4. Open the app on your IOS device by scanning the QR code

## Contribution <a name="contribution"></a>
### Branch rules
- feature/{$feature_branch_name}
- hotfix/{$hotfix_branch_name}
- release/{$release_ver}

## Team <a name="team"></a>
Woojin Choi <cwwojin@gmail.com> <br/>
Wonjung Woo <agnes2327@kaist.ac.kr> <br/>
Aya Hamane <aya.hamane@epfl.ch> <br/>
Nurgissa Sailaubek <sailaubek.nurgissa@gmail.com> <br/>