import { LoadingButtonProps, LoadingButton } from '@mui/lab';
import { Dialog, DialogContent, Grid, Stack, DialogTitle, useTheme } from '@mui/material';
import { ReactNode, createContext, useContext, FC, useState } from 'react';
import { PoppinsTypography } from './Typography';

interface ActionButtonProps extends LoadingButtonProps {
	readonly children: ReactNode;
	readonly callback: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, _key: number) => void;
}

interface AlertDialogProps {
	_key: number;
	title?: ReactNode;
	content?: ReactNode;
	buttons: ActionButtonProps[];
}

type AlertDialogContextType = {
	showAlertDialog: (props: Omit<AlertDialogProps, '_key'>) => void;
	hideAlertDialog: (_key?: number) => void;
};

const AlertDialogContext = createContext<AlertDialogContextType>({
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	showAlertDialog: (_props: Omit<AlertDialogProps, '_key'>) => undefined,
	hideAlertDialog: () => undefined,
});

export const useAlertDialog = (): AlertDialogContextType =>
	useContext<AlertDialogContextType>(AlertDialogContext);

export const AlertDialogProvider: FC<{ children: ReactNode }> = ({ children }): JSX.Element => {
	const [state, setState] = useState<AlertDialogProps>({} as AlertDialogProps);

	const showAlertDialog = (props: Omit<AlertDialogProps, '_key'>) => {
		setState({ _key: new Date().getTime(), ...props });
	};

	const hideAlertDialog = () => {
		setState({} as AlertDialogProps);
	};

	return (
		<AlertDialogContext.Provider value={{ showAlertDialog, hideAlertDialog }}>
			{children}
			<AlertDialog
				key={state._key}
				{...state}
				_key={state._key}
			/>
		</AlertDialogContext.Provider>
	);
};

export const AlertDialog: FC<AlertDialogProps> = ({
	_key,
	title,
	content,
	buttons,
}): JSX.Element => {
	const theme = useTheme();
	const isSubAdminView = location.pathname.includes('/sub-admin/');

	return (
		<Dialog
			open={Boolean(_key)}
			key={_key}
			maxWidth={isSubAdminView ? 'xs' : 'md'}
			sx={{ '.MuiPaper-root': { width: `100%` } }}
		>
			<DialogTitle sx={{ padding: 4, paddingBottom: 3 }}>
				<PoppinsTypography
					variant='h4'
					sx={{ color: theme.palette.common.primaryGreyText }}
				>
					{title}
				</PoppinsTypography>
			</DialogTitle>
			<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 7, padding: 4 }}>
				{content && <PoppinsTypography variant='h6'> {content}</PoppinsTypography>}
				{buttons && (
					<Stack
						flexDirection={'row'}
						gap={2}
						alignSelf={'self-end'}
					>
						{buttons.map((v, i) => (
							<Grid
								item
								key={i}
							>
								<LoadingButton
									{...v}
									onClick={(e) => v.callback(e, _key)}
									size={isSubAdminView ? 'small' : 'large'}
									sx={{ minWidth: isSubAdminView ? 80 : 166 }}
								>
									<PoppinsTypography variant='h6'>{v.children}</PoppinsTypography>
								</LoadingButton>
							</Grid>
						))}
					</Stack>
				)}
			</DialogContent>
		</Dialog>
	);
};
