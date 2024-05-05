import React from 'react';
import './styles/news-com.scss';
import { INews } from '../custom/type';
import { backEndUrl } from '../apis';


const NewsCom: React.FC<INews> = ({ content, image }) => {

    return (
        <>
            <div className='news-info'>
                <div >
                    <div className='news-info-detail' dangerouslySetInnerHTML={{ __html: content }} />
                </div>
                {image &&
                    <div className='news-info-image' style={{ overflow: 'hidden' }}>
                        <img src={`${backEndUrl}/images/news/${image}`} />
                    </div>}
            </div>
        </>
    );
};

export default NewsCom;
