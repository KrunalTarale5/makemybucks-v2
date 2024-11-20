import { AdminCards } from '@components/Cards';
import IconFinder from '@components/Icon';
import Table, { ColumnDef } from '@components/Table';
import { IconButton, Stack, TextField, useTheme } from '@mui/material';
import { memo, useRef, useState } from 'react';
import Pagination from '@components/Pagination';
import { PageRequest, PaginationResponse, SortRequest } from '@interfaces/common';
import { useAlertDialog } from '@components/AlertDialog';
import { useNavigate } from 'react-router-dom';
import { useOwnerStatus } from '@hooks/common';
import { PoppinsTypography } from '@components/Typography';
import { useSnackbar } from '@components/Snackbar';
import { BannerInformation, useBannerInfo } from '@hooks/admin-banner-info';
import {
	OwnersResponse,
	useChangeOwnerStatusApi,
	useGetOwnerCountApi,
	useGetOwnersApi,
} from '@hooks/admin-owner-management';

const OwnersManagement = () => {
	useBannerInfo(BannerInformation.ownersManagement);
	const navigate = useNavigate();
	const theme = useTheme();
	const { showAlertDialog, hideAlertDialog } = useAlertDialog();
	const { showSnackbar, hideSnackbar } = useSnackbar();

	const getStatus = useOwnerStatus();

	const searchInputRef = useRef<HTMLInputElement | null>(null);

	const GetOwnerCountApi = useGetOwnerCountApi();
	const ChangeOwnerStatusApi = useChangeOwnerStatusApi();

	const [pageRequest, setPageRequest] = useState<PageRequest>({
		page: 1,
		size: 10,
	});
	const [sortRequest, setSortRequest] = useState<SortRequest>({});

	const GetOwnersApi = useGetOwnersApi({
		...pageRequest,
		...sortRequest,
		search: searchInputRef.current?.value,
	});

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter') {
			void GetOwnersApi.refetch();
		}
	};

	const handlePage = (page: number) => {
		setPageRequest({ ...pageRequest, page });
	};

	const onCancelSearch = () => {
		if (searchInputRef.current?.value || searchInputRef.current?.value !== '') {
			(searchInputRef.current as HTMLInputElement).value = '';
			void GetOwnersApi.refetch();
		}
	};

	const handleBlockClick = (value: string) => {
		(searchInputRef.current as HTMLInputElement).value = value;
		void GetOwnersApi.refetch();
	};

	const handleDelete = (row: OwnersResponse) => {
		showAlertDialog({
			title: `${`De-active ${row.owner_name}`}`,
			content: `Are your sure? You want to ${`de-active`} this user.`,
			buttons: [
				{
					children: 'Cancel',
					variant: 'outlined',
					callback: () => {
						hideAlertDialog();
					},
				},
				{
					children: 'Yes, Deactivate',
					variant: 'contained',
					callback: () => {
						ChangeOwnerStatusApi.mutateAsync({
							request: { owner_id: row.owner_id, owner_status: 'deactivate' },
						})
							.then((response) => {
								showSnackbar({
									title: 'Success!',
									variant: 'sucess',
									content: response.data?.message,
									onCancel: () => hideSnackbar(),
								});
								hideAlertDialog();
								void GetOwnersApi.refetch();
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

	const rows: PaginationResponse<OwnersResponse>['data'] = GetOwnersApi.data?.data.data ?? [];
	type Row = (typeof rows)[number];
	const columns: ColumnDef<Row>[] = [
		{
			field: 'owner_id',
			renderHeader: () => 'Id',
			renderCell: ({ row }) => row.owner_id,
			sortable: true,
		},
		{
			field: 'owner_name',
			renderHeader: () => `Name`,
			renderCell: ({ row }) => row.owner_name,
			sortable: true,
		},
		{
			field: 'city',
			renderHeader: () => 'City',
			renderCell: ({ row }) => row.city,
			sortable: true,
		},
		{
			field: 'state',
			renderHeader: () => `State`,
			renderCell: ({ row }) => row.state,
			sortable: true,
			tableCellProps: {
				sx: {
					maxWidth: 150,
				},
			},
		},

		{
			field: 'agreement_type',
			renderHeader: () => `Type`,
			renderCell: ({ row }) => row.agreement_type,
			tableCellTypographySx: {
				paddingLeft: theme.spacing(1),
			},
		},
		{
			field: 'added_by',
			renderHeader: () => `Added By`,
			renderCell: ({ row }) => row.added_by,
			sortable: true,
		},
		{
			field: 'status',
			renderHeader: () => `Status`,
			renderCell: ({ row }) => {
				const status = getStatus(row.owner_status);
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
							onClick: () => navigate(`/admin/owners/${row.owner_id}`),
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
						heading='Total Contract'
						content={GetOwnerCountApi.data?.data.data.total_contract ?? 0}
						onClick={() => handleBlockClick('')}
					/>

					<AdminCards
						heading='Currently Active'
						content={GetOwnerCountApi.data?.data.data.active_owner_count ?? 0}
						sx={{ background: '#F5FFF4', borderColor: '#B8E5B6' }}
						onClick={() => handleBlockClick('approved')}
					/>

					<AdminCards
						heading='Pending Approval'
						content={GetOwnerCountApi.data?.data.data.pending_approval_count ?? 0}
						sx={{ background: '#FFF7E8', borderColor: '#F6EAD4' }}
						onClick={() => handleBlockClick('pending approval')}
					/>

					<AdminCards
						heading='Upcoming Renewal'
						content={GetOwnerCountApi.data?.data.data.upcoming_renewal ?? 0}
						sx={{ background: '#F0F6FF', borderColor: '#D3E1F5' }}
						onClick={() => handleBlockClick('upcoming renewal')}
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
					loading={GetOwnersApi.isLoading}
				/>
				<Pagination
					page={pageRequest.page}
					size={GetOwnersApi.data?.data.size as number}
					totalPages={GetOwnersApi.data?.data.pagesTotal as number}
					onPageChange={handlePage}
				/>
			</Stack>
		</Stack>
	);
};

export default memo(OwnersManagement);
