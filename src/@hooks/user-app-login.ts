import { FieldProps, FormError } from '@interfaces/common';
import { validateForm } from '@utils/validateUtils';
import { validatePhoneNumber } from '@utils/validator';
import axios from 'axios';
import { useMutation } from 'react-query';

export type LoginRequest = { phone_no: string };

export type LoginFormFields = {
	[key in keyof LoginRequest]: FieldProps;
};

export const LoginFormFields: Partial<LoginFormFields> = {
	phone_no: {
		label: 'Enter Your Mobile Number',
		fieldType: 'mobile-number',
		inputProps: {
			inputMode: 'tel',
		},
	},
};

export const validateLoginFields = (
	fieldName: keyof LoginRequest,
	formData: LoginRequest
): string => {
	switch (fieldName) {
		case 'phone_no':
			return validatePhoneNumber(formData[fieldName]);

		default:
			return '';
	}
};

export const validateLoginForm = (formData: LoginRequest): FormError<LoginRequest> =>
	validateForm(formData, validateLoginFields);

export type LoginResponse = {
	access_token: string;
	user_data: {
		subadmin_id: string;
		subadmin_firstname: string;
		subadmin_lastname: string;
		email: string;
		mobile_no: string;
		subadmin_user_id: string;
		profile_pic: string;
	};
};
export const useSendOTPApi = () => {
	return useMutation((info: { request: LoginRequest }) =>
		axios({
			method: 'POST',
			url: `/send_user_otp/`,
			data: info.request,
		})
	);
};

export type VerifyOtpResponse = {
	access_token: string;
	register_status: string;
	kyc_status: string;
};

export const useVerifyOTPApi = () => {
	return useMutation(
		(info: {
			request: {
				phone_no: string | number;
				otp: string | number;
			};
		}) =>
			axios<VerifyOtpResponse>({
				method: 'POST',
				url: `/verify_user_otp/`,
				data: info.request,
			})
	);
};
