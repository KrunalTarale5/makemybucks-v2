import { InterTypography } from '@components/Typography';
import { Stack, useTheme } from '@mui/material';
import { memo } from 'react';

const Footer = () => {
	const theme = useTheme();
	return (
		<Stack
			flexDirection={'row'}
			justifyContent={'space-between'}
			padding={1.5}
			paddingX={2}
			sx={{ background: 'white' }}
		>
			{/* <Stack
				flexDirection={'row'}
				gap={3}
			>
				<InterTypography variant='subtitle2'>Privacy Policy</InterTypography>
				<InterTypography variant='subtitle2'>Terms of Use</InterTypography>
			</Stack> */}
			<Stack>
				<InterTypography
					variant='subtitle1'
					display={'flex'}
				>
					{`© 2024 makemybucks, Made with `}
					<InterTypography
						variant='subtitle1'
						paddingX={`4px`}
						sx={{ color: theme.palette.error.main }}
					>
						{` ❤ `}
					</InterTypography>
					{`	in India.`}
				</InterTypography>
			</Stack>
		</Stack>
	);
};
export default memo(Footer);
