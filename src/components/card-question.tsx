import React, { useState } from 'react';
import { Button, Card } from 'antd';
import './styles/card-question.scss';

interface CardQuestionProps {
    title: string;
    answer?: string;
    isQuestion: boolean;
    description?: string;
}

const CardQuestion: React.FC<CardQuestionProps> = ({ title, answer, isQuestion, description }) => {
    const [flipped, setFlipped] = useState<boolean>(false);

    const flipCard = () => {
        setFlipped(!flipped);
    };

    return (
        <div className={`flip-card ${flipped ? 'isFlip' : ''}`}>
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    <Card title={isQuestion ? 'Quiz Time' : 'News'} bordered={false} style={{ textAlign: 'center', height: 260 }}>
                        <div className='flip-question'>{title}</div>
                        {isQuestion ? <Button type='primary' onClick={flipCard}>Check Answer</Button> : <p>{description}</p>}
                    </Card>
                </div>
                {isQuestion &&
                    <div className="flip-card-back">
                        <Card title="Answer" bordered={false} style={{ textAlign: 'center', height: 260 }}>
                            <div className='flip-question'>{answer}</div>
                            {isQuestion && <Button onClick={flipCard}>Question</Button>}
                        </Card>
                    </div>}
            </div>
        </div>
    );
};

export default CardQuestion;
