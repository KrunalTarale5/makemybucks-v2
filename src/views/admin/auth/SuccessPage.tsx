import AuthWrapper from '../../../@components/AuthWrapper';
import { Button, Stack } from '@mui/material';
import IconFinder from '@components/Icon';
import { InterTypography } from '@components/Typography';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface SuccessPageProps {
	message: ReactNode;
}

const SuccessPage = (props: SuccessPageProps) => {
	const navigate = useNavigate();
	return (
		<AuthWrapper>
			<Stack
				alignItems={'center'}
				gap={5}
			>
				<IconFinder iconName='SuccessLogo' />
				<Stack
					gap={4}
					width={`100%`}
					alignItems={'center'}
				>
					<InterTypography
						variant='h2'
						color={'#DAE0FF'}
					>
						Success !
					</InterTypography>
					<InterTypography
						variant='subtitle1'
						color={'white'}
					>
						{props.message}
					</InterTypography>

					<Button
						size='large'
						variant='contained'
						color='ternary'
						onClick={() => {
							navigate(`/admin/login`);
						}}
						sx={{ minWidth: 436, height: 66 }}
					>
						<InterTypography
							variant='h5'
							fontWeight={600}
						>
							Back to Login
						</InterTypography>
					</Button>
				</Stack>
			</Stack>
		</AuthWrapper>
	);
};

export default SuccessPage;
