import { TextFieldProps } from '@mui/material';

export type Option = {
	label: string;
	value: string;
};

export type FieldProps = {
	/**
	 * @default
	 * text
	 */
	fieldType?: 'text' | 'number' | 'mobile-number' | 'date' | 'select' | 'multple-select' | 'upload';
	label: React.ReactNode;
	/**
	 * Options shows when fieldType='select'
	 */
	options?: Option[];
} & Partial<Omit<TextFieldProps, 'value' | 'name' | 'label' | 'select'>>;

export type FormErrorMessage<T> = {
	[key in keyof T]: string;
};

export type FormError<T> = {
	errors: FormErrorMessage<T>;
	hasError: boolean;
};

export type ErrorValues = {
	[k: string]: string[] | string;
};
export type SanitizeErrors = {
	[k: string]: string;
};

export type PageRequest = {
	page: number;
	size: number;
};

export type PaginationResponse<T> = {
	recordsTotal: number;
	recordsFiltered: number;
	pagesTotal: number;
	data: T[];
} & PageRequest;

export type SortRequest = Partial<{
	sort_by: string;
	order: 'asc' | 'desc';
}>;

export const Status = {
	'0': 'Pending',
	'1': 'Active',
	'2': 'Rejected',
};
export type Status = keyof typeof Status;

export const SubAdminStatus = {
	'0': 'pending',
	'1': 'active',
	'2': 'inactive ',
	'3': 'deactivated',
};
export type SubAdminStatus = keyof typeof SubAdminStatus;

export const RestaurantStatus = {
	'0': 'approval pending',
	'1': 'approved',
	'2': 'activation pending',
	'3': 'active',
	'4': 'disabled',
	'5': 'reject',
};
export type RestaurantStatus = keyof typeof RestaurantStatus;

export const UserStatus = {
	'0': 'Active',
	'1': 'Inactive',
};
export type UserStatus = keyof typeof UserStatus;

export const KycStatus = {
	pending: 'Pending',
	verified: 'Done',
};
export type KycStatus = keyof typeof KycStatus;

export const UserKycStatus = {
	Pending: 'Pending',
	Verified: 'Verified',
};
export type UserKycStatus = keyof typeof UserKycStatus;

export const RestaurantProfileStatus = {
	'0': 'aprovalpending',
	'1': 'approved',
	'2': 'activationpending ',
	'3': 'active',
	'4': 'disabled',
};
export type RestaurantProfileStatus = keyof typeof RestaurantProfileStatus;

export const WeekDays = {
	mon: true,
	tue: true,
	wed: true,
	thu: true,
	fri: true,
	sat: true,
	sun: true,
};

export type WeekDays = keyof typeof WeekDays;

export const MenuType = {
	'0': 'Non-veg',
	'1': 'Veg',
};
export type MenuType = keyof typeof MenuType;

export const MenuRecomendedType = {
	no: false,
	yes: true,
};
export type MenuRecomendedType = keyof typeof MenuRecomendedType;

export const RestaurantCategoryStatus = {
	'1': 'active',
	'0': 'inactive ',
};
export type RestaurantCategoryStatus = keyof typeof RestaurantCategoryStatus;

export const RestaurantMenuStatus = RestaurantCategoryStatus;
export type RestaurantMenuStatus = keyof typeof RestaurantMenuStatus;

export const OwnersStatus = {
	'0': 'approval pending',
	'1': 'approved',
	'2': 'deactivate',
	'3': 'reject',
};
export type OwnersStatus = keyof typeof OwnersStatus;

export const NavNotificationStatus = {
	'1': 'active',
	'0': 'inactive ',
};
export type NavNotificationStatus = keyof typeof NavNotificationStatus;
