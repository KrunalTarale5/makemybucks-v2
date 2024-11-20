import { Paper, Stack, SxProps, Theme, useTheme } from '@mui/material';
import { InterTypography, PoppinsTypography } from './Typography';
import { ReactNode, memo } from 'react';

interface CardsProps {
	heading: string | number;
	content: ReactNode | string | number;
	sx?: SxProps<Theme>;
	onClick?: () => void;
}

export const AdminCards = memo((props: CardsProps) => (
	<Paper
		sx={{
			width: 230,
			padding: 3,
			paddingY: 2,
			display: 'flex',
			gap: 2,
			flexDirection: 'column',
			boxShadow: `0px 10px 30px 0px #1126920D`,
			'&:hover': {
				boxShadow: `0px 2px 4px 0px #0000001F`,
			},
			borderColor: '#EFF5FF',
			borderWidth: '1px',
			borderStyle: 'solid',
			borderRadius: '8px',
			cursor: props.onClick ? 'pointer' : 'default',
			...props.sx,
		}}
		onClick={props.onClick}
	>
		<InterTypography
			variant='subtitle1'
			className='heading'
		>
			{props.heading}
		</InterTypography>
		<PoppinsTypography
			variant='h4'
			fontWeight={600}
			className='content'
		>
			{props.content}
		</PoppinsTypography>
	</Paper>
));

export const OwnerCards = memo((props: CardsProps) => (
	<Paper
		sx={{
			width: 250,
			padding: 4,
			paddingY: 3,
			display: 'flex',
			gap: 4,
			flexDirection: 'column',
			background: '#FAFBFF',
			borderWidth: '1px',
			borderStyle: 'solid',
			borderColor: '#E4E4F7',
			borderRadius: '16px',
			boxShadow: 'none',
			...props.sx,
		}}
		onClick={props.onClick}
	>
		<PoppinsTypography
			variant='subtitle1'
			className='heading'
			fontWeight={500}
		>
			{props.heading}
		</PoppinsTypography>
		<PoppinsTypography
			variant='h4'
			fontWeight={600}
		>
			{props.content}
		</PoppinsTypography>
	</Paper>
));

export const RestaurantCards = memo((props: CardsProps) => {
	const theme = useTheme();
	return (
		<Paper
			sx={{
				width: 400,
				padding: 3,
				paddingY: 2,
				display: 'flex',
				gap: `14px`,
				flexDirection: 'column',
				boxShadow: `none`,
				/* '&:hover': {
					boxShadow: `0px 2px 4px 0px #0000001F`,
				}, */
				backgroundColor: '#F4F4F8',
				borderColor: '#EFF5FF',
				borderWidth: '1px',
				borderStyle: 'solid',
				borderRadius: '16px',
				justifyContent: 'space-around',
				...props.sx,
			}}
		>
			<InterTypography
				variant='h6'
				className='heading'
				fontWeight={700}
				sx={{
					color: theme.palette.common.secondaryGreyText,
				}}
			>
				{props.heading}
			</InterTypography>
			<PoppinsTypography
				variant='h3'
				fontWeight={700}
				className='content'
			>
				{props.content}
			</PoppinsTypography>
		</Paper>
	);
});

export const RestaurantCardsOne = memo(
	(props: CardsProps & { subtitle: string | number; contenttwo: ReactNode | string | number }) => {
		const theme = useTheme();
		return (
			<Paper
				sx={{
					width: 400,
					padding: 3,
					paddingY: 2,
					display: 'flex',
					gap: 2,
					boxShadow: `none`,
					/* boxShadow: `0px 10px 30px 0px #1126920D`,
					'&:hover': {
						boxShadow: `0px 2px 4px 0px #0000001F`,
					}, */
					backgroundColor: '#F4F4F8',
					borderColor: '#EFF5FF',
					borderWidth: '1px',
					borderStyle: 'solid',
					borderRadius: '16px',
					flexFlow: 'column',
					justifyContent: 'space-around',
					...props.sx,
				}}
			>
				<Stack
					flexDirection={'row'}
					justifyContent={'space-between'}
				>
					<InterTypography
						variant='h6'
						className='heading'
						fontWeight={700}
						sx={{
							color: theme.palette.common.secondaryGreyText,
						}}
					>
						{props.heading}
					</InterTypography>
					<PoppinsTypography
						variant='h5'
						fontWeight={700}
						className='contenttwo'
					>
						{props.contenttwo}
					</PoppinsTypography>
				</Stack>
				<Stack>
					<PoppinsTypography
						variant='subtitle2'
						className='subtitle'
						sx={{
							color: theme.palette.common.secondaryGreyText,
						}}
					>
						{props.subtitle}
					</PoppinsTypography>
					<PoppinsTypography
						variant='h3'
						fontWeight={700}
						className='content'
					>
						{props.content}
					</PoppinsTypography>
				</Stack>
			</Paper>
		);
	}
);
export const RestaurantCardsTwo = memo(
	(props: {
		sx: SxProps<Theme> | undefined;
		subtitle: string | number;
		contenttwo: ReactNode | string | number;
	}) => {
		const theme = useTheme();
		return (
			<Paper
				sx={{
					width: 309,
					height: 96,
					padding: 3,
					paddingY: 2,
					display: 'flex',
					gap: 2,
					flexDirection: 'column',
					boxShadow: `none`,
					/* '&:hover': {
						boxShadow: `0px 2px 4px 0px #0000001F`,
					}, */
					backgroundColor: '#F4F4F8',
					borderColor: '#EFF5FF',
					borderWidth: '1px',
					borderStyle: 'solid',
					borderRadius: '16px',
					justifyContent: 'space-evenly',
					...props.sx,
				}}
			>
				<Stack
					flexDirection={'row'}
					justifyContent={'space-between'}
					className='wrapper'
				>
					<PoppinsTypography
						variant='subtitle2'
						className='subtitle'
						sx={{
							color: theme.palette.common.secondaryGreyText,
						}}
					>
						{props.subtitle}
					</PoppinsTypography>
					<PoppinsTypography
						variant='h5'
						fontWeight={700}
						className='contenttwo'
					>
						{props.contenttwo}
					</PoppinsTypography>
				</Stack>
			</Paper>
		);
	}
);

export const SuAdminSquareCards = memo((props: CardsProps) => {
	const theme = useTheme();
	return (
		<Paper
			elevation={1}
			sx={{
				padding: 3,
				paddingTop: 4,
				textAlign: 'center',
				display: 'flex',
				gap: 2,
				flexDirection: 'column',
				width: '100%',
			}}
		>
			<PoppinsTypography
				variant='h3'
				fontWeight={600}
				sx={{ color: theme.palette.common.primaryGreyText }}
			>
				{props.heading}
			</PoppinsTypography>
			<PoppinsTypography
				variant='subtitle2'
				sx={{ color: theme.palette.common.secondaryGreyText }}
			>
				{props.content}
			</PoppinsTypography>
		</Paper>
	);
});

export const SuAdminOutLineCards = memo((props: CardsProps) => {
	const theme = useTheme();
	return (
		<Paper
			variant='outlined'
			sx={{
				padding: 2.1,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				...props.sx,
			}}
		>
			<PoppinsTypography
				variant='body1'
				sx={{ color: theme.palette.common.secondaryGreyText }}
			>
				{props.heading}
			</PoppinsTypography>
			<PoppinsTypography
				variant='h5'
				fontWeight={600}
				sx={{ color: theme.palette.common.primaryGreyText }}
			>
				{props.content}
			</PoppinsTypography>
		</Paper>
	);
});

export const SuAdminDetailsCards = memo((props: { children?: ReactNode }) => {
	return (
		<Paper sx={{ padding: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>
			{props.children}
		</Paper>
	);
});
