import { CheckOutlined, CloseOutlined, LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import QuestionVocab from './question-vocab';
import { IQuestionVocab } from "../custom/type";
import { Button, Col, Row, Space } from "antd";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ListQuestionVocab({
    result,
    listQuestion,
    handelSubmit,
    handelBackToFlashCard,
    handelAnswer
}: {
    result: IQuestionVocab[],
    listQuestion: IQuestionVocab[],
    handelSubmit: () => void,
    handelBackToFlashCard: () => void,
    handelAnswer: (word: IQuestionVocab, answer: string) => void
}) {
    const check: number[] = [];
    const questionRefs = useRef<(HTMLHeadingElement | null)[]>([]);
    // Khởi tạo mảng check với giá trị null
    result.forEach((rs) => {
        if (rs.anTrue === rs.answer) {
            check.push(1)
        }
        else {
            check.push(0);
        }
    })
    const scrollToQuestion = (index: number) => {
        if (questionRefs.current[index]) {
            questionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
    const { idList } = useParams();
    const navigator = useNavigate();
    const handelBackToListFlashCard = () => {
        navigator('/vocab-detail/' + idList)
    }
    return (<>
        {result.length ?
            <div style={{ position: 'sticky', top: 50 }}><div className="list-btn-question">
                <h4>Câu hỏi</h4>
                {check.map((_, index) => (
                    <>
                        <div key={index} onClick={() => scrollToQuestion(index)}>
                            {check[index] ? <CheckOutlined style={{ color: "#59e8b5" }} /> : <CloseOutlined style={{ color: "#ff7873" }} />}
                            {index + 1}
                        </div>
                    </>
                ))}
            </div> </div> : <></>}
        <div className='question-btn'>
            <div onClick={() => { handelBackToFlashCard() }} style={{ cursor: 'pointer' }}>
                <LeftCircleOutlined /> Quay lại học
            </div>
            <div onClick={handelBackToListFlashCard} style={{ cursor: 'pointer' }}>
                Trở về trang list từ vựng <RightCircleOutlined style={{ marginLeft: 20 }} />
            </div>
        </div>
        <div className='question-list'>
            {result.length ?
                <Space size={50} align='center' direction='vertical' >
                    {result.map((result, index) => {
                        return <div ref={el => (questionRefs.current[index] = el)}><QuestionVocab key={index} word={result} /></div>
                    })}
                </Space>
                : listQuestion.length ?
                    <Space size={50} align='center' direction='vertical' >
                        {listQuestion.map((question) => {
                            return <QuestionVocab handelAnswer={handelAnswer} word={question} />
                        })}
                    </Space> :
                    <></>}
            <Row style={{
                margin: 40,
                justifyContent: 'center'
            }}>
                {!result.length ? <Col style={{ padding: 10 }} span={4}>
                    <Button onClick={handelSubmit} type='primary' style={{ fontSize: 20, width: '100%', height: '100%' }}>Gửi bài kiểm tra</Button>
                </Col> : <></>}
            </Row>
        </div>
    </>);
}

export default ListQuestionVocab;