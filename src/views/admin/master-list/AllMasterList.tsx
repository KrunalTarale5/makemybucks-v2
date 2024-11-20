import IconFinder from '@components/Icon';
import InputField, { InputFieldValue } from '@components/InputField';
import { useSnackbar } from '@components/Snackbar';
import { PoppinsTypography } from '@components/Typography';
import { BannerInformation, useBannerInfo } from '@hooks/admin-banner-info';
import {
	useAddAgreementPeriodApi,
	useAddAssignLocationTypeApi,
	useAddCuisineTypeApi,
	useAddNotificationCategoryApi,
	useAddRejectedReasonApi,
	useAddRestaurantTypeApi,
	useGetAgreementPeriodApi,
	useGetAssignLocationTypeApi,
	useGetCuisineTypeApi,
	useGetNotificationCategoryApi,
	useGetRejectedReasonApi,
	useGetRestaurantTypeApi,
	useUpdateAgreementPeriodApi,
	useUpdateAssignLocationTypeApi,
	useUpdateCuisineTypeApi,
	useUpdateNotificationCategoryApi,
	useUpdateRejectedReasonApi,
	useUpdateRestaurantTypeApi,
} from '@hooks/admin-master-list';
import { Option } from '@interfaces/common';
import { LoadingButton } from '@mui/lab';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	List,
	ListItem,
	Stack,
	useTheme,
} from '@mui/material';
import React, { useState, memo, useEffect } from 'react';

type AddNewType =
	| 'Restaurant Type'
	| 'Cuisine Type'
	| 'Agreement Period'
	| 'Assign Location'
	| 'Notification Category'
	| 'Document Rejection'
	| false;

const Lists = [
	'Veg Restaurant',
	'Non Veg Restaurant',
	'South Indian Restaurant',
	'Chinese Restaurant',
];
const AllMasterList = () => {
	const theme = useTheme();
	useBannerInfo(BannerInformation.masterList);
	const { showSnackbar, hideSnackbar } = useSnackbar();

	const GetRestaurantTypeApi = useGetRestaurantTypeApi();
	const GetCuisineTypeApi = useGetCuisineTypeApi();
	const GetAgreementPeriodApi = useGetAgreementPeriodApi();
	const GetAssignLocationTypeApi = useGetAssignLocationTypeApi();
	const GetNotificationCategoryApi = useGetNotificationCategoryApi();
	const GetRejectedReasonApi = useGetRejectedReasonApi();

	const AddRestaurantTypeApi = useAddRestaurantTypeApi();
	const AddCuisineTypeApi = useAddCuisineTypeApi();
	const AddAgreementPeriodApi = useAddAgreementPeriodApi();
	const AddAssignLocationTypeApi = useAddAssignLocationTypeApi();
	const AddNotificationCategoryApi = useAddNotificationCategoryApi();
	const AddRejectedReasonApi = useAddRejectedReasonApi();

	const UpdateRestaurantTypeApi = useUpdateRestaurantTypeApi();
	const UpdateCuisineTypeApi = useUpdateCuisineTypeApi();
	const UpdateAgreementPeriodApi = useUpdateAgreementPeriodApi();
	const UpdateAssignLocationTypeApi = useUpdateAssignLocationTypeApi();
	const UpdateNotificationCategoryApi = useUpdateNotificationCategoryApi();
	const UpdateRejectedReasonApi = useUpdateRejectedReasonApi();

	const [addNewType, setAddNewType] = useState<AddNewType>(false);
	const [updateType, setUpdateType] = useState<{ type: AddNewType; item: Option } | null>(null);
	const [expandAccordian, setExpandAccordian] = useState<string | false>(false);

	const handleAddTypes = (type: AddNewType, value: string) => {
		switch (type) {
			case 'Restaurant Type':
				void AddRestaurantTypeApi.mutateAsync({ request: { type_name: value } })
					.then((response) => {
						showSnackbar({
							title: 'Success!',
							variant: 'sucess',
							content: response.data?.message,
							onCancel: () => hideSnackbar(),
						});
						setAddNewType(false);
						void GetRestaurantTypeApi.refetch();
					})
					.catch((error) => {
						showSnackbar({
							title: 'Error!',
							variant: 'error',
							content: error.response?.data?.message,
							onCancel: () => hideSnackbar(),
						});
					});
				break;

			case 'Cuisine Type':
				void AddCuisineTypeApi.mutateAsync({ request: { cuisine_name: value } })
					.then((response) => {
						showSnackbar({
							title: 'Success!',
							variant: 'sucess',
							content: response.data?.message,
							onCancel: () => hideSnackbar(),
						});
						setAddNewType(false);
						void GetCuisineTypeApi.refetch();
					})
					.catch((error) => {
						showSnackbar({
							title: 'Error!',
							variant: 'error',
							content: error.response?.data?.message,
							onCancel: () => hideSnackbar(),
						});
					});
				break;

			case 'Agreement Period':
				void AddAgreementPeriodApi.mutateAsync({ request: { period: value } })
					.then((response) => {
						showSnackbar({
							title: 'Success!',
							variant: 'sucess',
							content: response.data?.message,
							onCancel: () => hideSnackbar(),
						});
						setAddNewType(false);
						void GetAgreementPeriodApi.refetch();
					})
					.catch((error) => {
						showSnackbar({
							title: 'Error!',
							variant: 'error',
							content: error.response?.data?.message,
							onCancel: () => hideSnackbar(),
						});
					});
				break;
			case 'Assign Location':
				void AddAssignLocationTypeApi.mutateAsync({ request: { location: value } })
					.then((response) => {
						showSnackbar({
							title: 'Success!',
							variant: 'sucess',
							content: response.data?.message,
							onCancel: () => hideSnackbar(),
						});
						setAddNewType(false);
						void GetAssignLocationTypeApi.refetch();
					})
					.catch((error) => {
						showSnackbar({
							title: 'Error!',
							variant: 'error',
							content: error.response?.data?.message,
							onCancel: () => hideSnackbar(),
						});
					});
				break;
			case 'Notification Category':
				void AddNotificationCategoryApi.mutateAsync({ request: { message_category: value } })
					.then((response) => {
						showSnackbar({
							title: 'Success!',
							variant: 'sucess',
							content: response.data?.message,
							onCancel: () => hideSnackbar(),
						});
						setAddNewType(false);
						void GetNotificationCategoryApi.refetch();
					})
					.catch((error) => {
						showSnackbar({
							title: 'Error!',
							variant: 'error',
							content: error.response?.data?.message,
							onCancel: () => hideSnackbar(),
						});
					});
				break;

			case 'Document Rejection':
				void AddRejectedReasonApi.mutateAsync({ request: { reject_reason: value } })
					.then((response) => {
						showSnackbar({
							title: 'Success!',
							variant: 'sucess',
							content: response.data?.message,
							onCancel: () => hideSnackbar(),
						});
						setAddNewType(false);
						void GetNotificationCategoryApi.refetch();
					})
					.catch((error) => {
						showSnackbar({
							title: 'Error!',
							variant: 'error',
							content: error.response?.data?.message,
							onCancel: () => hideSnackbar(),
						});
					});
				break;

			default:
				break;
		}
	};

	const handleUpdateTypes = (type: AddNewType, itemToUpdate: Option) => {
		switch (type) {
			case 'Restaurant Type':
				void UpdateRestaurantTypeApi.mutateAsync({
					request: { new_type_name: itemToUpdate.label },
					id: itemToUpdate.value,
				})
					.then((response) => {
						showSnackbar({
							title: 'Success!',
							variant: 'sucess',
							content: response.data?.message,
							onCancel: () => hideSnackbar(),
						});
						setUpdateType(null);
						void GetRestaurantTypeApi.refetch();
					})
					.catch((error) => {
						showSnackbar({
							title: 'Error!',
							variant: 'error',
							content: error.response?.data?.message,
							onCancel: () => hideSnackbar(),
						});
					});
				break;

			case 'Cuisine Type':
				void UpdateCuisineTypeApi.mutateAsync({
					request: { new_cuisine_name: itemToUpdate.label },
					id: itemToUpdate.value,
				})
					.then((response) => {
						showSnackbar({
							title: 'Success!',
							variant: 'sucess',
							content: response.data?.message,
							onCancel: () => hideSnackbar(),
						});

						setUpdateType(null);
						void GetCuisineTypeApi.refetch();
					})
					.catch((error) => {
						showSnackbar({
							title: 'Error!',
							variant: 'error',
							content: error.response?.data?.message,
							onCancel: () => hideSnackbar(),
						});
					});

				break;

			case 'Agreement Period':
				void UpdateAgreementPeriodApi.mutateAsync({
					request: { new_period_name: itemToUpdate.label },
					id: itemToUpdate.value,
				})
					.then((response) => {
						showSnackbar({
							title: 'Success!',
							variant: 'sucess',
							content: response.data?.message,
							onCancel: () => hideSnackbar(),
						});
						setUpdateType(null);
						void GetAgreementPeriodApi.refetch();
					})
					.catch((error) => {
						showSnackbar({
							title: 'Error!',
							variant: 'error',
							content: error.response?.data?.message,
							onCancel: () => hideSnackbar(),
						});
					});
				break;
			case 'Assign Location':
				void UpdateAssignLocationTypeApi.mutateAsync({
					request: { new_location: itemToUpdate.label },
					id: itemToUpdate.value,
				})
					.then((response) => {
						showSnackbar({
							title: 'Success!',
							variant: 'sucess',
							content: response.data?.message,
							onCancel: () => hideSnackbar(),
						});
						setUpdateType(null);
						void GetAssignLocationTypeApi.refetch();
					})
					.catch((error) => {
						showSnackbar({
							title: 'Error!',
							variant: 'error',
							content: error.response?.data?.message,
							onCancel: () => hideSnackbar(),
						});
					});
				break;
			case 'Notification Category':
				void UpdateNotificationCategoryApi.mutateAsync({
					request: { new_message_category: itemToUpdate.label },
					id: itemToUpdate.value,
				})
					.then((response) => {
						showSnackbar({
							title: 'Success!',
							variant: 'sucess',
							content: response.data?.message,
							onCancel: () => hideSnackbar(),
						});
						setUpdateType(null);
						void GetNotificationCategoryApi.refetch();
					})
					.catch((error) => {
						showSnackbar({
							title: 'Error!',
							variant: 'error',
							content: error.response?.data?.message,
							onCancel: () => hideSnackbar(),
						});
					});
				break;

			case 'Document Rejection':
				void UpdateRejectedReasonApi.mutateAsync({
					request: { new_reject_reason: itemToUpdate.label },
					id: itemToUpdate.value,
				})
					.then((response) => {
						showSnackbar({
							title: 'Success!',
							variant: 'sucess',
							content: response.data?.message,
							onCancel: () => hideSnackbar(),
						});
						setUpdateType(null);
						void GetNotificationCategoryApi.refetch();
					})
					.catch((error) => {
						showSnackbar({
							title: 'Error!',
							variant: 'error',
							content: error.response?.data?.message,
							onCancel: () => hideSnackbar(),
						});
					});
				break;

			default:
				break;
		}
	};
	const handleAccExpand = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
		setExpandAccordian(isExpanded ? panel : false);
	};

	return (
		<Stack
			gap={5}
			paddingBottom={3}
		>
			<PoppinsTypography
				variant='h5'
				sx={{ color: theme.palette.common.primaryGreyText }}
			>
				All Master List
			</PoppinsTypography>
			<Stack gap={2}>
				<Accordion
					TransitionProps={{ unmountOnExit: true }}
					expanded={expandAccordian === 'Restaurant List'}
					onChange={handleAccExpand('Restaurant List')}
				>
					<AccordionSummary expandIcon={<IconFinder iconName='CircleArrowDown' />}>
						<PoppinsTypography
							variant='h6'
							sx={{ color: theme.palette.common.primaryGreyText }}
						>
							Restaurant List
						</PoppinsTypography>
					</AccordionSummary>
					<AccordionDetails>
						<Stack
							flexBasis={`25%`}
							flexDirection={'row'}
							gap={10}
						>
							<ListWrapper
								heading={`Restaurant Type`}
								onAddClick={() => setAddNewType('Restaurant Type')}
								onEditItemClick={(item) => setUpdateType({ item, type: 'Restaurant Type' })}
								data={GetRestaurantTypeApi.data?.data.restaurantTypeData.map((d) => ({
									label: d.type_name,
									value: d.id,
								}))}
							/>

							<ListWrapper
								heading={`Cuisine Type`}
								onAddClick={() => setAddNewType('Cuisine Type')}
								onEditItemClick={(item) => setUpdateType({ item, type: 'Cuisine Type' })}
								data={GetCuisineTypeApi.data?.data.cuisineData.map((d) => ({
									label: d.cuisine_name,
									value: d.id,
								}))}
							/>
						</Stack>
					</AccordionDetails>
				</Accordion>
				<Accordion
					TransitionProps={{ unmountOnExit: true }}
					expanded={expandAccordian === 'Sub Admin List'}
					onChange={handleAccExpand('Sub Admin List')}
				>
					<AccordionSummary expandIcon={<IconFinder iconName='CircleArrowDown' />}>
						<PoppinsTypography
							variant='h6'
							sx={{ color: theme.palette.common.primaryGreyText }}
						>
							Sub Admin List
						</PoppinsTypography>
					</AccordionSummary>
					<AccordionDetails>
						<Stack
							flexBasis={`25%`}
							flexDirection={'row'}
							gap={10}
						>
							<ListWrapper
								heading={`Agreement Period`}
								onAddClick={() => setAddNewType('Agreement Period')}
								onEditItemClick={(item) => setUpdateType({ item, type: 'Agreement Period' })}
								data={GetAgreementPeriodApi.data?.data.onbordingPeriodsData.map((d) => ({
									label: d.period,
									value: d.id,
								}))}
							/>
							<ListWrapper
								heading={`Assign Location`}
								onAddClick={() => setAddNewType('Assign Location')}
								onEditItemClick={(item) => setUpdateType({ item, type: 'Assign Location' })}
								data={GetAssignLocationTypeApi.data?.data.onbordingLocationData.map((d) => ({
									label: d.location_name,
									value: d.id,
								}))}
							/>
						</Stack>
					</AccordionDetails>
				</Accordion>
				<Accordion
					TransitionProps={{ unmountOnExit: true }}
					expanded={expandAccordian === 'Notifications'}
					onChange={handleAccExpand('Notifications')}
				>
					<AccordionSummary expandIcon={<IconFinder iconName='CircleArrowDown' />}>
						<PoppinsTypography
							variant='h6'
							sx={{ color: theme.palette.common.primaryGreyText }}
						>
							Notifications
						</PoppinsTypography>
					</AccordionSummary>
					<AccordionDetails>
						<Stack
							flexBasis={`25%`}
							flexDirection={'row'}
							gap={10}
						>
							<ListWrapper
								heading={`Notification Category`}
								onAddClick={() => setAddNewType('Notification Category')}
								onEditItemClick={(item) => setUpdateType({ item, type: 'Notification Category' })}
								data={GetNotificationCategoryApi.data?.data.categoryData.map((d) => ({
									label: d.message_category,
									value: d.msg_category_id,
								}))}
							/>

							<ListWrapper
								heading={`Document Rejection`}
								onAddClick={() => setAddNewType('Document Rejection')}
								onEditItemClick={(item) => setUpdateType({ item, type: 'Document Rejection' })}
								data={GetRejectedReasonApi.data?.data.reject_reason_data?.map((d) => ({
									label: d.reject_reason,
									value: d.id.toString(),
								}))}
							/>
						</Stack>
					</AccordionDetails>
				</Accordion>
			</Stack>
			<AddNewInputDialog
				heading={(updateType?.type ?? addNewType) as string}
				loading={AddRestaurantTypeApi.isLoading || UpdateRestaurantTypeApi.isLoading}
				updateItem={updateType?.item}
				handleClose={() => {
					setAddNewType(false);
					setUpdateType(null);
				}}
				onAddClick={handleAddTypes}
				onUpdateClick={handleUpdateTypes}
			/>
		</Stack>
	);
};

export default memo(AllMasterList);

interface ListWrapperProps {
	heading: AddNewType;
	data?: Option[];
	onAddClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	onEditItemClick?: (item: Option, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const ListWrapper = memo((props: ListWrapperProps) => {
	const theme = useTheme();

	return (
		<Stack
			gap={2}
			width={`25%`}
		>
			<PoppinsTypography
				variant='subtitle1'
				sx={{ color: theme.palette.common.primaryGreyText }}
			>
				{props.heading} ({props.data?.length})
			</PoppinsTypography>

			<List
				sx={{
					borderRadius: `8px !important`,
					borderWidth: 1,
					borderStyle: 'solid',
					borderColor: '#DFE3ED',
					backgroundColor: '#F3F4F8',
					maxHeight: 200,
					overflow: 'auto',
				}}
			>
				{props.data?.map((l, index) => (
					<>
						<ListItem
							alignItems='flex-start'
							secondaryAction={
								<IconButton
									edge='end'
									size='small'
									onClick={(e) => props.onEditItemClick?.(l, e)}
								>
									<IconFinder
										iconName='Pen'
										iconProps={{
											width: 20,
											height: 20,
											fill: theme.palette.common.primaryGreyText,
										}}
									/>
								</IconButton>
							}
						>
							<PoppinsTypography variant='subtitle1'>{l.label}</PoppinsTypography>
						</ListItem>
						{Lists.length !== index + 1 && (
							<Divider
								variant='inset'
								component='li'
								sx={{ borderColor: '#DFE3ED', marginX: 2 }}
							/>
						)}
					</>
				))}
			</List>

			{props?.onAddClick && (
				<LoadingButton
					size='large'
					variant='outlined'
					color='inherit'
					startIcon={
						<IconFinder
							iconName='Add'
							iconProps={{ fill: theme.palette.common.secondaryGreyText }}
						/>
					}
					sx={{
						borderColor: theme.palette.common.secondaryGreyText,
						alignSelf: 'self-start',
					}}
					onClick={props.onAddClick}
				>
					<PoppinsTypography variant='subtitle2'>Add New</PoppinsTypography>
				</LoadingButton>
			)}
		</Stack>
	);
});

interface AddNewInputDialogProps {
	heading: string;
	onAddClick?: (
		type: AddNewType,
		value: string,
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => void;
	updateItem?: Option;
	loading?: boolean;
	onUpdateClick?: (
		type: AddNewType,
		newItem: Option,
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => void;
	onCancelClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	handleClose?: () => void;
}

const AddNewInputDialog = (props: AddNewInputDialogProps) => {
	const theme = useTheme();

	const [value, setValue] = useState('');
	const onChange = (fieldName: string, value: InputFieldValue) => {
		setValue(value as string);
	};

	useEffect(() => {
		setValue(props.updateItem?.label ?? '');
	}, [props.updateItem]);

	useEffect(() => {
		if (!props.heading) {
			setValue('');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [Boolean(props.heading)]);

	return (
		<Dialog
			onClose={props.handleClose}
			open={Boolean(props.heading)}
			maxWidth='sm'
			sx={{ '.MuiPaper-root': { width: `100%` } }}
		>
			<DialogTitle sx={{ padding: 4, paddingBottom: 3 }}>
				<PoppinsTypography
					variant='h4'
					sx={{ color: theme.palette.common.primaryGreyText }}
				>
					{props.updateItem ? 'Update' : 'Add'} {props.heading}
				</PoppinsTypography>
			</DialogTitle>
			<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 4 }}>
				<InputField
					fieldName='add'
					value={value}
					fieldProps={{
						placeholder: 'Type here to add',
						fullWidth: true,
						size: 'medium',
						sx: {
							'.MuiInputBase-root': {
								borderRadius: '8px',
							},
						},
					}}
					onChange={onChange}
				/>

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
							variant='h5'
							sx={{ color: theme.palette.common.primaryGreyText }}
						>
							Cancel
						</PoppinsTypography>
					</LoadingButton>

					{props.updateItem ? (
						<LoadingButton
							variant='contained'
							size='large'
							sx={{ width: 166 }}
							loading={props.loading}
							onClick={(e) =>
								props.onUpdateClick?.(
									props.heading as AddNewType,
									{ value: props.updateItem?.value ?? '', label: value },
									e
								)
							}
						>
							<PoppinsTypography variant='h5'>Update</PoppinsTypography>
						</LoadingButton>
					) : (
						<LoadingButton
							variant='contained'
							size='large'
							sx={{ width: 166 }}
							loading={props.loading}
							onClick={(e) => props.onAddClick?.(props.heading as AddNewType, value, e)}
						>
							<PoppinsTypography variant='h5'>Add</PoppinsTypography>
						</LoadingButton>
					)}
				</Stack>
			</DialogContent>
		</Dialog>
	);
};
