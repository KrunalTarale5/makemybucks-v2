import DetailsTable from '@components/DetailsTable';
import IconFinder from '@components/Icon';
import { useSnackbar } from '@components/Snackbar';
import { PoppinsTypography } from '@components/Typography';
import Uploader from '@components/Uploader';
import { useForgotPasswordApi } from '@hooks/admin-forgot-password';
import { useGetProfileApi, useUpdateProfileApi } from '@hooks/admin-settings';
import { LoadingButton } from '@mui/lab';
import { Stack, useTheme } from '@mui/material';
import { setUserInfo } from '_store/actions/ui-actions';
import { RootState } from '_store/reducers';
import { SET_USER_INFO } from '_store/type';
import { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Profile = () => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const getProfileApi = useGetProfileApi();
	const ForgotPasswordApi = useForgotPasswordApi();

	const updateProfileApi = useUpdateProfileApi();
	const { showSnackbar, hideSnackbar } = useSnackbar();
	const { userInfo } = useSelector((state: RootState) => state.richPenny);

	const handleUploder = (e: React.ChangeEvent<HTMLInputElement>) => {
		updateProfileApi
			.mutateAsync({
				request: { admin_profile: e.target?.files as FileList },
			})
			.then((response) => {
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
				// eslint-disable-next-line @typescript-eslint/no-floating-promises
				getProfileApi.refetch?.();
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

	const handleResetPassword = () => {
		ForgotPasswordApi.mutateAsync({
			request: { admin_email: userInfo?.email ?? '', admin_user_id: userInfo?.id ?? '' },
		})
			.then((response) => {
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
				// eslint-disable-next-line @typescript-eslint/no-floating-promises
				getProfileApi.refetch?.();
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

	useEffect(() => {
		dispatch(
			setUserInfo({
				...userInfo,
				avatar: (getProfileApi.data?.data.data.admin_profile as string) ?? '',
			} as SET_USER_INFO['payload'])
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getProfileApi.dataUpdatedAt]);

	return (
		<Stack gap={5}>
			<Stack
				gap={2}
				//flexGrow={1}
				flexDirection={'row'}
				justifyContent={'space-between'}
			>
				<Stack
					//flexDirection={'row'}
					sx={{
						'& table': {
							borderCollapse: 'separate',
							borderSpacing: `0 4px`,
						},
						'& tr': {
							verticalAlign: 'top',
						},
						'& .tdValue': {
							paddingLeft: `6px`,
						},
					}}
				>
					<DetailsTable
						data={[
							{
								name: (
									<Stack
										flexDirection={'row'}
										gap={`12px`}
										justifyContent={'space-between'}
									>
										<PoppinsTypography
											variant='subtitle1'
											sx={{ color: theme.palette.common.secondaryGreyText }}
										>{`Name `}</PoppinsTypography>
										<PoppinsTypography
											variant='subtitle1'
											sx={{ color: theme.palette.common.secondaryGreyText, paddingX: 8 }}
										>{`:`}</PoppinsTypography>
									</Stack>
								),
								value: (
									<PoppinsTypography
										variant='subtitle1'
										fontWeight={600}
										sx={{ color: theme.palette.common.primaryGreyText }}
									>
										{getProfileApi.data?.data.data.admin_name}
									</PoppinsTypography>
								),
								showWhen: true,
							},
							{
								name: (
									<Stack
										flexDirection={'row'}
										gap={`12px`}
										justifyContent={'space-between'}
									>
										<PoppinsTypography
											variant='subtitle1'
											sx={{ color: theme.palette.common.secondaryGreyText }}
										>{`Email ID `}</PoppinsTypography>
										<PoppinsTypography
											variant='subtitle1'
											sx={{ color: theme.palette.common.secondaryGreyText, paddingX: 8 }}
										>{`:`}</PoppinsTypography>
									</Stack>
								),
								value: (
									<PoppinsTypography
										variant='subtitle1'
										sx={{ color: theme.palette.common.primaryGreyText }}
									>
										{getProfileApi.data?.data.data.email}
									</PoppinsTypography>
								),
								showWhen: true,
							},
							{
								name: (
									<Stack
										flexDirection={'row'}
										gap={`12px`}
										justifyContent={'space-between'}
									>
										<PoppinsTypography
											variant='subtitle1'
											sx={{ color: theme.palette.common.secondaryGreyText }}
										>{`Phone Number `}</PoppinsTypography>
										<PoppinsTypography
											variant='subtitle1'
											sx={{ color: theme.palette.common.secondaryGreyText, paddingX: 8 }}
										>{`:`}</PoppinsTypography>
									</Stack>
								),
								value: (
									<PoppinsTypography
										variant='subtitle1'
										sx={{ color: theme.palette.common.primaryGreyText }}
									>
										{getProfileApi.data?.data.data.mobile_no}
									</PoppinsTypography>
								),
								showWhen: true,
							},
						]}
					/>
				</Stack>
				<Stack
					gap={5}
					paddingRight={'7%'}
				>
					<Uploader
						fieldName='fieldName'
						sx={{ placeContent: 'flex-end', width: 175, height: 175, borderRadius: '8px' }}
						file={getProfileApi.data?.data.data.admin_profile ?? ''}
						onChange={handleUploder}
						children={<IconFinder iconName={'UploadPicture'} />}
					/>
				</Stack>
			</Stack>
			<LoadingButton
				size='large'
				variant='contained'
				color='primary'
				sx={{
					width: 237,
					height: 51,
					borderRadius: '8px',
				}}
				onClick={handleResetPassword}
				loading={ForgotPasswordApi.isLoading}
			>
				<PoppinsTypography
					variant='subtitle1'
					sx={{ color: theme.palette.common.white }}
				>
					Re-Set Password
				</PoppinsTypography>
			</LoadingButton>
		</Stack>
	);
};

export default memo(Profile);
