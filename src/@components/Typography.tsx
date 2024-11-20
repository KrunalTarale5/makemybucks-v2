import { TypographyProps, Typography } from '@mui/material';

type TypographyProps_ = Omit<TypographyProps, 'fontFamily'>;

export const InterTypography = (props: TypographyProps_) => (
	<Typography
		{...props}
		sx={{ ...(props.variant === 'subtitle1' && { letterSpacing: 1 }), ...props.sx }}
		fontFamily={'Inter'}
	/>
);

export const PoppinsTypography = (props: TypographyProps_) => (
	<Typography
		{...props}
		fontFamily={'Poppins'}
	/>
);
export const FiraSansTypography = (props: TypographyProps_) => (
	<Typography
		{...props}
		fontFamily={'Fira Sans'}
	/>
);
