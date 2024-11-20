import { FC, memo } from 'react';
import { Box, BoxProps, Stack, useTheme } from '@mui/material';
import Hash5 from '_assets/icons/layout-hash-5.svg';
import IconFinder from './Icon';
import { PoppinsTypography } from './Typography';

interface RestaurentAuthWrapperProps {
	children: React.ReactNode;
	sx?: BoxProps['sx'];
}

const RestaurentAuthWrapper: FC<RestaurentAuthWrapperProps> = (props) => {
	const theme = useTheme();
	return (
		<Box
			sx={{
				background: theme.palette.primary.main,
				height: `inherit`,
				backgroundImage: `url(${Hash5})`,
				backgroundRepeat: 'no-repeat',
				backgroundPosition: `top left`,
				display: 'flex',
				...props.sx,
			}}
		>
			<Stack
				flexBasis={`50%`}
				alignItems={'center'}
				justifyContent={'center'}
			>
				<IconFinder iconName='RestaurantLoginLogo'></IconFinder>
			</Stack>
			<Stack
				alignItems={'center'}
				justifyContent={'center'}
				flexBasis={`50%`}
				sx={{
					backgroundColor: theme.palette.secondary.main,
					borderTopLeftRadius: 48,
					borderBottomLeftRadius: 48,
				}}
			>
				<Stack
					maxWidth={613}
					gap={4}
				>
					<Stack>
						<PoppinsTypography
							variant='h3'
							fontWeight={700}
						>
							Welcome
						</PoppinsTypography>
						<PoppinsTypography
							variant='h3'
							fontWeight={700}
						>
							to makemybucks Team!
						</PoppinsTypography>
					</Stack>

					{props.children}
				</Stack>
			</Stack>
		</Box>
	);
};

export default memo(RestaurentAuthWrapper);
