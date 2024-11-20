import InputField, { InputFieldValue } from '@components/InputField';
import { PoppinsTypography } from '@components/Typography';
import {
	QrCodeFields,
	QrCodeRequest,
	useReceiveQRApi,
	validateQrCodeForm,
} from '@hooks/admin-qrcode';
import { FormErrorMessage } from '@interfaces/common';
import { LoadingButton } from '@mui/lab';
import { Stack, useTheme } from '@mui/material';
import { FC, memo, useState } from 'react';
import { useSnackbar } from '@components/Snackbar';

const intialFormData: QrCodeRequest = {
	number: '',
};
const intialFormError: FormErrorMessage<QrCodeRequest> = {
	number: '',
};

interface QrPlacardProps {
	refetch: () => void;
}
const QrPlacard: FC<QrPlacardProps> = (props) => {
	const theme = useTheme();
	const { showSnackbar, hideSnackbar } = useSnackbar();

	const ReceiveQRApi = useReceiveQRApi();

	const [formData, setFormData] = useState(intialFormData);
	const [formError, setFormError] = useState(intialFormError);

	const onChange = (fieldName: string, value: InputFieldValue) => {
		const _formData = { ...formData, [fieldName]: value };
		setFormData(_formData);
		setFormError({
			...formError,
			[fieldName]: QrCodeFields(fieldName as keyof QrCodeRequest, _formData),
		});
	};
	const handleClick = () => {
		const validatation = validateQrCodeForm(formData);
		if (validatation.hasError) {
			setFormError(validatation.errors);
			return;
		}
		ReceiveQRApi.mutateAsync({
			request: {
				number: formData.number as number,
			},
		})
			.then((response) => {
				setFormData(intialFormData);
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
				props.refetch();
			})
			.catch((error) => {
				showSnackbar({
					title: 'Error!',
					variant: 'error',
					content: error.response?.data?.message,
					onCancel: () => hideSnackbar(),
				});
			});
	};

	return (
		<Stack>
			<PoppinsTypography
				variant='subtitle1'
				sx={{ color: theme.palette.common.secondaryGreyText }}
			>
				Enter Number
			</PoppinsTypography>
			<Stack gap={8}>
				<InputField
					showLabel={false}
					fieldName={'number'}
					value={formData.number as string}
					fieldProps={{
						placeholder: 'Type the number of qr received',
						size: 'medium',
						error: Boolean(formError['number']),
						helperText: formError['number'],
						sx: {
							'& .MuiOutlinedInput-notchedOutline': {
								borderColor: theme.palette.common.secondaryGreyText,
								borderRadius: `8px`,
								minWidth: `114px`,
							},
							'& .MuiInputBase-input': {
								height: 11,
							},
							'& .MuiInputBase-root': {
								width: '30%',
							},
						},
					}}
					onChange={onChange}
				/>

				<LoadingButton
					size='large'
					variant='contained'
					color='primary'
					sx={{
						width: 209,
						height: 51,
						borderRadius: '8px',
					}}
					onClick={handleClick}
					disabled={formData === intialFormData}
					loading={ReceiveQRApi.isLoading}
				>
					<PoppinsTypography variant='subtitle1'>Accept</PoppinsTypography>
				</LoadingButton>
			</Stack>
		</Stack>
	);
};

export default memo(QrPlacard);
