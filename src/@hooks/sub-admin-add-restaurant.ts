import { createContext } from 'react';
import { FieldProps, FormError, Option, WeekDays } from '@interfaces/common';
import { validateForm } from '@utils/validateUtils';
import {
	validateAddress,
	validateContactNumber,
	validateCuisine,
	validateLatitude,
	validateLocation,
	validateLongitude,
	validateRestaurantName,
	validateRestaurantType,
	validateAgreedPercentage,
	validateAgreementPeriod,
	validateFssaino,
	validateGstNumber,
	validatePanNumber,
	validatePhoneNumber,
	validateEmail,
	validateAccountHolderName,
	validateBankName,
	validateAccountNumber,
	validateIFSCCode,
	validateImage,
	validateOwenerName,
	validateAgreementType,
} from '@utils/validator';
import axios from 'axios';
import { useMutation, useQuery } from 'react-query';
import { CompressImage } from '@utils/common';

export type AddRestaurantFormRequest = BasicDetailRequest &
	AddDocumentRequest &
	ContractTermRequest;

type AddRestaurantContextType = {
	formData: AddRestaurantFormRequest;
	setFormData: (formData: AddRestaurantFormRequest) => void;
	activeStep: number;
	setActiveStep: (activeStep: number) => void;
};

export const AddRestaurantContext = createContext<AddRestaurantContextType>({
	formData: {} as AddRestaurantFormRequest,
	setFormData: () => undefined,
	activeStep: 0,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	setActiveStep: (activeStep: number) => undefined,
});

export type BasicDetailRequest = {
	restaurant_name: string;
	contact_no: string | number;
	restaurant_type: string | Option;
	cuisine: string[] | Option[];
	location: string | Option;
	address: string;
	latitude: string;
	longitude: string;
};
export type BasicDetailFormFields = {
	[key in keyof BasicDetailRequest]: FieldProps;
};
export const BasicDetailFormFields: BasicDetailFormFields = {
	restaurant_name: { label: 'Enter Restaurant Name', placeholder: 'Enter Restaurant Name' },
	contact_no: {
		label: 'Contact Person Number',
		placeholder: 'Contact Person Number',
		fieldType: 'mobile-number',
		inputMode: 'numeric',
	},
	restaurant_type: {
		label: 'Restaurant Type',
		placeholder: 'Restaurant Type',
		fieldType: 'select',
		options: [],
	},
	cuisine: { label: 'Cuisine', placeholder: 'Cuisine', fieldType: 'multple-select', options: [] },
	location: { label: 'Location', placeholder: 'Location', fieldType: 'select', options: [] },
	address: { label: 'Enter Complete Address', placeholder: 'Enter Complete Address' },
	latitude: { label: 'Latitude', placeholder: 'Latitude' },
	longitude: { label: 'Longitude', placeholder: 'Longitude' },
};

export const validateBasicDetailFields = (
	fieldName: keyof BasicDetailRequest,
	formData: BasicDetailRequest
): string => {
	switch (fieldName) {
		case 'restaurant_name':
			return validateRestaurantName(formData[fieldName]);
		case 'contact_no':
			return validateContactNumber(formData[fieldName] as string);
		case 'restaurant_type':
			return validateRestaurantType(formData[fieldName]);
		case 'cuisine':
			return validateCuisine(formData[fieldName]);
		case 'location':
			return validateLocation(formData[fieldName]);
		case 'address':
			return validateAddress(formData[fieldName]);
		case 'latitude':
			return validateLatitude(formData[fieldName]);
		case 'longitude':
			return validateLongitude(formData[fieldName]);

		default:
			return '';
	}
};
export const validateBasicDetailForm = (
	formData: BasicDetailRequest
): FormError<BasicDetailRequest> => validateForm(formData, validateBasicDetailFields);

export type AddDocumentRequest = {
	gst_no: string;
	gst_no_url_pic: FileList;
	pan_no_url_pic: FileList;
	pan_no: string;
	fssai_lic_no: string;
	fssai_lic_no_url_pic: FileList;
	res_acc_holder_name: string;
	bank_name: string;
	bank_acc_no: string | number;
	ifsc_no: string;
};

export type AddDocumentFormFields = {
	[key in keyof AddDocumentRequest]: FieldProps;
};

export const AddDocumentFormFields: AddDocumentFormFields = {
	gst_no: {
		label: 'GST Number',
		placeholder: 'GST Number',
	},
	gst_no_url_pic: {
		label: 'Upload GST Certificate',
		placeholder: 'Upload GST Certificate',
		fieldType: 'upload',
	},
	pan_no: {
		label: 'PAN Number',
		placeholder: 'PAN Number',
	},
	pan_no_url_pic: {
		label: 'Upload PAN Card',
		placeholder: 'Upload PAN Card',
		fieldType: 'upload',
	},
	fssai_lic_no: {
		label: 'FSSAI Lic. No.',
		placeholder: 'FSSAI Lic. No.',
		fieldType: 'number',
	},
	fssai_lic_no_url_pic: {
		label: 'Upload FSSAI license',
		placeholder: 'Upload FSSAI license',
		fieldType: 'upload',
	},
	res_acc_holder_name: { label: 'Account Holder Name', placeholder: 'Account Holder Name' },
	bank_name: { label: 'Bank Name', placeholder: 'Bank Name' },
	bank_acc_no: { label: 'Account Number', placeholder: 'Account Number', fieldType: 'number' },
	ifsc_no: { label: 'IFSC Code', placeholder: 'IFSC Code' },
};

export const validateAddDocunemtFields = (
	fieldName: keyof AddDocumentRequest,
	formData: AddDocumentRequest
): string => {
	switch (fieldName) {
		case 'gst_no':
			return validateGstNumber(formData[fieldName]);
		case 'gst_no_url_pic':
		case 'pan_no_url_pic':
		case 'fssai_lic_no_url_pic':
			return validateImage(formData[fieldName]);
		case 'pan_no':
			return validatePanNumber(formData[fieldName]);
		case 'fssai_lic_no':
			return validateFssaino(formData[fieldName]);
		case 'res_acc_holder_name':
			return validateAccountHolderName(formData[fieldName]);
		case 'bank_acc_no':
			return validateAccountNumber(formData[fieldName] as string);
		case 'bank_name':
			return validateBankName(formData[fieldName]);
		case 'ifsc_no':
			return validateIFSCCode(formData[fieldName]);

		default:
			return '';
	}
};
export const validateAddDocumentForm = (
	formData: AddDocumentRequest
): FormError<AddDocumentRequest> => validateForm(formData, validateAddDocunemtFields);

export type ContractTermRequest = {
	owner_name: string;
	owner_no: number | string;
	owner_email: string;
	agreed_percentage: string;
	agreement_period: string | Option;
	agreement_type: string | Option;
	applicable_days?: typeof WeekDays;
	agreement_text?: string;
};
export type ContractTermFormFields = {
	[key in keyof ContractTermRequest]: FieldProps;
};
export const ContractTermFormFields: ContractTermFormFields = {
	owner_name: {
		label: 'Owner/Stakeholde Full Name',
		placeholder: 'Owner/Stakeholde Full Name',
		fieldType: 'text',
	},
	owner_no: {
		label: 'Owner/Stakeholder Phone Number',
		placeholder: 'Owner/Stakeholder Phone Number',
		fieldType: 'mobile-number',
	},
	owner_email: {
		label: 'Owner/Stakeholder Email ID',
		placeholder: 'Owner/Stakeholder Email ID',
		type: 'email',
	},
	agreed_percentage: {
		label: 'Agreed percentage',
		placeholder: 'Agreed percentage',
		fieldType: 'number',
	},
	agreement_period: {
		label: 'Agreement Period',
		placeholder: 'Agreement Period',
		fieldType: 'select',
	},
	agreement_type: {
		label: 'Agreement Type',
		placeholder: 'Agreement Type',
		fieldType: 'select',
		options: [
			{ label: 'Standard', value: 'Standard' },
			{ label: 'Synergy', value: 'Synergy' },
		],
	},
};
export const validateContractTermFields = (
	fieldName: keyof ContractTermRequest,
	formData: ContractTermRequest
): string => {
	switch (fieldName) {
		case 'owner_name':
			return validateOwenerName(formData[fieldName]);
		case 'owner_no':
			return validatePhoneNumber(formData[fieldName] as string);
		case 'owner_email':
			return validateEmail(formData[fieldName]);
		case 'agreed_percentage':
			return validateAgreedPercentage(formData[fieldName]);
		case 'agreement_type':
			return validateAgreementType(formData[fieldName] as Option);
		case 'agreement_period':
			return validateAgreementPeriod(formData[fieldName]);
		default:
			return '';
	}
};
export const validateContractTermForm = (
	formData: ContractTermRequest
): FormError<ContractTermRequest> => validateForm(formData, validateContractTermFields);

export const useAddRestaurantApi = () =>
	useMutation(
		async (info: {
			id: string;
			request: { sub_admin_id: string; added_by: string } & BasicDetailRequest &
				AddDocumentRequest &
				ContractTermRequest;
		}) => {
			const formData = new FormData();
			Object.keys(info.request).forEach((l) => {
				if (
					!(
						l === 'fssai_lic_no_url_pic' ||
						l === 'gst_no_url_pic' ||
						l === 'pan_no_url_pic' ||
						l === 'applicable_days'
					)
				) {
					formData.append(l, info.request[l as keyof BasicDetailRequest] as string);
				}
			});
			if (info.request.fssai_lic_no_url_pic) {
				const file = await CompressImage(info.request.fssai_lic_no_url_pic[0]);
				formData.append('fssai_lic_no_url_pic', file, file.name);
			}
			if (info.request.gst_no_url_pic) {
				const file = await CompressImage(info.request.gst_no_url_pic[0]);
				formData.append('gst_no_url_pic', file, file.name);
			}
			if (info.request.pan_no_url_pic) {
				const file = await CompressImage(info.request.pan_no_url_pic[0]);
				formData.append('pan_no_url_pic', file, file.name);
			}
			if (info.request.applicable_days)
				formData.append('applicable_days', JSON.stringify(info.request.applicable_days));

			return axios({
				method: 'POST',
				url: `/add_restaurant/${info.id}/`,
				data: formData,
			});
		}
	);

export type OtpResponse = {
	owner_no: string | number;
	otp_no: string | number;
	restaurant_id: string | number;
};

export const useSendOTPApi = () => {
	return useMutation((info: { request: { owner_no: string | number } }) =>
		axios<OtpResponse>({
			method: 'POST',
			url: `/send_otp/`,
			data: info.request,
		})
	);
};
export const useResendOTPApi = () => {
	return useMutation(
		(info: { request: { owner_no: string | number; restaurant_id: string | number } }) =>
			axios<OtpResponse>({
				method: 'POST',
				url: `/resend_otp/`,
				data: info.request,
			})
	);
};

export const useVerifyOTPApi = () => {
	return useMutation(
		(info: {
			request: {
				owner_no: string | number;
				otp_no: string | number;
				restaurant_id: string | number;
			};
		}) =>
			axios<OtpResponse>({
				method: 'POST',
				url: `/verify_otp/`,
				data: info.request,
			})
	);
};

export const useGetAgreementsApi = (agreement_type: string) => {
	return useQuery(['get_agreements'], () =>
		axios<{
			agreements: {
				agreement_id: string;
				agreement_text: string;
			}[];
		}>({
			method: 'GET',
			url: `/get_agreements/${agreement_type}/`,
		})
	);
};
