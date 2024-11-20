import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';

const Textarea = styled(BaseTextareaAutosize)(
	({ theme }) => `
    box-sizing: border-box;
    width: 100%;
    
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
       // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);
export default Textarea;
