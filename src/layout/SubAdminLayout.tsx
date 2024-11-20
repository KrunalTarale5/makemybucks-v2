import { Suspense, lazy, memo } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import ResetPassword from 'views/sub-admin/auth/ResetPassword';
import UpdatePassword from 'views/sub-admin/auth/UpdatePassword';
import QrDashboard from 'views/sub-admin/qr-code/QrDashboard';
import AssignQr from 'views/sub-admin/qr-code/AssignQr';
import Profile from 'views/sub-admin/profile/Profile';
import { isMobile } from '@utils/common';
import AuthWrapper from '@components/AuthWrapper';
import IconFinder from '@components/Icon';

const ProtectedRoute = lazy(() => import('@components/protectedRoute'));

const Login = lazy(() => import('views/sub-admin/auth/Login'));
const Dashboard = lazy(() => import('views/sub-admin/dashboard/Dashboard'));
const AddRestaurantForms = lazy(() => import('views/sub-admin/add-restaurant/AddRestaurantForms'));

const SubAdminLayout = () => {
	const location = useLocation();

	return location.pathname.includes('/sub-admin/') ? (
		process.env.NODE_ENV === 'production' && isMobile() ? (
			<AuthWrapper sx={{ flexDirection: 'column' }}>
				<IconFinder iconName='DesktopLoginLogo' />
			</AuthWrapper>
		) : (
			<Suspense fallback={null}>
				<Routes>
					<Route path='/sub-admin'>
						<Route
							path='login'
							element={<Login />}
						/>
						<Route
							path='reset-password'
							element={<ResetPassword />}
						/>
						<Route
							path='update-password'
							element={<UpdatePassword />}
						/>
						<Route
							path='restaurants/dashboard'
							element={
								<ProtectedRoute navigateTo='/sub-admin/login'>
									<Dashboard />
								</ProtectedRoute>
							}
						/>
						<Route
							path='restaurants/add'
							element={
								<ProtectedRoute navigateTo='/sub-admin/login'>
									<AddRestaurantForms />
								</ProtectedRoute>
							}
						/>
						<Route
							path='qr/dashboard'
							element={
								<ProtectedRoute navigateTo='/sub-admin/login'>
									<QrDashboard />
								</ProtectedRoute>
							}
						/>
						<Route
							path='qr/assign'
							element={
								<ProtectedRoute navigateTo='/sub-admin/login'>
									<AssignQr />
								</ProtectedRoute>
							}
						/>
						<Route
							path='profile'
							element={
								<ProtectedRoute navigateTo='/sub-admin/login'>
									<Profile />
								</ProtectedRoute>
							}
						/>
					</Route>
				</Routes>
			</Suspense>
		)
	) : (
		<></>
	);
};

export default memo(SubAdminLayout);
