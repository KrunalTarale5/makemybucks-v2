import { Stack, TextField } from '@mui/material';
import { FC } from 'react';

export const OTPFormData: { [key: number]: number | string } = {};

interface OTPFieldProps {
	otp: typeof OTPFormData;
	onEnter?: (otp: typeof OTPFormData) => void;
	setOtp: (value: React.SetStateAction<typeof OTPFormData>) => void;
}
const OTPField: FC<OTPFieldProps> = (props) => {
	const onInputChange =
		(number: number) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			if (event.target.value?.trim() === '') {
				props.setOtp({
					...props.otp,
					[number]: '',
				});
				document.getElementById(`otp-erify-${number - 1}`)?.focus();
			} else if (!isNaN(Number(event.target.value))) {
				if (event.target.value?.trim().length === 1) {
					props.setOtp({
						...props.otp,
						[number]: Number(event.target.value),
					});
					document.getElementById(`otp-erify-${number + 1}`)?.focus();
				}
			}
		};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter') {
			if (Object.keys(props.otp).length === 6) props.onEnter?.(props.otp);
		}
	};

	return (
		<Stack
			gap={1}
			flexDirection={'row'}
			alignSelf={'center'}
		>
			{Array.from(Array(6).keys()).flatMap((v, i) => (
				<TextField
					id={`otp-erify-${i}`}
					variant='outlined'
					color='primary'
					autoComplete='off'
					name='usename'
					type={'text'}
					inputMode='numeric'
					onChange={onInputChange(i)}
					value={props.otp[i] ?? ''}
					sx={{
						'.MuiInputBase-input': {
							textAlign: 'center',
							paddingY: 3,
							fontSize: 35,
							paddingX: 0,
						},
						'.MuiInputBase-root': {
							height: 68,
							fontFamily: 'Fira Sans',
						},
						'& .MuiOutlinedInput-notchedOutline': { borderRadius: `12px` },
					}}
					inputProps={{
						inputMode: 'numeric',
					}}
					onKeyDown={handleKeyDown}
				/>
			))}
		</Stack>
	);
};

export default OTPField;
