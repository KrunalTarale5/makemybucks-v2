import { FC, memo } from 'react';
import IconFinder from './Icon';
import { Stack, useTheme } from '@mui/material';
import { InterTypography } from './Typography';

interface SubAdminSuccessProps {
	heading: string;
}

const SubAdminSuccess: FC<SubAdminSuccessProps> = (props) => {
	const theme = useTheme();
	return (
		<Stack
			display={'flex'}
			alignItems={'center'}
			gap={5}
			margin={'auto'}
			justifyContent={'center'}
			height={'inherit'}
		>
			<IconFinder
				iconName='SuccessLogo'
				iconProps={{ fill: theme.palette.success.main }}
			/>
			<InterTypography
				variant='h4'
				textAlign={'center'}
			>
				{props.heading}
			</InterTypography>
		</Stack>
	);
};

export default memo(SubAdminSuccess);
