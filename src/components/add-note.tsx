import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './styles/add-note.scss';
import { Button, Tag } from 'antd';

interface AddNoteProps {
    time: string;
    handelCancel: () => void;
    handleAddNote: (note: string) => void;
}

const AddNote: React.FC<AddNoteProps> = ({ time, handelCancel, handleAddNote }) => {
    const [value, setValue] = useState<string>('');

    return (
        <div className='comment-app'>
            <h1>Thêm ghi chú tại <Tag style={{ fontSize: 21, padding: '3px 10px' }} color="red">{time}</Tag></h1>
            <ReactQuill className='comment-app-word' theme="snow" value={value} onChange={setValue} />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button className='comment-btn-cancel' onClick={handelCancel}>Hủy bỏ</Button>
                <Button onClick={() => handleAddNote(value)} type='primary' className='comment-btn-add-note'>Tạo ghi chú</Button>
            </div>
        </div>
    );
};

export default AddNote;
