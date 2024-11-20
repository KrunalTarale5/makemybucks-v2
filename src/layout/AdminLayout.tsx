import AuthWrapper from '@components/AuthWrapper';
import IconFinder from '@components/Icon';
import { PoppinsTypography } from '@components/Typography';
import { isMobile } from '@utils/common';
import { Suspense, lazy, memo } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import UpdateSalesExecutiveForm from 'views/admin/sales-executive/update/UpdateSalesExecutiveForm';
import Settings from 'views/admin/settings/Settings';
import UserManagement from 'views/admin/users/UserManagement';
import Banner from 'views/admin/banners/Banner';
import QrCodeManagement from 'views/admin/qr-codes/QrCodeManagement';
import OwnersManagement from 'views/admin/owners-management/OwnersManagement';
import OwnersDetails from 'views/admin/owners-management/OwnerDetails';
import Notifications from 'views/admin/notifications/Notifications';

const ProtectedRoute = lazy(() => import('@components/protectedRoute'));
const RestaurantManagement = lazy(
	() => import('views/admin/restaurant-management/RestaurantManagement')
);
const RestaurantDetails = lazy(() => import('views/admin/restaurant-management/RestaurantDetails'));
const Landing = lazy(() => import('views/admin/landing/Landing'));
const Login = lazy(() => import('views/admin/auth/Login'));
const ForgotPassword = lazy(() => import('views/admin/auth/ForgotPassword'));
const VerifyResetPassword = lazy(() => import('views/admin/auth/VerifyResetPassword'));

const HomeDashboard = lazy(() => import('views/admin/home/Dashboard'));

const SalesExecutiveDashboard = lazy(() => import('views/admin/sales-executive/Dashboard'));
const AddSalesExecutive = lazy(
	() => import('views/admin/sales-executive/add/AddSalesExecutiveForm')
);

const AllMasterList = lazy(() => import('views/admin/master-list/AllMasterList'));
const Reports = lazy(() => import('views/admin/reports/Reports'));
const Investment = lazy(() => import('views/admin/investment/Investment'));
const Settlement = lazy(() => import('views/admin/Settlement/Settlement'));

const AdminLayout = () => {
	const location = useLocation();
	return location.pathname.includes('/admin/') ? (
		process.env.NODE_ENV === 'production' && !isMobile() ? (
			<AuthWrapper sx={{ flexDirection: 'column' }}>
				<IconFinder iconName='MobileLoginLogo' />
				<PoppinsTypography
					align='center'
					variant='h4'
					color={'white'}
				>
					Sorry ! we only operate on desktop devices
				</PoppinsTypography>
			</AuthWrapper>
		) : (
			<Suspense fallback={null}>
				<Routes>
					<Route
						path='/admin/login'
						element={<Login />}
					/>
					<Route
						path='/admin/forgot-password'
						element={<ForgotPassword />}
					/>
					<Route
						path='/admin/reset-password'
						element={<VerifyResetPassword />}
					/>
					<Route
						path='/admin'
						element={
							<ProtectedRoute navigateTo='/admin/login'>
								<Landing />
							</ProtectedRoute>
						}
					>
						<Route
							path='home'
							element={<HomeDashboard />}
						/>
						<Route
							path='subadmin'
							element={<SalesExecutiveDashboard />}
						/>
						<Route
							path='subadmin/add'
							element={<AddSalesExecutive />}
						/>
						<Route
							path='subadmin/update/:id/:step'
							element={<UpdateSalesExecutiveForm />}
						/>
						<Route
							path='restaurants'
							element={<RestaurantManagement />}
						/>
						<Route
							path='users'
							element={<UserManagement />}
						/>
						<Route
							path='restaurants/:id'
							element={<RestaurantDetails />}
						/>
						<Route
							path='restaurants/update/:id'
							element={<RestaurantDetails />}
						/>
						<Route
							path='masterList'
							element={<AllMasterList />}
						/>
						<Route
							path='qrcode'
							element={<QrCodeManagement />}
						/>
						<Route
							path='owners'
							element={<OwnersManagement />}
						/>
						<Route
							path='owners/:id'
							element={<OwnersDetails />}
						/>
						<Route
							path='settings'
							element={<Settings />}
						/>
						<Route
							path='banner'
							element={<Banner />}
						/>
						<Route
							path='notifications'
							element={<Notifications />}
						/>
						<Route
							path='reports'
							element={<Reports />}
						/>
						<Route
							path='investment'
							element={<Investment />}
						/>
						<Route
							path='settlement'
							element={<Settlement />}
						/>
					</Route>
				</Routes>
			</Suspense>
		)
	) : (
		<></>
	);
};

export default memo(AdminLayout);
