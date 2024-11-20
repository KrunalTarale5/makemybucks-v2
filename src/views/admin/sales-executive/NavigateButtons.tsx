import { PoppinsTypography } from '@components/Typography';
import { LoadingButton } from '@mui/lab';
import { Stack, useTheme } from '@mui/material';
import { FC, memo } from 'react';

interface NavigateButtonsProps {
	loading?: boolean;
	onNextClick?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
	onPreviousClick?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
	onCreateClick?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
	onUpdateClick?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}

const NavigateButtons: FC<NavigateButtonsProps> = (props) => {
	const theme = useTheme();

	return (
		<Stack
			flexDirection={'row'}
			gap={2}
		>
			{props.onPreviousClick && (
				<LoadingButton
					variant='outlined'
					size='large'
					sx={{ width: 196 }}
					onClick={props.onPreviousClick}
				>
					<PoppinsTypography
						fontSize={18}
						sx={{ color: theme.palette.common.primaryGreyText }}
					>
						Previous
					</PoppinsTypography>
				</LoadingButton>
			)}

			{props.onNextClick && (
				<LoadingButton
					loading={props.loading}
					variant='contained'
					size='large'
					sx={{ width: 196 }}
					onClick={props.onNextClick}
				>
					<PoppinsTypography fontSize={18}>Next</PoppinsTypography>
				</LoadingButton>
			)}

			{props.onCreateClick && (
				<LoadingButton
					loading={props.loading}
					variant='contained'
					size='large'
					sx={{ width: 196 }}
					onClick={props.onCreateClick}
				>
					<PoppinsTypography fontSize={18}>Create</PoppinsTypography>
				</LoadingButton>
			)}

			{props.onUpdateClick && (
				<LoadingButton
					loading={props.loading}
					variant='contained'
					size='large'
					sx={{ width: 196 }}
					onClick={props.onUpdateClick}
				>
					<PoppinsTypography fontSize={18}>Update</PoppinsTypography>
				</LoadingButton>
			)}
		</Stack>
	);
};
export default memo(NavigateButtons);
