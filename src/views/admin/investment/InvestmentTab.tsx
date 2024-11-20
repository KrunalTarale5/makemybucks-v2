import IconFinder from '@components/Icon';
import InputField from '@components/InputField';
import { useSnackbar } from '@components/Snackbar';
import Table, { ColumnDef } from '@components/Table';
import { PoppinsTypography } from '@components/Typography';
import {
	useGetInvestmentDataApi,
	useGetTransactionFeesApi,
	useUpdateTransactionFeesApi,
} from '@hooks/admin-transation';
import { LoadingButton } from '@mui/lab';
import { Button, Menu, MenuItem, Stack, useTheme } from '@mui/material';
import { memo, useEffect, useState } from 'react';

const REPORT_TYPE = ['Daily', 'Monthly'];

const InvestmentTab = () => {
	const theme = useTheme();
	const { showSnackbar, hideSnackbar } = useSnackbar();

	const [fee, setFee] = useState('');
	const [reportType, setReportType] = useState('Daily');
	const [reportTypeAnchorEl, setReportTypeAnchorEl] = useState<HTMLElement | null>(null);
	const GetTransactionFeesApi = useGetTransactionFeesApi();
	const UpdateTransactionFeesApi = useUpdateTransactionFeesApi();
	const GetInvestmentDataApi = useGetInvestmentDataApi({ data_type: reportType.toLowerCase() });
	const rows = GetInvestmentDataApi.data?.data.data.transaction_data ?? [];
	type Row = (typeof rows)[number];
	const columns: ColumnDef<Row>[] = [
		{
			field: 'date',
			renderHeader: () => (reportType === 'Daily' ? 'Date' : `Month`),
			renderCell: ({ row }) => row.date,
			tableCellProps: {
				sx: {
					width: 120,
				},
			},

			tableHeaderProps: {
				sx: {
					width: 120,
				},
			},
		},
		{
			field: 'total_transaction',
			renderHeader: () => `Total Transaction (₹)`,
			renderCell: ({ row }) => row.total_transaction,
			tableCellProps: {
				sx: {
					width: 250,
					textAlign: 'center',
				},
			},
			tableHeaderProps: {
				sx: {
					width: 250,
					flexDirection: 'column',
					textAlign: '-webkit-center',
				},
			},
		},
		{
			field: 'total_gst',
			renderHeader: () => 'Total GST',
			renderCell: ({ row }) => row.total_gst,
			tableCellProps: {
				sx: {
					width: 200,
					textAlign: 'center',
				},
			},
			tableHeaderProps: {
				sx: {
					width: 200,
					flexDirection: 'column',
					textAlign: '-webkit-center',
				},
			},
		},
		{
			field: 'total_investment',
			renderHeader: () => `Total Investment (₹)`,
			renderCell: ({ row }) => row.total_investment,
			tableCellProps: {
				sx: {
					width: 200,
					textAlign: 'center',
				},
			},
			tableHeaderProps: {
				sx: {
					width: 200,
					flexDirection: 'column',
					textAlign: '-webkit-center',
				},
			},
		},

		{
			field: 'total_commission',
			renderHeader: () => `Total Comission`,
			renderCell: ({ row }) => row.total_commission,
			tableCellProps: {
				sx: {
					width: 210,
					textAlign: 'center',
				},
			},
			tableHeaderProps: {
				sx: {
					width: 210,
					flexDirection: 'column',
					textAlign: '-webkit-center',
				},
			},
		},
		{
			field: 'gst_commission',
			renderHeader: () => `GST on Commision`,
			renderCell: ({ row }) => row.gst_commission,
			tableCellProps: {
				sx: {
					width: 200,
					textAlign: 'center',
				},
			},
			tableHeaderProps: {
				sx: {
					width: 200,
					flexDirection: 'column',
					textAlign: '-webkit-center',
				},
			},
		},
	];

	const onSubmit = () => {
		UpdateTransactionFeesApi.mutateAsync({
			request: { transaction_fee: fee },
		})
			.then((response) => {
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
				void GetInvestmentDataApi.refetch();
				void GetTransactionFeesApi.refetch();
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

	useEffect(() => {
		setFee(GetTransactionFeesApi.data?.data.response_data?.transaction_fees ?? '');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [GetTransactionFeesApi.dataUpdatedAt]);

	return (
		<Stack
			gap={2}
			flexGrow={'inherit'}
		>
			<Stack
				flexDirection={'row'}
				justifyContent={'space-between'}
				alignItems={'flex-end'}
			>
				<Stack
					flexDirection={'row'}
					gap={2}
					alignItems={'flex-end'}
				>
					<InputField
						fieldName='input'
						fieldProps={{
							label: 'Transaction Fee',
							fullWidth: true,
							sx: {
								width: 465,
								gap: 0,
							},
							disabled: GetTransactionFeesApi.data?.data.response_data?.clickable,
						}}
						onChange={(f, v) => setFee(v as string)}
						value={fee}
					/>
					<LoadingButton
						variant='contained'
						size='large'
						sx={{ height: 40 }}
						loading={UpdateTransactionFeesApi.isLoading}
						disabled={GetTransactionFeesApi.data?.data.response_data?.clickable}
					>
						<PoppinsTypography
							variant='caption'
							onClick={onSubmit}
						>
							Submit
						</PoppinsTypography>
					</LoadingButton>
				</Stack>

				<>
					<Button
						variant='outlined'
						size='large'
						sx={{
							minWidth: 180,
							borderColor: '#DFE3ED',
							justifyContent: 'space-between',
						}}
						onClick={(e) => setReportTypeAnchorEl(e.currentTarget)}
						endIcon={
							<IconFinder
								iconName='ChevronDown'
								iconProps={{ fill: theme.palette.common.primaryGreyText }}
							/>
						}
					>
						<PoppinsTypography
							variant='subtitle2'
							sx={{ color: theme.palette.common.primaryGreyText }}
						>
							{reportType}
						</PoppinsTypography>
					</Button>
					<Menu
						anchorEl={reportTypeAnchorEl}
						open={Boolean(reportTypeAnchorEl)}
						onClose={() => setReportTypeAnchorEl(null)}
						sx={{
							'.MuiMenu-paper': {
								left: 'auto !important',
								right: `${theme.spacing(3)} !important`,
								width: reportTypeAnchorEl?.offsetWidth,
							},
						}}
					>
						{REPORT_TYPE.map((s) => (
							<MenuItem
								key={s}
								onClick={() => {
									setReportType(s);
									setReportTypeAnchorEl(null);
								}}
							>
								{s}
							</MenuItem>
						))}
					</Menu>
				</>
			</Stack>
			<Table
				rows={rows}
				columns={columns as any}
				rowId={(row) => row.id as string}
				tableProps={{ size: 'small', stickyHeader: false }}
				tableRowProps={{ hover: true }}
				loading={GetInvestmentDataApi.isLoading}
				sx={{ paddingTop: 5 }}
			/>
		</Stack>
	);
};

export default memo(InvestmentTab);
