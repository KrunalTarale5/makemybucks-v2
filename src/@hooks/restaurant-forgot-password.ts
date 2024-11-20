import { FormError } from '@interfaces/common';
import { validateForm } from '@utils/validateUtils';
import { validateEmail } from '@utils/validator';
import axios from 'axios';
import { useMutation } from 'react-query';

export type RestaurantForgotRequest = { owner_email: string };
export const RestaurantForgotFields = (
	fieldName: keyof RestaurantForgotRequest,
	formData: RestaurantForgotRequest
): string => {
	switch (fieldName) {
		case 'owner_email':
			return validateEmail(formData[fieldName]);

		default:
			return '';
	}
};
export const validateRestaurantForgotForm = (
	formData: RestaurantForgotRequest
): FormError<RestaurantForgotRequest> => validateForm(formData, RestaurantForgotFields);

export const useRestaurantForgotApi = () => {
	return useMutation((info: { request: RestaurantForgotRequest }) =>
		axios({
			method: 'POST',
			url: `/restaurant_forgot_password/`,
			data: info.request,
		})
	);
};
