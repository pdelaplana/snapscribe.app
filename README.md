# Snapscribe App

Snapscribe is a photo gallery application built with Ionic and React. It allows users to capture, upload, and manage photos with captions and ratings.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/yourusername/snapscribe.app.git
    cd snapscribe.app
    ```

2. Install Ionic CLI globally:

    ```sh
    npm install -g @ionic/cli
    ```

3. Install project dependencies:

    ```sh
    npm install
    ```

4. Set up environment variables:

    Create a `.env.development.local` file in the root directory and add the following variables:

    ```env
    VITE_CAPTIONING_API_URL=https://api.captioning.dev
    VITE_FIREBASE_API_KEY=your_firebase_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_firebase_app_id
    VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
    ```

5. Start the development server:

    ```sh
    ionic serve
    ```

## Usage

- Open the app in your browser at `http://localhost:3000`.
- Sign in or sign up to start using the app.
- Capture photos using the camera button.
- Add captions and ratings to your photos.
- View and manage your photo gallery.

## Features

- **Photo Capture**: Capture photos using the device camera.
- **Photo Upload**: Upload photos to Firebase Storage.
- **Photo Management**: Add, update, and remove photos.
- **Photo Gallery**: View photos in a gallery layout.
- **User Authentication**: Sign in and sign up functionality.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
