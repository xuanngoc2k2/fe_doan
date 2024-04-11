import React from 'react';
import './styles/exam-ranking.scss';
import { Avatar, Card, Table, Tooltip } from 'antd';
import { UserOutlined } from '@ant-design/icons';
interface ExamListProps {
    data: { image?: string; full_name: string; score: number; date: string; }[];
}

const ExamRanking: React.FC<ExamListProps> = ({ data }) => {
    const dataSource = data.map((item, index) => ({ ...item, index: index + 1 }));

    return (
        <>
            <Card
                style={
                    {
                        marginBlockEnd: 'auto',
                        width: 370
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
                        key="full_name"
                        render={(record: { image?: string; full_name: string }) => {
                            return <div style={{ textAlign: 'left' }}>
                                {record.image ? (
                                    <Avatar src={record.image} alt={record.full_name} size={32} />
                                ) : (
                                    <Avatar size={32} icon={<UserOutlined />} />
                                )}
                                <span> {record.full_name}</span>
                            </div>
                        }
                        }
                    />
                    <Table.Column
                        align='center'
                        title="Điểm" dataIndex="score" key="score" />
                    <Table.Column
                        align='center'
                        title="Ngày thi" dataIndex="date" key="date"
                        render={(value: string) => {
                            if (value.length > 15) {
                                return <Tooltip title={value}>{value.slice(0, 15) + '...'}
                                </Tooltip>
                            }
                            return value;
                        }} />
                </Table>
            </Card>
        </>
    );
};

export default ExamRanking;
