import {
	PageRequest,
	PaginationResponse,
	RestaurantCategoryStatus,
	SortRequest,
} from '@interfaces/common';
import axios from 'axios';
import { useMutation, useQuery } from 'react-query';

export type RestaurantCategoriesResponse = {
	categories_id: string;
	categories_name: string;
	restaurant_id: string;
	categories_status: RestaurantCategoryStatus;
	total_items: number;
	added_datetime: string;
	update_datetime: string;
};

export const useGetRestaurantCategoriesApi = (
	request: PageRequest & SortRequest & { search?: string }
) =>
	useQuery(['get_menu_categories', request], () =>
		axios<PaginationResponse<RestaurantCategoriesResponse>>({
			method: 'GET',
			url: `/get_menu_categories/`,
			params: request,
		})
	);

export const useRestaurantAddCategoryApi = () => {
	return useMutation(
		(info: {
			request: {
				categories_name: string;
			};
		}) =>
			axios({
				method: 'POST',
				url: `/add_restaurant_category/`,
				data: info.request,
			})
	);
};

export const useRestaurantUpdateCategoryApi = () => {
	return useMutation(
		(info: {
			request: {
				categories_name: string;
				categories_id: string;
			};
		}) =>
			axios({
				method: 'POST',
				url: `/update_restaurant_category/`,
				data: info.request,
			})
	);
};

export const useRestaurantChangeStatusCategoryApi = () => {
	return useMutation((info: { id: string }) =>
		axios({
			method: 'POST',
			url: `/change_category_status/${info.id}/`,
		})
	);
};

export const useGetAllRestaurantCategoriesApi = () =>
	useQuery(['get_restaurant_all_categories'], () =>
		axios<{ data: RestaurantCategoriesResponse[] }>({
			method: 'GET',
			url: `/get_restaurant_all_categories/`,
		})
	);
