import IconFinder from '@components/Icon';
import { Avatar, Box, Button, Stack, useTheme } from '@mui/material';
import { memo, useEffect } from 'react';
import { InterTypography, PoppinsTypography } from '@components/Typography';
import NavPanel from './NavPanel';
import { MenuItem } from '@interfaces/admin';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setBannerInfo, setToken, setUserInfo } from '_store/actions/ui-actions';
import { RootState } from '_store/reducers';
import { useAlertDialog } from '@components/AlertDialog';
import Hash7 from '_assets/icons/layout-hash-7.svg';
import { useGetRestaurentProfileApi } from '@hooks/restaurant-settings';
import { SET_USER_INFO } from '_store/type';
import { RESTAURANT_BASE_URL } from '@utils/common';

const Landing = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { showAlertDialog, hideAlertDialog } = useAlertDialog();
	const GetRestaurentsprofileApi = useGetRestaurentProfileApi();

	const { bannerInfo, userInfo, token } = useSelector((state: RootState) => state.richPenny);

	useEffect(() => {
		if (userInfo && token && location.pathname === `/${RESTAURANT_BASE_URL}/`) {
			navigate(`/${RESTAURANT_BASE_URL}/menu`, { replace: true });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.pathname]);

	useEffect(() => {
		dispatch(
			setUserInfo({
				...userInfo,
				avatar: GetRestaurentsprofileApi?.data?.data.restaurant_details.restaurant_profile,
			} as SET_USER_INFO['payload'])
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [GetRestaurentsprofileApi.dataUpdatedAt]);

	const onMenuSelect = (item: MenuItem) => {
		if (item.name === 'Logout') {
			showAlertDialog({
				title: `Do you want to logout?`,
				buttons: [
					{
						children: 'No',
						variant: 'outlined',
						callback: () => {
							hideAlertDialog();
						},
					},
					{
						children: 'Yes',
						variant: 'contained',
						callback: () => {
							hideAlertDialog();
							dispatch(setToken(null));
							dispatch(setUserInfo(null));
							dispatch(setBannerInfo(null));
							navigate(item.url);
						},
					},
				],
			});
			return;
		}
		navigate(item.url);
	};

	return (
		<Box
			sx={{
				height: `inherit`,
				display: 'flex',
				backgroundImage: `url(${Hash7})`,
				backgroundRepeat: 'no-repeat',
				backgroundPosition: `bottom right`,
			}}
		>
			<NavPanel onMenuSelect={onMenuSelect} />

			<Stack
				overflow={'auto'}
				flexGrow={1}
				gap={2}
				padding={2}
				paddingRight={4}
			>
				<Stack
					flexDirection={'row'}
					justifyContent={'space-between'}
				>
					<PoppinsTypography
						fontWeight={600}
						fontSize={56}
					>
						{bannerInfo?.bannerName}
					</PoppinsTypography>
					<Box
						sx={{
							padding: 1,
							paddingX: 2,
							paddingRight: 0,
							display: 'flex',
							gap: 1,
							alignItems: 'center',
						}}
					>
						<IconFinder
							iconName='Notification'
							iconProps={{ fill: theme.palette.primary.main }}
						/>

						<Button
							sx={{
								color: 'white',
								gap: 1,
								paddingRight: 0,
								'.MuiButton-endIcon': { alignSelf: 'auto' },
							}}
							startIcon={
								<Avatar
									src={userInfo?.avatar}
									sx={{ width: 45, height: 45 }}
								/>
							}
							endIcon={
								<IconFinder
									iconName='ChevronDown'
									iconProps={{
										fill: theme.palette.common.primaryGreyText,
									}}
								/>
							}
						>
							<Stack
								flexDirection={'column'}
								alignItems={'start'}
							>
								<PoppinsTypography
									variant='subtitle1'
									fontWeight={600}
									sx={{ color: theme.palette.common.primaryGreyText }}
								>
									{userInfo?.name}
								</PoppinsTypography>
								<InterTypography
									variant='caption'
									sx={{ color: theme.palette.common.primaryGreyText }}
								>
									Admin
								</InterTypography>
							</Stack>
						</Button>
					</Box>
				</Stack>

				<Stack
					flexGrow={1}
					overflow={'auto'}
				>
					<Outlet />
				</Stack>
			</Stack>
		</Box>
	);
};

export default memo(Landing);
