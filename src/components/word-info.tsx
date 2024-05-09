import { PlayCircleOutlined } from '@ant-design/icons';
import { notification, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import './styles/word-info.scss';
import { backEndUrl, searchVocab } from '../apis';
import { IVocabulary } from '../custom/type';
import { useSpeechSynthesis } from 'react-webspeech';
// import { useAppSelector } from '../redux/hook';

interface WordInfo {
    word: string;
}

const WordInfo: React.FC<WordInfo> = ({ word }) => {
    const { speak } = useSpeechSynthesis({});
    const [koreanVoice, setKoreanVoice] = useState<SpeechSynthesisVoice | undefined>(undefined);
    const [vocab, setVocab] = useState<IVocabulary>();
    // const user = useAppSelector((state) => state.account.user);
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
    useEffect(() => {
        try {
            const fetch = async () => {
                const res = await searchVocab(word);
                if (res && res.data) {
                    setVocab(res.data);
                    console.log(res.data)
                }
                // const apiUrl = `https://api.mymemory.translated.net/get?q=${word}&langpair="ko-KR"|"vi-VN"`;
                // fetch(apiUrl)
                //     .then((res) => res.json())
                //     .then((data) => {
                //         console.log(data);
                //     });
            }
            fetch();
        }
        catch {
            notification.warning({ message: "Không tìm thấy từ vựng" })
        }
    }, [word])
    const speakText = (text: string) => {
        if (koreanVoice) {
            speak({ text, voice: koreanVoice });
        } else {
            speak({ text, voice: koreanVoice });
            console.error('Không tìm thấy giọng đọc tiếng Hàn');
        }
    };
    // const handleAddWord = () => {
    //     if (user.id == 0) {
    //         notification.error({ message: "Vui lòng đăng nhập trước" });
    //     }
    // }
    return (
        <>
            {vocab &&
                <div className='word-info'>
                    <div className='word-info-detail'>
                        <h1 className='word-info-title'>{vocab?.word}</h1>
                        <p className='word-info-part-of-speech'>{vocab?.partOfSpeech}</p>
                        <p className='word-info-pronunciation'>{vocab?.spell} <PlayCircleOutlined style={{ color: '#1677ff' }} onClick={() => speakText(vocab.word!)} /></p>
                        {vocab.level && <Tag color='green'>TOPIK {vocab?.level}</Tag>}
                        <p className='word-info-meaning'>{vocab?.meaning}</p>
                        {vocab.example &&
                            <><p>Example:</p>
                                {vocab?.example?.split('\n').map((ex) => {
                                    return <p className='word-info-example'>{ex}</p>
                                })}
                            </>}
                    </div>
                    {vocab?.image &&
                        <div className='word-info-image'>
                            <img width={200} style={{ maxHeight: 200 }} src={`${backEndUrl}/images/vocabulary/${vocab.image}`} />
                        </div>}
                    {/* <div className='add-to-my-vocab'>
                        <PlusCircleOutlined onClick={handleAddWord} style={{ cursor: 'pointer' }} />
                    </div> */}
                </div>
            }
        </>
    );
};

export default WordInfo;
