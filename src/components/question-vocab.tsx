import { Card, Col, Row } from "antd";
import { IQuestionVocab } from "../custom/type";
import { useState } from "react";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import './styles/question-vocab.scss';

function QuestionVocab({ word, handelAnswer }: { word: IQuestionVocab, handelAnswer?: (word: IQuestionVocab, answer: string) => void }) {
    const [isSelected, setIsSelected] = useState('');
    return (<>
        <Card
            className={`question-vocab-container ${handelAnswer ? '' : 'result'}`}
            style={{ textAlign: 'center', height: 260 }}>
            <div className='question-vocab-title'>
                <p>Định nghĩa</p>
                <h3>{word.meaning.meaning}</h3>
            </div>
            <div className={`question-vocab-detail`}>
                <p>Chọn thuật ngữ đúng</p>
                <Row>{word.ans.map((answer) => {
                    return (
                        <Col onClick={() => {
                            if (handelAnswer) {
                                handelAnswer(word, answer);
                                setIsSelected(answer)
                            }
                        }}
                            className={
                                `question-vocab-ans ${isSelected == answer && handelAnswer ? 'selected' : ''} ${!handelAnswer && 'result'} ${word.answer != '' ? (word.answer === answer ? answer == word.anTrue ? 'da-true' : 'da-false' : answer == word.anTrue ? 'must-true' : '') : (word.anTrue == answer ? 'need-true' : '')}`}>
                            {word.answer != '' ? (word.answer === answer ? answer == word.anTrue ? <CheckOutlined style={{ color: "#59e8b5" }} /> : <CloseOutlined style={{ color: "#ff7873" }} /> : <></>) :
                                (answer == word.anTrue ? <CheckOutlined style={{ color: '#939bb4' }} /> : <></>)}
                            {answer}
                        </Col>
                    )
                })}
                </Row>
                {/* <Row>
                    <p>Đáp án đúng</p>
                    {isSelected !== word.anTrue && !handelAnswer ? <>
                        <Col span={24}>
                            {word.anTrue}
                        </Col>
                    </> : <></>}
                </Row> */}
            </div>
        </Card>
    </>);
}

export default QuestionVocab;