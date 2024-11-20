import { useVisibility } from '@hooks/common';
import {
	Components,
	//	ComponentsOverrides,
	Theme,
	createTheme,
	responsiveFontSizes,
} from '@mui/material';
import { useLocation } from 'react-router-dom';

declare module '@mui/material/Button' {
	interface ButtonPropsColorOverrides {
		ternary: true;
	}
}
declare module '@mui/material/styles/createPalette' {
	interface Palette {
		ternary?: Palette['secondary'];
	}
	interface PaletteOptions {
		ternary?: PaletteOptions['secondary'];
	}
}

declare module '@mui/material/styles' {
	interface CommonColors {
		text1: string;
		primaryGreyText: string;
		secondaryGreyText: string;
		ternaryGreyText: string;
	}
	interface BreakpointOverrides {
		xxl: true;
	}
}

export const text1 = '#BBC2E3';
export const primaryGreyText = '#232D42';
export const secondaryGreyText = '#8A92A6';
export const ternaryGreyText = '#ADB5BD';

const adminTheme = responsiveFontSizes(
	createTheme({
		breakpoints: {
			values: {
				xs: 0,
				sm: 600,
				md: 900,
				lg: 1200,
				xl: 1536,
				xxl: 1920,
			},
		},
		palette: {
			primary: {
				main: '#605DAA',
			},
			secondary: {
				main: '#605DAA',
			},
			ternary: { main: '#FFFFFF' },
			error: { main: '#FF2A2A' },
			success: { main: '#00BA55' },
			common: {
				text1,
				primaryGreyText,
				secondaryGreyText,
				ternaryGreyText,
			},
		},
		typography: {
			fontFamily: ['Poppins', 'Inter'].join(', '),
		},
		shape: {
			borderRadius: 4,
		},
	})
);

const useThemeComponents = (): Components => {
	const visibility = useVisibility();
	const location = useLocation();
	return {
		MuiCssBaseline: {
			styleOverrides: {
				html: {
					...(!location.pathname.includes('/sub-admin/') && { ...visibility }),
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
				},
				outlined: {
					backgroundColor: 'white',
					'&: hover': {
						backgroundColor: 'white',
					},
				},
			},
		},
		MuiAlert: {
			styleOverrides: {
				standardError: {
					background: `#FFC3C3`,
					color: adminTheme.palette.error.main,
				},
			},
		},
		MuiDivider: {
			styleOverrides: {
				root: {
					borderColor: '#E9ECEF',
				},
			},
		},
		MuiCheckbox: {
			styleOverrides: {
				root: {
					color: adminTheme.palette.primary.main,
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				notchedOutline: {
					borderColor: adminTheme.palette.common.secondaryGreyText,
				},
			},
		},
		MuiBackdrop: {
			styleOverrides: {
				root: {
					backgroundColor: '#0F131C26',
				},
			},
		},
		MuiAccordion: {
			styleOverrides: {
				root: {
					borderRadius: `8px !important`,
					borderWidth: 1,
					borderStyle: 'solid',
					borderColor: '#DFE3ED',
					boxShadow: 'none',
					'&:before': {
						display: 'none',
					},
					'&.Mui-expanded': {
						margin: `0px !important`,
					},
				},
			},
		},
		MuiAccordionSummary: {
			styleOverrides: {
				root: {
					backgroundColor: '#F3F4F8',
					paddingLeft: `24px`,
					paddingRight: `24px`,
				},
				content: {
					marginTop: '20px',
					marginBottom: '20px',
				},
			},
		},
		MuiAccordionDetails: {
			styleOverrides: {
				root: {
					display: 'flex',
					flexDirection: 'column',
					padding: `24px`,
					paddingTop: `16px`,
				},
			},
		},
		MuiTabs: {
			styleOverrides: {
				flexContainer: {
					justifyContent: 'space-around',
				},
				indicator: {
					display: 'none',
				},
				root: {
					'.Mui-selected': {
						backgroundColor: 'white',
						transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
					},
				},
			},
		},
		MuiTab: {
			styleOverrides: {
				root: {
					width: `100%`,
					transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
					borderRadius: `4px`,
					'.MuiTouchRipple-root': {
						color: '#E9EBF0',
					},
					padding: 8,
				},
			},
		},
		MuiDialog: {
			styleOverrides: {
				paper: {
					borderRadius: `8px`,
				},
			},
		},
	};
};

export const useAdminTheme = (): Theme => {
	const components = useThemeComponents();
	return { ...adminTheme, components };
};
