# Apus Network Website

This repository contains the source code for the official Apus Network website, built with React, TypeScript, and Vite.

## Features

-   **Modern Tech Stack**: Built with Vite, React, and TypeScript for a fast and robust development experience.
-   **Component-Based**: A modular architecture with reusable components.
-   **AO Integration**: Interacts with `ao` processes for features like the Community Mint and AI Playground.
-   **Responsive Design**: Styled with Tailwind CSS for a responsive layout across all devices.
-   **Web3 Integration**: Uses `arweave-wallet-kit` for connecting to Arweave wallets.

## Development

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm or yarn

### Getting Started

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd apus-website
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

### Build for Production

To create a production build of the application, run:

```sh
npm run build
```

This will generate the static files in the `dist` directory.

## Project Structure

-   `src/pages`: Contains the main pages of the website (Homepage, Mint, Console, etc.).
-   `src/components`: Shared React components used across different pages.
-   `src/contexts`: React contexts for managing global state (e.g., wallet connection, competition data).
-   `src/utils`: Utility functions, including helpers for `ao` interaction (`ao.ts`).
-   `src/assets`: Static assets like images, logos, and animations.
-   `public`: Static assets that are copied directly to the build output.