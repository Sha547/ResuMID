/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Space Grotesk', 'sans-serif'],
            },
            colors: {
                // Neon/Cyberpunk palette
                primary: {
                    DEFAULT: '#7c3aed', // Violet-600
                    hover: '#6d28d9',   // Violet-700
                    light: '#a78bfa',   // Violet-400
                },
                secondary: {
                    DEFAULT: '#8b5cf6', // Violet 500
                    hover: '#7c3aed',   // Violet 600
                },
                dark: {
                    bg: '#020617',      // Slate 950
                    card: '#0f172a',    // Slate 900
                    surface: '#1e293b', // Slate 800
                    border: '#334155',  // Slate 700
                },
                accent: {
                    DEFAULT: '#22d3ee', // Cyan 400
                    glow: '#06b6d4',    // Cyan 500
                }
            },
            animation: {
                'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                shake: {
                    '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
                    '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
                    '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
                    '40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
                },
                glow: {
                    'from': { boxShadow: '0 0 10px #d946ef, 0 0 20px #d946ef' },
                    'to': { boxShadow: '0 0 20px #8b5cf6, 0 0 30px #8b5cf6' }
                }
            }
        },
    },
    plugins: [],
}
