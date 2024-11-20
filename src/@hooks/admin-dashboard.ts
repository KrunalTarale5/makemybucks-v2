import axios from 'axios';
import { useQuery } from 'react-query';

export type DashboardCountResponse = {
	data: {
		active_restaurant_count: number;
		added_restaurant_count: number;
		new_users: number;
		pending_activation_count: number;
		pending_approval_count: number;
		total_users: number;
		total_investment: number;
		total_profit: number;
		total_revenue: number;
		todays_revenue_count: number;
		settlement_amount: number;
	};
};

export const useGetDashboardCountApi = () => {
	return useQuery(['get_dashboard_count'], () =>
		axios<DashboardCountResponse>({
			method: 'GET',
			url: `/dashboard_restaurant_count/`,
		})
	);
};

type CoordinateRequest = { filter?: string; calendar?: string; year?: string; month?: string };

export const useGetTotalRestaurentCoordApi = (request: CoordinateRequest) =>
	useQuery(['total_restaurantGraph_count', request], () =>
		axios<{
			data: {
				x_axis: string[];
				y_axis: number[];
			};
		}>({
			method: 'GET',
			url: `/total_restaurantGraph_count/`,
			params: request,
		})
	);

export const useGetTotalUserCoordApi = (request: CoordinateRequest) =>
	useQuery(['total_userGraph_count', request], () =>
		axios<{
			data: {
				x_axis: string[];
				y_axis: number[];
			};
		}>({
			method: 'GET',
			url: `/total_userGraph_count/`,
			params: request,
		})
	);

export const useGetTotalTransactionCoordApi = (request: CoordinateRequest) =>
	useQuery(['total_transaction_admingraph', request], () =>
		axios<{
			data: {
				x_axis: string[];
				y_axis: number[];
			};
		}>({
			method: 'GET',
			url: `/total_transaction_admingraph/`,
			params: request,
		})
	);
