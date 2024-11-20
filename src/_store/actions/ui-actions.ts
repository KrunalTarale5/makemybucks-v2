import { Dispatch } from 'redux';
import { SET_BANNER_INFO, SET_DIRTY, SET_TOKEN, SET_USER_INFO } from '../type';

export const setBannerInfo = (info: SET_BANNER_INFO['payload']): any => {
	return (dispatch: Dispatch<SET_BANNER_INFO>) => {
		dispatch({
			type: 'SET_BANNER_INFO',
			payload: info,
		});
	};
};

export const setToken = (token: SET_TOKEN['payload']): any => {
	return (dispatch: Dispatch<SET_TOKEN>) => {
		dispatch({
			type: 'SET_TOKEN',
			payload: token,
		});
	};
};

export const setUserInfo = (info: SET_USER_INFO['payload']): any => {
	return (dispatch: Dispatch<SET_USER_INFO>) => {
		dispatch({
			type: 'SET_USER_INFO',
			payload: info,
		});
	};
};

export const setDirty = (info: SET_DIRTY['payload']): any => {
	return (dispatch: Dispatch<SET_DIRTY>) => {
		dispatch({
			type: 'SET_DIRTY',
			payload: info,
		});
	};
};
