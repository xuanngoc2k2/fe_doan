import React from 'react';
import { Button, Card, Tag } from 'antd';
import './styles/card-exam.scss';
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

interface CardExamProps {
    exam: {
        id: number;
        exam_name: string;
        description: string;
        duration: number;
        countUser: number;
        countTypeQuestion: number;
        countQuestion: number;
        type: string
    }
}

const CardExam: React.FC<CardExamProps> = ({ exam }) => {

    return (
        <>
            <Link to={`/exam/${exam.id}`}>
                <Card className='exam-card'>
                    <h2 className='exam-title'>
                        {exam.exam_name}
                    </h2>
                    <div className='exam-info'>
                        <div className='exam-item-info'>
                            <span><ClockCircleOutlined /> {exam.duration} phút </span>
                            <span>| <UserOutlined /> {exam.countUser}</span>
                        </div>
                        <div className='exam-item-info'>
                            <span>{exam.countTypeQuestion} phần thi | {exam.countQuestion} câu hỏi</span>
                        </div>
                    </div>
                    <div className='exam-tag-type'>
                        <Tag color="cyan">{exam.type}</Tag>
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
