import { FormError, Option } from '@interfaces/common';
import { validateForm } from '@utils/validateUtils';
import { validateImage } from '@utils/validator';
import axios from 'axios';
import { useMutation, useQuery } from 'react-query';

export type BannerRequest = {
	b1_restaurant_id: string | Option;
	b2_restaurant_id: string | Option;
	b3_restaurant_id: string | Option;
	b4_restaurant_id: string | Option;
	BannerImg1: FileList | string;
	BannerImg2: FileList | string;
	BannerImg3: FileList | string;
	BannerImg4: FileList | string;
	b1_publish_status: string;
	b2_publish_status: string;
	b3_publish_status: string;
	b4_publish_status: string;
};

export const validateBannerFields = (
	fieldName: keyof BannerRequest,
	formData: Partial<BannerRequest>
): string => {
	switch (fieldName) {
		case 'BannerImg1':
		case 'BannerImg2':
		case 'BannerImg3':
		case 'BannerImg4':
			return validateImage(formData[fieldName] as FileList);

		// case 'b1_restaurant_id':
		// case 'b2_restaurant_id':
		// case 'b3_restaurant_id':
		// case 'b4_restaurant_id':
		// 	return validateRestarant(formData[fieldName] as Option);

		default:
			return '';
	}
};
export const validateBannerForm = (
	formData: Partial<BannerRequest>
): FormError<Partial<BannerRequest>> => validateForm(formData, validateBannerFields);

export const useBannerPublishApi = () =>
	useMutation((info: { request: Partial<BannerRequest> }) => {
		const formData = new FormData();

		if (info.request.BannerImg1 && typeof info.request.BannerImg1 !== 'string')
			formData.append('BannerImg1', info.request.BannerImg1[0], info.request.BannerImg1[0].name);
		if (info.request.BannerImg2 && typeof info.request.BannerImg2 !== 'string')
			formData.append('BannerImg2', info.request.BannerImg2[0], info.request.BannerImg2[0].name);
		if (info.request.BannerImg3 && typeof info.request.BannerImg3 !== 'string')
			formData.append('BannerImg3', info.request.BannerImg3[0], info.request.BannerImg3[0].name);
		if (info.request.BannerImg4 && typeof info.request.BannerImg4 !== 'string')
			formData.append('BannerImg4', info.request.BannerImg4[0], info.request.BannerImg4[0].name);

		if (info.request.b1_restaurant_id)
			formData.append('b1_restaurant_id', (info.request.b1_restaurant_id as Option)?.value);
		if (info.request.b2_restaurant_id)
			formData.append('b2_restaurant_id', (info.request.b2_restaurant_id as Option)?.value);
		if (info.request.b3_restaurant_id)
			formData.append('b3_restaurant_id', (info.request.b3_restaurant_id as Option)?.value);
		if (info.request.b4_restaurant_id)
			formData.append('b4_restaurant_id', (info.request.b4_restaurant_id as Option)?.value);

		if (info.request.b1_publish_status)
			formData.append('b1_publish_status', info.request.b1_publish_status);
		if (info.request.b2_publish_status)
			formData.append('b2_publish_status', info.request.b2_publish_status);
		if (info.request.b3_publish_status)
			formData.append('b3_publish_status', info.request.b3_publish_status);
		if (info.request.b4_publish_status)
			formData.append('b4_publish_status', info.request.b4_publish_status);

		return axios({
			method: 'POST',
			url: `/update_banner_new/`,
			data: formData,
		});
	});

export const useBannerUnPublishApi = () => {
	return useMutation((info: { request: { restaurant_id: string; banner_number: string } }) => {
		const formData = new FormData();

		formData.append('banner_number', info.request.banner_number);
		formData.append('restaurant_id', info.request.restaurant_id);
		return axios({
			method: 'POST',
			url: `/unpublish_banner/`,
			data: info.request,
		});
	});
};

export type BannerResponse = {
	data: {
		restaurant_id: string;
		banner_1: string;
		banner_2: string;
		banner_3: string;
		banner_4: string;
		added_datetime: string;
		updated_datetime: string;
	};
};

export const useGetBannerApi = (id: string) => {
	return useQuery(
		['get_banner_admin', id],
		() =>
			axios<BannerResponse>({
				method: 'GET',
				url: `/get_banner_admin/${id}/`,
			}),
		{ enabled: Boolean(id), retry: 0 }
	);
};

export type BannerRestaurantNameResponse = {
	restaurant_list: Option[];
};
export const useGetBannerRestaurantNamesApi = () => {
	return useQuery(['get_restaurants_name'], () =>
		axios<BannerRestaurantNameResponse>({
			method: 'GET',
			url: `/get_restaurants_name/`,
		})
	);
};

export type InitialBannerResponse = {
	data: {
		banner_count: number;
		banner_id: string;
		banner_1: string;
		b1_restaurant_id: string;
		banner_2: string;
		b2_restaurant_id: string;
		banner_3: string;
		b3_restaurant_id: string;
		banner_4: string;
		b4_restaurant_id: string;
		b1_publish_status: string;
		b2_publish_status: string;
		b3_publish_status: string;
		b4_publish_status: string;
		added_datetime: string;
		updated_datetime: string;
	}[];
};

export const useGetInitialBannersApi = () => {
	return useQuery(['get_banner_admin_new'], () =>
		axios<InitialBannerResponse>({
			method: 'GET',
			url: `/get_banner_admin_new/`,
		})
	);
};
