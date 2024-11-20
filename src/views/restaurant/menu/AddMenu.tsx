/* eslint-disable indent */
import IconFinder from '@components/Icon';
import { PoppinsTypography } from '@components/Typography';
import {
	Autocomplete,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	FormHelperText,
	IconButton,
	LinearProgress,
	Menu,
	MenuItem,
	Stack,
	TextField,
	Tooltip,
	TooltipProps,
	styled,
	tooltipClasses,
	useTheme,
} from '@mui/material';
import { memo, useEffect, useState } from 'react';
import InputField, { InputFieldValue } from '@components/InputField';
import { LoadingButton } from '@mui/lab';
import Uploader from '@components/Uploader';
import { FormErrorMessage, Option } from '@interfaces/common';
import {
	RestaurantMenuResponse,
	RestaurantMenusRequest,
	useAddRestaurantMenuApi,
	useGetRestaurantCountsApi,
	useGetRestaurantMenuApi,
	useUpdateRestaurantMenuApi,
	uploadRestaurantMenuExcelApi,
	useGetRestaurantMenusTypesApi,
	validateMenuFormFields,
	validateMenuForm,
} from '@hooks/restaurant-menu';
import AddUpdateCategoryDialog from './AddUpdateCategoryDialog';
import { validateIsPrice } from '@utils/validator';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '@components/Snackbar';
import { useGetAllRestaurantCategoriesApi } from '@hooks/restaurant-category';
import axios from 'axios';
import { RESTAURANT_BASE_URL } from '@utils/common';

const initialFormData = (data?: RestaurantMenuResponse): RestaurantMenusRequest => ({
	cat_id: data?.cat_id ? { label: data?.cat_name, value: data?.cat_id } : '',
	type_id: data?.type_id ?? null,
	menu_name: data?.menu_name ?? '',
	menu_desc: data?.menu_desc ?? '',
	price: data?.price ?? '',
	menu_img: data?.menu_img ?? '',
	recomended_status: data?.recomended_status ?? 'no',
});

const initialFormError: FormErrorMessage<Partial<RestaurantMenusRequest>> = {
	cat_id: '',
	type_id: '',
	menu_name: '',
	price: '',
};

const AddMenu = () => {
	const theme = useTheme();
	const { showSnackbar, hideSnackbar } = useSnackbar();
	const location = useLocation();
	const navigate = useNavigate();
	const { id } = useParams() as { id: string };

	const GetRestaurantMenusTypesApi = useGetRestaurantMenusTypesApi();
	const GetRestaurantCountsApi = useGetRestaurantCountsApi();
	const GetRestaurantMenuApi = useGetRestaurantMenuApi(id);
	const UpdateRestaurantMenuApi = useUpdateRestaurantMenuApi();
	const AddRestaurantMenuApi = useAddRestaurantMenuApi();
	const GetAllRestaurantCategoriesApi = useGetAllRestaurantCategoriesApi();

	const [openCategoryDialog, setOpenCategoryDialog] = useState<boolean>(false);
	const [openUploadExcelDialog, setOpenUploadExcelDialog] = useState<boolean>(false);
	const [menuTypeAnchorEl, setMenuTypeAnchorEl] = useState<HTMLElement | null>(null);
	const [formData, setFormData] = useState(initialFormData());
	const [formError, setFormError] = useState(initialFormError);

	const isToUpdate = location.pathname.includes(`/${RESTAURANT_BASE_URL}/menu/update/`);

	const onChange = (fieldName: string, value: InputFieldValue) => {
		let _formData: RestaurantMenusRequest = {} as RestaurantMenusRequest;
		if (fieldName === 'price') {
			_formData = {
				...formData,
				[fieldName as keyof RestaurantMenusRequest]: validateIsPrice(String(value))
					? value
					: formData[fieldName as keyof RestaurantMenusRequest],
			};
		} else if (fieldName === 'cat_id') {
			_formData = {
				...formData,
				[fieldName as keyof RestaurantMenusRequest]: (value as Option[]).reverse()[0],
			};
		} else {
			_formData = { ...formData, [fieldName]: value };
		}
		setFormData(_formData);
		setFormError({
			...formError,
			[fieldName]: validateMenuFormFields(
				fieldName as keyof Partial<RestaurantMenusRequest>,
				_formData as Partial<RestaurantMenusRequest>
			),
		});
	};

	const onAddItem = () => {
		const validatation = validateMenuForm(formData);
		if (validatation.hasError) {
			setFormError(validatation.errors);
			return;
		}

		AddRestaurantMenuApi.mutateAsync({
			request: { ...formData, cat_id: (formData.cat_id as Option)?.value },
		})
			.then((response) => {
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
				onCancel();
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

	const onUpdateItem = () => {
		const validatation = validateMenuForm(formData);
		if (validatation.hasError) {
			setFormError(validatation.errors);
			return;
		}
		UpdateRestaurantMenuApi.mutateAsync({
			id,
			request: { ...formData, cat_id: (formData.cat_id as Option)?.value },
		})
			.then((response) => {
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
				onCancel();
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

	const onCancel = () => {
		navigate(`/${RESTAURANT_BASE_URL}/menu`);
	};

	useEffect(() => {
		setFormData(initialFormData(GetRestaurantMenuApi.data?.data.data));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [GetRestaurantMenuApi.dataUpdatedAt]);

	return (
		<Stack
			flexGrow={1}
			gap={2}
		>
			<Stack
				flexDirection={'row'}
				gap={4}
			>
				<Stack
					flexBasis={`75%`}
					gap={8}
				>
					<Stack gap={4}>
						<Stack
							flexDirection={'row'}
							justifyContent={'space-between'}
						>
							<PoppinsTypography
								fontSize={25}
								sx={{
									color: theme.palette.common.primaryGreyText,
								}}
							>
								Add New Item
							</PoppinsTypography>
							<LightTooltip
								leaveDelay={500}
								arrow
								title={
									<>
										<MenuItem
											sx={{ gap: 1 }}
											onClick={() => setOpenUploadExcelDialog(true)}
										>
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.primaryGreyText }}
											>
												Upload via excel
											</PoppinsTypography>
											<IconFinder iconName='Excel' />
										</MenuItem>
										<Divider />
										<MenuItem
											onClick={() =>
												window.open(
													`${String(process.env.REACT_APP_GATEWAY_API)}/media/MenuImg/MENU.xlsx`
												)
											}
										>
											<PoppinsTypography
												variant='subtitle1'
												sx={{ color: theme.palette.common.primaryGreyText }}
											>
												Download Sample
											</PoppinsTypography>
										</MenuItem>
									</>
								}
							>
								<span>
									<IconFinder iconName='MoreVertical' />
								</span>
							</LightTooltip>
						</Stack>
						<InputField
							fieldName='menu_name'
							value={formData.menu_name}
							fieldProps={{
								placeholder: 'Enter Item Name',
								fullWidth: true,
								size: 'medium',
								variant: 'standard',
								autoComplete: 'off',
								error: Boolean(formError.menu_name),
								helperText: formError.menu_name,
								sx: {
									'& .MuiInputBase-input': {
										backgroundColor: 'transparent',
										height: 65,
										fontSize: 56,
										fontWeight: 600,
										fontFamily: 'Poppins',
										color: formData.menu_name ? theme.palette.common.primaryGreyText : '#CCCCDD',
									},
								},
								InputProps: {
									endAdornment: (
										<IconButton
											onClick={() =>
												onChange(
													'recomended_status',
													formData.recomended_status === 'no' ? 'yes' : 'no'
												)
											}
										>
											<IconFinder
												iconName='Star'
												iconProps={{
													...(formData.recomended_status === 'no' && {
														fill: theme.palette.common.secondaryGreyText,
													}),
												}}
											/>
										</IconButton>
									),
								},
							}}
							onChange={onChange}
						/>

						<InputField
							fieldName='menu_desc'
							value={formData.menu_desc}
							fieldProps={{
								multiline: true,
								maxRows: 5,
								label: 'Description (Optional)',
								fullWidth: true,
								size: 'medium',
								sx: {
									'& .MuiInputBase-input': {
										backgroundColor: '#ECEFF4',
										height: `60px !important`,
										paddingX: `14px`,
										paddingY: `16px`,
										borderRadius: `8px`,
									},
									'& .MuiInputBase-root': {
										padding: 0,
									},
									'& .MuiOutlinedInput-notchedOutline': {
										borderColor: 'transparent',
										borderRadius: `8px`,
									},
								},
							}}
							onChange={onChange}
						/>
						<Stack gap={1}>
							<PoppinsTypography
								variant='subtitle1'
								display={'flex'}
								gap={0.5}
							>
								Category
							</PoppinsTypography>
							<Stack
								flexDirection={'row'}
								gap={1}
							>
								<Autocomplete
									multiple
									fullWidth
									size='medium'
									placeholder='Type category to assign...'
									options={
										(GetAllRestaurantCategoriesApi.data?.data.data === undefined
											? []
											: GetAllRestaurantCategoriesApi.data?.data.data?.map((c) => ({
													label: c.categories_name,
													value: String(c.categories_id),
											  }))) as Option[]
									}
									value={(formData.cat_id ? [formData.cat_id] : []) as Option[]}
									renderOption={(_props, option) => {
										return (
											<MenuItem
												{..._props}
												disableGutters
											>
												{option.label}
											</MenuItem>
										);
									}}
									renderInput={(params) => (
										<TextField
											{...params}
											size='medium'
											label=''
											error={Boolean(formError.cat_id)}
											helperText={formError.cat_id}
										/>
									)}
									ChipProps={{
										color: 'primary',
										size: 'medium',
										variant: 'outlined',
										onDelete: undefined,
									}}
									onChange={(event: React.SyntheticEvent, value: Option[] | null) =>
										onChange?.('cat_id', value as InputFieldValue)
									}
									componentsProps={{
										popper: {
											sx: { height: `min-content` },
										},
									}}
									sx={{
										borderRadius: `8px`,
										'& .MuiInputBase-input': {
											height: 17,
										},
										'.MuiOutlinedInput-root': {
											borderRadius: `8px`,
										},
										'& .MuiInputBase-root': {
											backgroundColor: '#ECEFF4',
										},
										'.MuiOutlinedInput-notchedOutline': {
											borderColor: 'transparent',
										},
									}}
								/>
								<Button
									size='small'
									variant='text'
									disableRipple
									endIcon={
										<IconFinder
											iconName='Add'
											iconProps={{ fill: theme.palette.primary.main, width: 15, height: 15 }}
										/>
									}
									sx={{ minWidth: 180 }}
									onClick={() => setOpenCategoryDialog(true)}
								>
									<PoppinsTypography
										variant='caption'
										fontWeight={600}
									>
										Add New Category
									</PoppinsTypography>
								</Button>
							</Stack>
						</Stack>

						<InputField
							fieldName='price'
							value={formData.price as string}
							fieldType='number'
							fieldProps={{
								placeholder: '0000.00',
								label: 'Price',
								size: 'medium',
								InputProps: {
									startAdornment: (
										<>
											<IconFinder
												iconName='RupayV2'
												iconProps={{ width: 15, height: 15 }}
											/>
											<Divider
												orientation='vertical'
												sx={{
													borderColor: theme.palette.common.secondaryGreyText,
													height: `32px`,
													padding: 'inherit',
												}}
											/>
										</>
									),
								},
								error: Boolean(formError.price),
								helperText: formError.price,
								sx: {
									width: '50%',
									'& .MuiTextField-root': {
										borderRadius: `8px`,
									},
									'& .MuiInputBase-input': {
										height: 18,
									},
									'& .MuiInputBase-root': {
										backgroundColor: '#ECEFF4',
									},
									'& .MuiOutlinedInput-notchedOutline': {
										borderColor: 'transparent',
										borderRadius: `8px`,
									},
									'& .MuiOutlinedInput-input': { paddingLeft: 'inherit' },
								},
							}}
							onChange={onChange}
						/>
					</Stack>

					<Stack
						flexDirection={'row'}
						gap={2}
					>
						<LoadingButton
							variant='outlined'
							size={'large'}
							sx={{ minWidth: 280, borderRadius: `12px`, height: 56 }}
							disabled={UpdateRestaurantMenuApi.isLoading || AddRestaurantMenuApi.isLoading}
							onClick={onCancel}
						>
							<PoppinsTypography sx={{ color: theme.palette.common.primaryGreyText }}>
								Cancel
							</PoppinsTypography>
						</LoadingButton>

						{isToUpdate ? (
							<LoadingButton
								variant='contained'
								size={'large'}
								sx={{ minWidth: 280, borderRadius: `12px`, height: 56 }}
								loading={UpdateRestaurantMenuApi.isLoading}
								onClick={onUpdateItem}
							>
								<PoppinsTypography>Update Item</PoppinsTypography>
							</LoadingButton>
						) : (
							<LoadingButton
								variant='contained'
								size={'large'}
								sx={{ minWidth: 280, borderRadius: `12px`, height: 56 }}
								loading={AddRestaurantMenuApi.isLoading}
								onClick={onAddItem}
							>
								<PoppinsTypography>Add Item</PoppinsTypography>
							</LoadingButton>
						)}
					</Stack>
				</Stack>

				<Stack
					flexBasis={`25%`}
					gap={8}
				>
					<Stack
						flexDirection={'row'}
						justifyContent={'space-between'}
						alignSelf={'end'}
						height={37.5}
					>
						<PoppinsTypography
							variant='subtitle1'
							sx={{
								display: 'flex',
								alignSelf: 'center',
								color: theme.palette.common.secondaryGreyText,
							}}
						>
							Total Item:
							<PoppinsTypography
								variant='subtitle1'
								fontWeight={600}
								sx={{
									color: theme.palette.common.primaryGreyText,
									paddingLeft: 1,
								}}
							>
								{GetRestaurantCountsApi.data?.data.data.all_menu_count}
							</PoppinsTypography>
						</PoppinsTypography>
					</Stack>
					<Stack>
						<Button
							size='large'
							onClick={(e) => setMenuTypeAnchorEl(e.currentTarget)}
							endIcon={
								<IconFinder
									iconName='ChevronDown'
									iconProps={{ fill: theme.palette.secondary.main }}
								/>
							}
							sx={{
								height: 48,
								borderRadius: `8px`,
								justifyContent: 'space-between',
								'& .MuiButton-endIcon': {
									height: 'inherit',
									width: '20%',
									alignItems: 'center',
									justifyContent: 'center',
									backgroundColor: theme.palette.common.primaryGreyText,
									marginRight: `-10px`,
									borderTopRightRadius: `8px`,
									borderBottomRightRadius: `8px`,
								},
							}}
							style={{ backgroundColor: '#DFE3ED' }}
						>
							{formData.type_id === null ? (
								<PoppinsTypography
									variant={'subtitle2'}
									sx={{ color: theme.palette.common.secondaryGreyText }}
								>
									Choose type...
								</PoppinsTypography>
							) : (
								<Stack
									flexDirection={'row'}
									gap={1}
									alignItems={'center'}
								>
									<PoppinsTypography
										variant={'subtitle1'}
										sx={{ color: theme.palette.common.primaryGreyText }}
									>
										{
											GetRestaurantMenusTypesApi.data?.data.menuTypeData.find(
												(m) => String(m.menu_type_id) === String(formData.type_id)
											)?.menu_type_name
										}
									</PoppinsTypography>
									{GetRestaurantMenusTypesApi.data?.data.menuTypeData.find(
										(m) => String(m.menu_type_id) === String(formData.type_id)
									)?.menu_type_icon && (
										<img
											src={
												GetRestaurantMenusTypesApi.data?.data.menuTypeData.find(
													(m) => String(m.menu_type_id) === String(formData.type_id)
												)?.menu_type_icon
											}
											width={16}
											height={16}
										/>
									)}
								</Stack>
							)}
						</Button>
						{formError.type_id && (
							<FormHelperText error={Boolean(formError.type_id)}>
								{formError.type_id}
							</FormHelperText>
						)}
						<Menu
							anchorEl={menuTypeAnchorEl}
							open={Boolean(menuTypeAnchorEl)}
							onClose={() => setMenuTypeAnchorEl(null)}
							sx={{
								'.MuiMenu-paper': {
									left: 'auto !important',
									right: `${theme.spacing(4)} !important`,
									width: menuTypeAnchorEl?.offsetWidth,
								},
								'.MuiButtonBase-root': {
									gap: 1,
								},
							}}
						>
							{GetRestaurantMenusTypesApi.data?.data.menuTypeData?.map((m) => (
								<MenuItem
									key={m.menu_type_id}
									onClick={() => {
										onChange('type_id', m.menu_type_id);
										setMenuTypeAnchorEl(null);
									}}
								>
									{m.menu_type_name}
									{m?.menu_type_icon && (
										<img
											src={m?.menu_type_icon}
											width={16}
											height={16}
										/>
									)}
								</MenuItem>
							))}
						</Menu>
					</Stack>
					<Stack>
						<PoppinsTypography
							variant='subtitle1'
							sx={{ color: theme.palette.common.primaryGreyText }}
						>
							Photo (Optional)
						</PoppinsTypography>
						<Uploader
							fieldName='fieldName'
							sx={{
								placeContent: 'flex-end',
								height: 300,
								backgroundColor: '#ECEFF4',
								borderRadius: `12px`,
								justifyContent: 'center',
								alignItems: 'center',
								flexDirection: 'column',
							}}
							onChange={(e) => {
								setFormData({
									...formData,
									menu_img: e.target?.files as FileList,
								});
							}}
							file={formData.menu_img}
							overlay={
								<Stack
									flexDirection={'row'}
									sx={{
										backgroundColor: `#030406A3`,
										width: '100%',
										position: 'absolute',
										bottom: 0,
										justifyContent: 'center',
										alignItems: 'center',
										gap: 1,
										paddingY: 0.5,
										borderBottomRightRadius: 'inherit',
										borderBottomLeftRadius: 'inherit',
									}}
								>
									<IconFinder
										iconName='Upload'
										iconProps={{ fill: theme.palette.secondary.main }}
									/>
									<PoppinsTypography
										variant='subtitle1'
										sx={{ color: theme.palette.secondary.main }}
									>
										Update Image
									</PoppinsTypography>
								</Stack>
							}
						>
							<IconFinder
								iconName='Upload'
								iconProps={{ fill: theme.palette.primary.main }}
							/>
							<PoppinsTypography
								variant='subtitle1'
								sx={{ color: theme.palette.common.secondaryGreyText }}
							>
								Upload in size 1:1
							</PoppinsTypography>
						</Uploader>
					</Stack>
				</Stack>
			</Stack>
			<UploadExcelDialog
				open={openUploadExcelDialog}
				handleClose={() => setOpenUploadExcelDialog(false)}
			/>
			<AddUpdateCategoryDialog
				open={Boolean(openCategoryDialog)}
				heading='Add Category'
				handleClose={() => setOpenCategoryDialog(false)}
				refetch={() => void GetAllRestaurantCategoriesApi.refetch()}
			/>
		</Stack>
	);
};

export default memo(AddMenu);

interface UploadExcelDialogProps {
	open: boolean;
	handleClose?: () => void;
}

const UploadExcelDialog = memo((props: UploadExcelDialogProps) => {
	const theme = useTheme();
	const navigate = useNavigate();
	const { showSnackbar, hideSnackbar } = useSnackbar();

	const [file, setFile] = useState<FileList | null>(null);
	const [progress, setProgress] = useState<number>(0);
	const [isSucessful, setIsSucessful] = useState<boolean>(false);

	const onUploadClick = () => {
		axios
			.request({
				...uploadRestaurantMenuExcelApi(file as FileList),
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

	const onViewMenu = () => {
		navigate(`/${RESTAURANT_BASE_URL}/menu`);
	};

	return (
		<Dialog
			onClose={props.handleClose}
			open={props.open}
			maxWidth='sm'
		>
			<DialogTitle sx={{ padding: 4, paddingBottom: 3 }}>
				<PoppinsTypography
					fontSize={20}
					fontWeight={600}
					textAlign={'center'}
					sx={{ color: theme.palette.common.primaryGreyText }}
				>
					{isSucessful
						? 'Menu Uploaded Successfully !'
						: progress !== 0 && file !== null
						  ? 'Uploading Menu'
						  : `Upload Excel File`}
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
							width: 360,
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
				<Stack gap={1}>
					<LoadingButton
						variant='contained'
						size='large'
						sx={{ minWidth: 360, borderRadius: `12px` }}
						onClick={progress !== 0 || isSucessful ? onViewMenu : onUploadClick}
						disabled={file === null || progress !== 0}
					>
						<PoppinsTypography variant='subtitle1'>
							{progress !== 0 || isSucessful ? `View Menu` : `Upload Menu`}
						</PoppinsTypography>
					</LoadingButton>
					{!isSucessful && progress === 0 && (
						<LoadingButton
							variant='text'
							size='large'
							sx={{ minWidth: 360, borderRadius: `12px` }}
							onClick={props.handleClose}
						>
							<PoppinsTypography
								variant='subtitle1'
								sx={{ color: theme.palette.common.primaryGreyText }}
							>
								Cancel
							</PoppinsTypography>
						</LoadingButton>
					)}
				</Stack>
			</DialogContent>
		</Dialog>
	);
});

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip
		{...props}
		classes={{ popper: className }}
	/>
))(({ theme }) => ({
	height: `auto !important`,
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: theme.palette.common.white,
		boxShadow: `0px 4px 12px 0px #00000026`,
	},
	[`& .${tooltipClasses.arrow}`]: {
		color: theme.palette.common.white,
	},
}));
