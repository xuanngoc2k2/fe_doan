/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Empty, Form, Input, message, notification, Popconfirm, Select, Space, Table, Tag, theme } from "antd"
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { INews, IVocabulary } from "../../../custom/type";
import { backEndUrl, deleteNews, getAllNews, getNewsById, getVocabById, searchNews } from "../../../apis";
import { ColumnType } from "antd/es/table";
import ModalNews from "./new-modal";
// import { ActionType } from '@ant-design/pro-components';
import dayjs from 'dayjs';


const AdminNews: React.FC = () => {
    const [dataListNews, setDataListNews] = useState<INews[] | []>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState<string>();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [showModel, setShowModel] = useState(false);
    const [dataFix, setDataFix] = useState<INews | null>();
    // const tableRef = useRef<ActionType>();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const fetch = async () => {
        setLoading(true);
        const res = await getAllNews();
        if (res && res.data) {
            setDataListNews(res.data);
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
    const handleDeleteNews = async (_id: number | undefined) => {
        if (_id) {
            const res = await deleteNews(_id);
            if (res && res.data) {
                message.success('Xóa tin tức thành công');
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
        // setSearchLevel([])
    }

    useEffect(() => {
        fetch();
    }, [])
    const handelSearch = async () => {
        if (search) {
            setLoading(true);
            const res = await searchNews(search);
            if (res && res.data) {
                setDataListNews(res.data)
            }
            else {
                notification.error({ message: "Đã xảy ra một số lỗi!" })
            }
            setLoading(false)
        }
    }
    const columns: ColumnType<INews>[] = [
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
            title: 'Content',
            dataIndex: 'content',
            render: (content: string) => {
                return <p dangerouslySetInnerHTML={{ __html: content }}></p>
            },
            sorter: (a: INews, b: INews) => {
                if (a.content! < b.content!) {
                    return -1;
                }
                if (a.content! > b.content!) {
                    return 1;
                }
                return 0;
            }
        },
        {
            key: '3',
            title: 'Hình ảnh',
            dataIndex: 'image',
            render: (image: string) => {
                return image ? (
                    <img width={100} src={backEndUrl + '/images/news/' + image} />
                ) : (
                    <Empty style={{ width: 100 }} />
                );
            }
        },
        {
            key: '4',
            title: 'Create at',
            dataIndex: 'createdAt',
            sorter: (a: INews, b: INews) => {
                if (a.createdAt! < b.createdAt!) {
                    return -1;
                }
                if (a.createdAt! > b.createdAt!) {
                    return 1;
                }
                return 0;
            },
            render: (a: INews) => {
                return <>{dayjs(a.createdAt).format('DD/MM/YYYY')}</>
            }
        },
        {
            key: '5',
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
                        title={"Xác nhận xóa tin tức"}
                        description={"Bạn có chắc chắn muốn xóa tin tức này ?"}
                        onConfirm={() => handleDeleteNews(record.id)}
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
            const res = await getNewsById(id);
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
                        minHeight: 100,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <Form.Item
                        label="Tin tức"
                        style={{ width: '80%' }}
                    >
                        <Input.TextArea
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Nhập tin tức tìm kiếm"
                        />
                    </Form.Item>
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
                            <b>Danh sách tin tức</b>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button onClick={() => handleShowModel()} style={{ marginRight: 20 }} icon={<PlusOutlined />} type="primary">Thêm mới</Button>
                                <p onClick={fetch} style={{ cursor: 'pointer' }}><ReloadOutlined /></p>
                            </div>
                        </div>
                        <div style={{ marginTop: 10 }}>
                            <Table
                                loading={loading}
                                columns={columns}
                                dataSource={dataListNews}
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
            {showModel && <ModalNews data={dataFix} handelCancel={handelCancel} open={showModel} />}
        </>
    )
}
export default AdminNews