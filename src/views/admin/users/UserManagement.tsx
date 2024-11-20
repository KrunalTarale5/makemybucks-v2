import { AdminCards } from '@components/Cards';
import IconFinder from '@components/Icon';
import Pagination from '@components/Pagination';
import Table, { ColumnDef } from '@components/Table';
import { PoppinsTypography } from '@components/Typography';
import {
	UserManagementResponse,
	useBlockUserApi,
	useGetUserManagementApi,
} from '@hooks/admin-user-management';
import { useUserKycStatus, useUserStatus } from '@hooks/common';
import { PageRequest, PaginationResponse, SortRequest } from '@interfaces/common';
import { IconButton, Stack, TextField, useTheme } from '@mui/material';
import { memo, useRef, useState } from 'react';
import UsersDetails from './UsersDetails';
import { useSnackbar } from '@components/Snackbar';
import { useAlertDialog } from '@components/AlertDialog';
import { BannerInformation, useBannerInfo } from '@hooks/admin-banner-info';

function UserManagement() {
	useBannerInfo(BannerInformation.userManagement);
	const theme = useTheme();
	const { showAlertDialog, hideAlertDialog } = useAlertDialog();
	const { showSnackbar, hideSnackbar } = useSnackbar();

	const getStatus = useUserStatus();
	const getUserKycStatus = useUserKycStatus();

	const BlockUserApi = useBlockUserApi();
	const [selectedId, setSeletedId] = useState<string | false>(false);

	const [pageRequest, setPageRequest] = useState<PageRequest>({
		page: 1,
		size: 10,
	});
	const [sortRequest, setSortRequest] = useState<SortRequest>({});
	const searchInputRef = useRef<HTMLInputElement | null>(null);

	const GetUserManagementApi = useGetUserManagementApi({
		...pageRequest,
		...sortRequest,
		search: searchInputRef.current?.value,
	});

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter') {
			void GetUserManagementApi.refetch();
		}
	};
	const handlePage = (page: number) => {
		setPageRequest({ ...pageRequest, page });
	};

	const handleDelete = (row: UserManagementResponse) => {
		showAlertDialog({
			title: `${row.block_status === '0' ? `De-active ${row.name}` : `Enable ${row.name}`}`,
			content: `Are your sure? You want to ${
				row.block_status === '0' ? `de-active` : `enable`
			} this user.`,
			buttons: [
				{
					children: 'Cancel',
					variant: 'outlined',
					callback: () => {
						hideAlertDialog();
					},
				},
				{
					children: row.block_status === '0' ? 'Yes, Deactivate' : 'Yes, Enable',
					variant: 'contained',
					callback: () => {
						BlockUserApi.mutateAsync({ id: row.user_id })
							.then((response) => {
								showSnackbar({
									title: 'Success!',
									variant: 'sucess',
									content: response.data?.message,
									onCancel: () => hideSnackbar(),
								});
								hideAlertDialog();
								void GetUserManagementApi.refetch();
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
	const rows: PaginationResponse<UserManagementResponse>['data'] =
		GetUserManagementApi.data?.data.data ?? [];

	type Row = (typeof rows)[number];
	const columns: ColumnDef<Row>[] = [
		{
			field: 'user_id',
			renderHeader: () => 'UID',
			renderCell: ({ row }) => row.user_id,
			sortable: true,
		},
		{
			field: 'name',
			renderHeader: () => `User Name`,
			renderCell: ({ row }) => row.name,
			sortable: true,
		},

		{
			field: 'city',
			renderHeader: () => `City`,
			renderCell: ({ row }) => row.city,
			sortable: true,
		},

		{
			field: 'state',
			renderHeader: () => `State`,
			renderCell: ({ row }) => row.state,
		},
		{
			field: 'total_transaction',
			renderHeader: () => `Total Transaction (₹)`,
			renderCell: ({ row }) => row.total_transaction_amount_user,
		},
		{
			field: 'total_payback',
			renderHeader: () => `Total Payback (₹)`,
			renderCell: ({ row }) => row.total_payback,
		},
		{
			field: 'KYC',
			renderHeader: () => `KYC`,
			renderCell: ({ row }) => {
				const kycstatus = getUserKycStatus(row.KYC_Approval_status);
				return (
					<PoppinsTypography
						variant='subtitle1'
						sx={kycstatus.sx}
					>
						{kycstatus.lable}
					</PoppinsTypography>
				);
			},
			sortable: true,
		},
		{
			field: 'status',
			renderHeader: () => `Status`,
			renderCell: ({ row }) => {
				const status = getStatus(row.block_status);
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
							onClick: () => setSeletedId(row.user_id),
						}}
					/>
					<IconFinder
						iconName='DashCircle'
						iconProps={{
							cursor: 'pointer',
							onClick: () => handleDelete(row),
						}}
					/>
				</Stack>
			),
		},
	];
	const onCancelSearch = () => {
		if (searchInputRef.current?.value || searchInputRef.current?.value !== '') {
			(searchInputRef.current as HTMLInputElement).value = '';
			void GetUserManagementApi.refetch();
		}
	};
	const handleBlockClick = (value: string) => {
		(searchInputRef.current as HTMLInputElement).value = value;
		void GetUserManagementApi.refetch();
	};

	return (
		<Stack
			gap={1}
			flexGrow={'inherit'}
		>
			<Stack
				gap={2}
				flexDirection={'row'}
			>
				<AdminCards
					heading='Total Users'
					content={GetUserManagementApi.data?.data.all_user_count as number}
				/>

				<AdminCards
					heading='Active Users'
					content={GetUserManagementApi.data?.data.block_user_count as number}
					sx={{ '.heading': { color: theme.palette.success.main } }}
					onClick={() => handleBlockClick('active')}
				/>
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
					loading={GetUserManagementApi.isLoading}
				/>
				<Pagination
					page={pageRequest.page}
					size={(GetUserManagementApi.data?.data.size as number) ?? 0}
					totalPages={(GetUserManagementApi.data?.data.pagesTotal as number) ?? 0}
					onPageChange={handlePage}
				/>
			</Stack>
			{selectedId && (
				<UsersDetails
					selectedId={selectedId}
					onClose={() => setSeletedId(false)}
					refetch={() => void GetUserManagementApi.refetch()}
				/>
			)}
		</Stack>
	);
}

export default memo(UserManagement);
