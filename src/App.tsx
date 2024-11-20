import { AlertDialogProvider } from '@components/AlertDialog';
import { SnackbarProvider } from '@components/Snackbar';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { useAdminTheme } from '_assets/themes/admin-theme';
import { userAppTheme } from '_assets/themes/user-app-theme';
import { lazy } from 'react';

const AdminLayout = lazy(() => import('layout/AdminLayout'));
const UserAppLayout = lazy(() => import('layout/UserAppLayout'));

function App() {
	const adminTheme = useAdminTheme();

	return (
		<>
			<Box
				className='App'
				display={'flex'}
				flexDirection={'column'}
				height={`inherit`}
			>
				<ThemeProvider theme={adminTheme}>
					<CssBaseline />
					<AlertDialogProvider>
						<SnackbarProvider>
							<AdminLayout />
						</SnackbarProvider>
					</AlertDialogProvider>
				</ThemeProvider>

				<ThemeProvider theme={userAppTheme}>
					<UserAppLayout />
				</ThemeProvider>
			</Box>
		</>
	);
}

export default App;
