import { memo, useState } from 'react';
import AuthWrapper from '@components/AuthWrapper';
import { Alert, Button, Collapse, Stack, useTheme } from '@mui/material';
import IconFinder from '@components/Icon';
import InputField, { InputFieldValue } from '@components/InputField';
import { PoppinsTypography } from '@components/Typography';
import { FormErrorMessage } from '@interfaces/common';
import {
	LoginFormFields,
	LoginRequest,
	useLoginApi,
	validateLoginFields,
	validateLoginForm,
} from '@hooks/sub-admin-login';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setBannerInfo, setToken, setUserInfo } from '_store/actions/ui-actions';
import { LoadingButton } from '@mui/lab';

const intialFormData: LoginRequest = {
	subadmin_email: '',
	subadmin_password: '',
};

const intialFormError: FormErrorMessage<LoginRequest> = {
	subadmin_email: '',
	subadmin_password: '',
};

const Login = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [formData, setFormData] = useState(intialFormData);
	const [formError, setFormError] = useState(intialFormError);

	const LoginApi = useLoginApi();

	const onChange = (fieldName: string, value: InputFieldValue) => {
		const _formData = { ...formData, [fieldName]: value };
		setFormData(_formData);
		setFormError({
			...formError,
			[fieldName]: validateLoginFields(fieldName as keyof LoginRequest, _formData),
		});
	};

	const handleLogin = () => {
		const validatation = validateLoginForm(formData);
		if (validatation.hasError) {
			setFormError(validatation.errors);
			return;
		}
		void LoginApi.mutateAsync({ request: formData }).then((response) => {
			navigate('/sub-admin/restaurants/dashboard');
			dispatch(setToken(response.data.access_token));
			dispatch(
				setUserInfo({
					id: response.data.user_data?.subadmin_user_id,
					name: `${response.data.user_data?.subadmin_firstname} ${response.data.user_data?.subadmin_lastname}`,
					avatar: response.data.user_data?.profile_pic,
					email: response.data.user_data.email,
					mobile_no: response.data.user_data.mobile_no,
				})
			);
			dispatch(setBannerInfo(null));
		});
	};
	const handleResetPassword = () => {
		navigate(`/sub-admin/reset-password`);
	};
	return (
		<AuthWrapper sx={{ flexDirection: 'column' }}>
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
							variant='body1'
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
							sx={{ color: 'white' }}
						>
							ENTER YOUR DETAILS
						</PoppinsTypography>
						{Object.entries(LoginFormFields).map((v) => {
							const fieldName: keyof LoginFormFields = v[0] as keyof LoginFormFields;
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

					<Stack
						alignItems={'center'}
						width={`100%`}
						gap={2}
					>
						<LoadingButton
							variant='contained'
							size='large'
							color='secondary'
							fullWidth
							onClick={handleLogin}
							loading={LoginApi.isLoading}
							sx={{ borderRadius: `4px` }}
						>
							<PoppinsTypography
								variant='body1'
								fontWeight={600}
							>
								Submit
							</PoppinsTypography>
						</LoadingButton>
						<Button
							variant='text'
							size='small'
							color='secondary'
							onClick={handleResetPassword}
						>
							<PoppinsTypography
								variant='subtitle2'
								color={'white'}
							>
								Reset Password?
							</PoppinsTypography>
						</Button>
					</Stack>
				</Stack>
			</Stack>
			<Collapse
				in={LoginApi.isError}
				unmountOnExit
				sx={{ position: 'fixed', bottom: 0, width: `100%` }}
			>
				<Alert
					variant='standard'
					severity='error'
					icon={<IconFinder iconName='WarningDanger' />}
					sx={{
						background: 'white',
						fontFamily: `inter`,
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					{(LoginApi?.error as any)?.response?.data?.message}
				</Alert>
			</Collapse>
		</AuthWrapper>
	);
};

export default memo(Login);
