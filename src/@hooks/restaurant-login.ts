import { FieldProps, FormError } from '@interfaces/common';
import { validateForm } from '@utils/validateUtils';
import { validateEmail, validatePassword } from '@utils/validator';
import axios from 'axios';
import { useMutation } from 'react-query';

export type RestaurantLoginRequest = { owner_email: string; password: number | string };
export type RestaurantLoginFormFields = {
	[key in keyof RestaurantLoginRequest]: FieldProps;
};
export const RestaurantLoginFormFields: Partial<RestaurantLoginFormFields> = {
	owner_email: { label: '', placeholder: 'Enter registered email id', type: 'email' },
	password: { label: '', placeholder: 'Enter password ', type: 'password' },
};

export const validateRestaurantLoginFields = (
	fieldName: keyof RestaurantLoginRequest,
	formData: RestaurantLoginRequest
): string => {
	switch (fieldName) {
		case 'owner_email':
			return validateEmail(formData[fieldName]);
		case 'password':
			return validatePassword(formData[fieldName] as string);

		default:
			return '';
	}
};
export const validateRestaurantLoginForm = (
	formData: RestaurantLoginRequest
): FormError<RestaurantLoginRequest> => validateForm(formData, validateRestaurantLoginFields);

export type RestaurantLoginResponse = {
	message: string;
	access_token: string;
	user_data: {
		restaurant_id: string;
		owner_name: string;
		owner_no: string;
		owner_email: string;
		restaurant_name: string;
		restaurant_profile: string;
	};
};
export const useLoginRestaurantApi = () => {
	return useMutation((info: { request: RestaurantLoginRequest }) =>
		axios<RestaurantLoginResponse>({
			method: 'POST',
			url: `/restaurant_sign_in/`,
			data: info.request,
		})
	);
};
