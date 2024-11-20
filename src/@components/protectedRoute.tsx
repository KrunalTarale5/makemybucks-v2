import { Navigate, useNavigate } from 'react-router-dom';
import { FC, memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '_store/reducers';
import { useAlertDialog } from './AlertDialog';
import { setBannerInfo, setDirty, setToken, setUserInfo } from '_store/actions/ui-actions';

interface ProtectedRouteProps {
	children: JSX.Element;
	navigateTo: string;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, navigateTo }): JSX.Element => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { showAlertDialog, hideAlertDialog } = useAlertDialog();
	const { userInfo, token, isDirty } = useSelector((state: RootState) => state.richPenny);
	useEffect(() => {
		if (isDirty) {
			showAlertDialog({
				title: `Session expired`,
				content: 'Session expired',
				buttons: [
					{
						children: 'ok',
						variant: 'outlined',
						callback: () => {
							hideAlertDialog();
							dispatch(setDirty(false));
							dispatch(setToken(null));
							dispatch(setUserInfo(null));
							dispatch(setBannerInfo(null));
							navigate(navigateTo);
						},
					},
				],
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isDirty]);

	return userInfo && token ? children : <Navigate to={navigateTo} />;
};

export default memo(ProtectedRoute);
