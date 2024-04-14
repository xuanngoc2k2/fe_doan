import { Button, Carousel, Col, message, Progress, Row, Space } from 'antd';
import FlashCard from './flashcard';
import './styles/flashcard-list.scss'
import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { IListVocabDetail, IQuestionVocab } from '../custom/type';
import { getVocabOfList, renderQuestionVocab, updateRemember } from '../apis';
import { LeftCircleOutlined, PlayCircleOutlined, RightCircleOutlined, UndoOutlined } from '@ant-design/icons';
import { CarouselRef } from 'antd/es/carousel';
import QuestionVocab from './list-question-vocab';
function FlashcardList() {
    const { idList } = useParams();
    const [listVocabDetail, setListVocabDetail] = useState<IListVocabDetail | null>(null);
    const [listQuestion, setListQuestion] = useState<IQuestionVocab[] | []>([]);
    const [autoPlay, setAutoPlay] = useState(false);
    const [percent, setPercent] = useState<number>(0);
    const [answer, setAnswer] = useState<IQuestionVocab[] | []>([]);
    const length = Number(listVocabDetail?.vocabs.length);
    // const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [showQuestion, setShowQuestion] = useState<boolean>(true);
    const crRef = useRef<CarouselRef | null>(null);
    const percentAdd = Number((100 / Number(listVocabDetail?.vocabs.length)).toFixed(2));
    const fetch = async () => {
        try {
            const res = await getVocabOfList(String(idList));
            if (res.data) {
                setListVocabDetail(res.data)
            }

            if (showQuestion) {
                const response = await renderQuestionVocab(Number(idList));
                if (response.data) {
                    setListQuestion(response.data.questions)
                    setAnswer(response.data.questions);
                }
            }
        }
        catch {
            console.log("Lỗi lấy data")
        }
    }
    useEffect(() => {
        fetch()
    }, [showQuestion])
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
            setShowQuestion(true)
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
    const handelAnswer = (word: IQuestionVocab, u_answer: string) => {
        setAnswer((prev: IQuestionVocab[]) => {
            return prev.map((q) => {
                if (q.meaning.id === word.meaning.id) {
                    return { ...q, answer: u_answer };
                }
                return q;
            });
        });
    };

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
    const handelSubmit = () => {
        console.log(answer)
    }
    return (<div className="flashcard-list-container">
        <Row>
            <Col span={8} offset={4}>
                <div className="home-title">{listVocabDetail?.name}</div>
            </Col>
        </Row>
        <Progress showInfo={false} style={{ width: '90%', position: 'relative', left: '5%' }} percent={percent} />
        {!showQuestion ?
            <div className='flashcard-list-content'>
                <Carousel
                    afterChange={(cur) => handleAfterChange(cur, autoPlay)}
                    ref={crRef} pauseOnHover={true} dots={false} autoplay={autoPlay}>
                    {listVocabDetail?.vocabs.map((vob) => {
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
            : (<>
                <div className='question-btn'>
                    <div>
                        <LeftCircleOutlined onClick={() => { setShowQuestion(false); setPercent(0) }} /> Quay lại học
                    </div>
                    <div>
                        Trở về trang list từ vựng <RightCircleOutlined onClick={handelClickNext} style={{ marginLeft: 20 }} />
                    </div>
                </div>
                <div className='question-list'>
                    {listQuestion.length &&
                        <Space size={50} align='center' direction='vertical' >
                            {listQuestion.map((question) => {
                                return <QuestionVocab handelAnswer={handelAnswer} word={question} />
                            })}
                        </Space>}
                    <Row style={{
                        margin: 40,
                        justifyContent: 'center'
                    }}>
                        <Col style={{ padding: 10 }} span={4}>
                            <Button onClick={handelSubmit} type='primary' style={{ fontSize: 20, width: '100%', height: '100%' }}>Gửi bài kiểm tra</Button>
                        </Col>
                    </Row>
                </div>
            </>)
        }
    </div >);
}

export default FlashcardList;