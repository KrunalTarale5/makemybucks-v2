import { FC, memo } from 'react';
import QuillEditor from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface EditorProps {
	value?: string;
	onChange?: (
		value: string,
		delta?: any,
		source?: any,
		editor?: QuillEditor.UnprivilegedEditor
	) => void;
}

const Editor: FC<EditorProps> = (props) => {
	return (
		<QuillEditor
			theme='snow'
			formats={formats}
			modules={modules}
			{...props}
		/>
	);
};

export default memo(Editor);

const modules = {
	toolbar: {
		container: [
			[{ header: [2, 3, 4, false] }],
			['bold', 'italic', 'underline', 'blockquote'],
			[{ color: [] }],
			[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
			['link'],
		],
	},
	clipboard: {
		matchVisual: true,
	},
};

const formats = [
	'header',
	'bold',
	'italic',
	'underline',
	'strike',
	'blockquote',
	'list',
	'bullet',
	'indent',
	'link',
	'color',
];
