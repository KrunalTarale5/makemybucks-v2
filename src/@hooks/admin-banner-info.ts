import { BannerInfo } from '@interfaces/admin';
import { setBannerInfo } from '_store/actions/ui-actions';
import { SET_BANNER_INFO } from '_store/type';
import { useDispatch } from 'react-redux';

const HomeBreadcrumb = { name: 'Home', url: `/admin/home` };
export const BannerInformation: { [key: string]: BannerInfo } = {
	dashboard: {
		bannerName: 'Dashboard',
		breadcrumbs: [HomeBreadcrumb],
	},
	userManagement: {
		bannerName: 'User Management',
		breadcrumbs: [HomeBreadcrumb, { name: 'user Management', url: `/admin/users` }],
	},
	qrManagement: {
		bannerName: 'QR Management',
		breadcrumbs: [HomeBreadcrumb, { name: 'QR code' }],
	},
	restaurantManagement: {
		bannerName: 'Restaurant Management',
		breadcrumbs: [HomeBreadcrumb, { name: 'Restaurant Management', url: `/admin/restaurants` }],
	},
	restaurantManagementUpdate: {
		bannerName: 'Restaurant Management',
		breadcrumbs: [
			HomeBreadcrumb,
			{ name: 'Restaurant Management', url: `/admin/restaurants` },
			{ name: 'Update' },
		],
	},
	subAdmin: {
		bannerName: 'Sub Admin',
		breadcrumbs: [HomeBreadcrumb, { name: 'Sub Admin', url: `/admin/subadmin` }],
	},
	subAdminAdd: {
		bannerName: 'Sub Admin',
		breadcrumbs: [HomeBreadcrumb, { name: 'Sub Admin', url: `/admin/subadmin` }, { name: 'Add' }],
	},
	subAdminUpdate: {
		bannerName: 'Sub Admin',
		breadcrumbs: [
			HomeBreadcrumb,
			{ name: 'Sub Admin', url: `/admin/subadmin` },
			{ name: 'Update' },
		],
	},
	masterList: {
		bannerName: 'Master List',
		breadcrumbs: [HomeBreadcrumb, { name: 'Master List', url: `/admin/masterList` }],
	},
	reports: {
		bannerName: 'Reports',
		breadcrumbs: [HomeBreadcrumb, { name: 'Reports', url: `/admin/reports` }],
	},
	withdrawal: {
		bannerName: 'Withdrawal',
	},
	investment: {
		bannerName: 'Investment',
		breadcrumbs: [HomeBreadcrumb, { name: 'Investment', url: `/admin/investment` }],
	},
	banners: {
		bannerName: 'Banners',
		breadcrumbs: [HomeBreadcrumb, { name: 'Banners' }],
	},
	notifications: {
		bannerName: 'Notifications',
	},
	settings: {
		bannerName: 'Settings',
	},
	ownersManagement: {
		bannerName: 'Owners Management',
		breadcrumbs: [HomeBreadcrumb, { name: 'Owners Management', url: `/admin/owners` }],
	},
	settlement: {
		bannerName: 'Settlement',
		breadcrumbs: [HomeBreadcrumb, { name: 'Settlement', url: `/admin/settlement` }],
	},
};

export const useBannerInfo = (info: SET_BANNER_INFO['payload']) => {
	const dispatch = useDispatch();
	dispatch(setBannerInfo(info));
};
