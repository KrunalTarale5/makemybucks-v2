import { createContext } from 'react';
import {
	FieldProps,
	FormError,
	Option,
	PageRequest,
	PaginationResponse,
	RestaurantStatus,
	SortRequest,
	SubAdminStatus,
} from '@interfaces/common';
import { validateForm } from '@utils/validateUtils';
import {
	validateAddharNumber,
	validateEmail,
	validateFirstName,
	validateFlatNo,
	validateImage,
	validateLastName,
	validateLocalCity,
	validateLocalPinCode,
	validateLocalState,
	validateMobileNo,
	validatePersonalNo,
	validateReEmail,
	validateRole,
	validateStreetName,
	validateWorkLocation,
} from '@utils/validator';
import axios from 'axios';
import { useMutation, useQuery } from 'react-query';

export const SALES_EXECUTIVE_FORM_STEPS = [
	'Basic Details',
	'Address',
	'Identity Proof',
	'Assign Role',
];

export type AddSalesExecutiveRequest = {
	first_name: string;
	last_name: string;
	email: string;
	mobile_no: number | string;
	personal_no: number | string;
	profile_pic: FileList;

	local_flat_no: string;
	local_street_name: string;
	local_city: string;
	local_pin_code: number | string;
	local_state: string | Option;
	permanent_flat_no: string;
	permanent_street_name: string;
	permanent_city: string;
	permanent_pin_code: number | string;
	permanent_state: string | Option;

	aadhar_no: number | string;
	addhar_front_pic: FileList;
	addhar_back_pic: FileList;

	assign_role: string | Option;
	assign_work_location: string | Option;
	password: string;
};

export type BasicDetailsFormRequest = {
	first_name: string;
	last_name: string;
	email: string;
	reEmail: string;
	mobile_no: number | string;
	personal_no: number | string;
	profile_pic: FileList;
};

export type BasicDetailsFormFields = {
	[key in keyof BasicDetailsFormRequest]: FieldProps;
};

export const BasicDetailsFormFields: Partial<BasicDetailsFormFields> = {
	first_name: {
		label: 'First Name',
		required: true,
	},
	last_name: {
		label: 'Last Name',
		required: true,
	},
	email: {
		label: 'Email ID',
		type: 'email',
		required: true,
	},
	reEmail: {
		label: 'Re- Enter Email ID',
		type: 'email',
		required: true,
	},
	mobile_no: {
		label: 'Mobile Number',
		fieldType: 'mobile-number',
		required: true,
	},
	personal_no: {
		label: 'Personal Number',
		fieldType: 'mobile-number',
		required: true,
	},
};

export type AddressDetailsFormRequest = {
	localAddress: {
		local_flat_no: string;
		local_street_name: string;
		local_city: string;
		local_pin_code: number | string;
		local_state: Option;
	};
	permanentAddress: {
		permanent_flat_no: string;
		permanent_street_name: string;
		permanent_city: string;
		permanent_pin_code: number | string;
		permanent_state: Option;
	};
};

export type AddressDetailsFormFields = {
	localAddress: {
		[key in keyof AddressDetailsFormRequest['localAddress']]: FieldProps;
	};
	permanentAddress: {
		[key in keyof AddressDetailsFormRequest['permanentAddress']]: FieldProps;
	};
};

export const AddressDetailsFormFields: AddressDetailsFormFields = {
	localAddress: {
		local_flat_no: {
			label: 'Flat/Building',
			required: true,
		},
		local_street_name: {
			label: 'Road/Street',
			required: true,
		},
		local_city: {
			label: 'City',
			required: true,
		},
		local_pin_code: {
			label: 'PIN Code',
			fieldType: 'number',
			required: true,
		},
		local_state: {
			label: 'State',
			required: true,
			fieldType: 'select',
			options: [],
		},
	},
	permanentAddress: {
		permanent_flat_no: {
			label: 'Flat/Building',
			required: true,
		},
		permanent_street_name: {
			label: 'Road/Street',
			required: true,
		},
		permanent_city: {
			label: 'City',
			required: true,
		},
		permanent_pin_code: {
			label: 'PIN Code',
			fieldType: 'number',
			required: true,
		},
		permanent_state: {
			label: 'State',
			required: true,
			fieldType: 'select',
			options: [],
		},
	},
};

export type IdentityProofFormRequest = {
	aadhar_no: number | string;
	addhar_front_pic: FileList;
	addhar_back_pic: FileList;
};

export type IdentityProofFormFields = {
	[key in keyof IdentityProofFormRequest]: FieldProps;
};

export const IdentityProofFormFields: Partial<IdentityProofFormFields> = {
	aadhar_no: {
		label: 'AADHAR Number',
		required: true,
		fieldType: 'number',
	},
	addhar_front_pic: {
		label: 'Upload Aadhar Front',
		required: true,
		fieldType: 'upload',
	},
	addhar_back_pic: {
		label: 'Upload Aadhar Back',
		required: true,
		fieldType: 'upload',
	},
};

export type AssignRoleFormRequest = {
	assign_role: Option;
	assign_work_location: Option;
};

export type AssignRoleFormFields = {
	[key in keyof AssignRoleFormRequest]: FieldProps;
};

export const AssignRoleFormFields: Partial<AssignRoleFormFields> = {
	assign_role: {
		label: 'Assign Role',
		required: true,
		fieldType: 'select',
		options: [],
	},
	assign_work_location: {
		label: 'Assign Work Location',
		required: true,
		fieldType: 'select',
		options: [],
	},
};

type AddSalesExecutiveContextType = {
	formData: AddSalesExecutiveRequest;
	setFormData: (formData: AddSalesExecutiveRequest) => void;
	activeStep: number;
	setActiveStep: (activeStep: number) => void;
};

export const AddSalesExecutiveContext = createContext<AddSalesExecutiveContextType>({
	formData: {} as AddSalesExecutiveRequest,
	setFormData: () => undefined,
	activeStep: 0,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	setActiveStep: (activeStep: number) => undefined,
});

export const validateAddressDetailsFields = (
	fieldName: keyof AddressDetailsFormType,
	formData: AddressDetailsFormType
): string => {
	switch (fieldName) {
		case 'local_flat_no':
		case 'permanent_flat_no':
			return validateFlatNo(formData[fieldName]);

		case 'local_street_name':
		case 'permanent_street_name':
			return validateStreetName(formData[fieldName]);

		case 'local_city':
		case 'permanent_city':
			return validateLocalCity(formData[fieldName]);

		case 'local_pin_code':
		case 'permanent_pin_code':
			return validateLocalPinCode(formData[fieldName] as string);

		case 'local_state':
		case 'permanent_state':
			return validateLocalState(formData[fieldName]);

		default:
			return '';
	}
};

export const validateIdentityProofFields = (
	fieldName: keyof IdentityProofFormRequest,
	formData: IdentityProofFormRequest
): string => {
	switch (fieldName) {
		case 'aadhar_no':
			return validateAddharNumber(formData[fieldName] as string);
		case 'addhar_back_pic':
		case 'addhar_front_pic':
			return validateImage(formData[fieldName]);

		default:
			return '';
	}
};

export const validateAssignRoleFields = (
	fieldName: keyof AssignRoleFormRequest,
	formData: AssignRoleFormRequest
): string => {
	switch (fieldName) {
		case 'assign_role':
			return validateRole(formData[fieldName]);
		case 'assign_work_location':
			return validateWorkLocation(formData[fieldName]);

		default:
			return '';
	}
};

export const validateBasicDetailFields = (
	fieldName: keyof BasicDetailsFormRequest,
	formData: BasicDetailsFormRequest
): string => {
	switch (fieldName) {
		case 'first_name':
			return validateFirstName(formData[fieldName]);
		case 'last_name':
			return validateLastName(formData[fieldName]);
		case 'email':
			return validateEmail(formData[fieldName]);
		case 'reEmail':
			return validateReEmail(formData[fieldName], formData.email);
		case 'mobile_no':
			return validateMobileNo(formData[fieldName] as string);
		case 'personal_no':
			return validatePersonalNo(formData[fieldName] as string);

		default:
			return '';
	}
};

export type AddressDetailsFormType =
	| AddressDetailsFormRequest['localAddress']
	| AddressDetailsFormRequest['permanentAddress'];

export const validateAddressDetailsForm = (
	formData: AddressDetailsFormType
): FormError<AddressDetailsFormType> => validateForm(formData, validateAddressDetailsFields);

export const validateBasicDetailForm = (
	formData: BasicDetailsFormRequest
): FormError<BasicDetailsFormRequest> => validateForm(formData, validateBasicDetailFields);

export const validateIdentityProofForm = (
	formData: IdentityProofFormRequest
): FormError<IdentityProofFormRequest> => validateForm(formData, validateIdentityProofFields);

export const validateAssignRoleForm = (
	formData: AssignRoleFormRequest
): FormError<AssignRoleFormRequest> => validateForm(formData, validateAssignRoleFields);

export const addSubAdminApi = (request: AddSalesExecutiveRequest) => {
	const formData = new FormData();
	Object.keys(request).forEach((l) => {
		if (!(l === 'profile_pic' || l === 'addhar_front_pic' || l === 'addhar_back_pic')) {
			formData.append(l, request[l as keyof AddSalesExecutiveRequest] as string);
		}
	});
	if (request.profile_pic)
		formData.append('profile_pic', request.profile_pic[0], request.profile_pic[0].name);
	if (request.addhar_front_pic)
		formData.append(
			'addhar_front_pic',
			request.addhar_front_pic[0],
			request.addhar_front_pic[0].name
		);
	if (request.addhar_back_pic)
		formData.append('addhar_back_pic', request.addhar_back_pic[0], request.addhar_back_pic[0].name);

	return axios({
		method: 'POST',
		url: `/add_subadmin/`,
		data: formData,
	});
};

export type SalesExecutivesResponse = {
	user_id: string;
	first_name: string;
	last_name: string;
	mobile_no: string;
	assign_work_location: string;
	qr_holding: string;
	status: SubAdminStatus;
	local_address: string;
};

export const useGetSalesExecutivesApi = (
	request: PageRequest & SortRequest & { search?: string }
) => {
	return useQuery(['sales-excecutive', request], () =>
		axios<PaginationResponse<SalesExecutivesResponse>>({
			method: 'GET',
			url: `/for_subadmin_detail/`,
			params: request,
		})
	);
};

export const useGetAssignRolesApi = () => {
	return useQuery(['get-subadmin-roles'], () =>
		axios<{
			subAdminRolesData: {
				id: string;
				roles: string;
				add_datetime: string;
				updated_datetime: string;
			}[];
		}>({
			method: 'GET',
			url: `/get_subadmin_roles/`,
		})
	);
};
export type SubAdminCountResponse = {
	data: {
		activeRestaurantCount: number;
		addedRestaurantCount: number;
		activeSubadminCount: number;
		addedSubadminCount: number;
		totalUserCount: number;
	};
};

export const useGetSubAdminCountApi = () => {
	return useQuery(['admin_dashboard_count'], () =>
		axios<SubAdminCountResponse>({
			method: 'GET',
			url: `/admin_dashboard_count/`,
		})
	);
};

export const useGetWorkLocationApi = () => {
	return useQuery(['get_work_location'], () =>
		axios<{
			location_data: {
				id: string;
				location_name: string;
				location_added_datetime: string;
				location_updated_datetime: string;
			}[];
		}>({
			method: 'GET',
			url: `/get_work_location/`,
		})
	);
};

export const useGetStateApi = () => {
	return useQuery(['get_stateName'], () =>
		axios<{
			state_data: {
				id: string;
				state_name: string;
				state_added_datetime: string;
				state_updated_datetime: string;
			}[];
		}>({
			method: 'GET',
			url: `/get_stateName/`,
		})
	);
};

export const useDeleteSalesExecutivesApi = () => {
	return useMutation((info: { user_id: string; status: string }) =>
		axios({
			method: 'POST',
			url: `/change_subadmin_status/`,
			data: info,
		})
	);
};

export type SubAdminDetailsResponse = {
	data: {
		subadmin_details: {
			user_id: string;
			first_name: string;
			last_name: string;
			email: string;
			mobile_no: string;
			profile_pic: string;
			available_qr: number;
			subadmin_added_date: string;
			total_qr: number;
		};
		restaurant_data: {
			restaurant_id: string;
			restaurant_name: string;
			manager_no: string;
			restaurant_type: string;
			address: string;
			restaurant_added_date_time: string;
			status: RestaurantStatus;
		}[];
	};
};

export const useGetSubAdminDetailsApi = (id: string) => {
	return useQuery(['get_subadmin_restaurant'], () =>
		axios<SubAdminDetailsResponse>({
			method: 'GET',
			url: `/get_subadmin_restaurant/${id}/`,
		})
	);
};

export const useVerifySalesExecutivesMobileNumberApi = () => {
	return useMutation((info: { subadmin_contact_no: string }) =>
		axios({
			method: 'POST',
			url: `/verify_subadmin_contact_no/`,
			data: info,
		})
	);
};

export const useVerifySalesExecutivesAAdharApi = () => {
	return useMutation((info: { aadhar_no: string }) =>
		axios({
			method: 'POST',
			url: `/verify_subadmin_aadhar/`,
			data: info,
		})
	);
};
