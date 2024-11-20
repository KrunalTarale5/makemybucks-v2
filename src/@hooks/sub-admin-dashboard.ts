import { RestaurantStatus } from '@interfaces/common';
import axios from 'axios';
import { useQuery } from 'react-query';

export type SubDashboardCountResponse = {
	data: {
		active_sub_admin_count: number;
		added_sub_admin_count: number;
		available_qr_count: number;
		recently_added_restaurants: {
			restaurant_name: string;
			added_date_time: string;
			address: string;
			location: string;
			status: RestaurantStatus;
		}[];
	};
};

export const useGetSubDashboardCountApi = () => {
	return useQuery(['get_subAdmin_count'], () =>
		axios<SubDashboardCountResponse>({
			method: 'GET',
			url: `/dashboard_subAdmin_count/`,
		})
	);
};
