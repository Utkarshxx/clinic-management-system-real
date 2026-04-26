/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // Custom colors for clinic theme
            colors: {
                'clinic-primary': '#ebf5ff',  // Light blue - primary color
                'clinic-blue': '#3b82f6',     // Blue for buttons and accents
                'clinic-dark': '#1e293b',     // Dark text color
            },
        },
    },
    plugins: [],
}
