import { Suspense, lazy, memo } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { isMobile } from '@utils/common';
import AuthWrapper from '@components/AuthWrapper';
import IconFinder from '@components/Icon';
import { PoppinsTypography } from '@components/Typography';
import { AlertDialogProvider } from '@components/AlertDialog';

const Login = lazy(() => import('views/user/auth/Login'));
const PayTo = lazy(() => import('views/user/pay/PayTo'));
const PaymentError = lazy(() => import('views/user/pay/PaymentError'));

const UserAppLayout = () => {
	const location = useLocation();

	return location.pathname.includes('/payments') ? (
		// process.env.NODE_ENV === 'production' && isMobile() ? (
		// 	<AuthWrapper sx={{ flexDirection: 'column' }}>
		// 		<IconFinder iconName='DesktopLoginLogo' />
		// 		<PoppinsTypography
		// 			variant='h4'
		// 			color={'white'}
		// 		>
		// 			Sorry ! we only operate on mobile devices
		// 		</PoppinsTypography>
		// 	</AuthWrapper>
		// ) :
		// (
		<AlertDialogProvider>
			<Suspense fallback={null}>
				<Routes>
					<Route
						path='/payments'
						element={<Login />}
					/>
					<Route
						path='/payments/pay'
						element={<PayTo />}
					/>
					<Route
						path='/payments/verifypayment'
						element={<PaymentError />}
					/>
				</Routes>
			</Suspense>
		</AlertDialogProvider>
	) : (
		//)
		<></>
	);
};

export default memo(UserAppLayout);
