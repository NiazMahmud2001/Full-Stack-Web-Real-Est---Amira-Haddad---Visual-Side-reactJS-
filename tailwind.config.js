/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		opacity: Object.fromEntries(Array.from({ length: 101 }, (_, i) => [i, `${i / 100}`])),
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			// Brand palette — the sage/ink/brass system shared by every page.
  			sand: {
  				DEFAULT: '#E5EAE6',
  				light: '#F1F4F0',
  				deep: '#D2DAD5'
  			},
  			sage: {
  				DEFAULT: '#D2DAD5',
  				deep: '#BFC9C1'
  			},
  			ink: {
  				DEFAULT: '#151C17',
  				soft: '#232D26',
  				mute: '#3A473D'
  			},
  			brass: {
  				DEFAULT: '#B08D57',
  				light: '#D8C09A',
  				deep: '#8A6C3D'
  			},
  			forest: {
  				DEFAULT: '#2F5D48',
  				deep: '#1F4132'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
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
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		fontFamily: {
  			heading: ['var(--font-heading)'],
  			body: ['var(--font-body)'],
  			display: ['var(--font-display)'],
  			mono: ['var(--font-mono)']
  		},
  		letterSpacing: {
  			label: '0.24em',
  			wider2: '0.34em'
  		},
  		boxShadow: {
  			lift: '0 30px 60px -34px rgba(21,28,23,0.55)',
  			'lift-lg': '0 46px 90px -40px rgba(21,28,23,0.62)',
  			inset_line: 'inset 0 1px 0 0 rgba(255,255,255,0.5)'
  		},
  		transitionTimingFunction: {
  			expo: 'cubic-bezier(0.16, 1, 0.3, 1)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'pulse-ring': {
  				'0%': { transform: 'scale(0.8)', opacity: '0.7' },
  				'70%': { transform: 'scale(2.2)', opacity: '0' },
  				'100%': { transform: 'scale(2.2)', opacity: '0' }
  			},
  			'float-y': {
  				'0%, 100%': { transform: 'translateY(0)' },
  				'50%': { transform: 'translateY(-8px)' }
  			},
  			'shimmer': {
  				'100%': { transform: 'translateX(100%)' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'pulse-ring': 'pulse-ring 2.6s cubic-bezier(0.16,1,0.3,1) infinite',
  			'float-y': 'float-y 5s ease-in-out infinite',
  			'shimmer': 'shimmer 1.8s infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
