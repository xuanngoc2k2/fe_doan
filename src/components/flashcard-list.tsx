import { Carousel, Col, message, Progress, Row } from 'antd';
import FlashCard from './flashcard';
import './styles/flashcard-list.scss'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IListVocabDetail } from '../custom/type';
import { getVocabOfList } from '../apis';
import { LeftCircleOutlined, PlayCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
function FlashcardList() {
    const { idList } = useParams();
    const [listVocabDetail, setListVocabDetail] = useState<IListVocabDetail | null>(null);
    const [autoPlay, setAutoPlay] = useState(false);
    const [percent, setPercent] = useState<number>(0);

    const fetch = async () => {
        try {
            const res = await getVocabOfList(String(idList));
            if (res.data) {
                setListVocabDetail(res.data)
            }
        }
        catch {
            console.log("looi")
        }
    }
    useEffect(() => {
        fetch()
    }, [])
    const handelAutoPlay = () => {
        message.info(`Chế độ tự lướt đang ${autoPlay ? 'tắt' : 'bật'}`)
        setAutoPlay((prev) => !prev)
    }
    return (<div className="flashcard-list-container">
        <Row>
            <Col span={8} offset={4}>
                <div className="home-title">{listVocabDetail?.name}</div>
            </Col>
        </Row>
        <Progress style={{ width: '90%', position: 'relative', left: '5%' }} percent={percent} />
        <div className='flashcard-list-content'>
            <Carousel autoplay={autoPlay}>
                {listVocabDetail?.vocabs.map((vob) => {
                    { vob }
                    return <div><FlashCard word={vob} /></div>
                })}
            </Carousel>
            <div className='flashcard-list-btn'>
                <div><LeftCircleOutlined onClick={() => setPercent((prev) => prev - 10)} /></div>
                <div><RightCircleOutlined onClick={() => setPercent((prev) => prev + 10)} style={{ marginLeft: 20 }} /></div>
            </div>
            <PlayCircleOutlined onClick={handelAutoPlay} className='btn-auto-play' />
        </div>
    </div>);
}

export default FlashcardList;