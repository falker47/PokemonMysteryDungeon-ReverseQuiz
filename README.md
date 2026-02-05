# PMD Reverse Quiz

![PMD Reverse Quiz Hero](pmd-app/public/hero-preview.webp)

> **Optimize your adventure.** Ensure you get the starter Pokémon you want with our precision Reverse Quiz tool.

PMD Reverse Quiz is a web application designed to help players of **Pokémon Mystery Dungeon** games determine the necessary answers to the nature quiz to obtain their desired starter Pokémon.

## Features

- **Reverse Lookup**: Select a Game Version, Pokémon, and Gender to see the required nature.
- **Answer Guide**: Determine which answers to specific questions lead to the target nature.
- **Search Functionality**: Quickly find questions and their impact on your nature score.
- **Interactive UI**: Navigate easily with a clean, themed interface.

## Project Structure

- **`pmd-app/`**: The main frontend application built with React and Vite.
- **`data/`**: Contains data files used by the application or for processing.
- **`pokemon-pics/`**: Images of Pokémon used in the application.
- **`questions-*.txt`**: Raw text files containing quiz questions for different game versions.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ recommended)
- [npm](https://www.npmjs.com/)

### Installation & Running

1. Navigate to the application directory:
   ```bash
   cd pmd-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local URL provided (usually `http://localhost:5173`).

## Supported Games

- Pokémon Mystery Dungeon: Red/Blue Rescue Team
- Pokémon Mystery Dungeon: Explorers of Time/Darkness
- Pokémon Mystery Dungeon: Explorers of Sky

## Technologies Used

- **React**: UI library
- **Vite**: Build tool and development server
- **Tailwind CSS**: Styling
- **JavaScript**: Core logic
