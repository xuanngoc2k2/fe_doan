import { Empty, Tag } from "antd";
import { IVocabulary } from "../custom/type";
import { DeleteOutlined, PlayCircleOutlined } from "@ant-design/icons";
import './styles/card-vocab-item.scss'
import { backEndUrl } from "../apis";

function CardVocabItem({ word, handelRemove }: { word: IVocabulary, handelRemove: (id: number) => void }) {
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
                        <p className='vocab-example'>{word.example.split('\n').map((ex) => <li>{ex}</li>)}</p></>)}
            </div>
            <div className='vocab-image'>
                {word.image !== null ? <img src={`${backEndUrl}/images/vocabulary/${word.image}`} /> : <Empty />}
            </div>
            <div onClick={() => handelRemove(Number(word.id))} className='btn-delete-vob'>
                <DeleteOutlined />
            </div>
        </div>
    </>);
}

export default CardVocabItem;