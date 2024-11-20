import AuthWrapper from '@components/AuthWrapper';
import IconFinder from '@components/Icon';
import { PoppinsTypography } from '@components/Typography';
import { RESTAURANT_BASE_URL, isMobile } from '@utils/common';
import { Suspense, memo } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import CreateNewPassword from 'views/restaurant/auth/CreateNewPassword';
import ResetPassword from 'views/restaurant/auth/ForgotPassword';
import Login from 'views/restaurant/auth/Login';
import Landing from 'views/restaurant/landing/Landing';
import AddMenu from 'views/restaurant/menu/AddMenu';
import MenuWrapper from 'views/restaurant/menu/MenuWrapper';
import RestaurantSettings from 'views/restaurant/settings/RestaurantSettings';
import ProtectedRoute from '@components/protectedRoute';
import Dashboard from 'views/restaurant/dashboard/Dashboard';

const RestaurantLayout = () => {
	const location = useLocation();

	return location.pathname.includes(`/${RESTAURANT_BASE_URL}/`) ? (
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
						path={`/${RESTAURANT_BASE_URL}/login`}
						element={<Login />}
					/>
					<Route
						path={`/${RESTAURANT_BASE_URL}/forgot-password`}
						element={<ResetPassword />}
					/>
					<Route
						path={`/${RESTAURANT_BASE_URL}/reset-password`}
						element={<CreateNewPassword />}
					/>

					<Route
						path={`/${RESTAURANT_BASE_URL}`}
						element={
							<ProtectedRoute navigateTo={`/${RESTAURANT_BASE_URL}/login`}>
								<Landing />
							</ProtectedRoute>
						}
					>
						<Route
							path='menu'
							element={<MenuWrapper />}
						/>
						<Route
							path='menu/add'
							element={<AddMenu />}
						/>
						<Route
							path='menu/update/:id'
							element={<AddMenu />}
						/>
						<Route
							path='settings'
							element={<RestaurantSettings />}
						/>
						<Route
							path='dashboard'
							element={<Dashboard />}
						/>
					</Route>
				</Routes>
			</Suspense>
		)
	) : (
		<></>
	);
};

export default memo(RestaurantLayout);
