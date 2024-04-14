import { Carousel, Col, message, Progress, Row } from 'antd';
import FlashCard from './flashcard';
import './styles/flashcard-list.scss'
import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { IListVocabDetail } from '../custom/type';
import { getVocabOfList, updateRemember } from '../apis';
import { LeftCircleOutlined, PlayCircleOutlined, RightCircleOutlined, UndoOutlined } from '@ant-design/icons';
import { CarouselRef } from 'antd/es/carousel';
function FlashcardList() {
    const { idList } = useParams();
    const [listVocabDetail, setListVocabDetail] = useState<IListVocabDetail | null>(null);
    const [autoPlay, setAutoPlay] = useState(false);
    const [percent, setPercent] = useState<number>(0);
    const length = Number(listVocabDetail?.vocabs.length);
    // const [currentSlide, setCurrentSlide] = useState<number>(0);
    // const [showComplete, setShowComplete] = useState<boolean>(false);
    const crRef = useRef<CarouselRef | null>(null);
    const percentAdd = Number((100 / Number(listVocabDetail?.vocabs.length)).toFixed(2));
    const fetch = async () => {
        try {
            const res = await getVocabOfList(String(idList));
            if (res.data) {
                setListVocabDetail(res.data)
            }
        }
        catch {
            console.log("Lỗi lấy data")
        }
    }
    useEffect(() => {
        fetch()
    }, [])
    const handelAutoPlay = () => {
        if (crRef.current?.innerSlider.state.currentSlide === length - 1) {
            message.info("Đã lướt tới từ cuối cùng")
            return
        }
        message.info(`Chế độ tự lướt đang ${autoPlay ? 'tắt' : 'bật'}`)
        setAutoPlay((prev) => !prev)
    }
    const handelClickPrev = () => {
        if (crRef.current?.innerSlider.state.currentSlide == 0) {
            setPercent(0)
            return
        }
        crRef.current?.prev()
        setPercent((prev) => prev - percentAdd)
    }
    // if (currentSlide == (Number(listVocabDetail?.vocabs.length) - 1)) {
    //     console.log(currentSlide)
    // }
    const handelClickNext = () => {
        if (percent == 100) {
            return
        }
        if (crRef.current?.innerSlider.state.currentSlide == length - 1) {
            setPercent(100)
            return
        }
        crRef.current?.next()
        setPercent((prev) => prev + percentAdd)
    }
    const handleAfterChange = (cur: number, autoPlay: boolean) => {
        if (percent == 100) {
            return
        }
        if (autoPlay && cur == length - 1) {
            message.info("Đã lướt tới từ cuối cùng")
            setAutoPlay(false)
        }
        if (autoPlay) {
            setPercent((prev) => prev + percentAdd)
        }
    }
    const handelReset = () => {
        setPercent(0);
        crRef.current?.goTo(0);
    }
    const handleUpdateRemember = async (idWord: number) => {
        console.log(idWord)
        try {
            const res = await updateRemember(Number(idList), idWord);
            if (res) {
                message.success("Update thành công");
                fetch();
            }
            else {
                message.error("Update lỗi");
            }
        }
        catch {
            message.error("Lỗi API")
        }
    }
    return (<div className="flashcard-list-container">
        <Row>
            <Col span={8} offset={4}>
                <div className="home-title">{listVocabDetail?.name}</div>
            </Col>
        </Row>
        <Progress showInfo={false} style={{ width: '90%', position: 'relative', left: '5%' }} percent={percent} />
        <div className='flashcard-list-content'>
            <Carousel
                afterChange={(cur) => handleAfterChange(cur, autoPlay)}
                ref={crRef} pauseOnHover={true} dots={false} autoplay={autoPlay}>
                {listVocabDetail?.vocabs.map((vob) => {
                    { vob }
                    return <div><FlashCard handelUpdateRemember={handleUpdateRemember} word={vob.vocab} isRemember={vob.isRemember} /></div>
                })}
            </Carousel>
            <div className='flashcard-list-btn'>
                <div><LeftCircleOutlined onClick={handelClickPrev} /></div>
                <div><RightCircleOutlined onClick={handelClickNext} style={{ marginLeft: 20 }} /></div>
            </div>
            <PlayCircleOutlined onClick={handelAutoPlay} className='btn-auto-play' />
            <UndoOutlined onClick={handelReset} className='btn-reset' />
        </div>
        {/* : <>
            <div><LeftCircleOutlined onClick={handelClickPrev} />Quay lại thẻ cuối cùng</div>
            <div><RightCircleOutlined onClick={handelClickNext} style={{ marginLeft: 20 }} />Trở về trang list từ vựng</div>
        </> */}
    </div>);
}

export default FlashcardList;