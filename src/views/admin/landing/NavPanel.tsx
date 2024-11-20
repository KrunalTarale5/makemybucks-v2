import { useAlertDialog } from '@components/AlertDialog';
import IconFinder from '@components/Icon';
import { InterTypography, PoppinsTypography } from '@components/Typography';
import {
	useGetNotification_status_Api,
	useUpdateNotificationStatusApi,
} from '@hooks/admin-notifications';
import { MenuItem } from '@interfaces/admin';
import { Stack, useTheme, ListItem, ListItemButton } from '@mui/material';
import { setBannerInfo, setToken, setUserInfo } from '_store/actions/ui-actions';
import { FC, memo } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const HomeBreadcrumb = { name: 'Home', url: `/admin/home` };
const HOME_MENUS: MenuItem[] = [
	{
		bannerName: 'Dashboard',
		name: 'Dashboard',
		url: `/admin/home`,
		icon: 'Dashboard',
		breadcrumbs: [HomeBreadcrumb],
		key: 'dashboard',
	},
];

const BOTTOM_MENUS: MenuItem[] = [
	{
		bannerName: 'Logout',
		name: 'Logout',
		url: `/admin/logout`,
		icon: 'Logout',
		key: 'logout',
	},
];

const NavPanel: FC = () => {
	const theme = useTheme();
	const location = useLocation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { showAlertDialog, hideAlertDialog } = useAlertDialog();

	const useUpdateNotificationStatus = useUpdateNotificationStatusApi();
	const GetNotification_status_Api = useGetNotification_status_Api();

	const PAGES_MENUS: MenuItem[] = [
		{
			bannerName: 'User Management',
			name: 'Users',
			url: process.env.REACT_APP_IS_TEST_ENV ? `/admin/users` : `null`,
			icon: 'Users',
			notificication: GetNotification_status_Api.data?.data.data.user_status === '1',
			key: 'user',
		},
		{
			bannerName: 'QR Management',
			name: 'QR Codes',
			url: process.env.REACT_APP_IS_TEST_ENV ? `/admin/qrcode` : `null`,
			icon: 'QRCodeV2',
			key: 'qr',
		},
		{
			bannerName: 'Owners Management',
			name: 'Owners',
			url: process.env.REACT_APP_IS_TEST_ENV ? `/admin/owners` : `null`,
			icon: 'Owner',
			notificication: GetNotification_status_Api.data?.data.data.owner_status === '1',
			key: 'owner',
		},
		{
			bannerName: 'Restaurant Management',
			name: 'Restaurants',
			url: `/admin/restaurants`,
			icon: 'Restaurants',
			breadcrumbs: [
				HomeBreadcrumb,
				{ name: 'Restaurant Management' /*  url: `/admin/restaurants` */ },
			],
			notificication: GetNotification_status_Api.data?.data.data.restaurant_status === '1',
			key: 'restaurant',
		},
		{
			bannerName: 'Sub Admin',
			name: 'Sub Admin',
			url: `/admin/subadmin`,
			icon: 'User',
			breadcrumbs: [HomeBreadcrumb, { name: 'Sub Admin' /* url: `/admin/subadmin` */ }],
			notificication: GetNotification_status_Api.data?.data.data.admin_status === '1',
			key: 'admin',
		},
		{
			bannerName: 'Master List',
			name: 'Master List',
			url: `/admin/masterList`,
			icon: 'List',
			breadcrumbs: [HomeBreadcrumb, { name: 'Master List' /* url: `/admin/masterList` */ }],
			key: 'master',
		},
		{
			bannerName: 'Settlement',
			name: 'Settlement',
			url: `/admin/settlement`,
			icon: 'RupayV4',
			key: 'settlement',
		},
		{
			bannerName: 'Reports',
			name: 'Reports',
			url: `/admin/reports`,
			icon: 'Reports',
			key: 'report',
		},
		{
			bannerName: 'Investment',
			name: 'Investment',
			url: `/admin/investment`,
			icon: 'Investment',
			key: 'investment',
		},
		{
			bannerName: 'Banners',
			name: 'Banners',
			url: process.env.REACT_APP_IS_TEST_ENV ? `/admin/banner` : `null`,
			icon: 'Image',
			key: 'banner',
		},
		{
			bannerName: 'Notifications',
			name: 'Notifications',
			url: process.env.REACT_APP_IS_TEST_ENV ? `/admin/notifications` : `null`,
			icon: 'NotificationTwo',
			key: 'notification',
		},
		{
			bannerName: 'Settings',
			name: 'Settings',
			url: `/admin/settings`,
			icon: 'Settings',
			key: 'setting',
		},
	];

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
							navigate('/admin/login');
						},
					},
				],
			});
			return;
		}
		navigate(item.url);
		useUpdateNotificationStatus
			.mutateAsync({
				request: {
					notification_type: item.key ?? '',
				},
			})
			.finally(() => {
				void GetNotification_status_Api.refetch();
			});
	};

	return (
		<>
			<Stack>
				<IconFinder
					iconName='LightLogo'
					iconProps={{ height: `90px` }}
				/>
			</Stack>

			<Stack
				paddingTop={2}
				paddingX={1.5}
				gap={1}
			>
				<InterTypography
					variant='subtitle1'
					fontWeight={600}
					paddingX={2}
					sx={{ color: theme.palette.common.ternaryGreyText }}
				>
					Home
				</InterTypography>

				{HOME_MENUS.map((m, i) => {
					const isSelected = location.pathname.includes(m.url);
					return (
						<ListItem
							key={i}
							disablePadding
							disableGutters
						>
							<ListItemButton
								selected={isSelected}
								sx={{
									borderRadius: `4px`,
									paddingX: 3,
									'&.Mui-selected': {
										backgroundColor: theme.palette.primary.main,
										'&:hover': {
											backgroundColor: theme.palette.primary.main,
										},
									},
								}}
								onClick={() => onMenuSelect(m)}
							>
								<Stack
									flexDirection={'row'}
									justifyContent={'space-between'}
									gap={2}
								>
									<IconFinder
										iconName={m.icon}
										iconProps={{
											...(isSelected && { fill: 'white' }),
										}}
									/>
									<InterTypography
										variant='subtitle1'
										sx={{ color: isSelected ? 'white' : theme.palette.common.primaryGreyText }}
									>
										{m.bannerName}
									</InterTypography>
								</Stack>
							</ListItemButton>
						</ListItem>
					);
				})}
			</Stack>
			<Stack
				paddingTop={4}
				paddingBottom={3}
				paddingX={1.5}
				gap={1.5}
				flexGrow={1}
				overflow={'auto'}
			>
				<InterTypography
					variant='subtitle1'
					fontWeight={600}
					paddingX={2}
					sx={{ color: theme.palette.common.ternaryGreyText }}
				>
					Pages
				</InterTypography>

				{PAGES_MENUS.map((m, i) => (
					<ListItem_
						key={i}
						item={m}
						onMenuSelect={onMenuSelect}
					/>
				))}
				<Stack
					flex={'auto'}
					justifyContent={'flex-end'}
					alignItems={'flex-end'}
				>
					{BOTTOM_MENUS.map((m, i) => (
						<ListItem_
							key={i}
							item={m}
							onMenuSelect={onMenuSelect}
						/>
					))}
				</Stack>
			</Stack>
		</>
	);
};

export default memo(NavPanel);

interface ListItem_Props {
	item: MenuItem;
}
const ListItem_ = (props: ListItem_Props & { onMenuSelect: (item: MenuItem) => void }) => {
	const theme = useTheme();
	const location = useLocation();
	const isSelected = location.pathname.includes(props.item.url);

	return (
		<ListItem
			disablePadding
			disableGutters
		>
			<ListItemButton
				selected={isSelected}
				sx={{
					borderRadius: `4px`,
					paddingX: 1,
					justifyContent: 'space-between',
					'&.Mui-selected': {
						backgroundColor: theme.palette.primary.main,
						'&:hover': {
							backgroundColor: theme.palette.primary.main,
						},
					},
				}}
				onClick={props.item.url === 'null' ? undefined : () => props.onMenuSelect(props.item)}
			>
				<Stack
					flexDirection={'row'}
					justifyContent={'space-between'}
					alignItems={'center'}
					gap={1}
				>
					<IconFinder
						iconName={props.item.icon}
						iconProps={{ ...(isSelected && { fill: 'white' }) }}
					/>
					<PoppinsTypography
						variant='subtitle1'
						sx={{ color: isSelected ? 'white' : theme.palette.common.primaryGreyText }}
					>
						{props.item.name}
						{props.item.notificication && (
							<IconFinder
								iconName='Dot'
								iconProps={{
									fill: theme.palette.error.main,
									style: { verticalAlign: 'super', marginLeft: 4 },
								}}
							/>
						)}
					</PoppinsTypography>
				</Stack>
				<IconFinder
					iconName='ChevronRight'
					iconProps={{ ...(isSelected && { fill: 'white' }) }}
				/>
			</ListItemButton>
		</ListItem>
	);
};
