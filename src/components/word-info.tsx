import { PlayCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React from 'react';
import './styles/word-info.scss';

interface WordInfo {
    word: string;
}

const WordInfo: React.FC<WordInfo> = ({ word }) => {

    return (
        <>
            <div className='word-info'>
                <div className='word-info-detail'>
                    <h1 className='word-info-title'>{word}</h1>
                    <p className='word-info-part-of-speech'>adjective</p>
                    <p className='word-info-pronunciation'>/w:ord/ <PlayCircleOutlined /></p>
                    <Tag color='green'>TOPIK I</Tag>
                    <p className='word-info-meaning'>Meaning</p>
                    <p>Example:</p>
                    <p className='word-info-example'>아무 문제나 걱정이 없이 편안하다.</p>
                    <p className='word-info-example-meaning'>
                        Bình yên không có bất cứ vấn đề hay nỗi lo nào cả.</p>
                </div>
                <div className='word-info-image'>
                </div>
                <div className='add-to-my-vocab'>
                    <PlusCircleOutlined />
                </div>
            </div>
        </>
    );
};

export default WordInfo;
