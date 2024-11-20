import { AdminCards } from '@components/Cards';
import IconFinder from '@components/Icon';
import Table, { ColumnDef } from '@components/Table';
import { IconButton, Stack, TextField, useTheme } from '@mui/material';
import { memo, useRef, useState } from 'react';
import Pagination from '@components/Pagination';
import {
	RestaurantResponse,
	useChangeRestaurantStatusApi,
	useGetRestaurentsApi,
	useGetRestaurentsCountApi,
} from '@hooks/admin-restaurant-management';
import { PageRequest, PaginationResponse, SortRequest } from '@interfaces/common';
import { useAlertDialog } from '@components/AlertDialog';
import { useNavigate } from 'react-router-dom';
import { useRestaurantStatus } from '@hooks/common';
import { PoppinsTypography } from '@components/Typography';
import { useSnackbar } from '@components/Snackbar';
import { BannerInformation, useBannerInfo } from '@hooks/admin-banner-info';

const RestaurantManagement = () => {
	useBannerInfo(BannerInformation.restaurantManagement);
	const navigate = useNavigate();
	const theme = useTheme();
	const { showAlertDialog, hideAlertDialog } = useAlertDialog();
	const { showSnackbar, hideSnackbar } = useSnackbar();

	const getStatus = useRestaurantStatus();

	const searchInputRef = useRef<HTMLInputElement | null>(null);

	const GetRestaurentsCountApi = useGetRestaurentsCountApi();
	const ChangeRestaurantStatusApi = useChangeRestaurantStatusApi();

	const [pageRequest, setPageRequest] = useState<PageRequest>({
		page: 1,
		size: 10,
	});
	const [sortRequest, setSortRequest] = useState<SortRequest>({});

	const GetRestaurentsApi = useGetRestaurentsApi({
		...pageRequest,
		...sortRequest,
		search: searchInputRef.current?.value,
	});

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter') {
			void GetRestaurentsApi.refetch();
		}
	};

	const handlePage = (page: number) => {
		setPageRequest({ ...pageRequest, page });
	};

	const onCancelSearch = () => {
		if (searchInputRef.current?.value || searchInputRef.current?.value !== '') {
			(searchInputRef.current as HTMLInputElement).value = '';
			void GetRestaurentsApi.refetch();
		}
	};

	const handleDelete = (row: RestaurantResponse) => {
		showAlertDialog({
			title: `${row.status !== '4' ? 'De-active' : 'Active'} ${row.restaurant_name}?`,
			content: `Are your sure ? You want to ${
				row.status !== '4' ? 'de-active' : 'active'
			} restaurant.`,
			buttons: [
				{
					children: 'Cancel',
					variant: 'outlined',
					callback: () => {
						hideAlertDialog();
					},
				},
				{
					children: row.status !== '4' ? 'Yes, Deactivate' : 'Yes, Activate',
					variant: 'contained',
					loading: ChangeRestaurantStatusApi.isLoading,
					callback: () => {
						ChangeRestaurantStatusApi.mutateAsync({
							request: {
								restaurant_id: row.restaurant_id,
								status: row.status !== '4' ? 'disabled' : 'active',
							},
						})
							.then((response) => {
								hideAlertDialog();
								showSnackbar({
									title: 'Success!',
									variant: 'sucess',
									content: response.data?.message,
									onCancel: () => hideSnackbar(),
								});
								void GetRestaurentsCountApi.refetch();
								void GetRestaurentsApi.refetch();
							})
							.catch((error) => {
								showSnackbar({
									title: 'Error!',
									variant: 'error',
									content: error.response?.data?.message,
									onCancel: () => hideSnackbar(),
								});
							});
					},
				},
			],
		});
	};

	const handleUpdate = (id: string) => {
		showAlertDialog({
			title: `Edit Restaurant Details`,
			content: 'Are your sure you want to edit restaurant Details?',
			buttons: [
				{
					children: 'Cancel',
					variant: 'outlined',
					callback: () => {
						hideAlertDialog();
					},
				},
				{
					children: 'Yes, Continue',
					variant: 'contained',
					callback: () => {
						navigate(`/admin/restaurants/update/${id}`);
						hideAlertDialog();
					},
				},
			],
		});
	};

	const handleBlockClick = (value: string) => {
		(searchInputRef.current as HTMLInputElement).value = value;
		void GetRestaurentsApi.refetch();
	};

	const rows: PaginationResponse<RestaurantResponse>['data'] =
		GetRestaurentsApi.data?.data.data ?? [];
	type Row = (typeof rows)[number];
	const columns: ColumnDef<Row>[] = [
		{
			field: 'restaurant_id',
			renderHeader: () => 'Id',
			renderCell: ({ row }) => row.restaurant_id,
			sortable: true,
		},
		{
			field: 'restaurant_name',
			renderHeader: () => `Name`,
			renderCell: ({ row }) => row.restaurant_name,
			sortable: true,
		},
		{
			field: 'location',
			renderHeader: () => 'Location',
			renderCell: ({ row }) => row.location,
			sortable: true,
		},
		{
			field: 'address',
			renderHeader: () => `City`,
			renderCell: ({ row }) => row.address,
			sortable: true,
			tableCellProps: {
				sx: {
					maxWidth: 150,
				},
			},
		},

		{
			field: 'offer_list',
			renderHeader: () => `Active Offer`,
			renderCell: ({ row }) => (row.active_offer ? `${row.active_offer}%` : ''),
			tableCellTypographySx: {
				paddingLeft: theme.spacing(1),
			},
		},
		{
			field: 'qr_assign',
			renderHeader: () => `QR Ass`,
			renderCell: ({ row }) => row.qr_assign,
			sortable: true,
		},
		{
			field: 'status',
			renderHeader: () => `Status`,
			renderCell: ({ row }) => {
				const status = getStatus(row.status);
				return (
					<PoppinsTypography
						variant='subtitle1'
						sx={status.sx}
					>
						{status.lable}
					</PoppinsTypography>
				);
			},
			sortable: true,
		},
		{
			field: 'action',
			renderHeader: () => `Quick Action`,
			renderCell: ({ row }) => (
				<Stack
					flexDirection={'row'}
					gap={1}
				>
					<IconFinder
						iconName='OpenEye'
						iconProps={{
							fill: theme.palette.secondary.main,
							cursor: 'pointer',
							onClick: () => navigate(`/admin/restaurants/${row.restaurant_id}`),
						}}
					/>
					<IconButton
						disabled={row.status === '5'}
						sx={{ padding: '0px' }}
					>
						<IconFinder
							iconName='DashCircle'
							iconProps={{
								cursor: 'pointer',
								onClick: () => handleDelete(row),
							}}
						/>
					</IconButton>
					<IconFinder
						iconName='Pen'
						iconProps={{
							cursor: 'pointer',
							onClick: () => handleUpdate(row.restaurant_id),
						}}
					/>
				</Stack>
			),
		},
	];

	return (
		<Stack
			gap={1}
			flexGrow={'inherit'}
		>
			<Stack
				flexDirection={'row'}
				gap={12}
			>
				<Stack
					gap={2}
					flexDirection={'row'}
				>
					<AdminCards
						heading='Total Restaurant'
						content={GetRestaurentsCountApi.data?.data.data.added_restaurant_count ?? 0}
						onClick={() => handleBlockClick('')}
					/>
					<AdminCards
						heading='Currently Active'
						content={GetRestaurentsCountApi.data?.data.data.active_restaurant_count ?? 0}
						sx={{ background: '#F5FFF4', borderColor: '#B8E5B6' }}
						onClick={() => handleBlockClick('active')}
					/>
				</Stack>
				<Stack
					gap={2}
					flexDirection={'row'}
				>
					<AdminCards
						heading='Settlement Amount'
						content={`₹${GetRestaurentsCountApi.data?.data.data.settlement_amount ?? 'NA'}`}
						sx={{ background: '#F0F6FF', borderColor: '#D3E1F5' }}
					/>

					<AdminCards
						heading='Investment Amount'
						content={`₹${GetRestaurentsCountApi.data?.data.data.total_investment ?? 'NA'}`}
						sx={{ background: '#F0F6FF', borderColor: '#D3E1F5' }}
					/>
				</Stack>
				<Stack
					gap={2}
					flexDirection={'row'}
				>
					<AdminCards
						heading='Pending Approval'
						content={GetRestaurentsCountApi.data?.data.data.pending_approval_count ?? 0}
						sx={{ background: '#FFF7E8', borderColor: '#F6EAD4' }}
						onClick={() => handleBlockClick('approval pending')}
					/>

					<AdminCards
						heading='Pending Activation'
						content={GetRestaurentsCountApi.data?.data.data.pending_activation_count ?? 0}
						sx={{ background: '#FFF7E8', borderColor: '#F6EAD4' }}
						onClick={() => handleBlockClick('activation pending')}
					/>
				</Stack>
			</Stack>

			<Stack
				gap={2}
				flexDirection={'row'}
				alignSelf={'self-end'}
			>
				<TextField
					size='small'
					placeholder='Search...'
					autoComplete='off'
					InputProps={{
						startAdornment: <IconFinder iconName='Search' />,
						endAdornment: (
							<IconButton
								size='small'
								sx={{ padding: `4px` }}
								onClick={onCancelSearch}
							>
								<IconFinder iconName='Cancel' />
							</IconButton>
						),
					}}
					inputRef={searchInputRef}
					onKeyDown={handleKeyDown}
					sx={{
						'.MuiInputBase-input': {
							paddingLeft: 1,
						},
						'.MuiOutlinedInput-notchedOutline': {
							borderColor: '#E9ECEF',
						},
					}}
				/>
			</Stack>
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
					loading={GetRestaurentsApi.isLoading}
				/>
				<Pagination
					page={pageRequest.page}
					size={GetRestaurentsApi.data?.data.size as number}
					totalPages={GetRestaurentsApi.data?.data.pagesTotal as number}
					onPageChange={handlePage}
				/>
			</Stack>
		</Stack>
	);
};

export default memo(RestaurantManagement);
