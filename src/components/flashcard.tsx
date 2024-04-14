import { useState } from "react";
import { IVocabulary } from "../custom/type";
import { Card, Empty, Tag, Tooltip } from "antd";
import './styles/flashcard.scss'
import { backEndUrl } from "../apis";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

function FlashCard({
    word,
    isRemember,
    handelUpdateRemember }
    :
    {
        word: IVocabulary,
        isRemember: boolean,
        handelUpdateRemember: (id: number) => void,
    }) {
    const [flipped, setFlipped] = useState<boolean>(false);
    const flipCard = () => {
        setFlipped(!flipped);
    };
    // const handelSetIcon = () => {
    //     setIconIsRemember(!iconIsRemember)
    // }
    return (<>

        <div className="flash-card-container">
            <div className={`flip-card ${flipped ? 'isFlip' : ''}`}>
                <div className="flip-card-inner">
                    <div className="flip-card-front">
                        {<div onClick={() => { handelUpdateRemember(Number(word.id)); }}>
                            {<Tooltip title={`Nhấn để đánh dấu ${isRemember ? 'chưa' : 'đã'} thuộc`}>
                                {!isRemember ? <CheckCircleOutlined
                                    className="btn-remembered done" /> :
                                    <CloseCircleOutlined
                                        className="btn-remembered not" style={{ position: 'absolute' }} />}
                            </Tooltip>}
                        </div>
                        }
                        {/* {!iconIsRemember ?
                            <Tooltip title="Nhấn để đánh dấu đã thuộc"><CheckCircleOutlined
                                onClick={() => { handelRemember(Number(word.id)); setIconIsRemember(!iconIsRemember) }}
                                className="btn-remembered done" /></Tooltip> :
                            <Tooltip title="Nhấn để đánh dấu chưa thuộc"><CloseCircleOutlined
                                onClick={() => { handleNotRemember(Number(word.id)); setIconIsRemember(!iconIsRemember) }}
                                className="btn-remembered not" style={{ position: 'absolute' }} /></Tooltip>
                        } */}
                        <Card onClick={flipCard} bordered={false} style={{ textAlign: 'center', height: 260 }}>
                            <div className='flip-question'>{word.word}</div>
                            <p className='vocab-pronunciation'>[{word.spell}] </p>
                            {/* {isQuestion ? <Button type='primary' onClick={flipCard}>Check Answer</Button> : <p>{description}</p>} */}
                        </Card>
                    </div>
                    <div className="flip-card-back">
                        {<div onClick={() => { handelUpdateRemember(Number(word.id)); }}>
                            {<Tooltip title={`Nhấn để đánh dấu ${isRemember ? 'chưa' : 'đã'} thuộc`}>
                                {!isRemember ? <CheckCircleOutlined
                                    className="btn-remembered done" /> :
                                    <CloseCircleOutlined
                                        className="btn-remembered not" style={{ position: 'absolute' }} />}
                            </Tooltip>}
                        </div>}
                        <Card onClick={flipCard} bordered={false} style={{ textAlign: 'center', height: 260 }}>
                            <div style={{ display: 'flex', width: '100%' }}>
                                <div className="flash-card-word-info">
                                    <p className='vocab-meaning'>{word.meaning}</p>
                                    <Tag color='green'>TOPIK {word.level}</Tag>
                                    {word.example && (
                                        <><p>Example:</p>
                                            <p style={{ marginLeft: 20, textAlign: 'left' }}><ul>{word.example.split('\n').map((ex) => <li>{ex}</li>)}</ul></p></>)}
                                </div>
                                <div style={{ width: '50%' }} className='vocab-image'>
                                    {word.image !== null ? <img style={{ width: '100%' }} src={`${backEndUrl}/images/vocabulary/${word.image}`} /> : <Empty />}
                                </div>
                            </div>
                            {/* <div className='flip-question'>{word.image}</div> */}
                            {/* {isQuestion && <Button type='primary' ghost onClick={flipCard}>Question</Button>} */}
                        </Card>
                    </div>
                </div >
            </div >
        </div ></>);
}

export default FlashCard;