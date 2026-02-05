/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'dungeon-dark': '#2a303c', // Pokemon Dark Blue/Gray
                'dungeon-panel': '#3d4451', // Lighter Slate
                'dungeon-accent': '#ffcb05', // Pokemon Yellow
                'dungeon-text': '#f3f4f6', // Light Gray/White
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
