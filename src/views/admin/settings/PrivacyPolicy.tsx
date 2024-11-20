import Editor from '@components/Editor';
import { useSnackbar } from '@components/Snackbar';
import { PoppinsTypography } from '@components/Typography';
import { useGetPrivatePolicyApi, useUpdatePrivatePolicyApi } from '@hooks/admin-settings';
import { LoadingButton } from '@mui/lab';
import { Box, Stack, useTheme } from '@mui/material';
import { memo, useEffect, useState } from 'react';

const PrivacyPolicy = () => {
	const theme = useTheme();
	const { showSnackbar, hideSnackbar } = useSnackbar();

	const GetPrivatePolicyApi = useGetPrivatePolicyApi();
	const UpdatePrivatePolicyApi = useUpdatePrivatePolicyApi();

	const [value, setValue] = useState<string>();

	const onUpdate = () => {
		UpdatePrivatePolicyApi.mutateAsync({
			request: {
				policy_data: value as string,
			},
		})
			.then((response) => {
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});

				void GetPrivatePolicyApi.refetch?.();
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
		setValue(GetPrivatePolicyApi.data?.data.data.policy_data);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [GetPrivatePolicyApi.dataUpdatedAt]);

	return (
		<Stack gap={2}>
			<Box
				component={'div'}
				padding={2}
				sx={{
					'& .ql-container': {
						minHeight: 300,
					},
				}}
			>
				<Editor
					value={value as string}
					onChange={(value) => setValue(value)}
				/>
			</Box>

			<LoadingButton
				size='large'
				variant='contained'
				color='primary'
				sx={{
					width: 209,
					height: 51,
					borderRadius: '8px',
				}}
				loading={UpdatePrivatePolicyApi.isLoading}
				onClick={onUpdate}
			>
				<PoppinsTypography
					variant='subtitle1'
					sx={{ color: theme.palette.common.white }}
				>
					Update
				</PoppinsTypography>
			</LoadingButton>
		</Stack>
	);
};

export default memo(PrivacyPolicy);
