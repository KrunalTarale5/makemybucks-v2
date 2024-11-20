import { Button, Divider, IconButton, Snackbar as Snackbar_, Stack, useTheme } from '@mui/material';
import { FC, ReactNode, createContext, useContext, useState } from 'react';
import IconFinder from './Icon';
import { PoppinsTypography } from './Typography';

interface SnackbarProps {
	_key: number;
	title: ReactNode;
	content?: ReactNode;
	variant: 'sucess' | 'error' | 'warning';
	onCancel: (event: any, _key: number) => void;
	onView?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, _key: number) => void;
}
type SnackbarContextType = {
	showSnackbar: (props: Omit<SnackbarProps, '_key'>) => void;
	hideSnackbar: (_key?: number) => void;
};

const SnackbarContext = createContext<SnackbarContextType>({
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	showSnackbar: (_props: Omit<SnackbarProps, '_key'>) => undefined,
	hideSnackbar: () => undefined,
});
export const useSnackbar = (): SnackbarContextType =>
	useContext<SnackbarContextType>(SnackbarContext);

export const SnackbarProvider: FC<{ children: ReactNode }> = ({ children }): JSX.Element => {
	const [state, setState] = useState<SnackbarProps>({} as SnackbarProps);

	const showSnackbar = (props: Omit<SnackbarProps, '_key'>) => {
		setState({ _key: new Date().getTime(), ...props });
	};
	const hideSnackbar = () => {
		setState({} as SnackbarProps);
	};

	return (
		<SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
			{children}
			<Snackbar
				key={state._key}
				{...state}
				_key={state._key}
			/>
		</SnackbarContext.Provider>
	);
};
export const Snackbar: FC<SnackbarProps> = ({
	_key,
	title,
	content,
	variant,
	onCancel,
	onView,
}): JSX.Element => {
	const theme = useTheme();
	return (
		<Snackbar_
			sx={{
				'&.MuiSnackbar-root': {
					top: `190px`,
					backgroundColor: '#000516CC',
					boxShadow: `0px 12px 60px 0px #00000066`,
				},
				'.MuiPaper-root': { paddingRight: 6, gap: 10, borderRadius: `6px` },
			}}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			open={Boolean(_key)}
			onClose={(e) => onCancel?.(e, _key)}
			autoHideDuration={3000}
			action={
				onView ? (
					<Button
						variant='outlined'
						size='small'
						sx={{ borderColor: 'white', color: 'white' }}
						onClick={(e) => onView?.(e, _key)}
					>
						View
					</Button>
				) : undefined
			}
			message={
				<>
					<IconButton
						sx={{ top: '0px', right: '0px', position: 'absolute' }}
						onClick={(e) => onCancel?.(e, _key)}
					>
						<IconFinder iconName={'CancelWhite'}></IconFinder>
					</IconButton>

					<Stack sx={{ flexDirection: 'row', gap: '1' }}>
						<Divider
							orientation='vertical'
							flexItem
							sx={{
								borderColor:
									variant === 'sucess'
										? theme.palette.success.main
										: variant === 'error'
										  ? theme.palette.error.main
										  : variant === 'warning'
										    ? theme.palette.warning.main
										    : 'transparent',

								borderWidth: '4px',
								borderRadius: '3px',
							}}
						/>
						<Stack sx={{ paddingLeft: '10px' }}>
							<PoppinsTypography variant='h6'>{title}</PoppinsTypography>
							{content && <PoppinsTypography variant='body1'>{content}</PoppinsTypography>}
						</Stack>
					</Stack>
				</>
			}
			key={'vertical + horizontal'}
		/>
	);
};
