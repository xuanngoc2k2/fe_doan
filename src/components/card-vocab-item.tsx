import { Empty, Popconfirm, Tag } from "antd";
import { IVocabulary } from "../custom/type";
import { DeleteOutlined, PlayCircleOutlined } from "@ant-design/icons";
import './styles/card-vocab-item.scss'
import { backEndUrl } from "../apis";
import { useSpeechSynthesis } from 'react-webspeech';
import { useEffect, useState } from "react";

function CardVocabItem({ word, handelRemove }: { word: IVocabulary, handelRemove?: (id: number) => void }) {
    // const { speak } = useSpeechSynthesis({});
    const { speak } = useSpeechSynthesis({});
    const [koreanVoice, setKoreanVoice] = useState<SpeechSynthesisVoice | undefined>(undefined);
    useEffect(() => {
        const fetchVoices = () => {
            const allVoices = speechSynthesis.getVoices();
            const koreanVoice = allVoices.find(voice => voice.lang === 'ko-KR');
            if (koreanVoice) {
                setKoreanVoice(koreanVoice);
            } else {
                // Nếu không tìm thấy giọng tiếng Hàn, tiếp tục lắng nghe cho đến khi tìm thấy
                setTimeout(fetchVoices, 100);
            }
        };

        fetchVoices();
    }, []);


    const speakText = (text: string) => {
        if (koreanVoice) {
            speak({ text, voice: koreanVoice });
        } else {
            speak({ text, voice: koreanVoice });
            console.error('Không tìm thấy giọng đọc tiếng Hàn');
        }
    };

    const handleClick = () => {
        const text = word.word;
        if (text) {
            speakText(text);
            console.log(text)
        }
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
                        <p className='vocab-example'>{word.example.split('\n').map((ex, index) => <li key={index}>{ex}</li>)}</p></>)}
            </div>
            <div className='vocab-image'>
                {word.image !== null ? <img src={`${backEndUrl}/images/vocabulary/${word.image}`} /> : <Empty />}
            </div>
            {handelRemove &&
                <div className='btn-delete-vob'>
                    <Popconfirm
                        placement="leftTop"
                        title={"Xác nhận xóa từ vựng"}
                        description={"Bạn có chắc chắn muốn xóa từ vựng này ?"}
                        onConfirm={() => handelRemove(Number(word.id))}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <span style={{ cursor: "pointer", margin: "0 10px" }}>
                            <DeleteOutlined />
                        </span>
                    </Popconfirm>
                </div>}
        </div>
    </>);
}

export default CardVocabItem;