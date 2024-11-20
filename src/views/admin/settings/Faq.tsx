import IconFinder from '@components/Icon';
import InputField, { InputFieldValue } from '@components/InputField';
import { useSnackbar } from '@components/Snackbar';
import { FiraSansTypography, PoppinsTypography } from '@components/Typography';
import {
	FaqRequest,
	FaqResponse,
	useGetFaqsApi,
	useUpdateFaqApi,
	validateFaqFields,
	validateFaqsForm,
} from '@hooks/admin-settings';
import { FormErrorMessage } from '@interfaces/common';
import { LoadingButton } from '@mui/lab';
import { Divider, Stack, useTheme } from '@mui/material';
import { memo, useEffect, useState } from 'react';

const intialFormData: FaqRequest = {
	question: '',
	answer: '',
};
const intialFormError: FormErrorMessage<FaqRequest> = {
	question: '',
	answer: '',
};
const Faq = () => {
	const FaqApi = useGetFaqsApi();
	const updateApi = useUpdateFaqApi();

	const { showSnackbar, hideSnackbar } = useSnackbar();

	const theme = useTheme();
	const [formData, setFormData] = useState(intialFormData);
	const [formError, setFormError] = useState(intialFormError);

	const [selected, setSelected] = useState('');

	const onChange = (fieldName: string, value: InputFieldValue) => {
		const _formData = { ...formData, [fieldName]: value };
		setFormData(_formData);
		setFormError({
			...formError,
			[fieldName]: validateFaqFields(fieldName as keyof FaqRequest, _formData),
		});
	};

	const handleClick = (i: FaqResponse['data'][number]) => () => {
		setFormData({ question: i.question, answer: i.answer });
		setSelected(i.id);
	};
	useEffect(() => {
		setFormData({
			question: FaqApi.data?.data.data[0].question ?? '',
			answer: FaqApi.data?.data.data[0].answer ?? '',
		});
		setSelected(selected ? selected : FaqApi.data?.data.data[0].id ?? '');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [FaqApi.dataUpdatedAt]);

	const onModifyClick = () => {
		const validatation = validateFaqsForm(formData);
		if (validatation.hasError) {
			setFormError(validatation.errors);
			return;
		}
		updateApi
			.mutateAsync({
				request: { faq_id: selected, question: formData.question, answer: formData.answer },
			})
			.then((response) => {
				showSnackbar({
					title: 'Success!',
					variant: 'sucess',
					content: response.data?.message,
					onCancel: () => hideSnackbar(),
				});
				// eslint-disable-next-line @typescript-eslint/no-floating-promises
				FaqApi.refetch?.();
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
	return (
		<Stack
			gap={4}
			flexDirection={'row'}
		>
			<Stack
				gap={2}
				flexBasis={'40%'}
			>
				{FaqApi.data?.data.data.map((i, index) => (
					<Stack
						key={index}
						gap={1}
						flexDirection={'row'}
						alignItems={'center'}
					>
						<IconFinder
							iconName='ArrowFill'
							iconProps={{ fill: selected === i.id ? theme.palette.primary.main : 'transparent' }}
						/>
						<FiraSansTypography
							variant='subtitle1'
							fontWeight={600}
							paddingRight={1}
							sx={{
								color:
									selected === i.id
										? theme.palette.primary.main
										: theme.palette.common.primaryGreyText,
								cursor: 'pointer',
							}}
							onClick={handleClick(i)}
						>
							{index + 1}.
						</FiraSansTypography>

						<FiraSansTypography
							variant='subtitle1'
							fontWeight={600}
							sx={{
								color:
									selected === i.id
										? theme.palette.primary.main
										: theme.palette.common.primaryGreyText,
								cursor: 'pointer',
							}}
							onClick={handleClick(i)}
						>
							{i.question}
						</FiraSansTypography>
						<Divider sx={{ borderColor: '#DFE3ED' }} />
					</Stack>
				))}
			</Stack>
			<Divider
				orientation='vertical'
				flexItem
				sx={{ borderColor: '#DFE3ED' }}
			/>
			<Stack
				flexBasis={'60%'}
				gap={2}
			>
				<InputField
					showLabel={true}
					fieldName={'question'}
					value={formData.question}
					key={'question'}
					fieldProps={{
						variant: 'outlined',
						color: 'primary',
						fullWidth: true,
						sx: {
							'.MuiInputBase-input': {
								height: 39,
								fontWeight: 600,
								fontSize: '18px',
								color: theme.palette.common.primaryGreyText,
								fontFamily: 'Fira Sans',
							},
							'.MuiInputBase-root': {
								borderRadius: '8px',
								borderColor: theme.palette.common.secondaryGreyText,
							},
						},
						error: Boolean(formError['question']),
						helperText: formError['question'],
					}}
					onChange={onChange}
				/>
				<InputField
					fieldName='answer'
					value={formData.answer}
					fieldProps={{
						multiline: true,
						maxRows: 5,
						fullWidth: true,
						size: 'medium',
						sx: {
							'& .MuiInputBase-input': {
								height: `119px !important`,
								paddingX: `14px`,
								paddingY: `16px`,
								fontSize: '18px',
								color: theme.palette.common.primaryGreyText,
								fontFamily: 'Fira Sans',
								overflow: 'auto !important',
							},
							'& .MuiInputBase-root': {
								padding: 0,
								borderRadius: '8px',
								borderColor: theme.palette.common.secondaryGreyText,
							},
						},
						error: Boolean(formError['answer']),
						helperText: formError['answer'],
					}}
					onChange={onChange}
				/>

				<Stack alignItems={'end'}>
					<LoadingButton
						size='large'
						variant='contained'
						color='primary'
						sx={{
							width: 209,
							height: 51,
							borderRadius: '8px',
						}}
						loading={updateApi.isLoading}
						onClick={onModifyClick}
					>
						<PoppinsTypography
							variant='subtitle1'
							sx={{ color: theme.palette.common.white }}
						>
							Modify
						</PoppinsTypography>
					</LoadingButton>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default memo(Faq);
