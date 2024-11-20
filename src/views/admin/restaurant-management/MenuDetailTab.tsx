import Pagination from '@components/Pagination';
import Table, { ColumnDef } from '@components/Table';
import {
	RestaurantMenuResponse,
	useGetRestaurentsMenusApi,
} from '@hooks/admin-restaurant-management';
import { PageRequest, PaginationResponse, SortRequest } from '@interfaces/common';
import { Stack, useTheme } from '@mui/material';
import { generateSerialNumber } from '@utils/common';
import { memo, useState } from 'react';
import { useParams } from 'react-router-dom';

function MenuDetailTab() {
	const theme = useTheme();
	const { id } = useParams() as { id: string };

	const [pageRequest, setPageRequest] = useState<PageRequest>({
		page: 1,
		size: 10,
	});
	const [sortRequest, setSortRequest] = useState<SortRequest>({});

	const GetRestaurentsMenusApi = useGetRestaurentsMenusApi(id, { ...pageRequest, ...sortRequest });

	const handlePage = (page: number) => {
		setPageRequest({ ...pageRequest, page });
	};
	const rows: PaginationResponse<RestaurantMenuResponse>['data'] =
		GetRestaurentsMenusApi.data?.data.data ?? [];
	type Row = (typeof rows)[number];
	const columns: ColumnDef<Row>[] = [
		{
			field: 'SLNo',
			renderHeader: () => 'SL No',
			renderCell: ({ rowNumber }) =>
				generateSerialNumber(
					GetRestaurentsMenusApi.data?.data.page ?? 0,
					GetRestaurentsMenusApi.data?.data.size ?? 0,
					rowNumber
				),
			tableCellTypographySx: {
				paddingLeft: theme.spacing(1),
			},
		},
		{
			field: 'menu_name',
			renderHeader: () => `Dish Name`,
			renderCell: ({ row }) => row.menu_name,
			tableCellProps: {
				sx: {
					width: 550,
				},
			},
		},
		{
			field: 'type_name',
			renderHeader: () => 'Type',
			renderCell: ({ row }) => row.type_name,
		},
		{
			field: 'cat_name',
			renderHeader: () => `Category`,
			renderCell: ({ row }) => row.cat_name,
		},
		{
			field: 'price',
			renderHeader: () => `Price (₹)`,
			renderCell: ({ row }) => row.price,
			tableCellProps: {
				sx: {
					width: 130,
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
				loading={GetRestaurentsMenusApi.isLoading}
			/>
			<Pagination
				page={pageRequest.page}
				size={GetRestaurentsMenusApi.data?.data.size as number}
				totalPages={GetRestaurentsMenusApi.data?.data.pagesTotal as number}
				onPageChange={handlePage}
			/>
		</Stack>
	);
}

export default memo(MenuDetailTab);
