import InputField, { InputFieldValue } from '@components/InputField';
import { useSnackbar } from '@components/Snackbar';
import { PoppinsTypography } from '@components/Typography';
import {
	useRestaurantAddCategoryApi,
	useRestaurantUpdateCategoryApi,
} from '@hooks/restaurant-category';
import { Option } from '@interfaces/common';
import { LoadingButton } from '@mui/lab';
import { Dialog, DialogContent, DialogTitle, Stack, useTheme } from '@mui/material';
import { useState, useEffect, memo } from 'react';

interface AddUpdateCategoryDialogProps {
	open: boolean;
	heading: string;
	updateItem?: Option;
	onCancelClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	handleClose?: () => void;
	refetch?: () => void;
}

const AddUpdateCategoryDialog = (props: AddUpdateCategoryDialogProps) => {
	const theme = useTheme();
	const { showSnackbar, hideSnackbar } = useSnackbar();

	const RestaurantAddCategoryApi = useRestaurantAddCategoryApi();
	const RestaurantUpdateCategoryApi = useRestaurantUpdateCategoryApi();

	const [value, setValue] = useState('');
	const onChange = (fieldName: string, value: InputFieldValue) => {
		setValue(value ? `${(value as string)?.[0]?.toUpperCase()}${(value as string)?.slice(1)}` : '');
	};

	useEffect(() => {
		setValue(props.updateItem?.label ?? '');
	}, [props.updateItem]);

	useEffect(() => {
		if (!props.open) {
			setValue('');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.open]);

	const onAddClick = () => {
		RestaurantAddCategoryApi.mutateAsync({
			request: {
				categories_name: value,
			},
		})
			.then((response) => {
				props.refetch?.();
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});

				props.handleClose?.();
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

	const onUpdateClick = () => {
		RestaurantUpdateCategoryApi.mutateAsync({
			request: {
				categories_name: value,
				categories_id: props.updateItem?.value as string,
			},
		})
			.then((response) => {
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
				props.refetch?.();
				props.handleClose?.();
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
		<Dialog
			onClose={props.handleClose}
			open={props.open}
			maxWidth='sm'
		>
			<DialogTitle sx={{ padding: 4, paddingBottom: 3 }}>
				<PoppinsTypography
					fontSize={18}
					fontWeight={600}
					sx={{ color: theme.palette.common.primaryGreyText }}
				>
					{props.heading}
				</PoppinsTypography>
			</DialogTitle>
			<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 4 }}>
				<InputField
					fieldName='add'
					value={value}
					fieldProps={{
						placeholder: 'Type category to add...',
						fullWidth: true,
						size: 'medium',
						sx: {
							'& .MuiInputBase-input': {
								backgroundColor: '#F3F4F9',
								height: 20,
							},
							'& .MuiOutlinedInput-notchedOutline': {
								borderColor: 'transparent',
								borderRadius: `12px`,
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
						sx={{ width: 166, height: 40, borderRadius: `8px` }}
						onClick={props.handleClose}
					>
						<PoppinsTypography
							variant='subtitle1'
							sx={{ color: theme.palette.common.primaryGreyText }}
						>
							Cancel
						</PoppinsTypography>
					</LoadingButton>

					{props.updateItem ? (
						<LoadingButton
							variant='contained'
							size='large'
							sx={{ width: 166, height: 40, borderRadius: `8px` }}
							loading={RestaurantUpdateCategoryApi.isLoading}
							onClick={onUpdateClick}
						>
							<PoppinsTypography variant='subtitle1'>Update</PoppinsTypography>
						</LoadingButton>
					) : (
						<LoadingButton
							variant='contained'
							size='large'
							sx={{ width: 166, height: 40, borderRadius: `8px` }}
							loading={RestaurantAddCategoryApi.isLoading}
							onClick={onAddClick}
						>
							<PoppinsTypography variant='subtitle1'>Add</PoppinsTypography>
						</LoadingButton>
					)}
				</Stack>
			</DialogContent>
		</Dialog>
	);
};

export default memo(AddUpdateCategoryDialog);
