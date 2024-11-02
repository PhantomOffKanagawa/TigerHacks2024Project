import colors from 'tailwindcss/colors';

export default {
	darkMode: ["class"],
	content: ["./src/**/*.tsx", "./src/**/*.css"],
	plugins: [require("@tailwindcss/forms"), require("tailwindcss-animate")],
	theme: {
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				background: colors.emerald[900],
				foreground: colors.emerald[100],
				card: {
					DEFAULT: colors.emerald[700],
					foreground: colors.emerald[100]
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: colors.emerald[100]
				},
				primary: colors.emerald,
				// primary: {
				// 	DEFAULT: colors.emerald,
				// 	foreground: colors.emerald[100]
				// },
				secondary: {
					DEFAULT: colors.emerald[300],
					foreground: colors.emerald[100]
				},
				muted: {
					DEFAULT: colors.emerald[50],
					foreground: colors.emerald[100]
				},
				accent: {
					DEFAULT: colors.emerald[400],
					foreground: colors.emerald[100]
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			}
		}
	}
};