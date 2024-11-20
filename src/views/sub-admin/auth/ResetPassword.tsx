import { useAlertDialog } from '@components/AlertDialog';
import AuthWrapper from '@components/AuthWrapper';
import IconFinder from '@components/Icon';
import InputField, { InputFieldValue } from '@components/InputField';
import { PoppinsTypography } from '@components/Typography';
import {
	ResetPasswordFormFields,
	ResetPasswordRequest,
	useResetPasswordApi,
	validateResetPasswodForm,
	validateResetPasswordFields,
} from '@hooks/sub-admin-resetpassword';
import { FormErrorMessage } from '@interfaces/common';
import { LoadingButton } from '@mui/lab';
import { Stack, useTheme } from '@mui/material';
import { memo, useState } from 'react';
import SuccessPage from 'views/admin/auth/SuccessPage';

const intialFormData: ResetPasswordRequest = {
	subadmin_email: '',
	//captcha: '',
};

const intialFormError: FormErrorMessage<ResetPasswordRequest> = {
	subadmin_email: '',
	//captcha: '',
};

const ResetPassword = () => {
	const theme = useTheme();
	const { showAlertDialog, hideAlertDialog } = useAlertDialog();
	const ResetPasswordApi = useResetPasswordApi();

	const [formData, setFormData] = useState(intialFormData);
	const [formError, setFormError] = useState(intialFormError);

	const onChange = (fieldName: string, value: InputFieldValue) => {
		const _formData = { ...formData, [fieldName]: value };
		setFormData(_formData);
		setFormError({
			...formError,
			[fieldName]: validateResetPasswordFields(fieldName as keyof ResetPasswordRequest, _formData),
		});
	};

	const handleResetPassword = () => {
		const validatation = validateResetPasswodForm(formData);
		if (validatation.hasError) {
			setFormError(validatation.errors);
			return;
		}

		ResetPasswordApi.mutateAsync({ request: formData })
			.then((success) => {
				showAlertDialog({
					content: (
						<PoppinsTypography variant='subtitle2'>{success.data?.message}</PoppinsTypography>
					),
					buttons: [
						{
							children: 'ok',
							variant: 'outlined',
							callback: () => {
								hideAlertDialog();
							},
						},
					],
				});
			})
			.catch((error) => {
				showAlertDialog({
					content: (
						<PoppinsTypography variant='subtitle2'>
							{error?.response?.data?.message}
						</PoppinsTypography>
					),
					buttons: [
						{
							children: 'ok',
							variant: 'outlined',
							callback: () => {
								hideAlertDialog();
							},
						},
					],
				});
			});
	};

	return (
		<AuthWrapper isAppbar>
			<Stack
				alignItems={'center'}
				width={`100%`}
			>
				<Stack
					alignItems={'center'}
					gap={8}
					width={`303px`}
				>
					<Stack
						alignItems={'center'}
						gap={1}
					>
						<IconFinder iconName='MobileLoginLogo' />
						<PoppinsTypography
							variant='subtitle1'
							sx={{ color: theme.palette.common.text1 }}
						>
							Sub Admin Login
						</PoppinsTypography>
					</Stack>

					<Stack
						gap={2}
						width={`100%`}
					>
						<PoppinsTypography
							variant='subtitle2'
							textTransform={'uppercase'}
							sx={{ color: 'white' }}
						>
							Reset Password
						</PoppinsTypography>

						{Object.entries(ResetPasswordFormFields).map((v) => {
							const fieldName: keyof ResetPasswordFormFields =
								v[0] as keyof ResetPasswordFormFields;
							const fieldProps = v[1];

							return (
								<InputField
									showLabel={false}
									fieldName={fieldName}
									value={(formData[fieldName] as InputFieldValue) ?? ''}
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
												borderRadius: `4px`,
											},
											'& .MuiInputBase-input': {
												color: `white`,
												height: 31,
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
				</Stack>
				<LoadingButton
					variant='contained'
					size='large'
					color='secondary'
					fullWidth
					onClick={handleResetPassword}
					loading={ResetPasswordApi.isLoading}
					sx={{ borderRadius: `4px`, width: 303, position: 'fixed', bottom: 40 }}
				>
					<PoppinsTypography
						variant='subtitle2'
						fontWeight={600}
					>
						Submit
					</PoppinsTypography>
				</LoadingButton>
			</Stack>
		</AuthWrapper>
	);
};

export default memo(ResetPassword);
