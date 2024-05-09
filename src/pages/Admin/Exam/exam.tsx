/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification, Popconfirm, Select, Space, Table, theme } from "antd"
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { IExam } from "../../../custom/type";
import { deleteExam, getListExams, searchExam } from "../../../apis";
import { ColumnType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
// import { ActionType } from '@ant-design/pro-components';


const AdminExam: React.FC = () => {
    const [dataListExam, setDataListExam] = useState<IExam[] | []>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [searchByType, setSearchByType] = useState<string>();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const navigator = useNavigate();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const fetch = async () => {
        setLoading(true);
        const res = await getListExams();
        if (res && res.data) {
            setDataListExam(res.data);
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
    const handleDeleteExam = async (_id: number | undefined) => {
        if (_id) {
            const res = await deleteExam(_id);
            if (res && res.data) {
                notification.success({ message: 'Xóa bài thi thành công' });
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
        setSearch('');
        setSearchByType(undefined)
    }

    useEffect(() => {
        fetch();
    }, [])

    const handelSearch = async () => {
        const res = await searchExam(search, searchByType!)
        if (res && res.data) {
            setDataListExam(res.data)
        }
        else {
            notification.error({
                message: 'Đã xáy ra lỗi'
            })
        }
    }

    const columns: ColumnType<IExam>[] = [
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
            title: 'Tên bài thi',
            dataIndex: 'exam_name',
            sorter: (a: IExam, b: IExam) => {
                if (a.exam_name < b.exam_name) {
                    return -1;
                }
                if (a.exam_name > b.exam_name) {
                    return 1;
                }
                return 0;
            }
        },
        {
            key: '3',
            title: 'Mô tả',
            dataIndex: 'description'
        },
        {
            key: '4',
            title: 'Thời gian',
            dataIndex: 'duration',
        },
        {
            key: '5',
            title: 'Bắt đầu từ',
            dataIndex: 'startAt',
        },
        {
            key: '6',
            title: 'Kết thúc vào',
            dataIndex: 'endAt',
        },
        {
            key: '7',
            title: 'Loại bài thi',
            dataIndex: 'type',
        },
        {
            key: '8',
            title: 'Create at',
            dataIndex: 'createdAt',
            sorter: (a: IExam, b: IExam) => {
                if (a.createdAt! < b.createdAt!) {
                    return -1;
                }
                if (a.createdAt! > b.createdAt!) {
                    return 1;
                }
                return 0;
            }
        },
        {
            key: '9',
            title: 'Actions',
            render: (_: any, record: IExam) => (
                <Space>
                    <EditOutlined
                        style={{
                            fontSize: 20,
                            color: '#ffa500',
                        }}
                        onClick={() => {
                            navigator(`${record.id}`)
                            console.log(_, record)
                            // handlexShowModel(record.id)
                        }}
                    />
                    <Popconfirm
                        placement="leftTop"
                        title={"Xác nhận xóa bài thi"}
                        description={"Bạn có chắc chắn muốn xóa bài thi này ?"}
                        onConfirm={() => handleDeleteExam(record.id)}
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
                        height: 100,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <div style={{ display: 'flex' }}>
                        <Form.Item
                            label="Tên bài thi"
                        >
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Nhập tên bài thi tìm kiếm"
                                style={{ minWidth: 300 }} />
                        </Form.Item>
                        <Form.Item
                            label="Loại bài thi"
                            style={{ minWidth: 350, marginLeft: 20 }}
                        >
                            <Select onChange={(value) => setSearchByType(value)} value={searchByType} allowClear
                                placeholder="Chọn loại bài thi">
                                <Select.Option value={`Topik I`}>Topik I</Select.Option>
                                <Select.Option value={`Topik II`}>Topik II</Select.Option>
                                <Select.Option value={`EPS`}>EPS</Select.Option>
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
                            <b>Danh sách bài thi</b>
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
                                dataSource={dataListExam}
                                pagination={{
                                    current: page,
                                    pageSize: pageSize,
                                    onChange: (page, pageSize) => {
                                        setPage(page);
                                        setPageSize(pageSize);
                                    },
                                    // showSizeChanger: true,
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
export default AdminExam