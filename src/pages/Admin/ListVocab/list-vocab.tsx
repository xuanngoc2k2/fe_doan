/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, notification, Popconfirm, Select, Space, Table, Tag, theme } from "antd"
import { Content } from "antd/es/layout/layout";
import { Option } from "antd/es/mentions";
import { useEffect, useState } from "react";
import { ICourse, IListVocab, IListVocabDetail, IVocabulary } from "../../../custom/type";
import { backEndUrl, callDeleteCourse, deleteList, deleteVocab, getAllListVocab, getAllVocabulary, getCourseDetail, getListCourses, getListVocabWithCourse, getVocabById, searchCourse } from "../../../apis";
import { ColumnType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import ModalList from "./modal-list";
// import { ActionType } from '@ant-design/pro-components';
import dayjs from 'dayjs';


const AdminListVocab: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState<string>();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [showModel, setShowModel] = useState(false);
    const [dataFix, setDataFix] = useState<IListVocabDetail | null>();
    const [listVocab, setListVocab] = useState<IListVocabDetail[] | []>([]);
    // const tableRef = useRef<ActionType>();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navigator = useNavigate();
    const fetch = async () => {
        setLoading(true);
        const res = await getAllListVocab();
        if (res && res.data) {
            setListVocab(res.data);
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
    const handleDeleteListVocab = async (_id: number | undefined) => {
        if (_id) {
            const res = await deleteList(_id + '');
            if (res && res.data) {
                message.success('Xóa danh sách từ vựng thành công');
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
        fetch();
        // setSearchLevel([])
    }

    useEffect(() => {
        fetch();
    }, [])
    const handelSearch = async () => {
        if (search?.trim() != '') {
            setLoading(true);
            const res = await getAllListVocab(search);
            if (res && res.data) {
                setListVocab(res.data)
            }
            else {
                notification.error({ message: "Đã xảy ra một số lỗi!" })
            }
            setLoading(false)
        }
    }
    const columns: ColumnType<IListVocabDetail>[] = [
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
            title: 'Tên danh sách',
            width: 200,
            dataIndex: 'name',
            sorter: (a: IListVocabDetail, b: IListVocabDetail) => {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
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
            title: 'Tổng số từ',
            dataIndex: 'totalWords',
            width: 200,
            sorter: (a: IListVocabDetail, b: IListVocabDetail) => {
                if (a.totalWords! < b.totalWords!) {
                    return -1;
                }
                if (a.totalWords! > b.totalWords!) {
                    return 1;
                }
                return 0;
            }
        },
        {
            key: '5',
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: 200,
            sorter: (a: IListVocabDetail, b: IListVocabDetail) => {
                if (a.createdAt! < b.createdAt!) {
                    return -1;
                }
                if (a.createdAt! > b.createdAt!) {
                    return 1;
                }
                return 0;
            },
            render: (a: string) => {
                console.log(a);
                return <>{dayjs(a).format('DD/MM/YYYY')}</>
            }
        },
        {
            key: '6',
            title: 'Actions',
            align: 'center',
            width: 100,
            render: (_: any, record: IListVocabDetail) => (
                <Space>
                    <InfoCircleOutlined
                        style={{
                            fontSize: 20,
                            color: '#1677ff',
                            cursor: "pointer", margin: "0 10px"
                        }}
                        onClick={() => { navigator(`${record.id}`) }}
                    />
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
                        description={"Bạn có chắc chắn muốn xóa danh sách từ vựng này ?"}
                        onConfirm={() => handleDeleteListVocab(record.id)}
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
            const res = listVocab.find((list) => list.id == id)
            setDataFix(res as IListVocabDetail)
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
                        height: 100,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <div style={{ display: 'flex' }}>
                        <div>

                            <Form.Item
                                label="Tên danh sách"
                            >
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Nhập tên danh sách tìm kiếm"
                                    style={{ minWidth: 300 }} />
                            </Form.Item>
                        </div>
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
            {showModel && <ModalList data={dataFix} open={showModel} handelCancel={handelCancel} />}
        </>
    )
}
export default AdminListVocab