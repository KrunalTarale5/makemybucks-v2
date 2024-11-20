import { AdminCards } from '@components/Cards';
import IconFinder from '@components/Icon';
import Pagination from '@components/Pagination';
import Table, { ColumnDef } from '@components/Table';
import {
	Button,
	FormControl,
	FormControlLabel,
	IconButton,
	Radio,
	RadioGroup,
	Stack,
	TextField,
	useTheme,
} from '@mui/material';
import { memo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SalesExecutivesDetails from './SalesExcecutiveDetails';

import {
	SALES_EXECUTIVE_FORM_STEPS,
	SalesExecutivesResponse,
	useDeleteSalesExecutivesApi,
	useGetSalesExecutivesApi,
	useGetSubAdminCountApi,
} from '@hooks/admin-add-sales-executive';
import { PageRequest, PaginationResponse, SortRequest } from '@interfaces/common';
import { useAlertDialog } from '@components/AlertDialog';
import { PoppinsTypography } from '@components/Typography';
import { useSubAdminStatus } from '@hooks/common';
import { useSnackbar } from '@components/Snackbar';
import { BannerInformation, useBannerInfo } from '@hooks/admin-banner-info';

const Dashboard = () => {
	useBannerInfo(BannerInformation.subAdmin);

	const navigate = useNavigate();
	const theme = useTheme();
	//	const dispatch = useDispatch();
	const { showAlertDialog, hideAlertDialog } = useAlertDialog();
	const { showSnackbar, hideSnackbar } = useSnackbar();

	const getStatus = useSubAdminStatus();
	const step = useRef<number>(0);

	const GetSubAdminCountsApi = useGetSubAdminCountApi();
	const DeleteSalesExecutivesApi = useDeleteSalesExecutivesApi();

	const searchInputRef = useRef<HTMLInputElement | null>(null);
	const [selectedId, setSeletedId] = useState<string | false>(false);

	const [pageRequest, setPageRequest] = useState<PageRequest>({
		page: 1,
		size: 10,
	});
	const [sortRequest, setSortRequest] = useState<SortRequest>({});

	const GetSalesExecutivesApi = useGetSalesExecutivesApi({
		...pageRequest,
		...sortRequest,
		search: searchInputRef.current?.value,
	});

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter') {
			void GetSalesExecutivesApi.refetch();
		}
	};

	const rows: PaginationResponse<SalesExecutivesResponse>['data'] =
		GetSalesExecutivesApi.data?.data.data ?? [];
	type Row = (typeof rows)[number];

	const handlePage = (page: number) => {
		setPageRequest({ ...pageRequest, page });
	};

	const handleDelete = (row: SalesExecutivesResponse) => {
		showAlertDialog({
			title: `${row.status === '1' ? 'De-active' : 'Active'} ${row?.first_name} ${row?.last_name}?`,
			content: `Are your sure ? You want to ${
				row.status === '1' ? 'de-active' : 'active'
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
					children: row.status === '1' ? 'Yes, Deactivate' : 'Yes, Activate',
					variant: 'contained',
					callback: () => {
						DeleteSalesExecutivesApi.mutateAsync({
							user_id: row.user_id,
							status: row.status === '1' ? 'deactivated' : 'active',
						})
							.then((response) => {
								showSnackbar({
									title: 'Success!',
									variant: 'sucess',
									content: response.data?.message,
									onCancel: () => hideSnackbar(),
								});
								hideAlertDialog();
								void GetSalesExecutivesApi.refetch();
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

	const handleUpdateSubExcecutive = (id: string) => {
		showAlertDialog({
			title: `Do you want to update sub admin?`,
			content: (
				<FormControl>
					<RadioGroup
						defaultValue={0}
						onChange={(e) => (step.current = Number(e.target.value))}
					>
						{SALES_EXECUTIVE_FORM_STEPS.map((s, i) => (
							<FormControlLabel
								key={i}
								value={i}
								control={<Radio />}
								label={<PoppinsTypography variant='h6'>{s}</PoppinsTypography>}
							/>
						))}
					</RadioGroup>
				</FormControl>
			),
			buttons: [
				{
					children: 'No',
					variant: 'outlined',
					callback: () => {
						hideAlertDialog();
						step.current = 0;
					},
				},
				{
					children: 'Yes',
					variant: 'contained',
					callback: () => {
						hideAlertDialog();
						navigate(`/admin/subadmin/update/${id}/${String(step.current)}`);
					},
				},
			],
		});
	};

	const columns: ColumnDef<Row>[] = [
		{
			field: 'user_id',
			renderHeader: () => 'Id',
			renderCell: ({ row }) => row.user_id,
			sortable: true,
		},
		{
			field: 'first_name',
			renderHeader: () => `Name`,
			renderCell: ({ row }) => `${row.first_name} ${row.last_name}`,
			sortable: true,
			tableCellTypographySx: {
				width: 200,
			},
			tableHeaderProps: {
				sx: {
					width: 200,
				},
			},
		},
		{
			field: 'local_address',
			renderHeader: () => `Address`,
			renderCell: ({ row }) => row.local_address,
			sortable: true,
			tableCellTypographySx: {
				width: 250,
			},
			tableHeaderProps: {
				sx: {
					width: 250,
				},
			},
		},
		{
			field: 'assign_work_location',
			renderHeader: () => `Work Area`,
			renderCell: ({ row }) => row.assign_work_location,
			tableCellTypographySx: {
				width: 200,
			},
			tableHeaderProps: {
				sx: {
					width: 200,
				},
			},
		},
		{
			field: 'mobile_no',
			renderHeader: () => `Phone No.`,
			renderCell: ({ row }) => row.mobile_no,
			tableCellTypographySx: {
				width: 200,
			},
			tableHeaderProps: {
				sx: {
					width: 200,
				},
			},
		},
		{
			field: 'qr_holding',
			renderHeader: () => `QR Holding`,
			renderCell: ({ row }) => row.qr_holding,
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
			tableCellTypographySx: {
				width: 200,
			},
			tableHeaderProps: {
				sx: {
					width: 200,
				},
			},
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
							fill: theme.palette.secondary.main,
							onClick: () => handleDelete(row),
						}}
					/>
					<IconFinder
						iconName='Pen'
						iconProps={{
							cursor: 'pointer',
							fill: theme.palette.secondary.main,
							onClick: () => handleUpdateSubExcecutive(row.user_id),
						}}
					/>
				</Stack>
			),
		},
	];

	const onCancelSearch = () => {
		if (searchInputRef.current?.value || searchInputRef.current?.value !== '') {
			(searchInputRef.current as HTMLInputElement).value = '';
			void GetSalesExecutivesApi.refetch();
		}
	};

	const handleBlockClick = (value: string) => {
		(searchInputRef.current as HTMLInputElement).value = value;
		void GetSalesExecutivesApi.refetch();
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
					heading='Total Sub Admin'
					content={GetSubAdminCountsApi.data?.data.data.addedSubadminCount ?? '0'}
					onClick={() => handleBlockClick('')}
				/>
				<AdminCards
					heading='Total Active'
					content={GetSubAdminCountsApi.data?.data.data.activeSubadminCount ?? '0'}
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
				<Button
					variant='contained'
					color='primary'
					startIcon={<IconFinder iconName='Add' />}
					onClick={() => {
						navigate(`/admin/subadmin/add`);
					}}
				>
					Add Sub Admin
				</Button>
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
					loading={GetSalesExecutivesApi.isLoading}
				/>
				<Pagination
					page={pageRequest.page}
					size={GetSalesExecutivesApi.data?.data.size as number}
					totalPages={GetSalesExecutivesApi.data?.data.pagesTotal as number}
					onPageChange={handlePage}
				/>
			</Stack>
			{selectedId && (
				<SalesExecutivesDetails
					selectedId={selectedId}
					onClose={() => setSeletedId(false)}
				/>
			)}
		</Stack>
	);
};

export default memo(Dashboard);
