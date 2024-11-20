import { useAlertDialog } from '@components/AlertDialog';
import IconFinder from '@components/Icon';
import InputField, { InputFieldValue } from '@components/InputField';
import SubAdminWrapper from '@components/SubAdminWrapper';
import { PoppinsTypography } from '@components/Typography';
import Uploader from '@components/Uploader';
import { ProfileFormFields, ProfileRequest, validateProfileFields } from '@hooks/sub-admin-profile';
import { FieldProps, FormErrorMessage } from '@interfaces/common';
import { Button, Stack, useTheme } from '@mui/material';
import { validateIsNumber } from '@utils/validator';
import { setToken, setUserInfo, setBannerInfo } from '_store/actions/ui-actions';
import { RootState } from '_store/reducers';
import { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const intialFormData: ProfileRequest = {
	email: '',
	phoneno: '',
};

const intialFormError: FormErrorMessage<ProfileRequest> = {
	email: '',
	phoneno: '',
};
const Profile = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { showAlertDialog, hideAlertDialog } = useAlertDialog();
	const { userInfo } = useSelector((state: RootState) => state.richPenny);

	const [formData, setFormData] = useState(intialFormData);
	const [formError, setFormError] = useState(intialFormError);

	useEffect(() => {
		setFormData({ email: userInfo?.email ?? '', phoneno: userInfo?.mobile_no ?? '' });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onChange = (
		fieldName: string,
		value: InputFieldValue,
		fieldType: FieldProps['fieldType']
	) => {
		let _formData: ProfileRequest = {} as ProfileRequest;
		if (fieldType === 'number') {
			const isNumber = validateIsNumber(String(value));
			_formData = {
				...formData,
				[fieldName]: isNumber ? value : formData[fieldName as keyof ProfileRequest],
			};
		} else {
			_formData = { ...formData, [fieldName]: value };
		}
		setFormData(_formData);
		setFormError({
			...formError,
			[fieldName]: validateProfileFields(fieldName as keyof ProfileRequest, _formData),
		});
	};

	const onLogout = () => {
		showAlertDialog({
			content: `Do you want to logout?`,
			buttons: [
				{
					children: 'No',
					variant: 'outlined',
					callback: () => {
						hideAlertDialog();
					},
				},
				{
					children: 'Yes',
					variant: 'contained',
					callback: () => {
						hideAlertDialog();
						dispatch(setToken(null));
						dispatch(setUserInfo(null));
						dispatch(setBannerInfo(null));
						navigate('/sub-admin/login');
					},
				},
			],
		});
	};

	return (
		<SubAdminWrapper
			heading={'Profile'}
			bottonToolbar
		>
			<Stack>
				<Stack sx={{ alignItems: 'center' }}>
					<Uploader
						fieldName='img'
						file={userInfo?.avatar ?? ''}
						sx={{ width: 160, height: 160 }}
					/>
					<PoppinsTypography
						variant='h5'
						fontWeight={600}
						sx={{ color: theme.palette.common.primaryGreyText }}
					>
						{userInfo?.name}
					</PoppinsTypography>
					<PoppinsTypography
						variant='h6'
						sx={{ color: theme.palette.common.secondaryGreyText }}
					>
						ID: {userInfo?.id}
					</PoppinsTypography>
				</Stack>
				<Stack
					gap={2}
					width={`100%`}
					paddingTop={'60px'}
				>
					{Object.entries(ProfileFormFields).map((v) => {
						const fieldName: keyof ProfileFormFields = v[0] as keyof ProfileFormFields;
						const fieldProps = v[1];

						return (
							<InputField
								showLabel={true}
								fieldName={fieldName}
								value={(formData[fieldName] as InputFieldValue) ?? ''}
								key={fieldName}
								fieldProps={{
									...fieldProps,
									variant: 'standard',
									color: 'secondary',
									fullWidth: true,
									disabled: true,
									sx: {
										'.MuiTypography-subtitle1': {
											fontFamily: 'inter',
											color: theme.palette.common.secondaryGreyText,
											fontSize: '14px',
											fontWeight: 600,
										},
										'.MuiInputBase-input': {
											color: theme.palette.common.secondaryGreyText,
										},
									},
									error: Boolean(formError[fieldName]),
									helperText: formError[fieldName],
								}}
								fieldType={fieldProps.fieldType}
								onChange={onChange}
							/>
						);
					})}
				</Stack>
				<Stack
					gap={2}
					paddingTop={'60px'}
				>
					<Button
						variant='outlined'
						size='large'
						sx={{ justifyContent: 'space-between' }}
						onClick={() => navigate(`/sub-admin/reset-password`)}
					>
						<PoppinsTypography
							variant='subtitle1'
							sx={{ color: theme.palette.common.primaryGreyText }}
						>
							Reset Password
						</PoppinsTypography>
						<IconFinder iconName='ChevronRight' />
					</Button>
					<Button
						variant='outlined'
						size='large'
						sx={{ justifyContent: 'space-between' }}
						onClick={onLogout}
					>
						<PoppinsTypography
							variant='subtitle1'
							sx={{ color: theme.palette.common.primaryGreyText }}
						>
							Logout
						</PoppinsTypography>
						<IconFinder iconName='ChevronRight' />
					</Button>
				</Stack>
			</Stack>
		</SubAdminWrapper>
	);
};

export default memo(Profile);
