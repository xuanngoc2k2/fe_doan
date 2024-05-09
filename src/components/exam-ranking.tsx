import React from 'react';
import './styles/exam-ranking.scss';
import { Avatar, Card, Table, Tooltip } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { backEndUrl } from '../apis';
interface ExamListProps {
    data: {
        id?: number;
        score: number;
        full_name: string;
        userId: number,
        // "examId": 1,
        // "count": 2,
        createdAt: string,
        // "deletedAt": null,
        user: {
            id: number,
            full_name: string,
            image: string
        }
    }[];
}
const dateFormat = 'DD/MM/YYYY';
dayjs.extend(customParseFormat);
const ExamRanking: React.FC<ExamListProps> = ({ data }) => {
    const dataSource = data.map((item, index) => ({ ...item, index: index + 1 }));

    return (
        <>
            {data && <Card
                style={
                    {
                        marginBlockEnd: 'auto',
                        width: 400
                    }
                }
                className='exam-ranking-card'
                styles={{
                    title: {
                        textAlign: 'center'
                    }
                }} title="Bảng xếp hạng"
            >
                <Table className='exam-ranking-table' dataSource={dataSource} pagination={false}>
                    <Table.Column
                        title="STT"
                        dataIndex="index"
                        key="index"
                        render={(text: unknown, record: unknown, index: number) => index + 1}
                    />
                    <Table.Column
                        align='center'
                        title="Họ và tên"
                        dataIndex="user"
                        key="full_name"
                        render={(record: { image?: string; full_name: string }) => {
                            return <div style={{ textAlign: 'left' }}>
                                {record.image ? (
                                    <Avatar src={`${backEndUrl}/images/users/${record.image}`} alt={record.full_name} size={32} />
                                ) : (
                                    <Avatar size={32} icon={<UserOutlined />} />
                                )}
                                <span style={{ marginLeft: 10 }}> {record.full_name}</span>
                            </div>
                        }
                        }
                    />
                    <Table.Column
                        align='center'
                        title="Điểm" dataIndex="score" key="score" />
                    <Table.Column
                        align='center'
                        title="Ngày thi" dataIndex="createdAt" key="date"
                        render={(value: string) => {
                            return <Tooltip
                                title={dayjs(value, { format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }).format(dateFormat)}
                            >
                                {dayjs(value, { format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }).format(dateFormat)}
                            </Tooltip>
                        }} />
                </Table>
            </Card>}
        </>
    );
};

export default ExamRanking;
