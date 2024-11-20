import { FC, memo } from 'react';
import { AppBar, Box, BoxProps, Container, IconButton, Toolbar, useTheme } from '@mui/material';
import Hash1 from '_assets/icons/layout-hash-1.svg';
import Hash2 from '_assets/icons/layout-hash-2.svg';
import IconFinder from './Icon';
import { PoppinsTypography } from './Typography';
import { useNavigate } from 'react-router-dom';

interface AuthWrapperProps {
	children: React.ReactNode;
	backgroundImage?: boolean;
	isAppbar?: boolean;
	sx?: BoxProps['sx'];
}

const AuthWrapper: FC<AuthWrapperProps> = (props) => {
	const navigate = useNavigate();
	const theme = useTheme();
	return (
		<Box
			sx={{
				background: theme.palette.primary.main,
				height: `inherit`,
				...(props.backgroundImage && {
					backgroundImage: `url(${Hash1}), url(${Hash2})`,
					backgroundRepeat: 'no-repeat',
					backgroundPosition: `top left, bottom right`,
				}),
				display: 'flex',
				justifyContent: 'center',
				alignItems: `center`,
				...props.sx,
			}}
		>
			{props.isAppbar && (
				<AppBar
					color='transparent'
					sx={{
						placeContent: 'flex-end',
						boxShadow: 'none',
					}}
				>
					<Toolbar
						component={Container}
						maxWidth='xs'
					>
						<IconButton
							sx={{ paddingY: 1.5 }}
							onClick={() => navigate(-1)}
						>
							<IconFinder
								iconName='ArrowBack'
								iconProps={{ fill: 'white' }}
							/>
						</IconButton>
						<PoppinsTypography
							variant='subtitle1'
							sx={{ color: 'white' }}
						>
							Back
						</PoppinsTypography>
					</Toolbar>
				</AppBar>
			)}
			{props.children}
		</Box>
	);
};

export default memo(AuthWrapper);
