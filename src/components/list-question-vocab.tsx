import { Card, Col, Row } from "antd";
import { IQuestionVocab } from "../custom/type";
import { useState } from "react";

function QuestionVocab({ word, handelAnswer }: { word: IQuestionVocab, handelAnswer: (word: IQuestionVocab, answer: string) => void }) {
    const [isSelected, setIsSelected] = useState('');
    return (<>
        <Card className="question-vocab-container" style={{ textAlign: 'center', height: 260 }}>
            <div className='question-vocab-title'>
                <p>Định nghĩa</p>
                <h3>{word.meaning.meaning}</h3>
            </div>
            <div style={{ height: '60%' }} className="question-vocab-detail">
                <p>Chọn thuật ngữ đúng</p>
                <Row>{word.ans.map((answer) => {
                    return (
                        <Col onClick={() => { handelAnswer(word, answer); setIsSelected(answer) }}
                            className={`question-vocab-ans ${isSelected == answer ? 'selected' : ''}`}>{answer}</Col>
                    )
                })}
                </Row>
            </div>
        </Card>
    </>);
}

export default QuestionVocab;