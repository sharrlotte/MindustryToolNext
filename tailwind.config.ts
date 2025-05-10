/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-background': 'linear-gradient(10deg, #000000 0%, #000000 70%, #121212 100%)',
			},
			height: {
				screen: ['100vh /* fallback for Opera, IE and etc. */', '100dvh'],
			},
			fontFamily: {
				icon: ['var(--font-icon)'],
				noto: ['var(--font-noto)', 'var(--font-icon)'],
				inter: ['var(--font-inter)', 'var(--font-icon)'],
			},
			minHeight: (theme: any) => ({
				...theme('spacing'),
			}),
			spacing: {
				preview: 'var(--preview-size)',
				'preview-height': 'var(--preview-card-height)',
				nav: 'var(--nav)',
			},
			colors: {
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))',
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				brand: {
					DEFAULT: 'hsl(var(--brand))',
					foreground: 'hsl(var(--brand-foreground))',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'slide-in': {
					'0%': {
						transform: 'translateX(100%)',
					},
					'100%': {
						transform: 'translateX(0)',
					},
				},
				popup: {
					'0%': { transform: 'translateX(-100%)' },

					'100%': { transform: 'translateX(0)' },
				},
				spin: {
					'0%': {
						transform: 'rotate(0deg)',
					},
					'100%': {
						transform: 'rotate(360deg)',
					},
				},
				appear: {
					'0%': {
						opacity: 0,
					},
					'100%': {
						opacity: 1,
					},
				},
				expand: {
					'0%': { transform: 'scaleY(0)' },
					'100%': { transform: 'scaleY(1)' },
				},
				collapse: {
					'0%': { transform: 'scaleY(1)' },
					'100%': { transform: 'scaleY(0)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'slide-in': 'slide-in 0.5s forwards',
				popup: 'popup 0.2s forwards',
				spin: 'spin 1s linear infinite',
				appear: 'appear 0.5s linear',
				expand: 'expand 1s linear forwards',
				collapse: 'collapse 1s linear forwards',
			},
		},
	},
	plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
