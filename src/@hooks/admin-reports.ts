import axios from 'axios';
import { useMutation, useQuery } from 'react-query';

type CoordinateRequest = { filter?: string; calendar?: string; year?: string; month?: string };

export const useGetTotalUserCoordApi = (request: CoordinateRequest) =>
	useQuery(['transaction_and_usergraph', request], () =>
		axios<{
			data: {
				x_axis: string[];
				y_axis: number[];
			};
		}>({
			method: 'GET',
			url: `/transaction_and_usergraph/`,
			params: request,
		})
	);

export const useGetTotalPaybackCoordApi = (request: CoordinateRequest) =>
	useQuery(['investment_paybackgraph', request], () =>
		axios<{
			data: {
				x_axis: string[];
				y_axis: number[];
			};
		}>({
			method: 'GET',
			url: `/investment_paybackgraph/`,
			params: request,
		})
	);

export type DownloadReportRequest = {
	url: string;
	request?: { year?: number; month?: number | string; date?: string };
};

export type DownloadReportRequest2 = {
	url: string;
	request?: { year?: number; quarter?: number | string; date?: string };
};

export const useDownloadReportApi = () =>
	useMutation((info: DownloadReportRequest) =>
		axios<{
			message: string;
			file_name: string;
			download_link: string;
		}>({
			method: 'POST',
			url: `/${info.url}/`,
			params: info.request,
		})
	);
