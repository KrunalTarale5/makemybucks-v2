import InputField, { InputFieldValue } from '@components/InputField';
import RestaurentAuthWrapper from '@components/RestaurentAuthWrapper';
import { useSnackbar } from '@components/Snackbar';
import { PoppinsTypography } from '@components/Typography';
import {
	CreateNewPasswordFormFields,
	CreateNewPasswordRequest,
	useCreateNewPasswordApi,
	validateCreateNewPasswordFields,
	validateCreateNewPasswordForm,
} from '@hooks/restaurant-new-password';
import { FormErrorMessage } from '@interfaces/common';
import { LoadingButton } from '@mui/lab';
import { Stack, useTheme } from '@mui/material';
import { memo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
const intialFormData: CreateNewPasswordRequest = {
	new_password: '',
	confirm_password: '',
};

const intialFormError: FormErrorMessage<CreateNewPasswordRequest> = {
	new_password: '',
	confirm_password: '',
};

function CreateNewPassword() {
	const CreateNewPasswordApi = useCreateNewPasswordApi();
	const theme = useTheme();
	const [searchParams] = useSearchParams();
	const { showSnackbar, hideSnackbar } = useSnackbar();
	const [formData, setFormData] = useState(intialFormData);
	const [formError, setFormError] = useState(intialFormError);
	const onChange = (fieldName: string, value: InputFieldValue) => {
		const _formData = { ...formData, [fieldName]: value };
		setFormData(_formData);
		setFormError({
			...formError,
			[fieldName]: validateCreateNewPasswordFields(
				fieldName as keyof CreateNewPasswordRequest,
				_formData
			),
		});
	};
	const handleLogin = () => {
		const validatation = validateCreateNewPasswordForm(formData);
		if (validatation.hasError) {
			setFormError(validatation.errors);
			return;
		}
		void CreateNewPasswordApi.mutateAsync({
			request: { ...formData, key: searchParams?.get('key') as string },
		})
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
			<Stack gap={4}>
				<Stack>
					<PoppinsTypography
						variant='h5'
						sx={{ color: '#727198' }}
					>
						Create New Password
					</PoppinsTypography>
				</Stack>
				<Stack
					gap={5}
					width={`100%`}
					paddingTop={'60px'}
				>
					{Object.entries(CreateNewPasswordFormFields).map((v) => {
						const fieldName: keyof CreateNewPasswordFormFields =
							v[0] as keyof CreateNewPasswordFormFields;
						const fieldProps = v[1];

						return (
							<InputField
								showLabel={true}
								fieldName={fieldName}
								value={(formData[fieldName] as InputFieldValue) ?? ''}
								key={fieldName}
								fieldProps={{
									...fieldProps,
									variant: 'standard',
									color: 'primary',
									fullWidth: true,
									sx: {
										'.MuiInputBase-input': {
											fontSize: '22px',
											color: theme.palette.common.primaryGreyText,
											fontFamily: 'inter',
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
					<LoadingButton
						variant='contained'
						size='large'
						color='primary'
						fullWidth
						onClick={handleLogin}
						sx={{ borderRadius: `16px`, height: '68px', marginTop: '25px' }}
						loading={CreateNewPasswordApi.isLoading}
					>
						<PoppinsTypography variant='h5'>Save </PoppinsTypography>
					</LoadingButton>
				</Stack>
			</Stack>
		</RestaurentAuthWrapper>
	);
}

export default memo(CreateNewPassword);
