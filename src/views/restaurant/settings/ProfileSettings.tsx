import IconFinder from '@components/Icon';
import { useSnackbar } from '@components/Snackbar';
import SwitchButton from '@components/SwitchButton';
import { PoppinsTypography } from '@components/Typography';
import Uploader from '@components/Uploader';
import {
	useGetRestaurentProfileApi,
	useGetRestaurentProfileUpdateApi,
} from '@hooks/restaurant-settings';
import { Box, Divider, Stack, useTheme } from '@mui/material';
import { useAlertDialog } from '@components/AlertDialog';

import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo } from '_store/actions/ui-actions';
import { SET_USER_INFO } from '_store/type';
import { LoadingButton } from '@mui/lab';
import { useChangeRestaurantStatusApi } from '@hooks/admin-restaurant-management';
import { RootState } from '_store/reducers';

function ProfileSettings() {
	const theme = useTheme();
	const dispatch = useDispatch();
	const { userInfo } = useSelector((state: RootState) => state.richPenny);
	const { showAlertDialog, hideAlertDialog } = useAlertDialog();
	const { showSnackbar, hideSnackbar } = useSnackbar();
	const GetRestaurentsprofileApi = useGetRestaurentProfileApi();

	const ChangeRestaurantStatusApi = useChangeRestaurantStatusApi();
	const UpdateRestaurantApi = useGetRestaurentProfileUpdateApi();

	const handleStatus = (status?: string) => () => {
		showAlertDialog({
			title: `${status === '3' ? `De-active` : `Enable`}`,
			content: `Are your sure? You want to ${status === '3' ? `de-active` : `enable`}?`,
			buttons: [
				{
					children: 'Cancel',
					variant: 'outlined',
					callback: () => {
						hideAlertDialog();
					},
				},
				{
					children: status === '3' ? 'Yes, Deactivate' : 'Yes, Enable',
					variant: 'contained',
					callback: () => {
						UpdateRestaurantApi.mutateAsync({
							request: {
								status:
									GetRestaurentsprofileApi.data?.data.restaurant_details.status === '3' ? '2' : '3',
							},
						})
							.then((response) => {
								showSnackbar({
									title: 'Success!',
									variant: 'sucess',
									content: response.data?.message,
									onCancel: () => hideSnackbar(),
								});
								hideAlertDialog();
								dispatch(
									setUserInfo({
										...userInfo,
										avatar: response.data.data.restaurant_banner,
									} as SET_USER_INFO['payload'])
								);
								void GetRestaurentsprofileApi.refetch();
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
	const handleUploadImage = (fielName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
		UpdateRestaurantApi.mutateAsync({
			request: { [fielName]: event.target.files as FileList },
		})
			.then((response) => {
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
				void GetRestaurentsprofileApi.refetch();
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

	const onActivationClick = () => {
		showAlertDialog({
			title: (
				<Box marginTop={-3}>
					<PoppinsTypography
						variant='caption'
						sx={{ color: theme.palette.common.secondaryGreyText }}
					>
						Ready to go live?
					</PoppinsTypography>
					<PoppinsTypography
						variant='h5'
						fontWeight={600}
						sx={{ color: theme.palette.common.primaryGreyText }}
					>
						Request Activation!
					</PoppinsTypography>
				</Box>
			),
			content: (
				<Stack gap={1}>
					<PoppinsTypography
						variant='caption'
						sx={{ color: theme.palette.common.secondaryGreyText }}
					>
						Make Sure:
					</PoppinsTypography>
					<PoppinsTypography
						variant='subtitle1'
						sx={{ color: theme.palette.common.primaryGreyText }}
					>
						<strong>1. You Have Added Menu</strong> (minimum 10 menus)
					</PoppinsTypography>
					<PoppinsTypography
						variant='subtitle1'
						sx={{ color: theme.palette.common.primaryGreyText }}
					>
						<strong>2. You Have Scheduled Operational Hours.</strong>
					</PoppinsTypography>
				</Stack>
			),
			buttons: [
				{
					children: 'Cancel',
					variant: 'outlined',
					callback: () => {
						hideAlertDialog();
					},
				},
				{
					children: `Send request`,
					variant: 'contained',
					callback: () => {
						ChangeRestaurantStatusApi.mutateAsync({
							request: {
								restaurant_id: userInfo?.id as string,
								status: 'activation pending',
							},
						})
							.then((response) => {
								showSnackbar({
									title: 'Success!',
									variant: 'sucess',
									content: response.data?.message,
									onCancel: () => hideSnackbar(),
								});
								void GetRestaurentsprofileApi.refetch();
								hideAlertDialog();
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

	return (
		<Stack sx={{ flexDirection: 'row' }}>
			<Stack
				flexBasis={`50%`}
				gap={2}
			>
				<PoppinsTypography
					variant='h5'
					fontWeight={700}
					sx={{ color: theme.palette.common.secondaryGreyText }}
				>
					Profile
				</PoppinsTypography>
				<Uploader
					fieldName='restaurant_profile'
					file={GetRestaurentsprofileApi.data?.data.restaurant_details.restaurant_profile ?? ''}
					sx={{ width: '170px', height: '170px', borderRadius: '15.11px' }}
					onChange={handleUploadImage('restaurant_profile')}
					overlay={
						<Stack
							sx={{
								position: 'absolute',
								bottom: 10,
								right: 10,
							}}
						>
							<IconFinder iconName='PenCircle' />
						</Stack>
					}
				/>

				<Stack
					gap={4}
					sx={{ flexDirection: 'row', alignItems: 'baseline' }}
				>
					<PoppinsTypography
						variant='h3'
						fontWeight={700}
						sx={{ color: '#727198' }}
					>
						{GetRestaurentsprofileApi.data?.data.restaurant_details.restaurant_name}
					</PoppinsTypography>

					<SwitchButton
						checked={
							GetRestaurentsprofileApi.data?.data.restaurant_details.status === '3' ? true : false
						}
						onChange={handleStatus(GetRestaurentsprofileApi.data?.data.restaurant_details.status)}
					/>
				</Stack>

				<PoppinsTypography
					variant='h5'
					sx={{ color: theme.palette.common.secondaryGreyText }}
				>
					{GetRestaurentsprofileApi.data?.data.restaurant_details.address}
				</PoppinsTypography>

				{GetRestaurentsprofileApi.data?.data.restaurant_details.restaurant_status !== '3' && (
					<LoadingButton
						size='large'
						variant='contained'
						color='primary'
						sx={{
							borderRadius: '12px',
							height: 51,
							width: 280,
							marginTop: 'auto',
						}}
						onClick={onActivationClick}
						loading={ChangeRestaurantStatusApi.isLoading}
					>
						<PoppinsTypography variant='subtitle1'>Request Activation</PoppinsTypography>
					</LoadingButton>
				)}
			</Stack>
			<Divider
				orientation='vertical'
				flexItem
				sx={{ borderColor: '#DFE3ED' }}
			/>
			<Stack
				flexBasis={`50%`}
				gap={2}
			>
				<Stack
					gap={2}
					alignSelf={'self-end'}
					maxWidth={683}
				>
					<PoppinsTypography
						variant='h5'
						fontWeight={700}
						sx={{ color: theme.palette.common.secondaryGreyText }}
					>
						Banner
					</PoppinsTypography>
					<Uploader
						fieldName='restaurant_banner'
						file={GetRestaurentsprofileApi.data?.data.restaurant_details.restaurant_banner ?? ''}
						sx={{ height: '408px', borderRadius: '14.43px' }}
						onChange={handleUploadImage('restaurant_banner')}
						overlay={
							<Stack
								sx={{
									position: 'absolute',
									bottom: 20,
									right: 20,
								}}
							>
								<IconFinder
									iconName='PenCircle'
									iconProps={{ width: 48, height: 48 }}
								/>
							</Stack>
						}
					/>
				</Stack>
			</Stack>
		</Stack>
	);
}

export default memo(ProfileSettings);
