module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: { animation: {
      glow: 'glow 1.5s infinite',
      glow2: 'glow2 1.5s infinite',
      glow3: 'glow3 1.5s infinite',
      glow4: 'glow4 1.5s infinite',
    },
    keyframes: {
      glow: {
        '0%, 100%': { boxShadow: '0 0 10px #fd3f92' },
        '50%': { boxShadow: '0 0 20px #fd3f92' },
      },
      glow2: {
        '0%, 100%': { boxShadow: '0 0 10px #87ceeb' },
        '50%': { boxShadow: '0 0 20px #87ceeb' },
      },
      glow3: {
        '0%, 100%': { boxShadow: '0 0 10px #a855f5' },
        '50%': { boxShadow: '0 0 20px #a855f5' },
      },
      glow4: {
        '0%, 100%': { boxShadow: '0 0 10px #ffbf00' },
        '50%': { boxShadow: '0 0 20px #ffbf00' },
      },
    },
      colors: {
        primary: { "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd", "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8", "800": "#1e40af", "900": "#1e3a8a", "950": "#172554" }
      }
    }, fontFamily: {
      'body': [
        'Inter',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'system-ui',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji'
      ],
      'sans': [
        'Inter',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'system-ui',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji'
      ]
    },
    plugins: [],
  }
}
