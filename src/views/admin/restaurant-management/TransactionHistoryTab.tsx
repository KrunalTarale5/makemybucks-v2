import { AdminCards } from '@components/Cards';
import Table, { ColumnDef } from '@components/Table';

import { PoppinsTypography } from '@components/Typography';
import {
	RestaurantTransactionResponse,
	useGetRestaurentsTransactionApi,
	useGetRestaurentsTransactionCountApi,
} from '@hooks/admin-restaurant-management';
import { Stack, useTheme } from '@mui/material';
import moment from 'moment';
import { memo } from 'react';
import { useParams } from 'react-router-dom';

function TransactionHistoryTab() {
	const theme = useTheme();
	const { id } = useParams() as { id: string };
	const GetRestaurentsTransactionApi = useGetRestaurentsTransactionApi(id);
	const GetRestaurentsTransactionCountApi = useGetRestaurentsTransactionCountApi(id);

	const rows =
		(GetRestaurentsTransactionApi.data?.data.data as RestaurantTransactionResponse[]) ?? [];
	type Row = (typeof rows)[number];
	const columns: ColumnDef<Row>[] = [
		{
			field: 'transaction_date',
			renderHeader: () => `Date`,
			renderCell: ({ row }) => moment(row.transaction_date).utc().format('DD MMM YYYY'),
			tableCellProps: {
				sx: {
					width: 300,
				},
			},
		},
		{
			field: 'transaction_total_amount',
			renderHeader: () => `Total Amount (₹)`,
			renderCell: ({ row }) => row.transaction_total_amount,
			tableCellProps: {
				sx: {
					width: 400,
				},
			},
		},
		{
			field: 'transaction_revenue',
			renderHeader: () => `Revenue`,
			renderCell: ({ row }) => row.transaction_revenue,
			tableCellProps: {
				sx: {
					width: 300,
				},
			},
		},
		{
			field: 'payable_amount',
			renderHeader: () => `Payable Amount (₹)`,
			renderCell: ({ row }) => row.payable_amount,
			tableCellProps: {
				sx: {
					width: 400,
				},
			},
		},
		{
			field: 'settlement_status',
			renderHeader: () => `Settlement status`,
			renderCell: ({ row }) => row.settlement_status,
			tableHeaderProps: {
				sx: {
					justifyContent: 'right',
				},
			},
			tableCellProps: {
				sx: {
					textAlign: '-webkit-right',
					paddingRight: theme.spacing(11),
				},
			},
		},
	];

	return !GetRestaurentsTransactionApi.data?.data.data ? (
		<Stack
			justifyContent={'center'}
			alignItems={'center'}
		>
			<PoppinsTypography
				fontSize={48}
				sx={{ color: theme.palette.common.secondaryGreyText }}
			>
				Oops!
			</PoppinsTypography>
			<PoppinsTypography
				fontSize={20}
				sx={{ color: theme.palette.common.secondaryGreyText }}
			>
				No Data Found!
			</PoppinsTypography>
		</Stack>
	) : (
		<>
			<Stack
				gap={12}
				flexDirection={'row'}
				paddingTop={2}
			>
				<Stack
					gap={2}
					flexDirection={'row'}
				>
					<AdminCards
						heading='Total Transaction'
						content={`₹${
							GetRestaurentsTransactionCountApi.data?.data.data.total_transaction_count ?? 0
						}`}
						sx={{
							'& .content': { fontSize: 20 },
							gap: `12px`,
							padding: 1.5,
							width: 190,
							background: '#F8FBFF',
							borderColor: '#DFE3ED',
						}}
					/>

					<AdminCards
						heading='Total Revenue'
						content={`₹${
							GetRestaurentsTransactionCountApi.data?.data.data.total_revenue_count ?? 0
						}`}
						sx={{
							'& .content': { fontSize: 20 },
							gap: `12px`,
							padding: 1.5,
							width: 190,
							background: '#F8FBFF',
							borderColor: '#DFE3ED',
						}}
					/>
				</Stack>
				<Stack
					gap={2}
					flexDirection={'row'}
				>
					<AdminCards
						heading='Total Settlement'
						content={`₹${
							GetRestaurentsTransactionCountApi.data?.data.data.total_settlement_count ?? 0
						}`}
						sx={{
							'& .content': { fontSize: 20 },
							gap: `12px`,
							padding: 1.5,
							width: 190,
							background: '#F4F5F8',
							borderColor: '#DFE3ED',
						}}
					/>

					<AdminCards
						heading='Total Outstanding'
						content={`₹${
							GetRestaurentsTransactionCountApi.data?.data.data.total_outstanding_count ?? 0
						}`}
						sx={{
							'& .content': { fontSize: 20 },
							gap: `12px`,
							padding: 1.5,
							width: 190,
							background: '#F4F5F8',
							borderColor: '#DFE3ED',
						}}
					/>

					<AdminCards
						heading='Upcoming Payment'
						content={`₹${
							GetRestaurentsTransactionCountApi.data?.data.data.total_upcoming_payment_count ?? 0
						}`}
						sx={{
							'& .content': { fontSize: 20 },
							gap: `12px`,
							padding: 1.5,
							width: 190,
							background: '#F4F5F8',
							borderColor: '#DFE3ED',
						}}
					/>
				</Stack>
			</Stack>

			<Stack
				gap={1}
				flexGrow={1}
			>
				<PoppinsTypography
					variant='subtitle1'
					sx={{ color: theme.palette.common.primaryGreyText }}
				>
					Recent Transaction Details
				</PoppinsTypography>
				<Stack flexGrow={1}>
					<Table
						rows={rows}
						columns={columns as any}
						rowId={(row) => row.Date as string}
						tableProps={{ size: 'small', stickyHeader: false }}
						tableRowProps={{ hover: true }}
					/>
				</Stack>
			</Stack>
		</>
	);
}

export default memo(TransactionHistoryTab);
