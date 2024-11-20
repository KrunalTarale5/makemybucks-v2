import { Button, Stack, Checkbox, FormControlLabel, Alert, Collapse } from '@mui/material';
import IconFinder from '@components/Icon';
import InputField, { InputFieldValue } from '@components/InputField';
import { InterTypography } from '@components/Typography';
import {
	LoginFormFields,
	LoginRequest,
	useLoginApi,
	validateLoginFields,
	validateLoginForm,
} from '@hooks/admin-login';
import { FormErrorMessage } from '@interfaces/common';
import { memo, useEffect, useState } from 'react';
import AuthWrapper from '../../../@components/AuthWrapper';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setUserInfo } from '_store/actions/ui-actions';
import { RootState } from '_store/reducers';
import { LoadingButton } from '@mui/lab';

const intialFormData: LoginRequest = {
	admin_user_id: '',
	admin_password: '',
	//captcha: '',
};

const intialFormError: FormErrorMessage<LoginRequest> = {
	admin_user_id: '',
	admin_password: '',
	//captcha: '',
};

const Login = () => {
	const { userInfo, token } = useSelector((state: RootState) => state.richPenny);
	const [formData, setFormData] = useState(intialFormData);
	const [formError, setFormError] = useState(intialFormError);

	const LoginApi = useLoginApi();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();

	useEffect(() => {
		if (userInfo && token && location.pathname === '/admin/login') {
			navigate('/admin/home', { replace: true });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.pathname]);

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
			navigate(`/admin/home`, { replace: true });
			dispatch(setToken(response.data.access_token));
			dispatch(
				setUserInfo({
					id: response.data.user_data?.admin_user_id,
					name: response.data.user_data?.admin_name,
					avatar: response.data.user_data?.admin_profile,
					email: response.data.user_data.email,
					mobile_no: response.data.user_data.mobile_no,
				})
			);
		});
	};

	const handleForgetPassword = () => {
		navigate(`/admin/forgot-password`);
	};

	return (
		<AuthWrapper backgroundImage>
			<Stack
				alignItems={'center'}
				gap={5}
			>
				<IconFinder iconName='DesktopResetLogo' />
				<Collapse
					in={LoginApi.isError}
					unmountOnExit
				>
					<Alert
						variant='standard'
						severity='error'
						icon={<IconFinder iconName='WarningDanger' />}
						sx={{ fontFamily: `inter`, alignItems: 'center' }}
					>
						Incorrect User ID or Password. Try Again!
					</Alert>
				</Collapse>
				<Stack
					gap={4}
					width={`100%`}
					alignItems={'center'}
				>
					<InterTypography
						variant='h4'
						color={'white'}
					>
						Admin Dashboard Login
					</InterTypography>
					<Stack
						gap={2}
						width={`100%`}
					>
						{Object.entries(LoginFormFields).map((v) => {
							const fieldName: keyof LoginFormFields = v[0] as keyof LoginFormFields;
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

						<Stack
							flexDirection={'row'}
							justifyContent={'space-between'}
							alignItems={'center'}
						>
							<FormControlLabel
								control={
									<Checkbox
										sx={{
											color: 'white !important',
										}}
									/>
								}
								label={
									<InterTypography
										color={'white'}
										variant='body2'
									>
										Remember me?
									</InterTypography>
								}
							/>
							<Button
								variant='text'
								size='small'
								color='ternary'
								sx={{ height: 'fit-content' }}
								onClick={handleForgetPassword}
							>
								<InterTypography variant='body2'>Forgot Password?</InterTypography>
							</Button>
						</Stack>
					</Stack>
					<LoadingButton
						variant='contained'
						size='large'
						color='ternary'
						fullWidth
						onClick={handleLogin}
						loading={LoginApi.isLoading}
						sx={{ height: `66px` }}
					>
						<InterTypography
							variant='h5'
							fontWeight={600}
						>
							Login
						</InterTypography>
					</LoadingButton>
				</Stack>
			</Stack>
		</AuthWrapper>
	);
};

export default memo(Login);
