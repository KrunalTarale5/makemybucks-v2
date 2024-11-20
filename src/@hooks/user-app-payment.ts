import axios from 'axios';
import { useMutation, useQuery } from 'react-query';

export type GetDeepLinkInfoResponse = {
	data: {
		restaurant_id: string;
		restaurant_name: string;
		restaurant_profile: string;
		address: string;
	};
};

export const useGetDeepLinkInfoApi = (key: string) => {
	return useQuery(
		['get_deeplink'],
		() =>
			axios<GetDeepLinkInfoResponse>({
				method: 'GET',
				url: `/get_deeplink`,
				params: { qr_id: key },
			}),
		{ retry: 0 }
	);
};

export type GenerateOrderIdResponse = {
	amount: string;
	currency: string;
	order_id: string;
	restaurant_id: string;
	restaurant_name: string;
	user_id: number;
	phone_no: string;
};
export const useGenerateOrderIdApi = () =>
	useMutation(
		(info: {
			request: {
				restaurant_id: string;
				amount: string;
			};
		}) =>
			axios<GenerateOrderIdResponse>({
				method: 'POST',
				url: `/orderId_generate/`,
				data: { ...info.request, currency: 'INR' },
			})
	);
export type OrderDetailsResponse = {
	transaction_details: {
		order_id: string;
		payment_date: string;
		basic_amt: string;
		amt_gst: string;
		transaction_amount: string;
		payment_status: string;
		payment_id: string;
	};
	user_details: {
		user_full_name: string;
		user_profile_img: string;
		user_id: string;
	};
	restaurant_details: {
		restaurant_name: string;
		restaurant_profile: string;
		restaurant_id: string;
	};
};
export const useGetOrderDetailsApi = (key: string) =>
	useQuery(['get_transaction_details'], () =>
		axios<OrderDetailsResponse>({
			method: 'GET',
			url: `/get_transaction_details/${key}/`,
		})
	);
// export const useGetOrderDetailsApi = (key: string) => {
// 	return useQuery(['get_transaction_details'], () =>
// 		axios<OrderDetailsResponse>({
// 			method: 'GET',
// 			url: `/get_transaction_details/${key}/`,
// 		})
// 	);
// };
export type VerifyPaymentRequest = {
	razorpay_order_id: string;
	razorpay_signature: string;
	razorpay_payment_id: string;
	restaurant_id: string;
	amount: string;
	payment_type: string;
	currency: string;
};
export const useVerifyPaymentApi = () =>
	useMutation((info: { request: VerifyPaymentRequest }) => {
		const formData = new FormData();
		Object.keys(info.request).forEach((l) => {
			formData.append(l, info.request[l as keyof VerifyPaymentRequest]);
		});
		return axios<GenerateOrderIdResponse>({
			method: 'POST',
			url: `/verify_payment/`,
			data: formData,
		});
	});

export const usePostRatingApi = () =>
	useMutation(
		(info: {
			request: {
				restaurant_id: string;
				rating: string;
			};
		}) =>
			axios({
				method: 'POST',
				url: `/update_save_rating/`,
				data: { ...info.request },
			})
	);

export const useAddCashTransationApi = () =>
	useMutation(
		(info: {
			request: {
				restaurant_id: string;
				amount: string;
			};
		}) =>
			axios<{
				message: string;
				transaction_id: string;
			}>({
				method: 'POST',
				url: `/add_cash_transaction/`,
				data: info.request,
			})
	);

export const useVerifyCashTransationApi = () =>
	useMutation(
		(info: {
			request: {
				transaction_id: string;
				cash_otp: string;
			};
		}) =>
			axios({
				method: 'POST',
				url: `/verify_cash_transaction/`,
				data: info.request,
			})
	);
