import {
	AppBar,
	Toolbar,
	useScrollTrigger,
	Slide,
	Container,
	IconButton,
	Stack,
	useTheme,
} from '@mui/material';
import { FC, ReactNode, memo } from 'react';
import { FiraSansTypography } from './Typography';
import IconFinder from './Icon';
import { LoadingButton } from '@mui/lab';

export interface UserAppWrapperProps {
	subHeading?: ReactNode;
	heading?: ReactNode;
	handleBack?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	controlButtonProps?: {
		content: ReactNode;
		loading?: boolean;
		disabled?: boolean;
		onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	};
	children: React.ReactElement;
}

const UserAppWrapper: FC<UserAppWrapperProps> = (props) => {
	const theme = useTheme();

	return (
		<Stack
			flexGrow={1}
			sx={{ background: theme.palette.background.default }}
		>
			{props.heading && (
				<HideOnScroll>
					<AppBar
						sx={{
							background: theme.palette.background.default,
							height: theme.spacing(15),
							placeContent: 'flex-end',
							boxShadow: 'none',
							flexFlow: 'row',
							...(props.subHeading && { marginTop: 2 }),
						}}
					>
						<Toolbar
							sx={{ paddingX: 4, gap: 1 }}
							component={Container}
							maxWidth='sm'
						>
							{props.handleBack && (
								<IconButton
									sx={{ paddingY: 1.5 }}
									onClick={props.handleBack}
								>
									<IconFinder
										iconName='ArrowBack'
										iconProps={{ fill: theme.palette.common.white }}
									/>
								</IconButton>
							)}
							<Stack flexDirection={'column'}>
								{props.subHeading && (
									<FiraSansTypography
										variant='subtitle1'
										sx={{ color: theme.palette.common.primaryGreyText }}
									>
										{props.subHeading}
									</FiraSansTypography>
								)}
								<FiraSansTypography
									variant='h4'
									fontSize={`32px`}
									fontWeight={600}
									sx={{ color: theme.palette.common.white }}
								>
									{props.heading}
								</FiraSansTypography>
							</Stack>
						</Toolbar>
					</AppBar>
				</HideOnScroll>
			)}
			<Container
				maxWidth='sm'
				sx={{
					paddingTop: 16,
					paddingBottom: 3,
					paddingX: 4,
					height: `calc(100% - ${theme.spacing(10)})`,
					overflow: 'auto',
					display: 'flex',

					flexDirection: 'column',
				}}
			>
				{props.children}
			</Container>

			{props.controlButtonProps && (
				<AppBar
					position='fixed'
					sx={{
						top: 'auto',
						bottom: 0,
						backgroundColor: theme.palette.background.default,
						backgroundImage: 'none',
						boxShadow: 'none',
					}}
				>
					<Toolbar
						component={Container}
						maxWidth='sm'
						sx={{
							height: theme.spacing(10),
							'.MuiTabs-flexContainer': {
								justifyContent: 'space-around',
							},
							justifyContent: 'space-around',
						}}
					>
						{props.controlButtonProps && (
							<LoadingButton
								variant='contained'
								size='large'
								color='primary'
								fullWidth
								onClick={props.controlButtonProps?.onClick}
								loading={props.controlButtonProps.loading}
								disabled={props.controlButtonProps.disabled}
								sx={{ height: 64, alignSelf: 'center', borderRadius: `14px` }}
							>
								<FiraSansTypography
									variant='h6'
									fontWeight={600}
									letterSpacing={0.36}
								>
									{props.controlButtonProps?.content}
								</FiraSansTypography>
							</LoadingButton>
						)}
					</Toolbar>
				</AppBar>
			)}
		</Stack>
	);
};
export default memo(UserAppWrapper);

interface HideOnScrollProps {
	children: React.ReactElement;
}

function HideOnScroll(props: HideOnScrollProps) {
	const trigger = useScrollTrigger({
		target: window ? window : undefined,
	});

	return (
		<Slide
			appear={false}
			direction='down'
			in={!trigger}
			children={props.children}
		/>
	);
}
