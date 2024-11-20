import IconFinder from '@components/Icon';
import UserAppWrapper from '@components/UserAppWrapper';
import { Stack, useTheme, Button } from '@mui/material';
import { memo, useState } from 'react';
import { FiraSansTypography } from '@components/Typography';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CelebrationTriangles from '_assets/icons/celebration-triangles.svg';
import { useGetOrderDetailsApi } from '@hooks/user-app-payment';
import Uploader from '@components/Uploader';
import axios from 'axios';

const PaymentError = () => {
	const theme = useTheme();
	const [amount, setAmount] = useState('');
	const [orderId, setOrderId] = useState('');
	const [userId, setUserId] = useState('');
	const [userName, setUserName] = useState('');
	const [userProfile, setUserProfile] = useState('');
	const [restoName, setRestoName] = useState('');
	const [restoImage, setRestoImage] = useState('');
	const [restoId, setRestoId] = useState('');
	const [paymentStatus, setPaymentStatus] = useState('');

	// const req = new XMLHttpRequest();
	// console.log(req.response);
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	// const user_id = params?.get('user_id') as string;
	// const restaurant_id = params?.get('restaurant_id') as string;
	const order_id = searchParams?.get('order_id') as string;
	console.log(order_id, order_id);
	const getOrderDetailsResponse = useGetOrderDetailsApi(order_id);
	console.log('getOrderDetailsResponse', getOrderDetailsResponse);

	const fetchPaymentDetails = (paymentId: string) => {
		const axiosBaseURL = axios.create({
			baseURL: 'https://api.makemybucks.com',
		});
		axiosBaseURL
			.get('/fetch_payment/' + `${paymentId}/`, {
				headers: {
					Authorization: 'Basic cnpwX3Rlc3RfYktiR25xbmV3RDR6Z2Y6SjZyYzZFT3FlYlNqMklwV3VYSmZiWk1i',
				},
			})
			.then((response) => {
				console.log(response.data);
				setPaymentStatus(
					response.data['order_details']['status'] === 'captured' ? 'success' : 'failed'
				);
			})
			.catch((error) => {
				console.log(error);
			});
		/*
			Headers:*/
		// const axios = require('axios');

		// const config = {
		// 	method: 'get',
		// 	maxBodyLength: Infinity,
		// 	url: 'https://api.razorpay.com/v1/payments/' + `${paymentId}`,
		// 	headers: {
		// 		Authorization: 'Basic cnpwX3Rlc3RfYktiR25xbmV3RDR6Z2Y6SjZyYzZFT3FlYlNqMklwV3VYSmZiWk1i',
		// 	},
		// };

		// axios
		// 	.request(config)
		// 	.then((response: { data: any }) => {
		// 		console.log(JSON.stringify(response.data));
		// 		setPaymentStatus(response.data['status'] === 'captured' ? 'success' : 'failed');
		// 	})
		// 	.catch((error: any) => {
		// 		console.log(error);
		// 	});
	};

	if (getOrderDetailsResponse.data !== undefined && restoName === '') {
		setOrderId(order_id);
		setAmount(getOrderDetailsResponse.data?.data?.transaction_details.transaction_amount ?? '');
		setUserId(getOrderDetailsResponse.data?.data?.user_details.user_id.toString() ?? '');
		setUserName(getOrderDetailsResponse.data?.data?.user_details.user_full_name ?? '');
		setUserProfile(getOrderDetailsResponse.data?.data?.user_details.user_profile_img ?? '');
		setRestoId(getOrderDetailsResponse.data?.data?.restaurant_details.restaurant_id ?? '');
		setRestoName(getOrderDetailsResponse.data?.data?.restaurant_details.restaurant_name ?? '');
		setRestoImage(getOrderDetailsResponse.data?.data?.restaurant_details.restaurant_profile ?? '');

		fetchPaymentDetails(getOrderDetailsResponse.data?.data?.transaction_details.payment_id ?? '');
	}

	return (
		<UserAppWrapper>
			<Stack
				gap={1}
				flexGrow={1}
				justifyContent={'space-between'}
				sx={{
					backgroundSize: 'contain',
					backgroundImage: `url(${CelebrationTriangles})`,
					backgroundRepeat: 'no-repeat',
				}}
			>
				<Stack gap={1}>
					<Stack
						alignSelf={'center'}
						paddingTop={`30vh`}
					>
						{paymentStatus === 'success' ? (
							<IconFinder
								iconName='SuccessLogo'
								iconProps={{ fill: theme.palette.success.main }}
							/>
						) : (
							<IconFinder
								iconName='FailedLogo'
								iconProps={{ fill: theme.palette.error.main }}
							/>
						)}
					</Stack>

					<FiraSansTypography
						variant='h4'
						textAlign={'center'}
						fontWeight={600}
						sx={{ color: theme.palette.common.white }}
					>
						{paymentStatus === 'success' ? 'Payment Successful' : 'Payment Failed'}
					</FiraSansTypography>
					{/* <FiraSansTypography
						variant='h6'
						textAlign={'center'}
						fontWeight={600}
						sx={{ color: theme.palette.common.primaryGreyText }}
					>
						Your payment is all done!
					</FiraSansTypography> */}
					<FiraSansTypography
						variant='h6'
						textAlign={'center'}
						fontWeight={600}
						marginBottom={10}
						sx={{ color: theme.palette.common.primaryGreyText }}
					>
						{`Hello ${userName}! Your payment is all ${
							paymentStatus === 'success' ? 'done' : 'failed'
						}`}
					</FiraSansTypography>
					<Stack
						alignItems={'center'}
						gap={1}
						sx={{
							marginTop: '10%',
						}}
					>
						<Uploader
							fieldName={`restaurant_img`}
							sx={{
								placeContent: 'flex-end',
								height: 68,
								marginTop: '10%',
								width: 68,
								borderRadius: '16px',
								justifyContent: 'center',
								alignItems: 'center',
							}}
							file={restoImage ?? ''}
						/>
						<FiraSansTypography
							variant='h4'
							fontWeight={600}
							fontSize={24}
							sx={{ color: theme.palette.common.white, marginTop: '2%' }}
						>
							{restoName}
						</FiraSansTypography>
					</Stack>
					<FiraSansTypography
						variant='h5'
						textAlign={'center'}
						fontWeight={600}
						sx={{ color: theme.palette.common.white, marginTop: '10%' }}
					>
						{`Amount: ₹${amount}`}
					</FiraSansTypography>
					<FiraSansTypography
						variant='h5'
						textAlign={'center'}
						fontWeight={600}
						sx={{ color: theme.palette.common.white }}
					>
						{`Order Id: ${orderId}`}
					</FiraSansTypography>
				</Stack>
			</Stack>
		</UserAppWrapper>
	);
};

export default memo(PaymentError);
