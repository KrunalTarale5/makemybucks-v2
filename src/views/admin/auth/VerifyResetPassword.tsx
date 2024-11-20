import AuthWrapper from '../../../@components/AuthWrapper';
import { Button, Stack } from '@mui/material';
import IconFinder from '@components/Icon';
import { InterTypography } from '@components/Typography';
import { useState } from 'react';
import {
	VerifyResetPasswordFields,
	VerifyResetPasswordRequest,
	useVerifyPasswordApi,
	validateVerifyResetPasswordFields,
	validateVerifyResetPasswordForm,
} from '@hooks/admin-verify-reset-password';
import InputField, { InputFieldValue } from '@components/InputField';
import { FormErrorMessage } from '@interfaces/common';
import SuccessPage from './SuccessPage';
import { useSearchParams } from 'react-router-dom';
import { useSnackbar } from '@components/Snackbar';

const intialFormData: VerifyResetPasswordRequest = {
	new_password: '',
	confirm_password: '',
};

const intialFormError: FormErrorMessage<VerifyResetPasswordRequest> = {
	new_password: '',
	confirm_password: '',
};

const VerifyResetPassword = () => {
	const { showSnackbar, hideSnackbar } = useSnackbar();
	const [searchParams] = useSearchParams();
	const VerifyPasswordApi = useVerifyPasswordApi();

	const [formData, setFormData] = useState(intialFormData);
	const [formError, setFormError] = useState(intialFormError);

	const onChange = (fieldName: string, value: InputFieldValue) => {
		const _formData = { ...formData, [fieldName]: value };
		setFormData(_formData);
		setFormError({
			...formError,
			[fieldName]: validateVerifyResetPasswordFields(
				fieldName as keyof VerifyResetPasswordRequest,
				_formData
			),
		});
	};

	const handleLogin = () => {
		const validatation = validateVerifyResetPasswordForm(formData);
		if (validatation.hasError) {
			setFormError(validatation.errors);
			return;
		}
		VerifyPasswordApi.mutateAsync({
			request: { ...formData, otp: searchParams?.get('key') as string },
		}).catch((error) => {
			showSnackbar({
				title: 'Error!',
				variant: 'error',
				content: error.response?.data?.message,
				onCancel: () => hideSnackbar(),
			});
		});
	};

	return (
		<>
			{VerifyPasswordApi.isSuccess ? (
				<SuccessPage message={'Password reset successfully'} />
			) : (
				<AuthWrapper backgroundImage>
					<Stack
						alignItems={'center'}
						gap={5}
					>
						<IconFinder iconName='DesktopResetLogo' />
						<Stack
							gap={2}
							width={`100%`}
							alignItems={'center'}
						>
							<InterTypography
								variant='h4'
								color={'white'}
							>
								Reset Password
							</InterTypography>
							<InterTypography
								variant='subtitle1'
								color={'white'}
							>
								Enter your Details and we’ll send you an email with instructions to reset your
								password.
							</InterTypography>
						</Stack>
						<Stack
							gap={4}
							width={`70%`}
							alignItems={'center'}
						>
							<Stack
								gap={2}
								width={`100%`}
							>
								{Object.entries(VerifyResetPasswordFields).map((v) => {
									const fieldName: keyof VerifyResetPasswordFields =
										v[0] as keyof VerifyResetPasswordFields;
									const fieldProps = v[1];

									return (
										<InputField
											fieldName={fieldName}
											value={formData[fieldName] as InputFieldValue}
											key={fieldName}
											fieldProps={{
												...fieldProps,
												color: 'secondary',
												fullWidth: true,
												sx: {
													'.MuiTypography-subtitle1': {
														color: `white`,
														fontFamily: 'inter',
													},
													'& .MuiOutlinedInput-notchedOutline': {
														color: `white`,
														borderColor: `white !important`,
													},

													'& .MuiInputBase-input': {
														color: `white`,
														height: 27,
													},
												},
												error: Boolean(formError[fieldName]),
												helperText: formError[fieldName],
											}}
											fieldType={fieldProps.fieldType}
											onChange={onChange}
										/>
									);
								})}
							</Stack>
							<Button
								variant='contained'
								size='large'
								color='ternary'
								fullWidth
								onClick={handleLogin}
								sx={{ height: `66px` }}
							>
								<InterTypography
									variant='h5'
									fontWeight={600}
								>
									Submit
								</InterTypography>
							</Button>
						</Stack>
					</Stack>
				</AuthWrapper>
			)}
		</>
	);
};

export default VerifyResetPassword;
