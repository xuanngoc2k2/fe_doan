import React, { useState } from 'react';
import { Button, Card } from 'antd';
import './styles/card-question.scss';
import { IAnswer, IQuestion } from '../custom/type';

interface CardQuestionProps {
    title: string;
    answers?: IAnswer[];
    question: IQuestion;
}

const CardQuestion: React.FC<CardQuestionProps> = ({ title, answers, question }) => {
    const [flipped, setFlipped] = useState<boolean>(false);

    const flipCard = () => {
        setFlipped(!flipped);
    };
    const isTrue = answers?.find((st) => st.is_true);
    return (
        <div className={`flip-card ${flipped ? 'isFlip' : ''}`}>
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    <Card title={'Quiz Time'} bordered={false} style={{ textAlign: 'center', height: 260 }}>
                        <div className='flip-question'>{title}</div>
                        {question?.type === 'multiple-choice' && question.answers?.map((ans, index) => (
                            <p key={index} className='flip-description'>{ans.answer}</p>
                        ))}
                        <Button type='primary' className={question.type === 'multiple-choice' ? 'true' : 'false'} onClick={flipCard}>Check Answer</Button>
                    </Card>
                </div>
                <div className="flip-card-back">
                    <Card title="Answer" bordered={false} style={{ textAlign: 'center', height: 260 }}>
                        <div className='flip-question'>{isTrue?.answer}</div>
                        <Button type='primary' ghost onClick={flipCard}>Question</Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CardQuestion;
