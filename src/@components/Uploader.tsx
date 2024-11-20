import { Box, SxProps, Theme } from '@mui/material';
import { FC, ReactNode, memo } from 'react';

export interface UploaderProps {
	fieldName: string;
	children?: ReactNode;
	sx?: SxProps<Theme>;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	file: string | FileList;
	acceptFiles?: string;
	overlay?: ReactNode;
}

const Uploader: FC<UploaderProps> = (props) => {
	return (
		<>
			<label htmlFor={`attatch-files-${props.fieldName}`}>
				<Box
					className='uploader-container'
					display={'flex'}
					{...props}
					sx={{
						...(props.onChange && { cursor: 'pointer' }),
						...props.sx,
						position: 'relative',
						userSelect: 'none',
						'& img': {
							borderRadius: 'inherit',
						},
					}}
				>
					{props.onChange && (
						<input
							id={`attatch-files-${props.fieldName}`}
							name={`attatch-files-${props.fieldName}`}
							accept={props.acceptFiles}
							style={{
								opacity: 0,
								position: 'absolute',
								width: 'inherit',
								height: 'inherit',
								...(props.onChange !== undefined && { cursor: 'pointer' }),
							}}
							type='file'
							onChange={props.onChange}
							onClick={(event) => (event.currentTarget.value = '')}
						/>
					)}
					{props.file ? (
						<>
							<img
								src={
									typeof props.file === 'string' ? props.file : URL.createObjectURL(props.file?.[0])
								}
								alt='picture'
								width={`100%`}
								height={`100%`}
							/>
							{props.overlay}
						</>
					) : (
						props.children
					)}
				</Box>
			</label>
		</>
	);
};
export default memo(Uploader);
