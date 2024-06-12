/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, notification, Popconfirm, Select, Space, Table, Tag, theme } from "antd"
import { Content } from "antd/es/layout/layout";
import { Option } from "antd/es/mentions";
import { useEffect, useState } from "react";
import { IGroupQuestion, ILesson, IQuestion } from "../../../custom/type";
import { backEndUrl, deleteLesson, deleteQuestion, getAllGroupQuestion, getAllQuestionByGroupQuestion, getLesson, getListQuestion, searchQuestion } from "../../../apis";
import { ColumnType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
// import { ActionType } from '@ant-design/pro-components';
import dayjs from 'dayjs';


const AdminQuestion: React.FC = () => {
    const [dataListQuestion, setDataListQuestion] = useState<IQuestion[] | []>([]);
    const [dataListGroupQuestion, setDataListGroupQuestion] = useState<IGroupQuestion[] | []>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState<{ search: string, groupQuestion: number, type: string } | null>();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const navigator = useNavigate();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const fetch = async () => {
        setLoading(true);
        const res = await getAllGroupQuestion();
        const resp = await getListQuestion();
        if (res && res.data && resp && resp.data) {
            setDataListQuestion(resp.data)
            setDataListGroupQuestion(res.data);
            setLoading(false);
        }
        else {
            notification.error({
                message: "Đã xảy ra lỗi!",
                description:
                    res.data.message,
                duration: 5
            })
        }
    }
    // const reloadTable = () => {
    //     tableRef?.current?.reload();
    // }
    const handleDeleteQuestion = async (_id: number | undefined) => {
        if (_id) {
            const res = await deleteQuestion(_id);
            if (res && res.data) {
                message.success('Xóa câu hỏi thành công');
                fetch();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.data.message
                });
            }
        }
    }

    const handleResetSearch = () => {
        setSearch(null);
        fetch();
    }

    useEffect(() => {
        fetch();
    }, [])
    const handelSearch = async () => {
        if (search) {
            const res = await searchQuestion(search!)
            if (res && res.data) {
                setDataListQuestion(res.data)
            }
            else {
                notification.error({
                    message: 'Đã xáy ra lỗi'
                })
            }
        }
    }
    const columns: ColumnType<IQuestion>[] = [
        {
            key: '1',
            title: "STT",
            width: 50,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: (_text: any, _record: any, index: number) => {
                return (
                    <>
                        {(index + 1) + (page - 1) * (pageSize)}
                    </>)
            },
        },
        {
            key: '2',
            title: 'Câu hỏi',
            dataIndex: 'question',
            sorter: (a: IQuestion, b: IQuestion) => {
                if (a.question < b.question) {
                    return -1;
                }
                if (a.question > b.question) {
                    return 1;
                }
                return 0;
            }
        },
        {
            key: '3',
            title: 'Level',
            dataIndex: 'level'
        },
        {
            key: '4',
            title: 'Loại câu hỏi',
            dataIndex: 'type'
        },
        {
            key: '5',
            title: 'Điểm',
            dataIndex: 'score',
            align: 'center',
        },
        {
            key: '6',
            title: 'Nhóm câu hỏi',
            render: (_: any, record: IQuestion) => {
                return <p>{record.group_question?.content}</p>
            }
        },
        {
            key: '7',
            title: 'Mô tả',
            render: (_: any, record: IQuestion) => {
                return <p>{record.group_question?.description}</p>
            }
        },
        {
            key: '8',
            title: 'Loại câu hỏi',
            render: (_: any, record: IQuestion) => {
                return <Tag color={record.group_question?.type == 'Reading' ? 'cyan' : 'magenta'}>{record.group_question?.type}</Tag>
            }
        },
        {
            key: '9',
            title: 'Ngày tạo',
            width: 110,
            dataIndex: 'createdAt',
            sorter: (a: IQuestion, b: IQuestion) => {
                if (a.createdAt! < b.createdAt!) {
                    return -1;
                }
                if (a.createdAt! > b.createdAt!) {
                    return 1;
                }
                return 0;
            },
            render: (a: string) => {
                return <>{dayjs(a).format('DD/MM/YYYY')}</>
            }
        },
        {
            key: '10',
            title: 'Actions',
            render: (_: any, record: IQuestion) => (
                <Space>
                    <InfoCircleOutlined
                        style={{
                            fontSize: 20,
                            color: '#1677ff',
                        }}
                        onClick={() => { navigator(`${record.id}`) }}
                    />
                    <Popconfirm
                        placement="leftTop"
                        title={"Xác nhận xóa câu hỏi"}
                        description={"Bạn có chắc chắn muốn xóa câu hỏi này ?"}
                        onConfirm={() => handleDeleteQuestion(record.id)}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <span style={{ cursor: "pointer", margin: "0 10px" }}>
                            <DeleteOutlined
                                style={{
                                    fontSize: 20,
                                    color: '#ff4d4f',
                                }}
                            />
                        </span>
                    </Popconfirm>
                </Space>
            ),
        },
    ]
    return (
        <>
            <Content style={{ padding: '0 48px', marginBottom: 20 }}>
                <div
                    style={{
                        background: colorBgContainer,
                        height: 130,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <div style={{ display: 'flex' }}>
                        <div>
                            <Form.Item
                                name={'question'}
                                label="Câu hỏi"
                                rules={[{
                                    required: true
                                }]}
                            >
                                <Input
                                    value={search?.search}
                                    onChange={(e) => setSearch((prev) => ({ ...prev!, search: e.target.value }))}
                                    placeholder="Nhập câu hỏi tìm kiếm"
                                    style={{ minWidth: 300 }} />
                            </Form.Item>
                            <Form.Item
                                label="Loại câu hỏi"
                                style={{ minWidth: 120 }}
                            >
                                <Select onChange={(value) => setSearch((prev) => ({ ...prev!, type: value }))} value={search?.type} allowClear
                                    placeholder="Chọn loại câu hỏi">
                                    <Option value={`Reading`}>Reading</Option>
                                    <Option value={`Listening`}>Listening</Option>
                                </Select>
                            </Form.Item>
                        </div>
                        <Form.Item
                            label="Nhóm câu hỏi"
                            style={{ minWidth: 350, maxWidth: 700, marginLeft: 20 }}
                        >
                            <Select onChange={(value) => setSearch((prev) => ({ ...prev!, groupQuestion: value }))} value={search?.groupQuestion} allowClear
                                placeholder="Chọn nhóm câu hỏi">
                                {dataListGroupQuestion.map((groupQuestion) => {
                                    return (
                                        <Option value={`${groupQuestion.id}`}>{groupQuestion.content}</Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                    </div>
                    <div>
                        <Button onClick={handleResetSearch}>Làm lại</Button>
                        <Button onClick={handelSearch} type="primary" style={{ marginLeft: 20 }}>Tìm kiếm</Button>
                    </div>
                </div>
                <div
                    style={{
                        marginTop: 20,
                        background: colorBgContainer,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <b>Danh sách câu hỏi</b>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button onClick={() => {
                                    navigator('create-new')
                                }} style={{ marginRight: 20 }} icon={<PlusOutlined />} type="primary">Thêm mới</Button>
                                <p onClick={fetch} style={{ cursor: 'pointer' }}><ReloadOutlined /></p>
                            </div>
                        </div>
                        <div style={{ marginTop: 10 }}>
                            <Table
                                loading={loading}
                                columns={columns}
                                dataSource={dataListQuestion}
                                pagination={{
                                    current: page,
                                    pageSize: pageSize,
                                    onChange: (page, pageSize) => {
                                        setPage(page);
                                        setPageSize(pageSize);
                                    },
                                    showSizeChanger: false,
                                    showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                                }}
                            >
                            </Table>
                        </div>
                    </div>
                </div>
            </Content>
        </>
    )
}
export default AdminQuestion