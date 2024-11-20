import IconFinder from '@components/Icon';
import Pagination from '@components/Pagination';
import { useSnackbar } from '@components/Snackbar';
import Table, { ColumnDef } from '@components/Table';
import { PoppinsTypography } from '@components/Typography';
import Uploader from '@components/Uploader';
import {
	AllNotificationsResponse,
	useGetAllNotificationApi,
	useGetAllNotificationByIdApi,
	useQwickSendApi,
} from '@hooks/admin-notifications';
import { PageRequest, PaginationResponse, SortRequest } from '@interfaces/common';
import { LoadingButton } from '@mui/lab';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	TextField,
	useTheme,
} from '@mui/material';
import { generateSerialNumber } from '@utils/common';
import moment from 'moment';
import { memo, useRef, useState } from 'react';

interface AllNotificationsProps {
	isToUpdate: (id: string | false) => void;
}

function AllNotifications(props: AllNotificationsProps) {
	const theme = useTheme();
	const { showSnackbar, hideSnackbar } = useSnackbar();
	const QwickSendApi = useQwickSendApi();
	const searchInputRef = useRef<HTMLInputElement | null>(null);
	const [pageRequest, setPageRequest] = useState<PageRequest>({
		page: 1,
		size: 10,
	});
	const [sortRequest, setSortRequest] = useState<SortRequest>({});
	const [openPreview, setOpenPreview] = useState<string | false>(false);

	const GetAllNotificationApi = useGetAllNotificationApi({
		...pageRequest,
		...sortRequest,
		search: searchInputRef.current?.value,
	});
	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter') {
			void GetAllNotificationApi.refetch();
		}
	};
	const handlePage = (page: number) => {
		setPageRequest({ ...pageRequest, page });
	};

	const rows: PaginationResponse<AllNotificationsResponse>['data'] =
		GetAllNotificationApi.data?.data.data ?? [];

	type Row = (typeof rows)[number];
	const columns: ColumnDef<Row>[] = [
		{
			field: 'SL No',
			renderHeader: () => `SL No`,
			renderCell: ({ rowNumber }) =>
				generateSerialNumber(
					GetAllNotificationApi.data?.data.page ?? 0,
					GetAllNotificationApi.data?.data.size ?? 0,
					rowNumber
				),
		},
		{
			field: 'header',
			renderHeader: () => `Header`,
			renderCell: ({ row }) => row.message_title,
			sortable: true,
		},

		{
			field: 'info_text',
			renderHeader: () => `Info Text`,
			renderCell: ({ row }) => row.message_info_text,
			sortable: true,
		},

		{
			field: 'body_type',
			renderHeader: () => `Body Type`,
			renderCell: ({ row }) => row.message_body_type,
		},
		{
			field: 'category',
			renderHeader: () => `Category`,
			renderCell: ({ row }) => row.message_category,
		},
		{
			field: 'time',
			renderHeader: () => `Time`,
			renderCell: ({ row }) =>
				row.schedule_time === null ? 'Instant' : moment(row.schedule_time).format('DD MMM, H A'),
		},
		{
			field: 'status',
			renderHeader: () => `Status`,
			renderCell: ({ row }) => (
				<PoppinsTypography
					variant='subtitle1'
					sx={{
						color:
							row.message_status === 'Sent'
								? theme.palette.success.main
								: theme.palette.warning.main,
					}}
				>
					{row.message_status}
				</PoppinsTypography>
			),
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
							onClick: () => setOpenPreview(row.notification_id),
						}}
					/>

					<IconFinder
						iconName='Pen'
						iconProps={{
							cursor: 'pointer',
							onClick: () => props.isToUpdate(row.notification_id),
						}}
					/>
					<IconFinder
						iconName='Send'
						iconProps={{
							cursor: 'pointer',
							onClick: () => onQwickSendClick(row),
						}}
					/>
				</Stack>
			),
		},
	];

	const onCancelSearch = () => {
		if (searchInputRef.current?.value || searchInputRef.current?.value !== '') {
			(searchInputRef.current as HTMLInputElement).value = '';
			void GetAllNotificationApi.refetch();
		}
	};

	const onQwickSendClick = (data: AllNotificationsResponse) => {
		QwickSendApi.mutateAsync({ id: data.notification_id, request: data })
			.then((response) => {
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
				void GetAllNotificationApi.refetch();
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

	return (
		<Stack
			gap={1}
			flexGrow={'inherit'}
		>
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
			<Table
				rows={rows}
				columns={columns as any}
				rowId={(row) => row.id as string}
				tableProps={{ size: 'small', stickyHeader: false }}
				tableRowProps={{ hover: true }}
				onSortChange={(sort) => {
					setSortRequest({ sort_by: sort?.field as string, order: sort?.order });
				}}
				loading={GetAllNotificationApi.isLoading}
			/>
			<Stack>
				<Pagination
					page={pageRequest.page}
					size={GetAllNotificationApi.data?.data.size as number}
					totalPages={GetAllNotificationApi.data?.data.pagesTotal as number}
					onPageChange={handlePage}
				/>
			</Stack>
			<NotificationPreviewDialog
				open={openPreview}
				handleClose={() => setOpenPreview(false)}
			/>
		</Stack>
	);
}

export default memo(AllNotifications);

interface NotificationPreviewDialogProps {
	open: string | boolean;
	handleClose: () => void;
}

const NotificationPreviewDialog = (props: NotificationPreviewDialogProps) => {
	const theme = useTheme();

	const GetAllNotificationByIdApi = useGetAllNotificationByIdApi(props.open as string);
	const data = GetAllNotificationByIdApi.data?.data.data;
	return (
		<Dialog
			onClose={props.handleClose}
			open={Boolean(props.open)}
			maxWidth='sm'
			sx={{
				'.MuiDialog-paper': {
					width: 646,
				},
			}}
		>
			<DialogTitle sx={{ padding: 4, paddingBottom: 3 }}>
				<PoppinsTypography
					variant='subtitle1'
					align='center'
					sx={{ color: theme.palette.common.secondaryGreyText }}
				>
					Notification Preview
				</PoppinsTypography>
			</DialogTitle>
			<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 4 }}>
				<Stack alignItems={'center'}>
					<PoppinsTypography
						variant='subtitle1'
						fontSize={24}
						fontWeight={600}
						sx={{ color: theme.palette.common.primaryGreyText }}
					>
						{data?.message_title}
					</PoppinsTypography>
					<PoppinsTypography
						variant='caption'
						sx={{ color: theme.palette.common.primaryGreyText }}
					>
						{data?.message_info_text}
					</PoppinsTypography>
				</Stack>

				<Stack
					alignItems={'center'}
					gap={2}
				>
					<PoppinsTypography
						variant='subtitle1'
						sx={{ color: theme.palette.common.primaryGreyText }}
					>
						{data?.message_body}
					</PoppinsTypography>
					<Uploader
						fieldName='message_img'
						sx={{
							flexDirection: 'column',
							alignItems: 'center',
							placeContent: 'center',
							width: 440,
							height: 196,
							borderRadius: '16px',
							borderStyle: 'solid',
							borderWidth: '1px',
							borderColor: theme.palette.primary.main,
						}}
						file={data?.message_img ?? ''}
					/>
				</Stack>

				<Stack
					flexDirection={'row'}
					gap={2}
					alignSelf={'center'}
					paddingTop={`32px`}
				>
					<LoadingButton
						variant='contained'
						size='large'
						sx={{ width: 166, height: 46, borderRadius: `4px` }}
						onClick={props.handleClose}
					>
						<PoppinsTypography variant='subtitle1'>Ok</PoppinsTypography>
					</LoadingButton>
				</Stack>
			</DialogContent>
		</Dialog>
	);
};
