// import IconFinder from '@components/Icon';
// import Pagination from '@components/Pagination';
// import { useSnackbar } from '@components/Snackbar';
// import Table, { ColumnDef } from '@components/Table';
// import { PoppinsTypography } from '@components/Typography';
// import Uploader from '@components/Uploader';
// import {
// 	useGetSettlementUserResponseApi,
// 	uploadCustomerDisbusmentExcelApi,
// } from '@hooks/admin-settlement';
// import { PageRequest, PaginationResponse, SortRequest } from '@interfaces/common';
// import { LoadingButton } from '@mui/lab';
// import {
// 	Button,
// 	Dialog,
// 	DialogContent,
// 	DialogTitle,
// 	LinearProgress,
// 	Stack,
// 	useTheme,
// } from '@mui/material';
// import { generateSerialNumber } from '@utils/common';
// import { memo, useRef, useState, useEffect } from 'react';
// import moment from 'moment';
// import axios from 'axios';
// const UserTab = () => {
// 	const theme = useTheme();
// 	const searchInputRef = useRef<HTMLInputElement | null>(null);
// 	const [openUploadDialog, setOpenUploadDialog] = useState(false);
// 	const [pageRequest, setPageRequest] = useState<PageRequest>({
// 		page: 1,
// 		size: 10,
// 	});
// 	const [sortRequest, setSortRequest] = useState<SortRequest>({});
// 	const GetSettlementUserResponseApi = useGetSettlementUserResponseApi();
// 	const handlePage = (page: number) => {
// 		setPageRequest({ ...pageRequest, page });
// 	};
// 	// useEffect(() => {
// 	// 	window.location.reload();
// 	// }, [openUploadDialog]);
// 	//const rows: PaginationResponse<SettlementUserResponse>['transaction_data'] = [];
// 	const rows = GetSettlementUserResponseApi.data?.data.data.transaction_data ?? [];
// 	type Row = (typeof rows)[number];
// 	const columns: ColumnDef<Row>[] = [
// 		{
// 			field: 'SL No',
// 			renderHeader: () => `Date`,
// 			renderCell: ({ row }) => moment(row.Date).utc().format('DD MMM YY'),
// 			tableCellProps: {
// 				sx: {
// 					width: 500,
// 				},
// 			},
// 			tableHeaderProps: {
// 				sx: {
// 					width: 500,
// 				},
// 			},
// 		},
// 		{
// 			field: 'action',
// 			renderHeader: () => `Total Amount (₹)`,
// 			renderCell: ({ row }) => row.Total_amount,
// 			tableCellProps: {
// 				sx: {
// 					width: 500,
// 				},
// 			},
// 			tableHeaderProps: {
// 				sx: {
// 					width: 500,
// 				},
// 			},
// 			sortable: true,
// 		},
// 		{
// 			field: 'action',
// 			renderHeader: () => `Number of users`,
// 			renderCell: ({ row }) => row.Number_of_user,
// 			tableCellProps: {
// 				sx: {
// 					width: 500,
// 				},
// 			},
// 			tableHeaderProps: {
// 				sx: {
// 					width: 500,
// 				},
// 			},
// 			sortable: true,
// 		},
// 	];

// 	return (
// 		<Stack
// 			gap={2}
// 			flexGrow={'inherit'}
// 		>
// 			<Stack alignSelf={'flex-end'}>
// 				<Button
// 					variant='contained'
// 					onClick={() => setOpenUploadDialog(true)}
// 					sx={{ height: 40, width: 144 }}
// 				>
// 					<PoppinsTypography variant='caption'>Upload</PoppinsTypography>
// 				</Button>
// 			</Stack>

// 			<Table
// 				rows={rows}
// 				columns={columns as any}
// 				rowId={(row) => row.id as string}
// 				tableProps={{ size: 'small', stickyHeader: false }}
// 				tableRowProps={{ hover: true }}
// 				loading={GetSettlementUserResponseApi.isLoading}
// 			/>
// 			{/* <Pagination
// 				page={pageRequest.page}
// 				size={(getSettlementUserResponseApi.data?.data.size as number) ?? 0}
// 				totalPages={(getSettlementUserResponseApi.data?.data.pagesTotal as number) ?? 0}
// 				onPageChange={handlePage}
// 			/> */}
// 			<UploadExcelDialog
// 				open={openUploadDialog}
// 				handleClose={() => setOpenUploadDialog(false)}
// 			/>
// 		</Stack>
// 	);
// };

// export default memo(UserTab);

// interface UploadExcelDialogProps {
// 	open: boolean;
// 	handleClose?: () => void;
// }

// const UploadExcelDialog = memo((props: UploadExcelDialogProps) => {
// 	const theme = useTheme();
// 	const { showSnackbar, hideSnackbar } = useSnackbar();
// 	const [file, setFile] = useState<FileList | null>(null);
// 	const [progress, setProgress] = useState<number>(0);
// 	const [isSucessful, setIsSucessful] = useState<boolean>(false);

// 	const onUploadClick = () => {
// 		axios
// 			.request({
// 				...uploadCustomerDisbusmentExcelApi(file as FileList),
// 				onUploadProgress: (progress: any) => {
// 					const { loaded, total } = progress;
// 					const percentageProgress = Math.floor((loaded / total) * 100);
// 					setProgress(percentageProgress);
// 				},
// 			})
// 			.then((response) => {
// 				setProgress(0);
// 				setIsSucessful(true);
// 				showSnackbar({
// 					title: 'Success!',
// 					variant: 'sucess',
// 					content: response.data?.message,
// 					onCancel: () => hideSnackbar(),
// 				});
// 			})
// 			.catch((error) => {
// 				setIsSucessful(false);
// 				setProgress(0);
// 				showSnackbar({
// 					title: 'Error!',
// 					variant: 'error',
// 					content: error.response?.data?.message,
// 					onCancel: () => hideSnackbar(),
// 				});
// 			});
// 	};

// 	return (
// 		<Dialog
// 			onClose={props.handleClose}
// 			open={props.open}
// 			maxWidth='md'
// 			sx={{ '.MuiPaper-root': { minWidth: 507 } }}
// 		>
// 			<DialogTitle sx={{ padding: 4, paddingBottom: 3 }}>
// 				<PoppinsTypography
// 					fontSize={20}
// 					fontWeight={600}
// 					textAlign={'center'}
// 					sx={{ color: theme.palette.common.primaryGreyText }}
// 				>
// 					{isSucessful
// 						? 'Uploaded Successfully !'
// 						: progress !== 0 && file !== null
// 						  ? 'Uploading'
// 						  : `Upload excel`}
// 				</PoppinsTypography>
// 			</DialogTitle>
// 			<DialogContent
// 				sx={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 4, alignItems: 'center' }}
// 			>
// 				{file !== null && progress !== 0 ? (
// 					<Stack
// 						flexDirection={'row'}
// 						gap={1}
// 						alignItems={'center'}
// 					>
// 						<IconFinder iconName='UploadFile' />
// 						<PoppinsTypography>{file[0].name}</PoppinsTypography>
// 						<LinearProgress
// 							variant='determinate'
// 							value={progress}
// 							sx={{
// 								minWidth: 200,
// 								height: 8,
// 								backgroundColor: '#DFE3ED',
// 								borderRadius: `8px`,
// 								'.MuiLinearProgress-bar': {
// 									backgroundColor: '#5DC5FF',
// 								},
// 							}}
// 						/>
// 					</Stack>
// 				) : isSucessful ? (
// 					<IconFinder
// 						iconName='Checked'
// 						iconProps={{ fill: theme.palette.success.main, height: 40, width: 40 }}
// 					/>
// 				) : (
// 					<Uploader
// 						fieldName='drag'
// 						acceptFiles='.xlsx'
// 						sx={{
// 							placeContent: 'flex-end',
// 							height: 138,
// 							width: 359,
// 							borderWidth: 1,
// 							borderStyle: 'dashed',
// 							borderColor: '#8A92A6',
// 							borderRadius: `12px`,
// 							justifyContent: 'center',
// 							alignItems: 'center',
// 							flexDirection: 'column',
// 						}}
// 						onChange={(e) => {
// 							setFile(e.target?.files as FileList);
// 						}}
// 						file={''}
// 					>
// 						<IconFinder iconName='UploadFile' />
// 						<PoppinsTypography
// 							variant='subtitle2'
// 							sx={{ color: theme.palette.common.secondaryGreyText, paddingTop: 1 }}
// 						>
// 							Drag a file here
// 						</PoppinsTypography>
// 						<PoppinsTypography
// 							variant='subtitle2'
// 							sx={{ color: theme.palette.common.secondaryGreyText, display: 'flex' }}
// 						>
// 							or
// 							<PoppinsTypography
// 								variant='subtitle2'
// 								sx={{ color: '#18ACFF', textDecoration: 'underline', paddingX: 0.5 }}
// 							>
// 								browse
// 							</PoppinsTypography>
// 							a file to upload
// 						</PoppinsTypography>
// 					</Uploader>
// 				)}
// 				<Stack
// 					gap={1}
// 					flexDirection={'row'}
// 				>
// 					<LoadingButton
// 						variant='text'
// 						size='large'
// 						sx={{ minWidth: 166, height: 46 }}
// 						onClick={props.handleClose}
// 					>
// 						<PoppinsTypography
// 							variant='subtitle1'
// 							fontSize={20}
// 							sx={{ color: theme.palette.common.primaryGreyText }}
// 						>
// 							Ok
// 						</PoppinsTypography>
// 					</LoadingButton>

// 					<LoadingButton
// 						variant='contained'
// 						size='large'
// 						sx={{ minWidth: 166, height: 46 }}
// 						onClick={onUploadClick}
// 						disabled={file === null || progress !== 0}
// 					>
// 						<PoppinsTypography
// 							variant='subtitle1'
// 							fontSize={20}
// 						>{`Upload File`}</PoppinsTypography>
// 					</LoadingButton>
// 				</Stack>
// 			</DialogContent>
// 		</Dialog>
// 	);
// });
import IconFinder from '@components/Icon';
import Pagination from '@components/Pagination';
import { useSnackbar } from '@components/Snackbar';
import Table, { ColumnDef } from '@components/Table';
import { PoppinsTypography } from '@components/Typography';
import Uploader from '@components/Uploader';
import {
	useGetSettlementUserResponseApi,
	uploadCustomerDisbusmentExcelApi,
} from '@hooks/admin-settlement';
import { PageRequest, PaginationResponse, SortRequest } from '@interfaces/common';
import { LoadingButton } from '@mui/lab';
import {
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	LinearProgress,
	Stack,
	useTheme,
} from '@mui/material';
import { generateSerialNumber } from '@utils/common';
import { memo, useRef, useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';

const UserTab = () => {
	const theme = useTheme();
	const searchInputRef = useRef<HTMLInputElement | null>(null);
	const [openUploadDialog, setOpenUploadDialog] = useState(false);
	const [pageRequest, setPageRequest] = useState<PageRequest>({
		page: 1,
		size: 10,
	});
	const [sortRequest, setSortRequest] = useState<SortRequest>({});
	const GetSettlementUserResponseApi = useGetSettlementUserResponseApi();
	const handlePage = (page: number) => {
		setPageRequest({ ...pageRequest, page });
	};
	const rows = GetSettlementUserResponseApi.data?.data.data.transaction_data ?? [];
	type Row = (typeof rows)[number];
	const columns: ColumnDef<Row>[] = [
		{
			field: 'SL No',
			renderHeader: () => `Date`,
			renderCell: ({ row }) => moment(row.Date).utc().format('DD MMM YY'),
			tableCellProps: {
				sx: {
					width: 500,
				},
			},
			tableHeaderProps: {
				sx: {
					width: 500,
				},
			},
		},
		{
			field: 'action',
			renderHeader: () => `Total Amount (₹)`,
			renderCell: ({ row }) => row.Total_amount,
			tableCellProps: {
				sx: {
					width: 500,
				},
			},
			tableHeaderProps: {
				sx: {
					width: 500,
				},
			},
			sortable: true,
		},
		{
			field: 'action',
			renderHeader: () => `Number of users`,
			renderCell: ({ row }) => row.Number_of_user,
			tableCellProps: {
				sx: {
					width: 500,
				},
			},
			tableHeaderProps: {
				sx: {
					width: 500,
				},
			},
			sortable: true,
		},
	];

	return (
		<Stack
			gap={2}
			flexGrow={'inherit'}
		>
			<Stack alignSelf={'flex-end'}>
				<Button
					variant='contained'
					onClick={() => setOpenUploadDialog(true)}
					sx={{ height: 40, width: 144 }}
				>
					<PoppinsTypography variant='caption'>Upload</PoppinsTypography>
				</Button>
			</Stack>

			<Table
				rows={rows}
				columns={columns as any}
				rowId={(row) => row.id as string}
				tableProps={{ size: 'small', stickyHeader: false }}
				tableRowProps={{ hover: true }}
				loading={GetSettlementUserResponseApi.isLoading}
			/>
			<UploadExcelDialog
				open={openUploadDialog}
				handleClose={() => setOpenUploadDialog(false)}
			/>
		</Stack>
	);
};

export default memo(UserTab);

interface UploadExcelDialogProps {
	open: boolean;
	handleClose?: () => void;
}

const UploadExcelDialog = memo((props: UploadExcelDialogProps) => {
	const theme = useTheme();
	const { showSnackbar, hideSnackbar } = useSnackbar();
	const [file, setFile] = useState<FileList | null>(null);
	const [progress, setProgress] = useState<number>(0);
	const [isSucessful, setIsSucessful] = useState<boolean>(false);

	const onUploadClick = () => {
		axios
			.request({
				...uploadCustomerDisbusmentExcelApi(file as FileList),
				onUploadProgress: (progress: any) => {
					const { loaded, total } = progress;
					const percentageProgress = Math.floor((loaded / total) * 100);
					setProgress(percentageProgress);
				},
			})
			.then((response) => {
				setProgress(0);
				setIsSucessful(true);
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
			})
			.catch((error) => {
				setIsSucessful(false);
				setProgress(0);
				showSnackbar({
					title: 'Error!',
					variant: 'error',
					content: error.response?.data?.message,
					onCancel: () => hideSnackbar(),
				});
			});
	};

	return (
		<Dialog
			onClose={props.handleClose}
			open={props.open}
			maxWidth='md'
			sx={{ '.MuiPaper-root': { minWidth: 507 } }}
		>
			<DialogTitle sx={{ padding: 4, paddingBottom: 3 }}>
				<PoppinsTypography
					fontSize={20}
					fontWeight={600}
					textAlign={'center'}
					sx={{ color: theme.palette.common.primaryGreyText }}
				>
					{isSucessful
						? 'Uploaded Successfully !'
						: progress !== 0 && file !== null
						  ? 'Uploading'
						  : `Upload excel`}
				</PoppinsTypography>
			</DialogTitle>
			<DialogContent
				sx={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 4, alignItems: 'center' }}
			>
				{file !== null && progress !== 0 ? (
					<Stack
						flexDirection={'row'}
						gap={1}
						alignItems={'center'}
					>
						<IconFinder iconName='UploadFile' />
						<PoppinsTypography>{file[0].name}</PoppinsTypography>
						<LinearProgress
							variant='determinate'
							value={progress}
							sx={{
								minWidth: 200,
								height: 8,
								backgroundColor: '#DFE3ED',
								borderRadius: `8px`,
								'.MuiLinearProgress-bar': {
									backgroundColor: '#5DC5FF',
								},
							}}
						/>
					</Stack>
				) : isSucessful ? (
					<IconFinder
						iconName='Checked'
						iconProps={{ fill: theme.palette.success.main, height: 40, width: 40 }}
					/>
				) : (
					<Uploader
						fieldName='drag'
						acceptFiles='.xlsx'
						sx={{
							placeContent: 'flex-end',
							height: 138,
							width: 359,
							borderWidth: 1,
							borderStyle: 'dashed',
							borderColor: '#8A92A6',
							borderRadius: `12px`,
							justifyContent: 'center',
							alignItems: 'center',
							flexDirection: 'column',
						}}
						onChange={(e) => {
							setFile(e.target?.files as FileList);
						}}
						file={''}
					>
						<IconFinder iconName='UploadFile' />
						<PoppinsTypography
							variant='subtitle2'
							sx={{ color: theme.palette.common.secondaryGreyText, paddingTop: 1 }}
						>
							Drag a file here
						</PoppinsTypography>
						<PoppinsTypography
							variant='subtitle2'
							sx={{ color: theme.palette.common.secondaryGreyText, display: 'flex' }}
						>
							or
							<PoppinsTypography
								variant='subtitle2'
								sx={{ color: '#18ACFF', textDecoration: 'underline', paddingX: 0.5 }}
							>
								browse
							</PoppinsTypography>
							a file to upload
						</PoppinsTypography>
					</Uploader>
				)}
				<Stack
					gap={1}
					flexDirection={'row'}
				>
					<LoadingButton
						variant='text'
						size='large'
						sx={{ minWidth: 166, height: 46 }}
						onClick={props.handleClose}
					>
						<PoppinsTypography
							variant='subtitle1'
							fontSize={20}
							sx={{ color: theme.palette.common.primaryGreyText }}
						>
							Ok
						</PoppinsTypography>
					</LoadingButton>

					{!isSucessful && (
						<LoadingButton
							variant='contained'
							size='large'
							sx={{ minWidth: 166, height: 46 }}
							onClick={onUploadClick}
						>
							<PoppinsTypography
								variant='subtitle1'
								fontSize={20}
								sx={{ color: theme.palette.common.white }}
							>
								Upload
							</PoppinsTypography>
						</LoadingButton>
					)}
				</Stack>
			</DialogContent>
		</Dialog>
	);
});

UploadExcelDialog.displayName = 'UploadExcelDialog';
