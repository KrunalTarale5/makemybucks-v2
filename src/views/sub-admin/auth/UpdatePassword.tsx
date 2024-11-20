import { useAlertDialog } from '@components/AlertDialog';
import AuthWrapper from '@components/AuthWrapper';
import IconFinder from '@components/Icon';
import InputField, { InputFieldValue } from '@components/InputField';
import { PoppinsTypography } from '@components/Typography';
import {
	UpdatePasswordFormFields,
	UpdatePasswordRequest,
	useUpdatePasswordApi,
	validateLoginForm,
	validateRePasswordFields,
} from '@hooks/sub-admin-updatepassword';
import { FormErrorMessage } from '@interfaces/common';
import { LoadingButton } from '@mui/lab';
import { Stack, useTheme } from '@mui/material';
import { memo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const intialFormData: UpdatePasswordRequest = {
	new_password: '',
	confirm_password: '',
};

const intialFormError: FormErrorMessage<UpdatePasswordRequest> = {
	new_password: '',
	confirm_password: '',
};

const UpdatePassword = () => {
	const theme = useTheme();

	const { showAlertDialog, hideAlertDialog } = useAlertDialog();

	const [searchParams] = useSearchParams();

	const UpdatePasswordApi = useUpdatePasswordApi();

	const [formData, setFormData] = useState(intialFormData);
	const [formError, setFormError] = useState(intialFormError);

	const onChange = (fieldName: string, value: InputFieldValue) => {
		const _formData = { ...formData, [fieldName]: value };
		setFormData(_formData);
		setFormError({
			...formError,
			[fieldName]: validateRePasswordFields(fieldName as keyof UpdatePasswordRequest, _formData),
		});
	};

	const handleUpdatePassword = () => {
		const validatation = validateLoginForm(formData);
		if (validatation.hasError) {
			setFormError(validatation.errors);
			return;
		}

		UpdatePasswordApi.mutateAsync({
			request: { ...formData, otp: searchParams?.get('key') as string },
		})
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
							update password
						</PoppinsTypography>

						{Object.entries(UpdatePasswordFormFields).map((v) => {
							const fieldName: keyof UpdatePasswordFormFields =
								v[0] as keyof UpdatePasswordFormFields;
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
			</Stack>
			<LoadingButton
				variant='contained'
				size='large'
				color='secondary'
				fullWidth
				onClick={handleUpdatePassword}
				loading={UpdatePasswordApi.isLoading}
				sx={{ borderRadius: `4px`, width: 303, position: 'fixed', bottom: 40 }}
			>
				<PoppinsTypography
					variant='subtitle2'
					fontWeight={600}
				>
					Save
				</PoppinsTypography>
			</LoadingButton>
		</AuthWrapper>
	);
};

export default memo(UpdatePassword);
