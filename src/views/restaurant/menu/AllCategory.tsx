import IconFinder from '@components/Icon';
import Pagination from '@components/Pagination';
import SwitchButton from '@components/SwitchButton';
import Table, { ColumnDef } from '@components/Table';
import { PoppinsTypography } from '@components/Typography';
import { Option, PageRequest, PaginationResponse, SortRequest } from '@interfaces/common';
import { IconButton, Stack, useTheme } from '@mui/material';
import { FC, memo, useEffect, useState } from 'react';
import AddUpdateCategoryDialog from './AddUpdateCategoryDialog';
import {
	RestaurantCategoriesResponse,
	useGetRestaurantCategoriesApi,
	useRestaurantChangeStatusCategoryApi,
} from '@hooks/restaurant-category';
import { useSnackbar } from '@components/Snackbar';
import { generateSerialNumber } from '@utils/common';

interface AllCategoryProps {
	searchInputRef: HTMLInputElement | null;
	refetch: boolean;
	handleRefetch: () => void;
}

const AllCategory: FC<AllCategoryProps> = (props) => {
	const theme = useTheme();
	const { showSnackbar, hideSnackbar } = useSnackbar();

	const RestaurantChangeStatusCategoryApi = useRestaurantChangeStatusCategoryApi();

	const [openCategoryDialog, setOpenCategoryDialog] = useState<Option | null>(null);

	const [pageRequest, setPageRequest] = useState<PageRequest>({
		page: 1,
		size: 10,
	});
	const [sortRequest, setSortRequest] = useState<SortRequest>({});

	const GetRestaurantCategoriesApi = useGetRestaurantCategoriesApi({
		...pageRequest,
		...sortRequest,
		search: (props.searchInputRef as HTMLInputElement)?.value,
	});

	const rows =
		(GetRestaurantCategoriesApi.data?.data
			.data as PaginationResponse<RestaurantCategoriesResponse>['data']) ?? [];
	type Row = (typeof rows)[number];
	const columns: ColumnDef<Row>[] = [
		{
			field: 'sr',
			renderHeader: () => `S No.`,
			renderCell: ({ rowNumber }) =>
				generateSerialNumber(
					GetRestaurantCategoriesApi.data?.data.page ?? 0,
					GetRestaurantCategoriesApi.data?.data.size ?? 0,
					rowNumber
				),
			tableCellProps: {
				sx: {
					width: 100,
				},
			},
			tableCellTypographySx: {
				paddingLeft: theme.spacing(1),
			},
		},
		{
			field: 'categories_name',
			renderHeader: () => `Category Name`,
			renderCell: ({ row }) => row.categories_name,
			tableCellProps: {
				sx: {
					width: 600,
				},
			},
		},
		{
			field: 'total_items',
			renderHeader: () => `Total Item`,
			renderCell: ({ row }) => row.total_items,
			tableCellProps: {
				sx: {
					width: 400,
				},
			},
		},
		{
			field: 'Edit',
			renderHeader: () => `Edit`,
			renderCell: ({ row }) => (
				<IconButton
					size='small'
					onClick={() =>
						setOpenCategoryDialog({
							label: row.categories_name,
							value: row.categories_id,
						})
					}
				>
					<IconFinder
						iconName='Pen'
						iconProps={{ fill: theme.palette.common.primaryGreyText }}
					/>
				</IconButton>
			),
		},
		{
			field: 'Status',
			renderHeader: () => `Status`,
			renderCell: ({ row }) => (
				<SwitchButton
					checked={Number(row.categories_status) === 1 ? true : false}
					onChange={handleStatus(row.categories_id)}
				/>
			),
			tableHeaderProps: {
				sx: {
					justifyContent: 'right',
				},
			},
			tableCellProps: {
				sx: {
					textAlign: '-webkit-right',
					paddingRight: theme.spacing(6),
				},
			},
			sortable: true,
		},
	];

	const handleStatus = (id: string) => () => {
		RestaurantChangeStatusCategoryApi.mutateAsync({ id })
			.then((response) => {
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
				props.handleRefetch();
				void GetRestaurantCategoriesApi.refetch();
			})
			.catch((error) => {
				showSnackbar({
					title: 'Error!',
					variant: 'error',
					content: error.response?.data?.message,
					onCancel: () => hideSnackbar(),
				});
			});
	};

	const handlePage = (page: number) => {
		setPageRequest({ ...pageRequest, page });
	};

	useEffect(() => {
		if (props.refetch) {
			void GetRestaurantCategoriesApi.refetch();
			props.handleRefetch();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.refetch]);

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
				loading={GetRestaurantCategoriesApi.isLoading}
			/>
			<Stack>
				<PoppinsTypography>
					{`Showing Result ${GetRestaurantCategoriesApi.data?.data.recordsFiltered ?? 0} Out of ${
						GetRestaurantCategoriesApi.data?.data.size ?? 0
					}`}
				</PoppinsTypography>

				<Pagination
					page={pageRequest.page}
					size={GetRestaurantCategoriesApi.data?.data.size ?? 0}
					totalPages={GetRestaurantCategoriesApi.data?.data.pagesTotal ?? 0}
					onPageChange={handlePage}
				/>
			</Stack>
			<AddUpdateCategoryDialog
				open={Boolean(openCategoryDialog)}
				updateItem={openCategoryDialog as Option}
				heading='Update Category'
				handleClose={() => setOpenCategoryDialog(null)}
				refetch={() => void GetRestaurantCategoriesApi.refetch()}
			/>
		</Stack>
	);
};

export default memo(AllCategory);
