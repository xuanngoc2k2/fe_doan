/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Empty, Form, Input, message, notification, Popconfirm, Select, Space, Table, Tag, theme } from "antd"
import { Content } from "antd/es/layout/layout";
import { Option } from "antd/es/mentions";
import { useEffect, useState } from "react";
import { ICourse, IVocabulary } from "../../../custom/type";
import { backEndUrl, callDeleteCourse, deleteVocab, getAllVocabulary, getCourseDetail, getListCourses, getListVocabWithCourse, getVocabById, searchCourse } from "../../../apis";
import { ColumnType } from "antd/es/table";
import ModalVocab from "./modal-vocab";
// import { ActionType } from '@ant-design/pro-components';
import dayjs from 'dayjs';


const AdminVocabulary: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState<{ word: string, id: number, meaning: string, level: string[] } | null>();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [showModel, setShowModel] = useState(false);
    const [dataFix, setDataFix] = useState<IVocabulary | null>();
    const [listVocab, setListVocab] = useState<IVocabulary[] | []>([]);
    // const tableRef = useRef<ActionType>();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const fetch = async () => {
        setLoading(true);
        const rs = await getAllVocabulary();
        if (rs && rs.data) {
            setListVocab(rs.data)
            setLoading(false);
        }
        else {
            notification.error({
                message: "Đã xảy ra lỗi!",
                description:
                    rs.data.message,
                duration: 5
            })
        }
    }
    const handleDeleteVocab = async (_id: number | undefined) => {
        if (_id) {
            const res = await deleteVocab(_id);
            if (res && res.data) {
                message.success('Xóa từ vựng thành công');
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
        // setSearchLevel([])
    }

    useEffect(() => {
        fetch();
    }, [])
    const handelSearch = async () => {
        if (search) {
            setLoading(true);
            const res = await getAllVocabulary(search.id, search.word, search.meaning, search.level);
            if (res && res.data) {
                setListVocab(res.data)
            }
            else {
                notification.error({ message: "Đã xảy ra một số lỗi!" })
            }
            setLoading(false)
        }
    }
    const columns: ColumnType<IVocabulary>[] = [
        {
            key: '1',
            align: 'center',
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
            title: 'Từ',
            width: 200,
            dataIndex: 'word',
            sorter: (a: IVocabulary, b: IVocabulary) => {
                if (a.word! < b.word!) {
                    return -1;
                }
                if (a.word! > b.word!) {
                    return 1;
                }
                return 0;
            }
        },
        {
            key: '3',
            width: 200,
            title: 'Định nghĩa',
            dataIndex: 'meaning'
        },
        {
            key: '4',
            title: 'Level',
            dataIndex: 'level',
            render: (level: number) => {
                return (
                    <Tag color={
                        level === 1 ? 'cyan'
                            : level === 2 ? 'green'
                                : level === 3 ? 'orange'
                                    : level === 4 ? 'red'
                                        : level === 5 ? 'magenta'
                                            : level === 6 ? 'purple'  // Thêm màu mong muốn cho level 6
                                                : ''  // Màu mặc định khi level không nằm trong khoảng từ 0 đến 6
                    }>
                        TOPIK {level}
                    </Tag>
                );
            },
            sorter: (a: IVocabulary, b: IVocabulary) => {
                if (a.level! < b.level!) {
                    return -1;
                }
                if (a.level! > b.level!) {
                    return 1;
                }
                return 0;
            }
        },
        {
            key: '5',
            title: 'Hình ảnh',
            dataIndex: 'image',
            render: (image: string) => {
                return image ? (
                    <img width={100} src={`${backEndUrl}/images/vocabulary/${image}`} />
                ) : (
                    <Empty style={{ width: 100 }} />
                );
            }
        },
        {
            key: '6',
            title: 'Ví dụ',
            dataIndex: 'example',
            render: (example: string) => {
                return <p dangerouslySetInnerHTML={{ __html: example }}></p>
            }
        },
        {
            key: '8',
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: 110,
            sorter: (a: IVocabulary, b: IVocabulary) => {
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
            key: '9',
            title: 'Actions',
            align: 'center',
            render: (_: any, record: IVocabulary) => (
                <Space>
                    <EditOutlined
                        style={{
                            fontSize: 20,
                            color: '#ffa500',
                        }}
                        onClick={() => {
                            handleShowModel(record.id)
                        }}
                    />
                    <Popconfirm
                        placement="leftTop"
                        title={"Xác nhận xóa từ vựng"}
                        description={"Bạn có chắc chắn muốn xóa từ vựng này ?"}
                        onConfirm={() => handleDeleteVocab(record.id)}
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
    const handleShowModel = async (id?: number) => {
        if (id) {
            const res = await getVocabById(id);
            setDataFix(res.data)
        }
        else {
            setDataFix(null)
        }
        setShowModel(true)
    }
    const handelCancel = () => {
        fetch();
        setShowModel(false);
    }
    return (
        <>
            <Content style={{ padding: '0 48px', marginBottom: 20 }}>
                <div
                    style={{
                        background: colorBgContainer,
                        height: 150,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <div style={{ display: 'flex' }}>
                        <div>

                            <Form.Item
                                label="Từ"
                            >
                                <Input
                                    value={search?.word}
                                    onChange={(e) => setSearch((prev) => ({ ...prev!, word: e.target.value }))}
                                    placeholder="Nhập từ tìm kiếm"
                                    style={{ minWidth: 300 }} />
                            </Form.Item>
                            <Form.Item
                                label="Định nghĩa"
                            >
                                <Input
                                    value={search?.meaning}
                                    onChange={(e) => setSearch((prev) => ({ ...prev!, meaning: e.target.value }))}
                                    placeholder="Nhập định nghĩa tìm kiếm"
                                    style={{ minWidth: 300 }} />
                            </Form.Item>
                        </div>
                        {/* <Form.Item
                            label="Khóa học"
                            style={{ minWidth: 400, marginLeft: 20 }}
                        >
                            <Select
                                onChange={(value) => setSearch((prev) => ({ ...prev!, id: value }))}
                                placeholder="Chọn khóa học">
                                {dataListCourse.map((course) => {
                                    return (
                                        <Select.Option value={course.id}>{course.course_name}</Select.Option>)
                                })}
                            </Select>
                        </Form.Item> */}
                        <Form.Item
                            label="Level"
                            style={{ minWidth: 150, marginLeft: 20 }}
                        >
                            <Select onChange={(value) => setSearch((prev) => ({ ...prev!, level: value }))} value={search?.level} allowClear
                                mode={(search?.meaning == "" || search?.word == "") ? "multiple" : "tags"}
                                placeholder="Chọn level">
                                {/* <Option value="0">TOPIK 0</Option> */}
                                <Option value="1">TOPIK 1</Option>
                                <Option value="2">TOPIK 2</Option>
                                <Option value="3">TOPIK 3</Option>
                                <Option value="4">TOPIK 4</Option>
                                <Option value="5">TOPIK 5</Option>
                                <Option value="6">TOPIK 6</Option>
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
                            <b>Danh sách từ vựng</b>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button onClick={() => handleShowModel()} style={{ marginRight: 20 }} icon={<PlusOutlined />} type="primary">Thêm mới</Button>
                                <p onClick={fetch} style={{ cursor: 'pointer' }}><ReloadOutlined /></p>
                            </div>
                        </div>
                        <div style={{ marginTop: 10 }}>
                            <Table
                                loading={loading}
                                columns={columns}
                                dataSource={listVocab}
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
            {showModel && <ModalVocab data={dataFix} handelCancel={handelCancel} open={showModel} />}
        </>
    )
}
export default AdminVocabulary