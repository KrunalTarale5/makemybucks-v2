import IconFinder from '@components/Icon';
import { PoppinsTypography } from '@components/Typography';
import { Button, IconButton, Stack, TextField, useTheme } from '@mui/material';
import { memo, useRef, useState } from 'react';
import AllCategory from './AllCategory';
import AddUpdateCategoryDialog from './AddUpdateCategoryDialog';
import { useNavigate } from 'react-router-dom';
import AllMenu from './AllMenu';
import { useBannerInfo } from '@hooks/admin-banner-info';
import { useGetRestaurantCountsApi } from '@hooks/restaurant-menu';
import { RESTAURANT_BASE_URL } from '@utils/common';

type View = 'All Item' | 'All Category';
const Views: View[] = ['All Item', 'All Category'];

const MenuWrapper = () => {
	useBannerInfo({ bannerName: 'All Menu' });
	const theme = useTheme();
	const navigate = useNavigate();

	const GetRestaurantCountsApi = useGetRestaurantCountsApi();

	const searchInputRef = useRef<HTMLInputElement | null>(null);

	const [view, setView] = useState<View>('All Item');
	const [openCategoryDialog, setOpenCategoryDialog] = useState<boolean>(false);
	const [refetch, setRefetch] = useState<boolean>(false);

	const handleView = (view: View) => () => {
		setView(view);
		(searchInputRef.current as HTMLInputElement).value = '';
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter') {
			setRefetch(true);
		}
	};

	const onCancelSearch = () => {
		if (searchInputRef.current?.value || searchInputRef.current?.value !== '') {
			(searchInputRef.current as HTMLInputElement).value = '';
			setRefetch(true);
		}
	};

	return (
		<Stack flexGrow={1}>
			<Stack
				flexDirection={'row'}
				gap={2}
				alignSelf={'end'}
			>
				{view === 'All Item' && (
					<>
						<PoppinsTypography
							variant='subtitle1'
							sx={{
								display: 'flex',
								alignSelf: 'end',
								color: theme.palette.common.secondaryGreyText,
							}}
						>
							Out of Stock:
							<PoppinsTypography
								variant='subtitle1'
								fontWeight={600}
								sx={{
									color: theme.palette.common.primaryGreyText,
									paddingLeft: 1,
								}}
							>
								{GetRestaurantCountsApi.data?.data.data.outof_stock_menu_count}
							</PoppinsTypography>
						</PoppinsTypography>
						<PoppinsTypography
							variant='subtitle1'
							sx={{
								display: 'flex',
								alignSelf: 'end',
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
					</>
				)}

				{view === 'All Category' && (
					<>
						<PoppinsTypography
							variant='subtitle1'
							sx={{
								display: 'flex',
								alignSelf: 'end',
								color: theme.palette.common.secondaryGreyText,
							}}
						>
							Inactive:
							<PoppinsTypography
								variant='subtitle1'
								fontWeight={600}
								sx={{
									color: theme.palette.common.primaryGreyText,
									paddingLeft: 1,
								}}
							>
								{GetRestaurantCountsApi.data?.data.data.inactive_categories_count}
							</PoppinsTypography>
						</PoppinsTypography>
						<PoppinsTypography
							variant='subtitle1'
							sx={{
								display: 'flex',
								alignSelf: 'end',
								color: theme.palette.common.secondaryGreyText,
							}}
						>
							Total Category:
							<PoppinsTypography
								variant='subtitle1'
								fontWeight={600}
								sx={{
									color: theme.palette.common.primaryGreyText,
									paddingLeft: 1,
								}}
							>
								{GetRestaurantCountsApi.data?.data.data.all_categories_count}
							</PoppinsTypography>
						</PoppinsTypography>
					</>
				)}
			</Stack>

			<Stack
				flexDirection={'row'}
				gap={2}
				justifyContent={'space-between'}
				paddingBottom={2}
			>
				<Stack
					flexDirection={'row'}
					gap={2}
				>
					{Views.map((b) => (
						<Button
							key={b}
							size='large'
							variant='contained'
							color='primary'
							onClick={handleView(b)}
							sx={{
								minWidth: 280,
								boxShadow: 'none',
								borderRadius: `10px`,
							}}
							style={{ backgroundColor: view === b ? theme.palette.primary.main : '#E1E1EA' }}
						>
							<PoppinsTypography
								variant='subtitle1'
								fontWeight={600}
								sx={{
									color:
										view === b
											? theme.palette.secondary.main
											: theme.palette.common.primaryGreyText,
								}}
							>
								{b}
							</PoppinsTypography>
						</Button>
					))}
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
								borderRadius: `10px`,
							},
						}}
					/>
					<Button
						variant='contained'
						color='primary'
						startIcon={<IconFinder iconName='Add' />}
						onClick={() => {
							if (view === 'All Category') {
								setOpenCategoryDialog(true);
							} else {
								navigate(`/${RESTAURANT_BASE_URL}/menu/add`);
							}
						}}
						sx={{ borderRadius: `10px` }}
					>
						{view === 'All Item' ? `Add New Item` : `Add Category`}
					</Button>
				</Stack>
			</Stack>
			{view === 'All Category' && (
				<AllCategory
					handleRefetch={() => {
						setRefetch(false);
						void GetRestaurantCountsApi.refetch();
					}}
					refetch={refetch}
					searchInputRef={searchInputRef.current}
				/>
			)}

			{view === 'All Item' && (
				<AllMenu
					handleRefetch={() => {
						setRefetch(false);
						void GetRestaurantCountsApi.refetch();
					}}
					refetch={refetch}
					searchInputRef={searchInputRef.current}
				/>
			)}
			<AddUpdateCategoryDialog
				open={openCategoryDialog}
				heading='Add Category'
				handleClose={() => setOpenCategoryDialog(false)}
				refetch={() => {
					setRefetch(true);
				}}
			/>
		</Stack>
	);
};

export default memo(MenuWrapper);
