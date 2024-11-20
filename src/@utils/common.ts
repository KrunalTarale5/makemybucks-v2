import imageCompression from 'browser-image-compression';

export const isMobile = () => {
	const mobileDevices = [
		/Android/i,
		/webOS/i,
		/iPhone/i,
		/iPad/i,
		/iPod/i,
		/BlackBerry/i,
		/Windows Phone/i,
	];
	return !mobileDevices.some((d) => navigator.userAgent.match(d));
};

export const CompressImage = (file: File) =>
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	imageCompression(file, {
		maxSizeMB: 1,
		maxWidthOrHeight: 720,
		useWebWorker: true,
	});

export const generateSerialNumber = (page: number, size: number, index: number) =>
	(page - 1) * size + 1 + index;

export const RESTAURANT_BASE_URL = 'partner';

export const getMaxTickAmount = (values: number[]) =>
	Math.max(...values) > 5 ? 5 : Math.max(...values);
