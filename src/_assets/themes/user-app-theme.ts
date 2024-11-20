import { Components, createTheme } from '@mui/material';

declare module '@mui/material/styles' {
	interface CommonColors {
		primaryGreyText: string;
		secondaryGreyText: string;
	}
}

export const primaryGreyText = '#B9B9BE';
export const secondaryGreyText = '#1D1D22';

const userAppTheme = createTheme({
	palette: {
		primary: {
			main: '#A9A7E8',
		},
		secondary: {
			main: '#F8F8FF',
		},
		error: {
			main: '#FF2A2A',
		},
		success: { main: '#54FEB6' },
		common: {
			white: '#F8F8FF',
			primaryGreyText,
			secondaryGreyText,
		},
		mode: 'dark',
		background: { default: '#25252A' },
	},

	typography: {
		fontFamily: ['Poppins', 'Inter', 'Fira Sans'].join(', '),
	},
});

const components: Components = {
	MuiButton: {
		styleOverrides: {
			root: {
				textTransform: 'none',
			},
		},
	},
	MuiTypography: {
		styleOverrides: {
			h4: {
				letterSpacing: 1.28,
			},
			subtitle1: {
				letterSpacing: 0.64,
			},
			subtitle2: {
				letterSpacing: 0.56,
			},
		},
	},
};

userAppTheme.components = components;

export { userAppTheme };
