import Pagination from '@components/Pagination';
import Table, { ColumnDef } from '@components/Table';
import { QrCodeHistoryResponse, useGetQrCodeHistoryApi } from '@hooks/admin-qrcode';
import { PageRequest, PaginationResponse, SortRequest } from '@interfaces/common';
import { Stack, useTheme } from '@mui/material';
import { generateSerialNumber } from '@utils/common';
import moment from 'moment';
import { memo, useRef, useState } from 'react';

const HistoryTableTab = () => {
	const theme = useTheme();
	const searchInputRef = useRef<HTMLInputElement | null>(null);

	const [pageRequest, setPageRequest] = useState<PageRequest>({
		page: 1,
		size: 10,
	});

	const [sortRequest, setSortRequest] = useState<SortRequest>({});

	const GetQrCodeHistoryApi = useGetQrCodeHistoryApi({
		...pageRequest,
		...sortRequest,
		search: searchInputRef.current?.value,
	});

	const handlePage = (page: number) => {
		setPageRequest({ ...pageRequest, page });
	};

	const rows: PaginationResponse<QrCodeHistoryResponse>['data'] =
		GetQrCodeHistoryApi.data?.data.data ?? [];
	type Row = (typeof rows)[number];
	const columns: ColumnDef<Row>[] = [
		{
			field: 'SL No',
			renderHeader: () => `SL No`,
			renderCell: ({ rowNumber }) =>
				generateSerialNumber(
					GetQrCodeHistoryApi.data?.data.page ?? 0,
					GetQrCodeHistoryApi.data?.data.size ?? 0,
					rowNumber
				),
			tableCellProps: {
				sx: {
					width: 150,
				},
			},
			tableCellTypographySx: {
				paddingLeft: theme.spacing(1),
			},
			tableHeaderProps: {
				sx: {
					width: 150,
				},
			},
		},
		{
			field: 'action',
			renderHeader: () => `Action`,
			renderCell: ({ row }) => row.action,
			tableCellProps: {
				sx: {
					width: 500,
				},
			},
			tableHeaderProps: {
				sx: {
					width: 500,
				},
			},
			sortable: true,
		},
		{
			field: 'by_or_to_id',
			renderHeader: () => 'By/To',
			renderCell: ({ row }) => row.by_or_to_id,
			tableCellProps: {
				sx: {
					width: 300,
				},
			},
			tableHeaderProps: {
				sx: {
					width: 300,
				},
			},
			sortable: true,
		},
		{
			field: 'added_datetime',
			renderHeader: () => `Date`,
			renderCell: ({ row }) => moment(row.added_datetime ?? '').format('DD MMM YYYY'),
			tableCellProps: {
				sx: {
					width: 300,
				},
			},
			tableHeaderProps: {
				sx: {
					width: 300,
				},
			},
			sortable: true,
		},

		{
			field: 'qr_number',
			renderHeader: () => `Number`,
			renderCell: ({ row }) => row.qr_number,
			tableCellProps: {
				sx: {
					width: 150,
					textAlign: '-webkit-left',
					paddingRight: theme.spacing(6),
				},
			},
			tableHeaderProps: {
				sx: {
					width: 150,
					justifyContent: 'left',
				},
			},
		},
	];

	return (
		<Stack
			gap={2}
			flexGrow={'inherit'}
		>
			<Table
				rows={rows}
				columns={columns as any}
				rowId={(row) => row.id as string}
				tableProps={{ size: 'small', stickyHeader: false }}
				tableRowProps={{ hover: true }}
				onSortChange={(sort) => {
					setSortRequest({ sort_by: sort?.field as string, order: sort?.order });
				}}
				loading={GetQrCodeHistoryApi.isLoading}
			/>
			<Pagination
				page={pageRequest.page}
				size={(GetQrCodeHistoryApi.data?.data.size as number) ?? 0}
				totalPages={(GetQrCodeHistoryApi.data?.data.pagesTotal as number) ?? 0}
				onPageChange={handlePage}
			/>
		</Stack>
	);
};

export default memo(HistoryTableTab);
