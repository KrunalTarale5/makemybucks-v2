// import { InterTypography, PoppinsTypography } from '@components/Typography';
// import { BannerInformation, useBannerInfo } from '@hooks/admin-banner-info';
// import {
// 	Button,
// 	Chip,
// 	Dialog,
// 	DialogContent,
// 	DialogTitle,
// 	Divider,
// 	IconButton,
// 	Menu,
// 	MenuItem,
// 	Select,
// 	Stack,
// 	FormControl,
// 	InputLabel,
// 	useTheme,
// } from '@mui/material';
// // eslint-disable-next-line import/default
// import Chart from 'react-apexcharts';
// import { useState, memo } from 'react';
// import moment, { Moment, months } from 'moment';
// import IconFinder from '@components/Icon';
// import { LoadingButton } from '@mui/lab';
// import { YearPicker } from '@components/DatePicker';
// import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
// import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import {
// 	DownloadReportRequest,
// 	DownloadReportRequest2,
// 	useDownloadReportApi,
// 	useGetTotalPaybackCoordApi,
// 	useGetTotalUserCoordApi,
// } from '@hooks/admin-reports';
// import { useSnackbar } from '@components/Snackbar';
// import { getMaxTickAmount } from '@utils/common';

// const REPORT_TYPE = ['Daily', 'Monthly', 'Quarterly'];
// type REPORTS =
// 	| 'GST Return'
// 	| 'Monthly TDS Return'
// 	| 'Quarterly TDS Return'
// 	| 'Customer Disbursement'
// 	| 'Restaurant Disbursement'
// 	| 'Discount Structure Savings'
// 	| 'Vendor Payment'
// 	| 'Restaurant Incentive'
// 	| 'Monthly Restaurant transaction'
// 	| 'Restaurant Membership Profit';

// const REPORTS: REPORTS[] = [
// 	'GST Return',
// 	'Monthly TDS Return',
// 	'Quarterly TDS Return',
// 	'Customer Disbursement',
// 	'Restaurant Disbursement',
// 	'Discount Structure Savings',
// 	'Vendor Payment',
// 	'Restaurant Incentive',
// 	'Monthly Restaurant transaction',
// 	'Restaurant Membership Profit',
// ];

// const Reports = () => {
// 	const theme = useTheme();
// 	useBannerInfo(BannerInformation.reports);

// 	const [downloadPopup, setDownloadPopup] = useState<REPORTS | false>(false);
// 	const [anchorEl, handleAnchorEl] = useState<{ element: HTMLElement | null; box: 1 | 2 } | null>(
// 		null
// 	);
// 	const [totalTransationReport, setTotalTransationReport] = useState<{
// 		date: moment.Moment | null;
// 		type: string;
// 	}>({
// 		date: moment(),
// 		type: 'Daily',
// 	});

// 	const [investmentReport, setInvestmentReport] = useState<{
// 		date: moment.Moment | null;
// 		type: string;
// 	}>({
// 		date: moment(),
// 		type: 'Daily',
// 	});

// 	const GetTotalPaybackCoordApi = useGetTotalPaybackCoordApi({
// 		filter: investmentReport.type.toLowerCase(),
// 		calendar: 'year',
// 		year: investmentReport.date?.get('year').toString(),
// 	});
// 	const GetTotalUserCoordApi = useGetTotalUserCoordApi({
// 		filter: totalTransationReport.type.toLowerCase(),
// 		calendar: 'year',
// 		year: totalTransationReport.date?.get('year').toString(),
// 		month: totalTransationReport.date?.format('MMMM'),
// 	});

// 	const onDownloadClick = (report: REPORTS) => () => {
// 		setDownloadPopup(report);
// 	};

// 	return (
// 		<Stack
// 			gap={5}
// 			paddingTop={6}
// 			paddingBottom={3}
// 		>
// 			<Stack
// 				flexDirection={'row'}
// 				gap={2}
// 			>
// 				<Stack
// 					boxShadow={'0px 2px 8px 0px #00000026'}
// 					padding={1.3}
// 					flexBasis={`60%`}
// 					gap={2}
// 				>
// 					<Stack
// 						flexDirection={'row'}
// 						justifyContent={'space-between'}
// 					>
// 						<InterTypography
// 							fontWeight={600}
// 							variant='subtitle1'
// 						>
// 							Total Transaction/no. of users
// 						</InterTypography>
// 						<Stack
// 							gap={1}
// 							flexDirection={'row'}
// 						>
// 							{REPORT_TYPE.filter((f) => f === 'Monthly' || f === 'Daily').map((r) => (
// 								<Chip
// 									key={r}
// 									size='small'
// 									label={r}
// 									sx={{
// 										fontSize: 7,
// 										backgroundColor: totalTransationReport.type === r ? '#E7EBFE' : 'transparent',
// 									}}
// 									onClick={() =>
// 										setTotalTransationReport({
// 											...totalTransationReport,
// 											type: r,
// 										})
// 									}
// 								/>
// 							))}

// 							<YearPicker
// 								onRightClick={() =>
// 									setTotalTransationReport({
// 										...totalTransationReport,
// 										date: moment(totalTransationReport.date).add(1, 'year'),
// 									})
// 								}
// 								onLeftClick={() =>
// 									setTotalTransationReport({
// 										...totalTransationReport,
// 										date: moment(totalTransationReport.date).subtract(1, 'year'),
// 									})
// 								}
// 								onCalenderClick={(e) => handleAnchorEl({ element: e.currentTarget, box: 1 })}
// 								onChange={(value) => {
// 									setTotalTransationReport({ ...totalTransationReport, date: value });
// 									handleAnchorEl(null);
// 								}}
// 								show={Boolean(anchorEl) && anchorEl?.box === 1}
// 								handleClose={() => handleAnchorEl(null)}
// 								anchorEl={anchorEl?.element}
// 								date={totalTransationReport.date}
// 							/>
// 							<IconFinder
// 								iconName='MoreVertical'
// 								iconProps={{ height: 24, fill: 'black' }}
// 							/>
// 						</Stack>
// 					</Stack>
// 					<Chart
// 						options={{
// 							chart: {
// 								zoom: {
// 									enabled: false,
// 								},
// 							},
// 							dataLabels: {
// 								enabled: false,
// 							},
// 							xaxis: {
// 								categories: GetTotalUserCoordApi.data?.data.data?.x_axis ?? [],
// 							},
// 							yaxis: {
// 								labels: {
// 									formatter: (value) => value?.toFixed(0),
// 								},
// 								tickAmount: getMaxTickAmount(GetTotalUserCoordApi.data?.data.data?.y_axis ?? []),
// 							},
// 							tooltip: {
// 								enabled: true,
// 								followCursor: true,
// 							},
// 							colors: [theme.palette.primary.main],
// 						}}
// 						series={[
// 							{
// 								name: 'Total Transaction/no. of users',
// 								data: GetTotalUserCoordApi.data?.data.data?.y_axis ?? [],
// 							},
// 						]}
// 						type='area'
// 						height={365}
// 						/* 	width={952} */
// 					/>
// 				</Stack>
// 				<Stack
// 					boxShadow={'0px 2px 8px 0px #00000026'}
// 					padding={1.3}
// 					flexBasis={`40%`}
// 				>
// 					<Stack gap={2}>
// 						<Stack
// 							justifyContent={'space-between'}
// 							flexDirection={'row'}
// 						>
// 							<InterTypography
// 								fontWeight={600}
// 								variant='subtitle1'
// 							>
// 								Investment/payback
// 							</InterTypography>
// 							<IconFinder
// 								iconName='MoreVertical'
// 								iconProps={{ height: 24, fill: 'black' }}
// 							/>
// 						</Stack>
// 						<Stack
// 							justifyContent={'space-between'}
// 							flexDirection={'row'}
// 						>
// 							<Stack
// 								gap={1}
// 								flexDirection={'row'}
// 							>
// 								{REPORT_TYPE.map((c) => (
// 									<Chip
// 										key={c}
// 										size='medium'
// 										label={c}
// 										sx={{
// 											fontSize: 10,
// 											height: 27,
// 											backgroundColor: investmentReport.type === c ? '#E7EBFE' : 'transparent',
// 										}}
// 										onClick={() =>
// 											setInvestmentReport({
// 												...investmentReport,
// 												type: c,
// 											})
// 										}
// 									/>
// 								))}
// 							</Stack>

// 							<YearPicker
// 								onRightClick={() =>
// 									setInvestmentReport({
// 										...investmentReport,
// 										date: moment(investmentReport.date).add(1, 'year'),
// 									})
// 								}
// 								onLeftClick={() =>
// 									setInvestmentReport({
// 										...investmentReport,
// 										date: moment(investmentReport.date).subtract(1, 'year'),
// 									})
// 								}
// 								onCalenderClick={(e) => handleAnchorEl({ element: e.currentTarget, box: 2 })}
// 								onChange={(value) => {
// 									setInvestmentReport({ ...investmentReport, date: value });
// 									handleAnchorEl(null);
// 								}}
// 								show={Boolean(anchorEl) && anchorEl?.box === 2}
// 								handleClose={() => handleAnchorEl(null)}
// 								anchorEl={anchorEl?.element}
// 								date={investmentReport.date}
// 								position={{ left: 100 }}
// 							/>
// 						</Stack>
// 						<Chart
// 							options={{
// 								chart: {
// 									zoom: {
// 										enabled: false,
// 									},
// 								},
// 								dataLabels: {
// 									enabled: false,
// 								},
// 								xaxis: {
// 									categories: GetTotalPaybackCoordApi.data?.data.data?.x_axis ?? [],
// 								},
// 								yaxis: {
// 									labels: {
// 										formatter: (value) => value?.toFixed(0),
// 									},
// 									tickAmount: getMaxTickAmount(
// 										GetTotalPaybackCoordApi.data?.data.data?.y_axis ?? []
// 									),
// 								},
// 								tooltip: {
// 									enabled: true,
// 									followCursor: true,
// 								},
// 								colors: [theme.palette.primary.main],
// 							}}
// 							series={[
// 								{
// 									name: 'Investment/payback',
// 									data: GetTotalPaybackCoordApi.data?.data.data?.y_axis ?? [],
// 								},
// 							]}
// 							type='bar'
// 							height={321}
// 						/>
// 					</Stack>
// 				</Stack>
// 			</Stack>

// 			<Stack
// 				flexDirection={'row'}
// 				justifyContent={'space-between'}
// 				alignItems={'center'}
// 			>
// 				<PoppinsTypography
// 					variant='subtitle1'
// 					sx={{ color: theme.palette.common.primaryGreyText }}
// 				>
// 					Download Reports
// 				</PoppinsTypography>
// 				<Divider
// 					orientation='horizontal'
// 					/* sx={{ width: `83%` }} */
// 				/>
// 				<IconFinder
// 					iconName='ChevronDown'
// 					iconProps={{ fill: 'black' }}
// 				/>
// 			</Stack>
// 			<Stack
// 				flexDirection={'row'}
// 				flexWrap={'wrap'}
// 				gap={1}
// 			>
// 				{REPORTS.map((r) => (
// 					<Stack
// 						key={r}
// 						height={64}
// 						border={`1px solid #C1C0CB`}
// 						borderRadius={`6px`}
// 						flexDirection={'row'}
// 						justifyContent={'space-between'}
// 						alignItems={'center'}
// 						paddingX={`23px`}
// 						flexBasis={`33%`}
// 					>
// 						<PoppinsTypography
// 							variant='subtitle1'
// 							sx={{ color: theme.palette.common.primaryGreyText }}
// 						>
// 							{r}
// 						</PoppinsTypography>
// 						<IconButton
// 							size='small'
// 							onClick={onDownloadClick(r)}
// 						>
// 							<IconFinder iconName='Download' />
// 						</IconButton>
// 					</Stack>
// 				))}
// 			</Stack>
// 			{downloadPopup && (
// 				<DownloadPopup
// 					handleClose={() => setDownloadPopup(false)}
// 					heading={downloadPopup}
// 				/>
// 			)}
// 		</Stack>
// 	);
// };

// export default memo(Reports);

// interface DownloadPopupProps {
// 	handleClose: () => void;
// 	heading: REPORTS | false;
// }

// const DownloadPopup = (props: DownloadPopupProps) => {
// 	const theme = useTheme();
// 	const { showSnackbar, hideSnackbar } = useSnackbar();

// 	const previousFinancialYears = Array.from(
// 		{ length: 3 },
// 		(_, count) => `${new Date().getFullYear() - count - 1}-${new Date().getFullYear() - count}`
// 	).reverse();

// 	const currentFinancialYear =
// 		new Date().getMonth() + 1 <= 3
// 			? `${new Date().getFullYear() - 1}-${new Date().getFullYear()}`
// 			: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;

// 	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
// 	const [finYear, setFinYear] = useState(currentFinancialYear);
// 	const FinancialYear = [...previousFinancialYears, currentFinancialYear];

// 	const DownloadReportApi = useDownloadReportApi();

// 	const [customerDisbursement, setCustomerDisbursement] = useState('');
// 	const [vendorPayment, setVendorPayment] = useState<Moment | null>(moment());
// 	const [selectedMonthValue, setSelectedMonthValue] = useState('04');
// 	const [currentDate, setCurrentDate] = useState<number | null>(null);
// 	const [selectedMonthName, setSelectedMonthName] = useState('');

// 	const onDownloadClick = () => {
// 		let info: DownloadReportRequest = {
// 			url: '',
// 			request: {
// 				month: moment().month(customerDisbursement).format('M'),
// 				year: new Date().getFullYear(),
// 			},
// 		};

// 		let info2: DownloadReportRequest2 = {
// 			url: '',
// 			request: {
// 				quarter: moment().month(customerDisbursement).format('M'),
// 				year: new Date().getFullYear(),
// 			},
// 		};
// 		let quartermonts = 1;
// 		const firstYear = finYear.split('-')[0];
// 		console.log(firstYear);
// 		console.log(selectedMonthValue);
// 		console.log(currentDate);
// 		const safeCurrentDate = currentDate || 1;
// 		const formattedDate = `${safeCurrentDate}-${selectedMonthValue}-${firstYear}`;
// 		const vendorPaymentDate = moment(formattedDate, 'DD-MM-YYYY');
// 		console.log(vendorPaymentDate.format('DD-MM-YYYY'));

// 		switch (props.heading) {
// 			case 'Vendor Payment':
// 				info = {
// 					url: 'download_vendor_payment_report',
// 					request: { date: vendorPaymentDate.format('DD-MM-YYYY') },
// 				};
// 				break;
// 			case 'Monthly Restaurant transaction':
// 				info = {
// 					url: 'download_monthly_rest_transaction_report',
// 					request: {
// 						month: moment().month(customerDisbursement).format('M'),
// 						year: new Date().getFullYear(),
// 					},
// 				};
// 				break;
// 			case 'GST Return':
// 				info = {
// 					url: 'download_monthly_gst_report',
// 					request: {
// 						month: moment().month(customerDisbursement).format('M'),
// 						year: new Date().getFullYear(),
// 					},
// 				};
// 				break;
// 			case 'Quarterly TDS Return':
// 				if (customerDisbursement === 'Apr - Jun') {
// 					quartermonts = 2;
// 				} else if (customerDisbursement === 'Jul - Sep') {
// 					quartermonts = 3;
// 				} else if (customerDisbursement === 'Oct - Dec') {
// 					quartermonts = 4;
// 				} else if (customerDisbursement === 'Jan - Mar') {
// 					quartermonts = 1;
// 				}
// 				info2 = {
// 					url: 'download_quarterly_tds_report',
// 					request: {
// 						quarter: quartermonts,
// 						year: new Date().getFullYear(),
// 					},
// 				};
// 				break;
// 			case 'Monthly TDS Return':
// 				info = {
// 					url: 'download_monthly_tds_report',
// 					request: {
// 						month: moment().month(customerDisbursement).format('M'),
// 						year: new Date().getFullYear(),
// 					},
// 				};
// 				break;
// 			case 'Restaurant Disbursement':
// 				info = {
// 					url: 'download_restaurant_disbursement_report',
// 					request: { date: vendorPayment?.format('DD-MM-YYYY') },
// 				};
// 				break;
// 			case 'Discount Structure Savings':
// 				info = {
// 					url: 'download_discount_structure_reports',
// 					request: {
// 						month: moment().month(customerDisbursement).format('M'),
// 						year: new Date().getFullYear(),
// 					},
// 				};
// 				break;
// 			case 'Restaurant Membership Profit':
// 				info = {
// 					url: 'download_restaurant_membership_report',
// 					request: {
// 						month: moment().month(customerDisbursement).format('M'),
// 						year: new Date().getFullYear(),
// 					},
// 				};
// 				break;

// 			case 'Restaurant Incentive':
// 				info = {
// 					url: 'download_restaurant_incentive_report',
// 					request: {
// 						month: moment().month(customerDisbursement).format('M'),
// 						year: new Date().getFullYear(),
// 					},
// 				};
// 				break;

// 			case 'Customer Disbursement':
// 				info = {
// 					url: 'download_customer_disbursement_report',
// 					request: {
// 						month: moment().month(customerDisbursement).format('M'),
// 						year: new Date().getFullYear(),
// 					},
// 				};
// 				break;

// 			default:
// 				break;
// 		}

// 		DownloadReportApi.mutateAsync(props.heading === 'Quarterly TDS Return' ? info2 : info)
// 			.then((res) => {
// 				window.open(res.data.download_link);
// 				showSnackbar({
// 					title: 'Success!',
// 					variant: 'sucess',
// 					content: res.data?.message,
// 					onCancel: () => hideSnackbar(),
// 				});
// 			})
// 			.catch((error) => {
// 				showSnackbar({
// 					title: 'Error!',
// 					variant: 'error',
// 					content: error.response?.data?.message,
// 					onCancel: () => hideSnackbar(),
// 				});
// 			});
// 		props.handleClose();
// 	};

// 	const quarters = {
// 		1: months().splice(3, 3),
// 		2: months().splice(6, 3),
// 		3: months().splice(9, 3),
// 		4: months().splice(0, 3),
// 	};

// 	return (
// 		<Dialog
// 			onClose={props.handleClose}
// 			open={Boolean(props.heading)}
// 			sx={{ '.MuiPaper-root': { width: `100%`, minWidth: 752 } }}
// 		>
// 			<DialogTitle sx={{ padding: 4, paddingBottom: 3 }}>
// 				<PoppinsTypography
// 					variant='h6'
// 					fontWeight={600}
// 					sx={{ color: theme.palette.common.primaryGreyText }}
// 				>
// 					{props.heading}
// 				</PoppinsTypography>
// 			</DialogTitle>
// 			<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 4 }}>
// 				<Stack flexDirection={'row'}>
// 					<PoppinsTypography
// 						fontSize={18}
// 						sx={{ color: theme.palette.common.primaryGreyText }}
// 					>
// 						Financial year
// 						<Button
// 							endIcon={
// 								<IconFinder
// 									iconName='ChevronDown'
// 									iconProps={{ fill: theme.palette.common.primaryGreyText }}
// 								/>
// 							}
// 							onClick={(e) => setAnchorEl(e.currentTarget)}
// 						>
// 							<PoppinsTypography
// 								fontSize={18}
// 								sx={{ color: theme.palette.common.primaryGreyText }}
// 							>
// 								{` ${finYear}`}
// 							</PoppinsTypography>
// 						</Button>
// 						<Menu
// 							anchorEl={anchorEl}
// 							open={Boolean(anchorEl)}
// 							onClose={() => setAnchorEl(null)}
// 						>
// 							{FinancialYear.map((s) => (
// 								<MenuItem
// 									key={s}
// 									onClick={() => {
// 										setFinYear(s);
// 										setAnchorEl(null);
// 									}}
// 								>
// 									{s}
// 								</MenuItem>
// 							))}
// 						</Menu>
// 					</PoppinsTypography>
// 				</Stack>
// 				{(props.heading === 'Discount Structure Savings' ||
// 					props.heading === 'GST Return' ||
// 					props.heading === 'Monthly TDS Return' ||
// 					props.heading === 'Customer Disbursement' ||
// 					props.heading === 'Restaurant Incentive' ||
// 					props.heading === 'Monthly Restaurant transaction' ||
// 					props.heading === 'Restaurant Membership Profit') && (
// 					<Stack
// 						flexDirection={'row'}
// 						flexWrap={'wrap'}
// 						gap={1}
// 					>
// 						{Object.entries(quarters).map((q) =>
// 							q[1].map((r) => (
// 								<Button
// 									key={r}
// 									size='large'
// 									variant={customerDisbursement === r ? 'contained' : 'outlined'}
// 									sx={{ width: 224, height: 48 }}
// 									onClick={() => setCustomerDisbursement(r)}
// 									disabled={
// 										finYear !== currentFinancialYear
// 											? false
// 											: new Date().getMonth() < Number(moment().month(r).format('M')) ||
// 											  //  new Date() < moment(r, 'MM-DD-YYYY').toDate() ||
// 											  !q[1]
// 													.map((q) => Number(moment().month(q).format('M')))
// 													.includes(new Date().getMonth())
// 									}
// 								>
// 									<PoppinsTypography fontSize={18}>{r}</PoppinsTypography>
// 								</Button>
// 							))
// 						)}
// 					</Stack>
// 				)}

// 				{props.heading === 'Quarterly TDS Return' && (
// 					<Stack
// 						flexDirection={'row'}
// 						flexWrap={'wrap'}
// 						gap={1}
// 					>
// 						{[
// 							{
// 								label: 'Apr - Jun',
// 								value: quarters[1],
// 							},
// 							{
// 								label: 'Jul - Sep',
// 								value: quarters[2],
// 							},
// 							{
// 								label: 'Oct - Dec',
// 								value: quarters[3],
// 							},
// 							{
// 								label: 'Jan - Mar',
// 								value: quarters[4],
// 							},
// 						].map((r) => (
// 							<Button
// 								key={r.label}
// 								size='large'
// 								variant={customerDisbursement === r.label ? 'contained' : 'outlined'}
// 								sx={{ width: 224, height: 48 }}
// 								onClick={() => setCustomerDisbursement(r.label)}
// 								disabled={
// 									finYear !== currentFinancialYear
// 										? false
// 										: new Date().getMonth() + 1 > 4 && r.value[0] === 'January'
// 										  ? true
// 										  : new Date().getMonth() <
// 										    Math.max(...r.value.map((q) => Number(moment().month(q).format('M'))))
// 								}
// 							>
// 								<PoppinsTypography fontSize={18}>{r.label}</PoppinsTypography>
// 							</Button>
// 						))}
// 					</Stack>
// 				)}

// 				{props.heading === 'Restaurant Disbursement' && (
// 					<LocalizationProvider dateAdapter={AdapterMoment}>
// 						<DemoContainer
// 							components={['DatePicker']}
// 							sx={{
// 								flexDirection: 'column-reverse !important',
// 								overflow: 'hidden',
// 								padding: 'inherit',
// 							}}
// 						>
// 							<StaticDatePicker
// 								views={['day']}
// 								onChange={(v) => {
// 									setVendorPayment(v);
// 									if (v) {
// 										const dayOfMonth = v.date();
// 										const month = (v.month() + 1).toString();
// 										console.log(month);

// 										setCurrentDate(dayOfMonth);
// 										setSelectedMonthValue(month);
// 									} else {
// 										console.log('Date value is null');
// 									}
// 								}}
// 								disableFuture
// 								defaultCalendarMonth={moment(new Date(2024, 0))}
// 								sx={{
// 									'& .MuiPickersLayout-actionBar': {
// 										display: 'none',
// 									},
// 									'& .MuiPickersToolbar-root': {
// 										display: 'none',
// 									},
// 									'& .MuiPickersSlideTransition-root': {
// 										height: 500,
// 									},
// 									'& .MuiPickersLayout-contentWrapper': { height: 500 },
// 									'& .MuiDateCalendar-root': {
// 										width: `100%`,
// 										height: `100%`,
// 										display: 'contents',
// 										paddingBottom: 3,
// 									},
// 									'& .MuiDayCalendar-header': {
// 										display: 'none',
// 									},
// 									'& .MuiPickersCalendarHeader-root': {
// 										display: 'visible',
// 									},
// 									'& .MuiPickersDay-root': {
// 										fontSize: `18px`,
// 										fontWeight: 600,
// 										fontFamily: 'Poppins',
// 										gap: '12px',
// 										width: 48,
// 										height: 48,
// 										borderRadius: `4px`,
// 										borderWidth: 1,
// 										borderStyle: 'solid',
// 										margin: `12px`,
// 										borderColor: theme.palette.primary.main,
// 									},
// 									'.Mui-disabled': {
// 										borderColor: '#C8C8C8',
// 									},
// 								}}
// 							/>
// 						</DemoContainer>
// 					</LocalizationProvider>
// 				)}

// 				{props.heading === 'Vendor Payment' && (
// 					<LocalizationProvider dateAdapter={AdapterMoment}>
// 						<Stack
// 							flexDirection={'row'}
// 							flexWrap={'wrap'}
// 							gap={1}
// 						>
// 							{/* <FormControl
// 								fullWidth
// 								sx={{ width: 224, height: 48 }}
// 							>
// 								<InputLabel id='month-select-label'>Select Month</InputLabel>
// 								<Select
// 									labelId='month-select-label'
// 									value={customerDisbursement}
// 									onChange={(event) => {
// 										setCustomerDisbursement(event.target.value);

// 										const newValue = event.target.value;
// 										setSelectedMonthName(newValue);
// 										let monthIndex;
// 										switch (newValue) {
// 											case 'January':
// 												monthIndex = '01';
// 												break;
// 											case 'February':
// 												monthIndex = '02';
// 												break;
// 											case 'March':
// 												monthIndex = '03';
// 												break;
// 											case 'April':
// 												monthIndex = '04';
// 												break;
// 											case 'May':
// 												monthIndex = '05';
// 												break;
// 											case 'June':
// 												monthIndex = '06';
// 												break;
// 											case 'July':
// 												monthIndex = '07';
// 												break;
// 											case 'August':
// 												monthIndex = '08';
// 												break;
// 											case 'September':
// 												monthIndex = '09';
// 												break;
// 											case 'October':
// 												monthIndex = '10';
// 												break;
// 											case 'November':
// 												monthIndex = '11';
// 												break;
// 											case 'December':
// 												monthIndex = '12';
// 												break;
// 											default:
// 												monthIndex = '0'; // Set a default value if needed
// 												break;
// 										}

// 										setSelectedMonthValue(monthIndex);
// 									}}
// 									displayEmpty
// 									label='Select Month' // This ensures proper alignment and styling with the InputLabel
// 								>
// 									{Object.entries(quarters).flatMap(([_, months]) =>
// 										months.map((month) => {
// 											const monthNumber = Number(moment().month(month).format('M')) - 1;
// 											const currentMonth = new Date().getMonth();

// 											return (
// 												<MenuItem
// 													key={month}
// 													value={month}
// 													disabled={
// 														finYear !== currentFinancialYear
// 															? false
// 															: monthNumber > currentMonth ||
// 															  (monthNumber < currentMonth &&
// 																	!months
// 																		.map((m) => Number(moment().month(m).format('M')) - 1)
// 																		.includes(currentMonth))
// 													}
// 												>
// 													<PoppinsTypography fontSize={18}>{month}</PoppinsTypography>
// 												</MenuItem>
// 											);
// 										})
// 									)}
// 								</Select>
// 							</FormControl> */}
// 						</Stack>

// 						<DemoContainer
// 							components={['DatePicker']}
// 							sx={{
// 								flexDirection: 'column-reverse !important',
// 								overflow: 'hidden',
// 								padding: 'inherit',
// 							}}
// 						>
// 							<StaticDatePicker
// 								views={['day']}
// 								onChange={(v) => {
// 									setVendorPayment(v);
// 									if (v) {
// 										const dayOfMonth = v.date();
// 										const month = (v.month() + 1).toString();
// 										console.log(month);

// 										setCurrentDate(dayOfMonth);
// 										setSelectedMonthValue(month);
// 									} else {
// 										console.log('Date value is null');
// 									}
// 								}}
// 								disableFuture
// 								defaultCalendarMonth={moment(new Date(2024, 0))}
// 								sx={{
// 									'& .MuiPickersLayout-actionBar': {
// 										display: 'none',
// 									},
// 									'& .MuiPickersToolbar-root': {
// 										display: 'none',
// 									},
// 									'& .MuiPickersSlideTransition-root': {
// 										height: 500,
// 									},
// 									'& .MuiPickersLayout-contentWrapper': { height: 500 },
// 									'& .MuiDateCalendar-root': {
// 										width: `100%`,
// 										height: `100%`,
// 										display: 'contents',
// 										paddingBottom: 3,
// 									},
// 									'& .MuiDayCalendar-header': {
// 										display: 'none',
// 									},
// 									'& .MuiPickersCalendarHeader-root': {
// 										display: 'visible',
// 									},
// 									'& .MuiPickersDay-root': {
// 										fontSize: `18px`,
// 										fontWeight: 600,
// 										fontFamily: 'Poppins',
// 										gap: '12px',
// 										width: 48,
// 										height: 48,
// 										borderRadius: `4px`,
// 										borderWidth: 1,
// 										borderStyle: 'solid',
// 										margin: `12px`,
// 										borderColor: theme.palette.primary.main,
// 									},
// 									'.Mui-disabled': {
// 										borderColor: '#C8C8C8',
// 									},
// 								}}
// 							/>
// 						</DemoContainer>
// 					</LocalizationProvider>
// 				)}

// 				<Stack
// 					flexDirection={'row'}
// 					gap={2}
// 					alignSelf={'self-end'}
// 				>
// 					<LoadingButton
// 						variant='outlined'
// 						size='large'
// 						sx={{ width: 166 }}
// 						onClick={props.handleClose}
// 					>
// 						<PoppinsTypography
// 							fontSize={18}
// 							sx={{ color: theme.palette.common.primaryGreyText }}
// 						>
// 							Cancel
// 						</PoppinsTypography>
// 					</LoadingButton>
// 					<LoadingButton
// 						variant='contained'
// 						size='large'
// 						sx={{ width: 166 }}
// 						onClick={onDownloadClick}
// 					>
// 						<PoppinsTypography fontSize={18}>Download</PoppinsTypography>
// 					</LoadingButton>
// 				</Stack>
// 			</DialogContent>
// 		</Dialog>
// 	);
// };
import { InterTypography, PoppinsTypography } from '@components/Typography';
import { BannerInformation, useBannerInfo } from '@hooks/admin-banner-info';
import {
	Button,
	Chip,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	Menu,
	MenuItem,
	Select,
	Stack,
	FormControl,
	InputLabel,
	useTheme,
} from '@mui/material';
// eslint-disable-next-line import/default
import Chart from 'react-apexcharts';
import { useState, memo } from 'react';
import moment, { Moment, months } from 'moment';
import IconFinder from '@components/Icon';
import { LoadingButton } from '@mui/lab';
import { YearPicker } from '@components/DatePicker';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import {
	DownloadReportRequest,
	DownloadReportRequest2,
	useDownloadReportApi,
	useGetTotalPaybackCoordApi,
	useGetTotalUserCoordApi,
} from '@hooks/admin-reports';
import { useSnackbar } from '@components/Snackbar';
import { getMaxTickAmount } from '@utils/common';

const REPORT_TYPE = ['Daily', 'Monthly', 'Quarterly'];
type REPORTS =
	| 'GST Return'
	| 'Monthly TDS Return'
	| 'Quarterly TDS Return'
	| 'Customer Disbursement'
	| 'Restaurant Disbursement'
	| 'Discount Structure Savings'
	| 'Vendor Payment'
	| 'Restaurant Incentive'
	| 'Monthly Restaurant transaction'
	| 'Restaurant Membership Profit';

const REPORTS: REPORTS[] = [
	'GST Return',
	'Monthly TDS Return',
	'Quarterly TDS Return',
	'Customer Disbursement',
	'Restaurant Disbursement',
	'Discount Structure Savings',
	'Vendor Payment',
	'Restaurant Incentive',
	'Monthly Restaurant transaction',
	'Restaurant Membership Profit',
];

const Reports = () => {
	const theme = useTheme();
	useBannerInfo(BannerInformation.reports);

	const [downloadPopup, setDownloadPopup] = useState<REPORTS | false>(false);
	const [anchorEl, handleAnchorEl] = useState<{ element: HTMLElement | null; box: 1 | 2 } | null>(
		null
	);
	const [totalTransationReport, setTotalTransationReport] = useState<{
		date: moment.Moment | null;
		type: string;
	}>({
		date: moment(),
		type: 'Daily',
	});

	const [investmentReport, setInvestmentReport] = useState<{
		date: moment.Moment | null;
		type: string;
	}>({
		date: moment(),
		type: 'Daily',
	});

	const GetTotalPaybackCoordApi = useGetTotalPaybackCoordApi({
		filter: investmentReport.type.toLowerCase(),
		calendar: 'year',
		year: investmentReport.date?.get('year').toString(),
	});
	const GetTotalUserCoordApi = useGetTotalUserCoordApi({
		filter: totalTransationReport.type.toLowerCase(),
		calendar: 'year',
		year: totalTransationReport.date?.get('year').toString(),
		month: totalTransationReport.date?.format('MMMM'),
	});

	const onDownloadClick = (report: REPORTS) => () => {
		setDownloadPopup(report);
	};

	return (
		<Stack
			gap={5}
			paddingTop={6}
			paddingBottom={3}
		>
			<Stack
				flexDirection={'row'}
				gap={2}
			>
				<Stack
					boxShadow={'0px 2px 8px 0px #00000026'}
					padding={1.3}
					flexBasis={`60%`}
					gap={2}
				>
					<Stack
						flexDirection={'row'}
						justifyContent={'space-between'}
					>
						<InterTypography
							fontWeight={600}
							variant='subtitle1'
						>
							Total Transaction/no. of users
						</InterTypography>
						<Stack
							gap={1}
							flexDirection={'row'}
						>
							{REPORT_TYPE.filter((f) => f === 'Monthly' || f === 'Daily').map((r) => (
								<Chip
									key={r}
									size='small'
									label={r}
									sx={{
										fontSize: 7,
										backgroundColor: totalTransationReport.type === r ? '#E7EBFE' : 'transparent',
									}}
									onClick={() =>
										setTotalTransationReport({
											...totalTransationReport,
											type: r,
										})
									}
								/>
							))}

							<YearPicker
								onRightClick={() =>
									setTotalTransationReport({
										...totalTransationReport,
										date: moment(totalTransationReport.date).add(1, 'year'),
									})
								}
								onLeftClick={() =>
									setTotalTransationReport({
										...totalTransationReport,
										date: moment(totalTransationReport.date).subtract(1, 'year'),
									})
								}
								onCalenderClick={(e) => handleAnchorEl({ element: e.currentTarget, box: 1 })}
								onChange={(value) => {
									setTotalTransationReport({ ...totalTransationReport, date: value });
									handleAnchorEl(null);
								}}
								show={Boolean(anchorEl) && anchorEl?.box === 1}
								handleClose={() => handleAnchorEl(null)}
								anchorEl={anchorEl?.element}
								date={totalTransationReport.date}
							/>
							<IconFinder
								iconName='MoreVertical'
								iconProps={{ height: 24, fill: 'black' }}
							/>
						</Stack>
					</Stack>
					<Chart
						options={{
							chart: {
								zoom: {
									enabled: false,
								},
							},
							dataLabels: {
								enabled: false,
							},
							xaxis: {
								categories: GetTotalUserCoordApi.data?.data.data?.x_axis ?? [],
							},
							yaxis: {
								labels: {
									formatter: (value) => value?.toFixed(0),
								},
								tickAmount: getMaxTickAmount(GetTotalUserCoordApi.data?.data.data?.y_axis ?? []),
							},
							tooltip: {
								enabled: true,
								followCursor: true,
							},
							colors: [theme.palette.primary.main],
						}}
						series={[
							{
								name: 'Total Transaction/no. of users',
								data: GetTotalUserCoordApi.data?.data.data?.y_axis ?? [],
							},
						]}
						type='area'
						height={365}
						/* 	width={952} */
					/>
				</Stack>
				<Stack
					boxShadow={'0px 2px 8px 0px #00000026'}
					padding={1.3}
					flexBasis={`40%`}
				>
					<Stack gap={2}>
						<Stack
							justifyContent={'space-between'}
							flexDirection={'row'}
						>
							<InterTypography
								fontWeight={600}
								variant='subtitle1'
							>
								Investment/payback
							</InterTypography>
							<IconFinder
								iconName='MoreVertical'
								iconProps={{ height: 24, fill: 'black' }}
							/>
						</Stack>
						<Stack
							justifyContent={'space-between'}
							flexDirection={'row'}
						>
							<Stack
								gap={1}
								flexDirection={'row'}
							>
								{REPORT_TYPE.map((c) => (
									<Chip
										key={c}
										size='medium'
										label={c}
										sx={{
											fontSize: 10,
											height: 27,
											backgroundColor: investmentReport.type === c ? '#E7EBFE' : 'transparent',
										}}
										onClick={() =>
											setInvestmentReport({
												...investmentReport,
												type: c,
											})
										}
									/>
								))}
							</Stack>

							<YearPicker
								onRightClick={() =>
									setInvestmentReport({
										...investmentReport,
										date: moment(investmentReport.date).add(1, 'year'),
									})
								}
								onLeftClick={() =>
									setInvestmentReport({
										...investmentReport,
										date: moment(investmentReport.date).subtract(1, 'year'),
									})
								}
								onCalenderClick={(e) => handleAnchorEl({ element: e.currentTarget, box: 2 })}
								onChange={(value) => {
									setInvestmentReport({ ...investmentReport, date: value });
									handleAnchorEl(null);
								}}
								show={Boolean(anchorEl) && anchorEl?.box === 2}
								handleClose={() => handleAnchorEl(null)}
								anchorEl={anchorEl?.element}
								date={investmentReport.date}
								position={{ left: 100 }}
							/>
						</Stack>
						<Chart
							options={{
								chart: {
									zoom: {
										enabled: false,
									},
								},
								dataLabels: {
									enabled: false,
								},
								xaxis: {
									categories: GetTotalPaybackCoordApi.data?.data.data?.x_axis ?? [],
								},
								yaxis: {
									labels: {
										formatter: (value) => value?.toFixed(0),
									},
									tickAmount: getMaxTickAmount(
										GetTotalPaybackCoordApi.data?.data.data?.y_axis ?? []
									),
								},
								tooltip: {
									enabled: true,
									followCursor: true,
								},
								colors: [theme.palette.primary.main],
							}}
							series={[
								{
									name: 'Investment/payback',
									data: GetTotalPaybackCoordApi.data?.data.data?.y_axis ?? [],
								},
							]}
							type='bar'
							height={321}
						/>
					</Stack>
				</Stack>
			</Stack>

			<Stack
				flexDirection={'row'}
				justifyContent={'space-between'}
				alignItems={'center'}
			>
				<PoppinsTypography
					variant='subtitle1'
					sx={{ color: theme.palette.common.primaryGreyText }}
				>
					Download Reports
				</PoppinsTypography>
				<Divider
					orientation='horizontal'
					/* sx={{ width: `83%` }} */
				/>
				<IconFinder
					iconName='ChevronDown'
					iconProps={{ fill: 'black' }}
				/>
			</Stack>
			<Stack
				flexDirection={'row'}
				flexWrap={'wrap'}
				gap={1}
			>
				{REPORTS.map((r) => (
					<Stack
						key={r}
						height={64}
						border={`1px solid #C1C0CB`}
						borderRadius={`6px`}
						flexDirection={'row'}
						justifyContent={'space-between'}
						alignItems={'center'}
						paddingX={`23px`}
						flexBasis={`33%`}
					>
						<PoppinsTypography
							variant='subtitle1'
							sx={{ color: theme.palette.common.primaryGreyText }}
						>
							{r}
						</PoppinsTypography>
						<IconButton
							size='small'
							onClick={onDownloadClick(r)}
						>
							<IconFinder iconName='Download' />
						</IconButton>
					</Stack>
				))}
			</Stack>
			{downloadPopup && (
				<DownloadPopup
					handleClose={() => setDownloadPopup(false)}
					heading={downloadPopup}
				/>
			)}
		</Stack>
	);
};

export default memo(Reports);

interface DownloadPopupProps {
	handleClose: () => void;
	heading: REPORTS | false;
}

const DownloadPopup = (props: DownloadPopupProps) => {
	const theme = useTheme();
	const { showSnackbar, hideSnackbar } = useSnackbar();

	const previousFinancialYears = Array.from(
		{ length: 3 },
		(_, count) => `${new Date().getFullYear() - count - 1}-${new Date().getFullYear() - count}`
	).reverse();

	const currentFinancialYear =
		new Date().getMonth() + 1 <= 3
			? `${new Date().getFullYear() - 1}-${new Date().getFullYear()}`
			: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;

	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const [finYear, setFinYear] = useState(currentFinancialYear);
	const FinancialYear = [...previousFinancialYears, currentFinancialYear];

	const DownloadReportApi = useDownloadReportApi();

	const [customerDisbursement, setCustomerDisbursement] = useState('');
	const [vendorPayment, setVendorPayment] = useState<Moment | null>(moment());
	const [selectedMonthValue, setSelectedMonthValue] = useState('04');
	const [currentDate, setCurrentDate] = useState<number | null>(null);
	const [selectedMonthName, setSelectedMonthName] = useState('');
	let selectedYear;

	const onDownloadClick = () => {
		let info: DownloadReportRequest = {
			url: '',
			request: {
				month: moment().month(customerDisbursement).format('M'),
				year: new Date().getFullYear(),
			},
		};

		let info2: DownloadReportRequest2 = {
			url: '',
			request: {
				quarter: moment().month(customerDisbursement).format('M'),
				year: new Date().getFullYear(),
			},
		};
		let quartermonts = 1;
		const [firstYear, secondYear] = finYear.split('-');
		console.log(firstYear);
		console.log(selectedMonthValue);
		console.log(currentDate);
		const safeCurrentDate = currentDate || 1;
		const formattedDate = `${safeCurrentDate}-${selectedMonthValue}-${firstYear}`;
		const vendorPaymentDate = moment(formattedDate, 'DD-MM-YYYY');
		console.log(vendorPaymentDate.format('DD-MM-YYYY'));

		const getCustomerDisbursementInfo = () => {
			const customerDisbursementMonth = parseInt(moment().month(customerDisbursement).format('M'));
			const customerDisbursementYear =
				customerDisbursementMonth <= 3 ? parseInt(secondYear) : parseInt(firstYear);
			return {
				url: 'download_customer_disbursement_report',
				request: {
					month: customerDisbursementMonth,
					year: customerDisbursementYear,
				},
			};
		};

		switch (props.heading) {
			case 'Vendor Payment':
				info = {
					url: 'download_vendor_payment_report',
					request: { date: vendorPaymentDate.format('DD-MM-YYYY') },
				};
				break;
			case 'Monthly Restaurant transaction':
				info = {
					url: 'download_monthly_rest_transaction_report',
					request: {
						month: parseInt(moment().month(customerDisbursement).format('M')),
						year: parseInt(firstYear),
					},
				};
				break;
			case 'GST Return':
				info = {
					url: 'download_monthly_gst_report',
					request: {
						month: parseInt(moment().month(customerDisbursement).format('M')),
						year: parseInt(firstYear),
					},
				};
				break;
			case 'Quarterly TDS Return':
				if (customerDisbursement === 'Jan - Mar') {
					selectedYear = secondYear;
				} else {
					selectedYear = firstYear;
				}
				if (customerDisbursement === 'Apr - Jun') {
					quartermonts = 2;
				} else if (customerDisbursement === 'Jul - Sep') {
					quartermonts = 3;
				} else if (customerDisbursement === 'Oct - Dec') {
					quartermonts = 4;
				} else if (customerDisbursement === 'Jan - Mar') {
					quartermonts = 1;
				}
				info2 = {
					url: 'download_quarterly_tds_report',
					request: {
						quarter: quartermonts,
						year: parseInt(selectedYear),
					},
				};
				break;
			case 'Monthly TDS Return':
				info = {
					url: 'download_monthly_tds_report',
					request: {
						month: parseInt(moment().month(customerDisbursement).format('M')),
						year: parseInt(firstYear),
					},
				};
				break;
			case 'Restaurant Disbursement':
				info = {
					url: 'download_restaurant_disbursement_report',
					request: { date: vendorPayment?.format('DD-MM-YYYY') },
				};
				break;
			case 'Discount Structure Savings':
				info = {
					url: 'download_discount_structure_reports',
					request: {
						month: parseInt(moment().month(customerDisbursement).format('M')),
						year: parseInt(firstYear),
					},
				};
				break;
			case 'Restaurant Membership Profit':
				info = {
					url: 'download_restaurant_membership_report',
					request: {
						month: parseInt(moment().month(customerDisbursement).format('M')),
						year: parseInt(firstYear),
					},
				};
				break;
			case 'Restaurant Incentive':
				info = {
					url: 'download_restaurant_incentive_report',
					request: {
						month: parseInt(moment().month(customerDisbursement).format('M')),
						year: parseInt(firstYear),
					},
				};
				break;
			case 'Customer Disbursement':
				info = getCustomerDisbursementInfo();
				break;
			default:
				break;
		}

		DownloadReportApi.mutateAsync(props.heading === 'Quarterly TDS Return' ? info2 : info)
			.then((res) => {
				window.open(res.data.download_link);
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: res.data?.message,
					onCancel: () => hideSnackbar(),
				});
			})
			.catch((error) => {
				showSnackbar({
					title: 'Error!',
					variant: 'error',
					content: error.response?.data?.message,
					onCancel: () => hideSnackbar(),
				});
			});
		props.handleClose();
	};

	const quarters = {
		1: months().splice(3, 3),
		2: months().splice(6, 3),
		3: months().splice(9, 3),
		4: months().splice(0, 3),
	};

	return (
		<Dialog
			onClose={props.handleClose}
			open={Boolean(props.heading)}
			sx={{ '.MuiPaper-root': { width: `100%`, minWidth: 752 } }}
		>
			<DialogTitle sx={{ padding: 4, paddingBottom: 3 }}>
				<PoppinsTypography
					variant='h6'
					fontWeight={600}
					sx={{ color: theme.palette.common.primaryGreyText }}
				>
					{props.heading}
				</PoppinsTypography>
			</DialogTitle>
			<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 4 }}>
				<Stack flexDirection={'row'}>
					<PoppinsTypography
						fontSize={18}
						sx={{ color: theme.palette.common.primaryGreyText }}
					>
						Financial year
						<Button
							endIcon={
								<IconFinder
									iconName='ChevronDown'
									iconProps={{ fill: theme.palette.common.primaryGreyText }}
								/>
							}
							onClick={(e) => setAnchorEl(e.currentTarget)}
						>
							<PoppinsTypography
								fontSize={18}
								sx={{ color: theme.palette.common.primaryGreyText }}
							>
								{` ${finYear}`}
							</PoppinsTypography>
						</Button>
						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={() => setAnchorEl(null)}
						>
							{FinancialYear.map((s) => (
								<MenuItem
									key={s}
									onClick={() => {
										setFinYear(s);
										setAnchorEl(null);
									}}
								>
									{s}
								</MenuItem>
							))}
						</Menu>
					</PoppinsTypography>
				</Stack>
				{(props.heading === 'Discount Structure Savings' ||
					props.heading === 'GST Return' ||
					props.heading === 'Monthly TDS Return' ||
					props.heading === 'Customer Disbursement' ||
					props.heading === 'Restaurant Incentive' ||
					props.heading === 'Monthly Restaurant transaction' ||
					props.heading === 'Restaurant Membership Profit') && (
					<Stack
						flexDirection={'row'}
						flexWrap={'wrap'}
						gap={1}
					>
						{Object.entries(quarters).map((q) =>
							q[1].map((r) => (
								<Button
									key={r}
									size='large'
									variant={customerDisbursement === r ? 'contained' : 'outlined'}
									sx={{ width: 224, height: 48 }}
									onClick={() => setCustomerDisbursement(r)}
									disabled={
										finYear !== currentFinancialYear
											? false
											: new Date().getMonth() < Number(moment().month(r).format('M')) ||
											  //  new Date() < moment(r, 'MM-DD-YYYY').toDate() ||
											  !q[1]
													.map((q) => Number(moment().month(q).format('M')))
													.includes(new Date().getMonth())
									}
								>
									<PoppinsTypography fontSize={18}>{r}</PoppinsTypography>
								</Button>
							))
						)}
					</Stack>
				)}

				{props.heading === 'Quarterly TDS Return' && (
					<Stack
						flexDirection={'row'}
						flexWrap={'wrap'}
						gap={1}
					>
						{[
							{
								label: 'Apr - Jun',
								value: quarters[1],
							},
							{
								label: 'Jul - Sep',
								value: quarters[2],
							},
							{
								label: 'Oct - Dec',
								value: quarters[3],
							},
							{
								label: 'Jan - Mar',
								value: quarters[4],
							},
						].map((r) => (
							<Button
								key={r.label}
								size='large'
								variant={customerDisbursement === r.label ? 'contained' : 'outlined'}
								sx={{ width: 224, height: 48 }}
								onClick={() => setCustomerDisbursement(r.label)}
								disabled={
									finYear !== currentFinancialYear
										? false
										: new Date().getMonth() + 1 > 4 && r.value[0] === 'January'
										  ? true
										  : new Date().getMonth() <
										    Math.max(...r.value.map((q) => Number(moment().month(q).format('M'))))
								}
							>
								<PoppinsTypography fontSize={18}>{r.label}</PoppinsTypography>
							</Button>
						))}
					</Stack>
				)}

				{props.heading === 'Restaurant Disbursement' && (
					<LocalizationProvider dateAdapter={AdapterMoment}>
						<DemoContainer
							components={['DatePicker']}
							sx={{
								flexDirection: 'column-reverse !important',
								overflow: 'hidden',
								padding: 'inherit',
							}}
						>
							<StaticDatePicker
								views={['day']}
								onChange={(v) => {
									setVendorPayment(v);
									if (v) {
										const dayOfMonth = v.date();
										const month = (v.month() + 1).toString();
										console.log(month);

										setCurrentDate(dayOfMonth);
										setSelectedMonthValue(month);
									} else {
										console.log('Date value is null');
									}
								}}
								disableFuture
								defaultCalendarMonth={moment(new Date(2024, 0))}
								sx={{
									'& .MuiPickersLayout-actionBar': {
										display: 'none',
									},
									'& .MuiPickersToolbar-root': {
										display: 'none',
									},
									'& .MuiPickersSlideTransition-root': {
										height: 500,
									},
									'& .MuiPickersLayout-contentWrapper': { height: 500 },
									'& .MuiDateCalendar-root': {
										width: `100%`,
										height: `100%`,
										display: 'contents',
										paddingBottom: 3,
									},
									'& .MuiDayCalendar-header': {
										display: 'none',
									},
									'& .MuiPickersCalendarHeader-root': {
										display: 'visible',
									},
									'& .MuiPickersDay-root': {
										fontSize: `18px`,
										fontWeight: 600,
										fontFamily: 'Poppins',
										gap: '12px',
										width: 48,
										height: 48,
										borderRadius: `4px`,
										borderWidth: 1,
										borderStyle: 'solid',
										margin: `12px`,
										borderColor: theme.palette.primary.main,
									},
									'.Mui-disabled': {
										borderColor: '#C8C8C8',
									},
								}}
							/>
						</DemoContainer>
					</LocalizationProvider>
				)}

				{props.heading === 'Vendor Payment' && (
					<LocalizationProvider dateAdapter={AdapterMoment}>
						<Stack
							flexDirection={'row'}
							flexWrap={'wrap'}
							gap={1}
						>
							{/* <FormControl
								fullWidth
								sx={{ width: 224, height: 48 }}
							>
								<InputLabel id='month-select-label'>Select Month</InputLabel>
								<Select
									labelId='month-select-label'
									value={customerDisbursement}
									onChange={(event) => {
										setCustomerDisbursement(event.target.value);

										const newValue = event.target.value;
										setSelectedMonthName(newValue);
										let monthIndex;
										switch (newValue) {
											case 'January':
												monthIndex = '01';
												break;
											case 'February':
												monthIndex = '02';
												break;
											case 'March':
												monthIndex = '03';
												break;
											case 'April':
												monthIndex = '04';
												break;
											case 'May':
												monthIndex = '05';
												break;
											case 'June':
												monthIndex = '06';
												break;
											case 'July':
												monthIndex = '07';
												break;
											case 'August':
												monthIndex = '08';
												break;
											case 'September':
												monthIndex = '09';
												break;
											case 'October':
												monthIndex = '10';
												break;
											case 'November':
												monthIndex = '11';
												break;
											case 'December':
												monthIndex = '12';
												break;
											default:
												monthIndex = '0'; // Set a default value if needed
												break;
										}

										setSelectedMonthValue(monthIndex);
									}}
									displayEmpty
									label='Select Month' // This ensures proper alignment and styling with the InputLabel
								>
									{Object.entries(quarters).flatMap(([_, months]) =>
										months.map((month) => {
											const monthNumber = Number(moment().month(month).format('M')) - 1;
											const currentMonth = new Date().getMonth();

											return (
												<MenuItem
													key={month}
													value={month}
													disabled={
														finYear !== currentFinancialYear
															? false
															: monthNumber > currentMonth ||
															  (monthNumber < currentMonth &&
																	!months
																		.map((m) => Number(moment().month(m).format('M')) - 1)
																		.includes(currentMonth))
													}
												>
													<PoppinsTypography fontSize={18}>{month}</PoppinsTypography>
												</MenuItem>
											);
										})
									)}
								</Select>
							</FormControl> */}
						</Stack>

						<DemoContainer
							components={['DatePicker']}
							sx={{
								flexDirection: 'column-reverse !important',
								overflow: 'hidden',
								padding: 'inherit',
							}}
						>
							<StaticDatePicker
								views={['day']}
								onChange={(v) => {
									setVendorPayment(v);
									if (v) {
										const dayOfMonth = v.date();
										const month = (v.month() + 1).toString();
										console.log(month);

										setCurrentDate(dayOfMonth);
										setSelectedMonthValue(month);
									} else {
										console.log('Date value is null');
									}
								}}
								disableFuture
								defaultCalendarMonth={moment(new Date(2024, 0))}
								sx={{
									'& .MuiPickersLayout-actionBar': {
										display: 'none',
									},
									'& .MuiPickersToolbar-root': {
										display: 'none',
									},
									'& .MuiPickersSlideTransition-root': {
										height: 500,
									},
									'& .MuiPickersLayout-contentWrapper': { height: 500 },
									'& .MuiDateCalendar-root': {
										width: `100%`,
										height: `100%`,
										display: 'contents',
										paddingBottom: 3,
									},
									'& .MuiDayCalendar-header': {
										display: 'none',
									},
									'& .MuiPickersCalendarHeader-root': {
										display: 'visible',
									},
									'& .MuiPickersDay-root': {
										fontSize: `18px`,
										fontWeight: 600,
										fontFamily: 'Poppins',
										gap: '12px',
										width: 48,
										height: 48,
										borderRadius: `4px`,
										borderWidth: 1,
										borderStyle: 'solid',
										margin: `12px`,
										borderColor: theme.palette.primary.main,
									},
									'.Mui-disabled': {
										borderColor: '#C8C8C8',
									},
								}}
							/>
						</DemoContainer>
					</LocalizationProvider>
				)}

				<Stack
					flexDirection={'row'}
					gap={2}
					alignSelf={'self-end'}
				>
					<LoadingButton
						variant='outlined'
						size='large'
						sx={{ width: 166 }}
						onClick={props.handleClose}
					>
						<PoppinsTypography
							fontSize={18}
							sx={{ color: theme.palette.common.primaryGreyText }}
						>
							Cancel
						</PoppinsTypography>
					</LoadingButton>
					<LoadingButton
						variant='contained'
						size='large'
						sx={{ width: 166 }}
						onClick={onDownloadClick}
					>
						<PoppinsTypography fontSize={18}>Download</PoppinsTypography>
					</LoadingButton>
				</Stack>
			</DialogContent>
		</Dialog>
	);
};
