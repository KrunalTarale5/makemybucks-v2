import { Components, createTheme } from '@mui/material';

declare module '@mui/material/styles' {
	interface CommonColors {
		text1: string;
		primaryGreyText: string;
		secondaryGreyText: string;
	}
}

export const text1 = '#BBC2E3';
export const primaryGreyText = '#232D42';
export const secondaryGreyText = '#8A92A6';

const subAdminTheme = createTheme({
	palette: {
		primary: {
			main: '#605DAA',
		},
		secondary: {
			main: '#FFFFFF',
		},
		error: {
			main: '#FF2A2A',
		},
		success: { main: '#00BA55' },
		warning: { main: '#FF9634' },
		common: {
			text1,
			primaryGreyText,
			secondaryGreyText,
		},
	},
	shape: { borderRadius: 8 },
	typography: {
		fontFamily: ['Poppins', 'Inter'].join(', '),
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
	MuiFab: {
		styleOverrides: {
			root: {
				textTransform: 'none',
			},
		},
	},
	MuiTab: {
		styleOverrides: {
			root: {
				textTransform: 'none',
				letterSpacing: 1,
				color: 'white',
			},
		},
	},
	MuiPaper: {
		styleOverrides: { root: { boxShadow: `0px 2px 4px 0px #0000001A` } },
	},
};

subAdminTheme.components = components;

export { subAdminTheme };
