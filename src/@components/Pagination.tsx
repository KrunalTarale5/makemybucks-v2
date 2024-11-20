import { FC, memo } from 'react';
import { Stack, Pagination as Pagination_ } from '@mui/material';
import { PageRequest } from '@interfaces/common';

export interface PaginationProps extends PageRequest {
	totalPages: number;

	onPageChange: (page: number, event?: React.ChangeEvent<unknown>) => void;
}

const Pagination: FC<PaginationProps> = (props) => {
	return (
		<Stack
			flexDirection={'row'}
			gap={2}
			alignSelf={'center'}
		>
			<Pagination_
				color='primary'
				count={props.totalPages}
				page={props.page}
				defaultPage={1}
				onChange={(e, v) => props.onPageChange(v, e)}
				sx={{
					'.MuiPaginationItem-previousNext': { backgroundColor: '#E1E2E9' },
					'.MuiPaginationItem-icon': { fill: '#A9B0C3' },
				}}
			/>
		</Stack>
	);
};

export default memo(Pagination);
