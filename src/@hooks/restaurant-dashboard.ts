import axios from 'axios';
import { useQuery } from 'react-query';

export type RestaurantDashboardResponse = {
	s_no: string;
	customer_name: string;
	transaction_time: string;
	total_amount: string;
	discounted_amount: string;
	settlement_amount: string;
	settlement_status: string;
};

export const useGetDashboardCountApi = () => {
	return useQuery(['get_restaurant_dashboard_count'], () =>
		axios<{
			data: {
				upcoming_settlement: string;
				profit_payback: string;
				todays_transaction: string;
				active_offer: string;
				'Total Onboarded': string;
			};
		}>({
			method: 'GET',
			url: `/get_restaurant_dashboard_count/`,
		})
	);
};
