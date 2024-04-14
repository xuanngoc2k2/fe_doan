import { Tag } from "antd";
import { IVocabulary } from "../custom/type";
import { PlayCircleOutlined } from "@ant-design/icons";
import './styles/card-vocab-item.scss'
import { backEndUrl } from "../apis";

function CardVocabItem({ word }: { word: IVocabulary }) {
    const handleClick = () => {
        console.log('xử lí phát âm thanh')
    }
    return (<>
        <div className='vocab-info'>
            <div className='vocab-detail'>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h1 className='vocab-title'>{word.word}</h1>
                    <p className='vocab-pronunciation'>[{word.spell}] </p>
                    <PlayCircleOutlined onClick={handleClick} style={{ fontSize: 20, marginLeft: 10, color: '#4096ff', cursor: 'pointer' }} />
                </div>
                <p className='vocab-part-of-speech'>{word.partOfSpeech}</p>
                <Tag color='green'>TOPIK {word.level}</Tag>
                <p className='vocab-meaning'>{word.meaning}</p>
                {word.example && (
                    <><p>Example:</p>
                        <p className='vocab-example'>{word.example}</p></>)}
            </div>
            <div className='vocab-image'>
                <img src={word.image !== null ? `${backEndUrl}/images/vocabulary/${word.image}` : "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ="} />
            </div>
        </div>
    </>);
}

export default CardVocabItem;