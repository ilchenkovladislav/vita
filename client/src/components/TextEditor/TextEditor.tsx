import React from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import './TextEditor.scss';

interface TextEditorProps {
    value: string;
    onChange: (markdown: string) => void;
}

const fontSizeArr = [
    '8px',
    '9px',
    '10px',
    '12px',
    '14px',
    '16px',
    '20px',
    '24px',
    '32px',
    '42px',
    '54px',
    '68px',
    '84px',
    '98px',
];

const fonts = [
    'Arial',
    'Roboto',
    'Helvetica',
    'Times New Roman',
    'Comic Sans MS',
    'Impact',
    'Oswald',
];

const Size = Quill.import('attributors/style/size');
const Font = Quill.import('attributors/style/font');
Size.whitelist = fontSizeArr;
Font.whitelist = fonts;
Quill.register(Size, true);
Quill.register(Font, true);

export const TextEditor: React.FC<TextEditorProps> = ({ value, onChange }) => {
    return (
        <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            modules={{
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                    ['blockquote', 'code-block'],

                    [{ header: 1 }, { header: 2 }], // custom button values
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
                    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
                    [{ direction: 'rtl' }], // text direction

                    [{ size: fontSizeArr }], // custom dropdown
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],

                    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                    [{ font: fonts }],
                    [{ align: [] }],

                    ['clean'], // remove formatting button
                ],
            }}
        />
    );
};
