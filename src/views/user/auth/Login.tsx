import { memo, useState } from 'react';
import { Divider, Stack, useTheme } from '@mui/material';
import IconFinder from '@components/Icon';
import InputField, { InputFieldProps, InputFieldValue } from '@components/InputField';
import { FiraSansTypography, PoppinsTypography } from '@components/Typography';
import { FormErrorMessage } from '@interfaces/common';
import {
	LoginFormFields,
	LoginRequest,
	useSendOTPApi,
	validateLoginFields,
	validateLoginForm,
	useVerifyOTPApi,
} from '@hooks/user-app-login';
import { useNavigate, useSearchParams } from 'react-router-dom';
import UserAppWrapper from '@components/UserAppWrapper';
import { useAlertDialog } from '@components/AlertDialog';
import { validateIsMobileNumber } from '@utils/validator';
import { useDispatch } from 'react-redux';
import { setToken } from '_store/actions/ui-actions';
import OTPField from '@components/OTPField';

const intialFormData: LoginRequest = {
	phone_no: '',
};

const intialFormError: FormErrorMessage<LoginRequest> = {
	phone_no: '',
};

interface FormData {
	[key: number]: number | string;
}

const OTPFormData: FormData = {};

const Login = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { showAlertDialog, hideAlertDialog } = useAlertDialog();
	const [searchParams] = useSearchParams();

	const [formData, setFormData] = useState(intialFormData);
	const [formError, setFormError] = useState(intialFormError);

	const [otp, setOtp] = useState<FormData>(OTPFormData);
	const [showOtp, setShowOtp] = useState<boolean>(false);

	const SendOTPApi = useSendOTPApi();
	const ResendOTPApi = useSendOTPApi();
	const VerifyOTPApi = useVerifyOTPApi();

	const onChange = (
		fieldName: string,
		value: InputFieldValue,
		fieldType: InputFieldProps['fieldType']
	) => {
		let _formData = { ...formData, [fieldName]: value };
		if (fieldType === 'mobile-number') {
			const isNumber = validateIsMobileNumber(String(value));
			_formData = {
				...formData,
				[fieldName]: isNumber ? value : formData[fieldName as keyof LoginRequest],
			};
		} else {
			_formData = { ...formData, [fieldName]: value };
		}
		setFormData(_formData);
		setFormError({
			...formError,
			[fieldName]: validateLoginFields(fieldName as keyof LoginRequest, _formData),
		});
	};

	const handleSendOTP = () => {
		const validatation = validateLoginForm(formData);
		if (validatation.hasError) {
			setFormError(validatation.errors);
			return;
		}
		void SendOTPApi.mutateAsync({ request: formData })
			.then((response) => {
				setShowOtp(true);
				showAlertDialog({
					title: response.data?.message,
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
			.catch(() => {
				setShowOtp(false);
				setOtp(OTPFormData);
				showAlertDialog({
					title: 'something went wrong',
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

	const handleResendOTP = () => {
		void ResendOTPApi.mutateAsync({ request: formData })
			.then((response) => {
				showAlertDialog({
					title: response.data?.message,
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
			.catch(() => {
				showAlertDialog({
					title: 'something went wrong',
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

	const handleVerifyOTP = () => {
		VerifyOTPApi.mutateAsync({
			request: {
				otp: Object.values(otp).join(''),
				phone_no: formData.phone_no,
			},
		})
			.then((response) => {
				dispatch(setToken(response.data.access_token));
				navigate(`/payments/pay?key=${searchParams?.get('key') as string}`);
			})
			.catch((error) => {
				setShowOtp(false);
				setOtp(OTPFormData);
				showAlertDialog({
					title: error?.response?.data?.message,
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

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter') {
			handleSendOTP();
		}
	};

	return (
		<UserAppWrapper
			controlButtonProps={{
				content: showOtp ? `Verify OTP` : `Proceed to Verify`,
				onClick: showOtp ? handleVerifyOTP : handleSendOTP,
				loading: SendOTPApi.isLoading || VerifyOTPApi.isLoading,
			}}
			handleBack={() => setShowOtp(false)}
			heading={<FiraSansTypography variant='h6'>Back</FiraSansTypography>}
		>
			<>
				{showOtp ? (
					<>
						<Stack gap={5}>
							<Stack>
								<FiraSansTypography
									variant='h4'
									fontWeight={600}
									sx={{ color: theme.palette.common.white }}
								>
									Verify OTP
								</FiraSansTypography>
								<FiraSansTypography
									variant='subtitle2'
									sx={{ color: theme.palette.common.primaryGreyText }}
									display={'flex'}
									gap={1}
								>
									OTP Sent to Number
									<FiraSansTypography
										variant='subtitle2'
										fontWeight={600}
										sx={{ color: theme.palette.common.white }}
									>
										+91 {formData.phone_no}
									</FiraSansTypography>
								</FiraSansTypography>
							</Stack>

							<Stack
								gap={1}
								flexDirection={'row'}
								alignSelf={'center'}
							>
								<OTPField
									otp={otp}
									setOtp={setOtp}
									onEnter={handleVerifyOTP}
								/>
							</Stack>
						</Stack>

						<PoppinsTypography
							variant='subtitle2'
							display={'inline-flex'}
							gap={1}
							sx={{
								color: theme.palette.common.primaryGreyText,
								paddingTop: `20px`,
							}}
						>
							{`Didn’t receive OTP? `}
							<PoppinsTypography
								variant='subtitle2'
								sx={{
									color: theme.palette.primary.main,
								}}
								onClick={handleResendOTP}
							>
								{` Re-Send Agian`}
							</PoppinsTypography>
						</PoppinsTypography>
					</>
				) : (
					<Stack
						width={`100%`}
						justifyContent={'space-between'}
						paddingTop={`100px`}
						flexGrow={1}
					>
						<Stack gap={5}>
							<Stack gap={1}>
								<IconFinder
									iconName='UserAppLogo'
									iconProps={{ width: 40, height: 40 }}
								/>
								<FiraSansTypography
									variant='h4'
									fontSize={`32px`}
									fontWeight={600}
									sx={{ color: theme.palette.common.white }}
								>
									Login to
								</FiraSansTypography>
								<FiraSansTypography
									variant='h4'
									fontSize={`32px`}
									fontWeight={600}
									sx={{ color: theme.palette.common.white }}
								>
									makemybucks
								</FiraSansTypography>
							</Stack>

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
											value={(formData[fieldName] as InputFieldValue) ?? ''}
											key={fieldName}
											fieldProps={{
												...fieldProps,
												color: 'primary',
												fullWidth: true,
												sx: {
													'.MuiTypography-subtitle1': {
														color: theme.palette.common.primaryGreyText,
														fontFamily: 'Fira Sans',
													},
													'& .MuiOutlinedInput-notchedOutline': { borderRadius: `12px` },
													'& .MuiInputBase-input': {
														height: 51,
														fontSize: 36,
														fontFamily: 'Fira Sans',
													},
												},
												error: Boolean(formError[fieldName]),
												helperText: formError[fieldName],
												InputProps: {
													inputMode: 'numeric',
													startAdornment: (
														<>
															<FiraSansTypography
																fontSize={28}
																sx={{ color: '#9E9E9E' }}
															>
																+91
															</FiraSansTypography>
															<Divider
																orientation='vertical'
																sx={{ height: `48px`, borderColor: '#696969', marginX: `14px` }}
															/>
														</>
													),
												},
												onKeyDown: handleKeyDown,
											}}
											fieldType={fieldProps.fieldType}
											onChange={onChange}
										/>
									);
								})}
							</Stack>
						</Stack>

						<Stack>
							<FiraSansTypography
								variant='subtitle2'
								align='center'
								sx={{ color: theme.palette.common.primaryGreyText }}
							>
								Proceeding ahead you will accept
							</FiraSansTypography>
							<FiraSansTypography
								variant='subtitle2'
								align='center'
								sx={{ color: theme.palette.common.white }}
							>
								Our Terms & Policy
							</FiraSansTypography>
						</Stack>
					</Stack>
				)}
			</>
		</UserAppWrapper>
	);
};

export default memo(Login);
