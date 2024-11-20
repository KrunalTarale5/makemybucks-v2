import InputField, { InputFieldValue } from '@components/InputField';
import RestaurentAuthWrapper from '@components/RestaurentAuthWrapper';
import { useSnackbar } from '@components/Snackbar';
import { InterTypography, PoppinsTypography } from '@components/Typography';
import {
	RestaurantLoginFormFields,
	RestaurantLoginRequest,
	useLoginRestaurantApi,
	validateRestaurantLoginFields,
	validateRestaurantLoginForm,
} from '@hooks/restaurant-login';
import { FormErrorMessage } from '@interfaces/common';
import { LoadingButton } from '@mui/lab';
import { Button, Stack, useTheme } from '@mui/material';
import { RESTAURANT_BASE_URL } from '@utils/common';
import { setBannerInfo, setToken, setUserInfo } from '_store/actions/ui-actions';
import { memo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const intialFormData: RestaurantLoginRequest = {
	owner_email: '',
	password: '',
};

const intialFormError: FormErrorMessage<RestaurantLoginRequest> = {
	owner_email: '',
	password: '',
};

const Login = () => {
	const RestaurantLoginApi = useLoginRestaurantApi();
	const theme = useTheme();
	const navigate = useNavigate();
	const { showSnackbar, hideSnackbar } = useSnackbar();
	const dispatch = useDispatch();

	const [formData, setFormData] = useState(intialFormData);
	const [formError, setFormError] = useState(intialFormError);

	const onChange = (fieldName: string, value: InputFieldValue) => {
		const _formData = { ...formData, [fieldName]: value };
		setFormData(_formData);
		setFormError({
			...formError,
			[fieldName]: validateRestaurantLoginFields(
				fieldName as keyof RestaurantLoginRequest,
				_formData
			),
		});
	};
	const handleLogin = () => {
		const validatation = validateRestaurantLoginForm(formData);
		if (validatation.hasError) {
			setFormError(validatation.errors);
			return;
		}
		void RestaurantLoginApi.mutateAsync({ request: formData })
			.then((response) => {
				dispatch(setToken(response.data.access_token));
				dispatch(
					setUserInfo({
						avatar: response.data.user_data.restaurant_profile,
						email: response.data.user_data.owner_email,
						id: response.data.user_data.restaurant_id,
						name: response.data.user_data.restaurant_name,
						mobile_no: response.data.user_data.owner_no,
					})
				);
				dispatch(setBannerInfo(null));
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
				navigate(`/${RESTAURANT_BASE_URL}/dashboard`);
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
						Login into your account
					</PoppinsTypography>
				</Stack>
				<Stack
					gap={5}
					width={`100%`}
					paddingTop={'60px'}
				>
					{Object.entries(RestaurantLoginFormFields).map((v) => {
						const fieldName: keyof RestaurantLoginFormFields =
							v[0] as keyof RestaurantLoginFormFields;
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
								addons={
									fieldName === 'password' && (
										<Stack alignItems={'flex-end'}>
											<Button
												variant='text'
												size='small'
												sx={{ height: 'fit-content' }}
												onClick={() => navigate(`/${RESTAURANT_BASE_URL}/forgot-password`)}
											>
												<InterTypography
													variant='body2'
													sx={{ color: '#18ACFF' }}
												>
													Forgot Password?
												</InterTypography>
											</Button>
										</Stack>
									)
								}
							/>
						);
					})}
					<LoadingButton
						variant='contained'
						size='large'
						color='primary'
						fullWidth
						sx={{ borderRadius: `16px`, height: '68px', marginTop: '25px' }}
						onClick={handleLogin}
						loading={RestaurantLoginApi.isLoading}
					>
						<PoppinsTypography variant='h5'>Login</PoppinsTypography>
					</LoadingButton>
				</Stack>
			</Stack>
		</RestaurentAuthWrapper>
	);
};

export default memo(Login);
