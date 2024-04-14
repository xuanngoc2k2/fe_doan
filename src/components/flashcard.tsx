import { useState } from "react";
import { IVocabulary } from "../custom/type";
import { Card } from "antd";
import './styles/flashcard.scss'

function FlashCard({ word }: { word: IVocabulary }) {
    const [flipped, setFlipped] = useState<boolean>(false);

    const flipCard = () => {
        setFlipped(!flipped);
    };

    return (<>

        <div className="flash-card-container">
            <div className={`flip-card ${flipped ? 'isFlip' : ''}`}>
                <div className="flip-card-inner">
                    <div className="flip-card-front">
                        <Card onClick={flipCard} bordered={false} style={{ textAlign: 'center', height: 260 }}>
                            <div className='flip-question'>{word.word}</div>
                            {/* {isQuestion ? <Button type='primary' onClick={flipCard}>Check Answer</Button> : <p>{description}</p>} */}
                        </Card>
                    </div>
                    <div className="flip-card-back">
                        <Card onClick={flipCard} bordered={false} style={{ textAlign: 'center', height: 260 }}>
                            <div className='flip-question'>{word.image}</div>
                            {/* {isQuestion && <Button type='primary' ghost onClick={flipCard}>Question</Button>} */}
                        </Card>
                    </div>
                </div>
            </div>
        </div></>);
}

export default FlashCard;