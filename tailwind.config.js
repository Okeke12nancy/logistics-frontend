/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
			colors: {
				"warning": "#ddaa44",
				"success": "#99cc33",
				"danger": "#cc3300",
			}
		},
  },
  plugins: [],
}

