import React from 'react';
import { Button, Card, Tag } from 'antd';
import './styles/card-exam.scss';
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

// interface CardExamProps {
//     title: string;
//     answer?: string;
//     isQuestion: boolean;
//     description?: string;
// }

const CardExam: React.FC = () => {

    return (
        <>
            <Link to={'/'}>
                <Card className='exam-card'>
                    <h2 className='exam-title'>
                        TOPIK I chính thức kì 31
                    </h2>
                    <div className='exam-info'>
                        <div className='exam-item-info'>
                            <span><ClockCircleOutlined /> 40 phút </span>
                            <span>| <UserOutlined /> 2546</span>
                        </div>
                        <div className='exam-item-info'>
                            <span>4 phần thi | 40 câu hỏi</span>
                        </div>
                    </div>
                    <div className='exam-tag-type'>
                        <Tag color="cyan">TOPIK I</Tag>
                    </div>
                    <div className='exam-buton'>
                        <Button block type='primary' ghost>Chi tiết</Button>
                    </div>
                </Card>
            </Link>
        </>
    );
};

export default CardExam;
