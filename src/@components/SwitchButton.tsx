import { Switch, styled } from '@mui/material';

const SwitchButton = styled(Switch)(({ theme, disabled }) => ({
	width: 39,
	height: 24,
	padding: 0,
	display: 'flex',
	...(disabled && { opacity: 0.5 }),
	'&:active': {
		'& .MuiSwitch-thumb': {
			width: 16,
			top: 4,
		},
	},
	'& .MuiSwitch-switchBase': {
		padding: 2,
		top: 2,
		transform: 'translateX(4px)',
		'&.Mui-checked': {
			transform: 'translateX(16px)',
			color: '#fff',
			'& + .MuiSwitch-track': {
				opacity: 1,
				backgroundColor: theme.palette.success.main,
			},
		},
	},
	'& .MuiSwitch-thumb': {
		boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
		width: 16,
		height: 16,
		borderRadius: 10,
		transition: theme.transitions.create(['width'], {
			duration: 200,
		}),
	},
	'& .MuiSwitch-track': {
		borderRadius: 25 / 2,
		opacity: 1,
		backgroundColor: theme.palette.common.secondaryGreyText,
		boxSizing: 'border-box',
	},
}));

export default SwitchButton;
