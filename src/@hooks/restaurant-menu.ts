import {
	FormError,
	MenuRecomendedType,
	MenuType,
	Option,
	PageRequest,
	PaginationResponse,
	RestaurantCategoryStatus,
	RestaurantMenuStatus,
	SortRequest,
} from '@interfaces/common';
import { validateForm } from '@utils/validateUtils';
import {
	validateMenuCategoryName,
	validateMenuName,
	validateMenuTypeName,
	validatePrice,
} from '@utils/validator';
import axios, { AxiosRequestConfig } from 'axios';
import { useMutation, useQuery } from 'react-query';

export const validateMenuFormFields = (
	fieldName: keyof Partial<RestaurantMenusRequest>,
	formData: Partial<RestaurantMenusRequest>
): string => {
	switch (fieldName) {
		case 'type_id':
			return validateMenuTypeName(formData[fieldName] as string);
		case 'cat_id':
			return validateMenuCategoryName(formData[fieldName] as string | Option);
		case 'menu_name':
			return validateMenuName(String(formData[fieldName]));
		case 'price':
			return validatePrice(String(formData[fieldName]));

		default:
			return '';
	}
};

export const validateMenuForm = (
	formData: Partial<RestaurantMenusRequest>
): FormError<Partial<RestaurantMenusRequest>> => validateForm(formData, validateMenuFormFields);

export type RestaurantMenuResponse = {
	menu_id: number;
	cat_id: string;
	restaurant_id: string;
	type_id: MenuType;
	menu_name: string;
	menu_desc: string;
	price: number;
	menu_status: RestaurantMenuStatus;
	menu_added_datetime: string;
	menu_update_datetime: string;
	cat_name: string;
	menu_img: string;
	recomended_status: MenuRecomendedType;
	type_name: MenuType;
	cat_status: RestaurantCategoryStatus;
	menu_type_icon: string;
};

export const useGetRestaurantMenusApi = (
	request: PageRequest & SortRequest & { search?: string }
) =>
	useQuery(['get_menu_list', request], () =>
		axios<PaginationResponse<RestaurantMenuResponse>>({
			method: 'GET',
			url: `/get_menu_list/`,
			params: request,
		})
	);

export const useGetRestaurantMenuApi = (id: string) =>
	useQuery(
		['get_menu_list_id', [id]],
		() =>
			axios<{ data: RestaurantMenuResponse }>({
				method: 'GET',
				url: `/get_menu_list/${id}/`,
			}),
		{ enabled: Boolean(id) }
	);

export type RestaurantMenusRequest = {
	cat_id: Option | string;
	type_id: MenuType | null;
	menu_name: string;
	menu_desc: string;
	price: string | number;
	menu_img: FileList | string;
	recomended_status: MenuRecomendedType;
};

export const useAddRestaurantMenuApi = () =>
	useMutation((info: { request: RestaurantMenusRequest }) => {
		const formData = new FormData();
		Object.keys(info.request).forEach((l) => {
			if (!(l === 'menu_img')) {
				formData.append(l, info.request[l as keyof RestaurantMenusRequest] as string);
			}
		});
		if (info.request.menu_img && typeof info.request.menu_img !== 'string')
			formData.append('menu_img', info.request.menu_img[0], info.request.menu_img[0].name);
		return axios({
			method: 'POST',
			url: `/add_restaurant_menu/`,
			data: formData,
		});
	});

export const useRestaurantChangeStatusMenuApi = () => {
	return useMutation((info: { id: string }) =>
		axios({
			method: 'POST',
			url: `/change_menu_status/${info.id}/`,
		})
	);
};

export const useUpdateRestaurantMenuApi = () =>
	useMutation((info: { id: string; request: RestaurantMenusRequest }) => {
		const formData = new FormData();
		Object.keys(info.request).forEach((l) => {
			if (!(l === 'menu_img')) {
				formData.append(l, info.request[l as keyof RestaurantMenusRequest] as string);
			}
		});
		if (info.request.menu_img && typeof info.request.menu_img !== 'string')
			formData.append('menu_img', info.request.menu_img[0], info.request.menu_img[0].name);
		return axios({
			method: 'POST',
			url: `/update_restaurant_menu/${info.id}/`,
			data: formData,
		});
	});

export type RestaurantCountResponse = {
	data: {
		outof_stock_menu_count: number;
		all_menu_count: number;
		all_categories_count: number;
		inactive_categories_count: number;
	};
};

export const useGetRestaurantCountsApi = () =>
	useQuery(['get_restaurant_count'], () =>
		axios<RestaurantCountResponse>({
			method: 'GET',
			url: `/get_restaurant_count/`,
		})
	);

export const uploadRestaurantMenuExcelApi = (file: FileList): AxiosRequestConfig => {
	const formData = new FormData();
	formData.append('file', file[0], file[0].name);
	return {
		method: 'POST',
		url: `/upload_menu_excel/`,
		data: formData,
	};
};

export const useGetRestaurantMenusTypesApi = () =>
	useQuery(['get_menu_type'], () =>
		axios<{
			menuTypeData: {
				menu_type_id: string;
				menu_type_name: string;
				menu_type_icon: string;
				menu_type_status: MenuType;
				added_datetime: string;
			}[];
		}>({
			method: 'GET',
			url: `/get_menu_type/`,
		})
	);
