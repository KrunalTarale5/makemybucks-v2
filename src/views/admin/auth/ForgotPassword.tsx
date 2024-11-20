import { memo, useState } from 'react';
import { Button, Stack } from '@mui/material';
import AuthWrapper from '../../../@components/AuthWrapper';
import IconFinder from '@components/Icon';
import { InterTypography } from '@components/Typography';
import InputField, { InputFieldValue } from '@components/InputField';
import { useSnackbar } from '@components/Snackbar';
import {
	ForgotPasswordFormFields,
	ForgotPasswordRequest,
	useForgotPasswordApi,
	validateForgotPasswordFields,
	validateForgotPasswordForm,
} from '@hooks/admin-forgot-password';
import { FormErrorMessage } from '@interfaces/common';
import SuccessPage from './SuccessPage';

const initialFormData: ForgotPasswordRequest = {
	admin_user_id: '',
	admin_email: '',
	// captcha: '',
};

const intialFormError: FormErrorMessage<ForgotPasswordRequest> = {
	admin_user_id: '',
	admin_email: '',
	// captcha: '',
};

const ForgotPassword = () => {
	const { showSnackbar, hideSnackbar } = useSnackbar();
	const ForgotPasswordApi = useForgotPasswordApi();

	const [formData, setFormData] = useState(initialFormData);
	const [formError, setFormError] = useState(intialFormError);

	const onChange = (fieldName: string, value: InputFieldValue) => {
		const _formData = { ...formData, [fieldName]: value };
		setFormData(_formData);
		setFormError({
			...formError,
			[fieldName]: validateForgotPasswordFields(
				fieldName as keyof ForgotPasswordRequest,
				_formData
			),
		});
	};

	const handleForgot = () => {
		const validatation = validateForgotPasswordForm(formData);
		if (validatation.hasError) {
			setFormError(validatation.errors);
			return;
		}
		ForgotPasswordApi.mutateAsync({ request: formData }).catch((error) => {
			showSnackbar({
				title: 'Error!',
				variant: 'error',
				content: error.response?.data?.message,
				onCancel: () => hideSnackbar(),
			});
		});
	};

	return ForgotPasswordApi.isSuccess ? (
		<SuccessPage
			message={
				'Password Reset Link Sent to Regeared Email ID. Please Re-set Password Within 48 Hours.'
			}
		/>
	) : (
		<AuthWrapper backgroundImage={true}>
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
						Forgot Password
					</InterTypography>

					<InterTypography
						variant='subtitle1'
						color={'white'}
					>
						Enter your Details and we’ll send you an email with instructions to reset your password.
					</InterTypography>
				</Stack>
				<Stack
					gap={4}
					width={`70%`}
					alignItems={'center'}
				>
					<Stack
						gap={2}
						width={'100%'}
					>
						{Object.entries(ForgotPasswordFormFields).map((v) => {
							const fieldName: keyof ForgotPasswordFormFields =
								v[0] as keyof ForgotPasswordFormFields;
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
						sx={{ height: `66px` }}
						onClick={handleForgot}
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
	);
};

export default memo(ForgotPassword);
