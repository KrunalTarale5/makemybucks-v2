import {
	AppBar,
	Toolbar,
	useScrollTrigger,
	Slide,
	Tab,
	Tabs,
	Container,
	IconButton,
	Fab,
	Stack,
	useTheme,
} from '@mui/material';
import { FC, ReactNode, memo } from 'react';
import { PoppinsTypography } from './Typography';
import IconFinder, { IconType } from './Icon';
import { LoadingButton } from '@mui/lab';
import { useLocation, useNavigate } from 'react-router-dom';

export interface SubAdminWrapperProps {
	subHeading?: ReactNode;
	heading?: ReactNode;
	handleBack?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	bottonToolbar?: boolean;
	controlButtonProps?: {
		content: ReactNode;
		loading?: boolean;
		onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
		disabled?: boolean;
	};
	fabButtonProps?: {
		content: ReactNode;
		onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	};
	children: React.ReactElement;
}

const TABS = [
	{
		label: 'Home',
		icon: 'Home',
		url: '/sub-admin/restaurants/dashboard',
		match: '/sub-admin/restaurants',
	},
	{
		label: 'QR Code',
		icon: 'QRCode',
		url: process.env.REACT_APP_IS_TEST_ENV ? '/sub-admin/qr/dashboard' : `null`,
		match: '/sub-admin/qr',
	},
	{ label: 'Profile', icon: 'Profile', url: '/sub-admin/profile', match: '/sub-admin/profile' },
];

const SubAdminWrapper: FC<SubAdminWrapperProps> = (props) => {
	const theme = useTheme();
	const navigate = useNavigate();
	const location = useLocation();

	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		if (newValue === 'null') return;
		navigate(newValue);
	};

	return (
		<>
			{props.heading && (
				<HideOnScroll>
					<AppBar
						sx={{
							background: 'white',
							height: theme.spacing(8),
							placeContent: 'flex-end',
							boxShadow: 'none',
							...(props.subHeading && { marginTop: 2 }),
						}}
					>
						<Toolbar
							sx={{ paddingX: 4, gap: 2 }}
							component={Container}
							maxWidth='xs'
						>
							{props.handleBack && (
								<IconButton
									sx={{ paddingY: 1.5 }}
									onClick={props.handleBack}
								>
									<IconFinder iconName='ArrowBack' />
								</IconButton>
							)}
							<Stack flexDirection={'column'}>
								{props.subHeading && (
									<PoppinsTypography
										variant='subtitle1'
										sx={{ color: theme.palette.common.primaryGreyText }}
									>
										{props.subHeading}
									</PoppinsTypography>
								)}
								<PoppinsTypography
									variant='h3'
									fontSize={`28px`}
									fontWeight={600}
									sx={{ color: theme.palette.common.primaryGreyText }}
								>
									{props.heading}
								</PoppinsTypography>
							</Stack>
						</Toolbar>
					</AppBar>
				</HideOnScroll>
			)}
			<Container
				maxWidth='xs'
				sx={{
					paddingTop: 9,
					paddingBottom: 12,
					paddingX: 4,
					height: `calc(100% - ${theme.spacing(10)})`,
					overflow: 'auto',
				}}
			>
				{props.children}
			</Container>

			{props.fabButtonProps && (
				<Stack alignItems={'center'}>
					<Fab
						variant='extended'
						color='primary'
						sx={{ position: 'fixed', bottom: theme.spacing(11), gap: theme.spacing(1) }}
						onClick={props.fabButtonProps.onClick}
					>
						{props.fabButtonProps.content}
					</Fab>
				</Stack>
			)}

			{(props.bottonToolbar || props.controlButtonProps) && (
				<AppBar
					position='fixed'
					sx={{
						top: 'auto',
						bottom: 0,
						backgroundColor: props.bottonToolbar ? theme.palette.primary.main : 'white',
					}}
				>
					<Toolbar
						component={Container}
						maxWidth='xs'
						sx={{
							height: theme.spacing(10),
							'.MuiTabs-flexContainer': {
								justifyContent: 'space-around',
							},
							justifyContent: 'space-around',
						}}
					>
						{props.bottonToolbar && (
							<Tabs
								onChange={handleChange}
								sx={{ width: `100%`, justifyContent: 'space-around' }}
							>
								{TABS.map((t, index) => {
									return (
										<Tab
											key={index}
											icon={
												<IconFinder
													iconName={t.icon as IconType}
													iconProps={{
														fill: location.pathname.includes(t.match) ? 'white' : '#C8CBD9',
													}}
												/>
											}
											value={t.url}
											label={
												<PoppinsTypography
													variant='subtitle2'
													color={location.pathname.includes(t.match) ? 'white' : '#C8CBD9'}
													//	fontWeight={600}
												>
													{t.label}
												</PoppinsTypography>
											}
										/>
									);
								})}
							</Tabs>
						)}
						{props.controlButtonProps && (
							<LoadingButton
								variant='contained'
								size='large'
								color='primary'
								fullWidth
								onClick={props.controlButtonProps?.onClick}
								loading={props.controlButtonProps.loading}
								disabled={props.controlButtonProps.disabled}
								sx={{ width: 364, height: 56, alignSelf: 'center' }}
							>
								<PoppinsTypography
									variant='subtitle1'
									fontWeight={600}
								>
									{props.controlButtonProps?.content}
								</PoppinsTypography>
							</LoadingButton>
						)}
					</Toolbar>
				</AppBar>
			)}
		</>
	);
};
export default memo(SubAdminWrapper);

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
