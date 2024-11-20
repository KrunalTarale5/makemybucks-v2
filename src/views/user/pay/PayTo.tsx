import IconFinder from '@components/Icon';
import InputField, { InputFieldProps, InputFieldValue } from '@components/InputField';
import { FiraSansTypography } from '@components/Typography';
import Uploader from '@components/Uploader';
import { FormErrorMessage } from '@interfaces/common';
import { Divider, Radio, Stack, useTheme } from '@mui/material';
import { validateAmount, validateIsPrice } from '@utils/validator';
import { memo, useEffect, useState } from 'react';
import PaymentSuccess from './PaymentSuccess';
import {
	GetDeepLinkInfoResponse,
	VerifyPaymentRequest,
	useAddCashTransationApi,
	useGenerateOrderIdApi,
	useGetDeepLinkInfoApi,
	useVerifyCashTransationApi,
	useVerifyPaymentApi,
} from '@hooks/user-app-payment';
import {
	useNavigate,
	useSearchParams,
	BrowserRouter as Router,
	Route,
	Link,
} from 'react-router-dom';
import { useAlertDialog } from '@components/AlertDialog';
import UserAppWrapper from '@components/UserAppWrapper';
import OTPField, { OTPFormData } from '@components/OTPField';

type PayToRequest = {
	amount: string;
};

const intialFormData: PayToRequest = {
	amount: '',
};

const intialFormError: FormErrorMessage<PayToRequest> = {
	amount: '',
};

const PayTo = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { showAlertDialog, hideAlertDialog } = useAlertDialog();

	const GetDeepLinkInfoApi = useGetDeepLinkInfoApi(searchParams?.get('key') as string);
	const GenerateOrderIdApi = useGenerateOrderIdApi();
	const VerifyPaymentApi = useVerifyPaymentApi();
	const AddCashTransationApi = useAddCashTransationApi();
	const VerifyCashTransationApi = useVerifyCashTransationApi();

	const [paymentMode, setPaymentMode] = useState<'online' | 'cash'>('online');
	const [transactionId, setTransactionId] = useState<string>('');
	const [otp, setOtp] = useState<typeof OTPFormData>(OTPFormData);
	const [formData, setFormData] = useState(intialFormData);
	const [formError, setFormError] = useState(intialFormError);
	const data = GetDeepLinkInfoApi.data?.data.data;
	const showOtp = Boolean(transactionId);

	const onChange = (
		fieldName: string,
		value: InputFieldValue,
		fieldType: InputFieldProps['fieldType']
	) => {
		let _formData = { ...formData, [fieldName]: value };
		if (fieldType === 'number') {
			const isNumber = validateIsPrice(String(value));
			_formData = {
				...formData,
				[fieldName]: isNumber ? value : formData[fieldName as keyof PayToRequest],
			};
		} else {
			_formData = { ...formData, [fieldName]: value };
		}
		setFormData(_formData);
		setFormError({
			...formError,
			[fieldName]: validateAmount(value as string),
		});
	};

	const onPayClick = () => {
		if (paymentMode === 'online') {
			payOnline();
		} else {
			payCash();
		}
	};

	const payCash = () => {
		AddCashTransationApi.mutateAsync({
			request: {
				amount: formData.amount,
				restaurant_id: GetDeepLinkInfoApi.data?.data.data.restaurant_id ?? '',
			},
		})
			.then((res) => {
				setTransactionId(res.data.transaction_id);
				showAlertDialog({
					title: res?.data?.message,
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

	const payOnline = () => {
		GenerateOrderIdApi.mutateAsync({
			request: {
				amount: formData.amount,
				restaurant_id: GetDeepLinkInfoApi.data?.data.data.restaurant_id ?? '',
			},
		})
			.then((res) => {
				const order_id = res.data.order_id;
				const objectForSending = {
					key_id: 'rzp_test_bKbGnqnewD4zgf',
					amount: Number(res.data.amount) * 100,
					//callback_url: 'http://localhost:3000/payments/error',
					//callback_url: 'http://localhost:3001/payments/error?order_id=' + `${res.data.order_id}`,
					//callback_url:
					//	'https://wellplayed.innvotix.in/payments/error?order_id=' + `${res.data.order_id}`,
					callback_url:
						'https://api.makemybucks.com/verify_payment_new/?order_id=' +
						`${res.data.order_id}` +
						'&restaurant_id=' +
						`${GetDeepLinkInfoApi.data?.data.data.restaurant_id ?? ''}` +
						'&amount=' +
						`${res.data.amount}` +
						'&currency=INR' +
						'&user_id=' +
						`${res.data.user_id}` +
						'&payment_type=online',
					name: '',
					description: '',
					'prefill[email]': '',
					'prefill[contact]': res.data.phone_no,
					order_id: res.data.order_id,
				};
				const form = document.createElement('form');
				form.method = 'POST';
				form.action = 'https://api.razorpay.com/v1/checkout/embedded';
				// Sample 1
				const hiddenFieldSample1 = document.createElement('input');
				hiddenFieldSample1.type = 'hidden';
				hiddenFieldSample1.name = 'key_id';
				hiddenFieldSample1.value = objectForSending.key_id?.toString();
				form.appendChild(hiddenFieldSample1);

				// Sample 2
				const hiddenFieldSample2 = document.createElement('input');
				hiddenFieldSample2.type = 'hidden';
				hiddenFieldSample2.name = 'amount';
				hiddenFieldSample2.value = objectForSending.amount?.toString();
				form.appendChild(hiddenFieldSample2);

				// order_id
				const hiddenFieldorder_id = document.createElement('input');
				hiddenFieldorder_id.type = 'hidden';
				hiddenFieldorder_id.name = 'order_id';
				hiddenFieldorder_id.value = objectForSending.order_id?.toString();
				form.appendChild(hiddenFieldorder_id);

				// callback_url
				const hiddenFieldcallback_url = document.createElement('input');
				hiddenFieldcallback_url.type = 'hidden';
				hiddenFieldcallback_url.name = 'callback_url';
				hiddenFieldcallback_url.value = objectForSending.callback_url?.toString();
				form.appendChild(hiddenFieldcallback_url);

				// callback_url
				const hiddenFieldcallemail = document.createElement('input');
				hiddenFieldcallemail.type = 'hidden';
				hiddenFieldcallemail.name = 'prefill[email]';
				hiddenFieldcallemail.value = 'lksh7264@gmail.com';
				form.appendChild(hiddenFieldcallemail);

				// callback_url
				const hiddenFieldcallphone = document.createElement('input');
				hiddenFieldcallphone.type = 'hidden';
				hiddenFieldcallphone.name = 'prefill[contact]';
				hiddenFieldcallphone.value = res.data.phone_no.toString();
				form.appendChild(hiddenFieldcallphone);
				document.body.appendChild(form);
				form.submit();

				// const _window: (Window & typeof globalThis) | any = window;
				// const Razorpay: any = _window.Razorpay;
				// const razorpay = new Razorpay({
				// 	key: process.env.REACT_APP_PAYMENT_GATEWAY_KEY,
				// 	amount: Number(res.data.amount) * 100,
				// 	currency: 'INR',
				// 	order_id: res.data.order_id,
				// 	prefill: {
				// 		contact: res.data.phone_no,
				// 	},
				// 	theme: {
				// 		color: '#A9A7E8',
				// 	},
				// 	image: 'https://makemybucks.openuidev.com/logo192.png',
				// 	handler: (response: VerifyPaymentRequest) => {
				// 		VerifyPaymentApi.mutate({
				// 			request: {
				// 				...response,
				// 				amount: res.data.amount,
				// 				currency: 'INR',
				// 				payment_type: 'online',
				// 				restaurant_id: GetDeepLinkInfoApi.data?.data.data.restaurant_id ?? '',
				// 			},
				// 		});
				// 	},
				// 	redirect: false,
				// 	retry: {
				// 		enabled: false,
				// 	},
				// });
				// razorpay.open();
				// razorpay.on('payment.failed', (response: any) => {
				// 	showAlertDialog({
				// 		title: response?.error?.description,
				// 		buttons: [
				// 			{
				// 				children: 'ok',
				// 				variant: 'outlined',
				// 				callback: () => {
				// 					hideAlertDialog();
				// 				},
				// 			},
				// 		],
				// 	});
				// });
			})
			.catch((error) => {
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

	const handleBack = () => {
		if (showOtp) {
			setTransactionId('');
			setOtp({});
		} else {
			navigate(`/payments?key=${searchParams?.get('key') as string}`);
		}
	};

	const handleVerifyOTP = () => {
		VerifyCashTransationApi.mutate({
			request: {
				cash_otp: Object.values(otp).join(''),
				transaction_id: transactionId,
			},
		});
	};

	useEffect(() => {
		void loadPaymentGateway();
	}, []);

	return VerifyPaymentApi.isSuccess || VerifyCashTransationApi.isSuccess ? (
		<PaymentSuccess
			data={{
				amount: formData.amount,
				...(GetDeepLinkInfoApi?.data?.data.data as GetDeepLinkInfoResponse['data']),
			}}
		/>
	) : (
		<UserAppWrapper
			controlButtonProps={{
				content: showOtp ? `Verify OTP` : `Proceed to Pay`,
				onClick: showOtp ? handleVerifyOTP : onPayClick,
				loading: GenerateOrderIdApi.isLoading || VerifyPaymentApi.isLoading,
				disabled: GetDeepLinkInfoApi.isError,
			}}
			handleBack={handleBack}
			heading={
				showOtp ? (
					<FiraSansTypography
						fontSize={`18px`}
						fontWeight={600}
						letterSpacing={0.64}
					>
						Back
					</FiraSansTypography>
				) : (
					<FiraSansTypography
						variant='h4'
						fontWeight={600}
						letterSpacing={0.64}
					>
						Paying to
					</FiraSansTypography>
				)
			}
		>
			{showOtp ? (
				<>
					<Stack gap={5}>
						<Stack>
							<FiraSansTypography
								variant='h4'
								fontWeight={600}
								sx={{ color: theme.palette.common.white }}
							>
								Verify cash Payment
							</FiraSansTypography>
							<FiraSansTypography
								variant='subtitle2'
								sx={{ color: theme.palette.common.primaryGreyText }}
								display={'flex'}
								gap={1}
							>
								OTP Sent to Restaurant Manager
							</FiraSansTypography>
						</Stack>
						<OTPField
							otp={otp}
							setOtp={setOtp}
							onEnter={handleVerifyOTP}
						/>
					</Stack>
				</>
			) : (
				<Stack
					gap={5}
					paddingTop={`100px`}
					flexGrow={1}
				>
					<Stack
						alignItems={'center'}
						gap={1}
					>
						<Uploader
							fieldName={`restaurant_img`}
							sx={{
								placeContent: 'flex-end',
								height: 68,
								width: 68,
								borderRadius: '16px',
								justifyContent: 'center',
								alignItems: 'center',
							}}
							file={data?.restaurant_profile ?? ''}
						/>
						<FiraSansTypography
							variant='h4'
							fontWeight={600}
							fontSize={24}
							sx={{ color: theme.palette.common.white }}
						>
							{data?.restaurant_name}
						</FiraSansTypography>
						<FiraSansTypography
							variant='subtitle1'
							sx={{ color: theme.palette.common.primaryGreyText }}
						>
							{data?.address}
						</FiraSansTypography>
					</Stack>
					<Stack
						alignItems={'center'}
						gap={1}
					>
						<InputField
							fieldName='amount'
							value={formData.amount}
							fieldType='number'
							fieldProps={{
								placeholder: '0',
								size: 'medium',
								inputProps: {
									inputMode: 'numeric',
								},
								InputProps: {
									startAdornment: (
										<>
											<IconFinder
												iconName='RupeeV3'
												iconProps={{
													width: `50px`,
												}}
											/>
											<Divider
												orientation='vertical'
												sx={{
													borderColor: theme.palette.common.white,
													height: `62px`,
													padding: 'inherit',
												}}
											/>
										</>
									),
								},
								error: Boolean(formError.amount),
								helperText: formError.amount,
								sx: {
									width: 130 + formData.amount.length * 30,
									'& .MuiInputBase-input': {
										height: 44,
										fontSize: 64,
										fontWeight: 900,
										fontFamily: 'Fira Sans',
									},
									'& .MuiOutlinedInput-notchedOutline': {
										borderColor: 'transparent !important',
									},
									'& .MuiOutlinedInput-input': { paddingLeft: 'inherit' },
								},
							}}
							onChange={onChange}
						/>

						<FiraSansTypography
							variant='h6'
							sx={{ color: theme.palette.common.primaryGreyText }}
						>
							Enter amount
						</FiraSansTypography>
					</Stack>
					<Stack marginTop={'auto'}>
						<FiraSansTypography
							variant='subtitle1'
							sx={{ color: theme.palette.common.primaryGreyText }}
						>
							Payment mode
						</FiraSansTypography>
						<Stack
							bgcolor={'#333335'}
							borderRadius={`16px`}
							padding={3}
							gap={3}
						>
							<Stack onClick={() => setPaymentMode('online')}>
								<Stack
									flexDirection={'row'}
									justifyContent={'space-between'}
								>
									<FiraSansTypography
										fontSize={`18px`}
										sx={{ color: theme.palette.common.white }}
									>
										Online
									</FiraSansTypography>
									<Radio
										sx={{ paddingTop: 0 }}
										checked={paymentMode === 'online'}
									/>
								</Stack>

								<IconFinder iconName='UPIList' />
							</Stack>
							<Divider sx={{ borderColor: '#515152' }} />
							<Stack
								flexDirection={'row'}
								justifyContent={'space-between'}
								onClick={() => setPaymentMode('cash')}
							>
								<FiraSansTypography
									fontSize={`18px`}
									sx={{ color: theme.palette.common.white }}
								>
									Cash
								</FiraSansTypography>
								<Radio
									sx={{ paddingTop: 0 }}
									checked={paymentMode === 'cash'}
								/>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			)}
		</UserAppWrapper>
	);
};

export default memo(PayTo);

export const loadPaymentGateway = () => {
	return new Promise((resolve) => {
		const script = document.createElement('script');
		script.src = 'https://checkout.razorpay.com/v1/checkout.js';
		script.type = 'text/javascript';
		script.onload = () => {
			resolve(true);
		};
		script.onerror = () => {
			resolve(false);
		};
		document.head.appendChild(script);
	});
};
