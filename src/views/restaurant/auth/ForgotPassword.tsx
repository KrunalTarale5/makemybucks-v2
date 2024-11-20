import InputField, { InputFieldValue } from '@components/InputField';
import RestaurentAuthWrapper from '@components/RestaurentAuthWrapper';
import { useSnackbar } from '@components/Snackbar';
import { PoppinsTypography } from '@components/Typography';
import {
	RestaurantForgotFields,
	RestaurantForgotRequest,
	useRestaurantForgotApi,
	validateRestaurantForgotForm,
} from '@hooks/restaurant-forgot-password';
import { FormErrorMessage } from '@interfaces/common';
import { LoadingButton } from '@mui/lab';
import { Stack, useTheme } from '@mui/material';
import { memo, useState } from 'react';

const intialFormData: RestaurantForgotRequest = {
	owner_email: '',
};
const intialFormError: FormErrorMessage<RestaurantForgotRequest> = {
	owner_email: '',
};

const ForgotPassword = () => {
	const RestaurantForgotApi = useRestaurantForgotApi();
	const theme = useTheme();
	const { showSnackbar, hideSnackbar } = useSnackbar();

	const [formData, setFormData] = useState(intialFormData);
	const [formError, setFormError] = useState(intialFormError);

	const onChange = (fieldName: string, value: InputFieldValue) => {
		const _formData = { ...formData, [fieldName]: value };
		setFormData(_formData);
		setFormError({
			...formError,
			[fieldName]: RestaurantForgotFields(fieldName as keyof RestaurantForgotRequest, _formData),
		});
	};
	const handleLogin = () => {
		const validatation = validateRestaurantForgotForm(formData);
		if (validatation.hasError) {
			setFormError(validatation.errors);
			return;
		}
		void RestaurantForgotApi.mutateAsync({ request: formData })
			.then((response) => {
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
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
		<RestaurentAuthWrapper>
			<Stack gap={8}>
				<Stack>
					<PoppinsTypography
						variant='h5'
						sx={{ color: '#727198' }}
					>
						Re-Set Your Password.
					</PoppinsTypography>
				</Stack>
				<InputField
					fieldName={'owner_email'}
					value={formData.owner_email}
					fieldProps={{
						variant: 'standard',
						size: 'medium',
						placeholder: 'Enter registered email id',
						error: Boolean(formError['owner_email']),
						helperText: formError['owner_email'],
						sx: {
							'.MuiInputBase-input': {
								fontSize: '22px',
								color: theme.palette.common.primaryGreyText,
								fontFamily: 'inter',
							},
						},
					}}
					onChange={onChange}
				></InputField>
				<LoadingButton
					variant='contained'
					size='large'
					color='primary'
					fullWidth
					onClick={handleLogin}
					loading={RestaurantForgotApi.isLoading}
					sx={{ borderRadius: `16px`, height: '68px', marginTop: '25px' }}
				>
					<PoppinsTypography variant='h5'>Send reset Link</PoppinsTypography>
				</LoadingButton>
			</Stack>
		</RestaurentAuthWrapper>
	);
};

export default memo(ForgotPassword);
