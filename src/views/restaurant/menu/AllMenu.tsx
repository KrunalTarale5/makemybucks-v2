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
	RestaurantMenuResponse,
	useGetRestaurantMenusApi,
	useRestaurantChangeStatusMenuApi,
} from '@hooks/restaurant-menu';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '@components/Snackbar';
import { RESTAURANT_BASE_URL, generateSerialNumber } from '@utils/common';

interface AllMenuProps {
	searchInputRef: HTMLInputElement | null;
	refetch: boolean;
	handleRefetch: () => void;
}

const AllMenu: FC<AllMenuProps> = (props) => {
	const theme = useTheme();
	const navigate = useNavigate();
	const { showSnackbar, hideSnackbar } = useSnackbar();

	const RestaurantChangeStatusMenuApi = useRestaurantChangeStatusMenuApi();

	const [openCategoryDialog, setOpenCategoryDialog] = useState<Option | null>(null);
	const [pageRequest, setPageRequest] = useState<PageRequest>({
		page: 1,
		size: 10,
	});
	const [sortRequest, setSortRequest] = useState<SortRequest>({});

	const GetRestaurantMenusApi = useGetRestaurantMenusApi({
		...pageRequest,
		...sortRequest,
		search: (props.searchInputRef as HTMLInputElement)?.value,
	});

	const handleStatus = (id: number) => () => {
		RestaurantChangeStatusMenuApi.mutateAsync({ id: String(id) })
			.then((response) => {
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
				void GetRestaurantMenusApi.refetch();
				props.handleRefetch();
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

	const rows =
		(GetRestaurantMenusApi.data?.data.data as PaginationResponse<RestaurantMenuResponse>['data']) ??
		[];
	type Row = (typeof rows)[number];
	const columns: ColumnDef<Row>[] = [
		{
			field: 'S No.',
			renderHeader: () => `S No.`,
			renderCell: ({ rowNumber }) =>
				generateSerialNumber(
					GetRestaurantMenusApi.data?.data.page ?? 0,
					GetRestaurantMenusApi.data?.data.size ?? 0,
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
			field: 'menu_name',
			renderHeader: () => `Dish Name`,
			renderCell: ({ row }) => (
				<Stack
					flexDirection={'row'}
					gap={1.5}
					alignItems={'center'}
				>
					<IconFinder
						iconName='Star'
						iconProps={{
							width: 16,
							height: 16,
							...(row.recomended_status === 'no' && { fill: 'transparent' }),
						}}
					/>
					{row['menu_name']}

					{row.menu_type_icon && (
						<img
							src={row.menu_type_icon}
							width={16}
							height={16}
						/>
					)}
				</Stack>
			),
			tableCellProps: {
				sx: {
					width: 600,
				},
			},
			tableHeaderProps: {
				sx: {
					paddingLeft: `20px`,
				},
			},
		},
		{
			field: 'price',
			renderHeader: () => `Price (₹)`,
			renderCell: ({ row }) => row.price,
			tableCellProps: {
				sx: {
					width: 400,
				},
			},
		},
		{
			field: 'cat_name',
			renderHeader: () => `Category`,
			renderCell: ({ row }) => row.cat_name,
			sortable: true,
		},
		{
			field: 'edit',
			renderHeader: () => `Edit`,
			renderCell: ({ row }) => (
				<IconButton
					size='small'
					onClick={() => navigate(`/${RESTAURANT_BASE_URL}/menu/update/${row.menu_id}`)}
				>
					<IconFinder
						iconName='Pen'
						iconProps={{ fill: theme.palette.common.primaryGreyText }}
					/>
				</IconButton>
			),
			tableHeaderProps: {
				sx: {
					justifyContent: 'right',
				},
			},
			tableCellProps: {
				sx: {
					textAlign: '-webkit-right',
				},
			},
		},
		{
			field: 'Status',
			renderHeader: () => `Status`,
			renderCell: ({ row }) => (
				<span title={Number(row.cat_status) === 0 ? 'Connected Category is disabled.' : ''}>
					<SwitchButton
						checked={Number(row.menu_status) === 1 ? true : false}
						onChange={handleStatus(row.menu_id)}
						disabled={Number(row.cat_status) === 0}
					/>
				</span>
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

	const handlePage = (page: number) => {
		setPageRequest({ ...pageRequest, page });
	};

	useEffect(() => {
		if (props.refetch) {
			void GetRestaurantMenusApi.refetch();
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
				loading={GetRestaurantMenusApi.isLoading}
			/>
			<Stack>
				<PoppinsTypography>
					{`Showing Result ${GetRestaurantMenusApi.data?.data.recordsFiltered ?? 0} Out of ${
						GetRestaurantMenusApi.data?.data.size ?? 0
					}`}
				</PoppinsTypography>

				<Pagination
					page={pageRequest.page}
					size={GetRestaurantMenusApi.data?.data.size ?? 0}
					totalPages={GetRestaurantMenusApi.data?.data.pagesTotal ?? 0}
					onPageChange={handlePage}
				/>
			</Stack>
			<AddUpdateCategoryDialog
				open={Boolean(openCategoryDialog)}
				updateItem={openCategoryDialog as Option}
				heading='Update Category'
				handleClose={() => setOpenCategoryDialog(null)}
			/>
		</Stack>
	);
};

export default memo(AllMenu);
