import { useAlertDialog } from '@components/AlertDialog';
import { useSnackbar } from '@components/Snackbar';
import { PoppinsTypography } from '@components/Typography';
import { useGeneraeteQRApi } from '@hooks/admin-qrcode';
import { LoadingButton } from '@mui/lab';
import { Button, Stack, useTheme } from '@mui/material';
import { FC, memo, useState } from 'react';

const BUTTONS = [100, 500, 1000, 2000, 5000, 10000];

interface GenerateQrCodeProps {
	refetch: () => void;
}

const GenerateQrCode: FC<GenerateQrCodeProps> = (props) => {
	const theme = useTheme();
	const { showSnackbar, hideSnackbar } = useSnackbar();
	const { showAlertDialog, hideAlertDialog } = useAlertDialog();

	const GeneraeteQRApi = useGeneraeteQRApi();

	const [selected, setSelected] = useState<number | null>(null);

	const onGenerateQR = () => {
		showAlertDialog({
			title: `Generate QR Code`,
			content: 'Are Your sure you want to generate QR Code?',
			buttons: [
				{
					children: 'Cancel',
					variant: 'outlined',
					callback: () => {
						hideAlertDialog();
					},
				},
				{
					children: 'Genearate',
					variant: 'contained',
					callback: () => {
						GeneraeteQRApi.mutateAsync({
							request: {
								number: selected as number,
							},
						})
							.then((response) => {
								showSnackbar({
									title: 'Success!',
									variant: 'sucess',
									content: response.data?.message,
									onCancel: () => hideSnackbar(),
								});
								setSelected(null);
								props.refetch();
							})
							.catch((error) => {
								showSnackbar({
									title: 'Error!',
									variant: 'error',
									content: error.response?.data?.message,
									onCancel: () => hideSnackbar(),
								});
							});
						hideAlertDialog();
					},
				},
			],
		});
	};

	return (
		<Stack gap={1}>
			<PoppinsTypography
				variant='subtitle1'
				sx={{ color: theme.palette.common.secondaryGreyText }}
			>
				Select Your Number
			</PoppinsTypography>
			<Stack gap={5}>
				<Stack
					flexDirection={'row'}
					gap={1}
				>
					{BUTTONS.map((l, index) => (
						<Button
							key={index}
							size='large'
							variant={selected === l ? 'contained' : 'outlined'}
							color='primary'
							sx={{
								...(selected === l && { borderColor: '#DFE3ED' }),
								width: 100,
								height: 40,
								borderRadius: '8px',
							}}
							onClick={() => setSelected(l)}
						>
							{l}
						</Button>
					))}
				</Stack>
				<LoadingButton
					size='large'
					variant='contained'
					color='primary'
					sx={{
						width: 209,
						height: 51,
						borderRadius: '8px',
					}}
					disabled={selected === null}
					loading={GeneraeteQRApi.isLoading}
					onClick={onGenerateQR}
				>
					<PoppinsTypography variant='subtitle1'>Generate QR</PoppinsTypography>
				</LoadingButton>
			</Stack>
		</Stack>
	);
};

export default memo(GenerateQrCode);
