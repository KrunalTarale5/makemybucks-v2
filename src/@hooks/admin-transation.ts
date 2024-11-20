import axios from 'axios';
import { useMutation, useQuery } from 'react-query';

export const useGetTransactionFeesApi = () =>
	useQuery(['get_transaction_fees'], () =>
		axios<{
			response_data: {
				clickable: boolean;
				id: number;
				transaction_fees: string;
				updated_datetime: string;
				valid_date: string;
			};
		}>({
			method: 'GET',
			url: `/get_transaction_fees/1/`,
		})
	);

export const useUpdateTransactionFeesApi = () => {
	return useMutation((info: { request: { transaction_fee: string } }) =>
		axios({
			method: 'Put',
			url: `/update_transaction_fees/1/`,
			data: info.request,
		})
	);
};
export type InvestmentDataResponse = {
	data: {
		current_investment: string;
		current_payback: string;
		total_investment: string;
		total_payback_amount: string;
		transaction_data: {
			date: string;
			total_investment: string;
			total_commission: string;
			gst_commission: string;
			total_transaction: string;
			total_gst: string;
		}[];
	};
};

export const useGetInvestmentDataApi = (request?: { data_type: string }) =>
	useQuery(['get_investment_data', request], () =>
		axios<InvestmentDataResponse>({
			method: 'GET',
			url: `/get_investment_data/`,
			params: request,
		})
	);

export const useGetProfitApi = () =>
	useQuery(['get_profit_for_month/3/'], () =>
		axios<{
			profit_id: string;
			profit_for_month: string;
			month: string;
			valid_date: boolean;
			clickable: boolean;
		}>({
			method: 'GET',
			url: `/get_profit_for_month/3/`,
		})
	);

export const useUpdateProfitApi = () => {
	return useMutation((info: { request: { profit_for_month: string } }) =>
		axios({
			method: 'POST',
			url: `/add_profit_for_month/`,
			data: info.request,
		})
	);
};

export const usePaybackTransactionApi = () => {
	return useMutation((info: { request: { profit_for_month: string } }) =>
		axios({
			method: 'POST',
			url: `/payback_transaction/`,
		})
	);
};
//payback_transaction

export type PaybackResponse = {
	data: {
		total_payback_amount: string;
		total_investment: string;
		current_payback: string;
		current_investment: string;
		payback_data: {
			month_year: string;
			total_disbursable_amount: string;
			payback_to_user: string;
			payback_to_restaurant: string;
		}[];
	};
};
export const useGetPaybackApi = () =>
	useQuery(['get_monthly_payback_data'], () =>
		axios<PaybackResponse>({
			method: 'GET',
			url: `/get_monthly_payback_data/`,
		})
	);
