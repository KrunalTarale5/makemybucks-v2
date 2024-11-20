import { FieldProps, FormError } from '@interfaces/common';
import { validateForm } from '@utils/validateUtils';
import { validateEmail, validatePhoneNumber } from '@utils/validator';

export type ProfileRequest = { email: string; phoneno: number | string };
export type ProfileFormFields = {
	[key in keyof ProfileRequest]: FieldProps;
};

export const ProfileFormFields: Partial<ProfileFormFields> = {
	email: { label: 'EMAIL ID', placeholder: 'Email ID', type: 'email' },
	phoneno: {
		label: 'Phone Number',
		placeholder: 'Enter PhoneNo ',
		fieldType: 'number',
	},
};
export const validateProfileFields = (
	fieldName: keyof ProfileRequest,
	formData: ProfileRequest
): string => {
	switch (fieldName) {
		case 'email':
			return validateEmail(formData[fieldName]);
		case 'phoneno':
			return validatePhoneNumber(formData[fieldName] as string);

		default:
			return '';
	}
};
export const validateProfileForm = (formData: ProfileRequest): FormError<ProfileRequest> =>
	validateForm(formData, validateProfileFields);
