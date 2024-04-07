import React from 'react';
import './styles/news-com.scss';

interface INews {
    content: string;
    image: string;
}

const NewsCom: React.FC<INews> = ({ content, image }) => {

    return (
        <>
            <div className='news-info'>
                <div >
                    <div className='news-info-detail' dangerouslySetInnerHTML={{ __html: content }} />
                </div>
                <div className='news-info-image' style={{ overflow: 'hidden' }}>
                    <img src={image} />
                </div>
            </div>
        </>
    );
};

export default NewsCom;
