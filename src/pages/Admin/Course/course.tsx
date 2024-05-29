/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, notification, Popconfirm, Select, Space, Table, Tag, theme } from "antd"
import { Content } from "antd/es/layout/layout";
import { Option } from "antd/es/mentions";
import { useEffect, useState } from "react";
import { ICourse } from "../../../custom/type";
import { backEndUrl, callDeleteCourse, getCourseDetail, getCourseWithLessons, getListCourses, searchCourse } from "../../../apis";
import ModalCourse from "./modal-course";
import { render } from "react-dom";
// import { ActionType } from '@ant-design/pro-components';
import dayjs from 'dayjs';


const AdminCourse: React.FC = () => {
    const [dataListCourse, setDataListCourse] = useState<ICourse[] | []>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [searchLevel, setSearchLevel] = useState<number[] | []>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [showModel, setShowModel] = useState(false);
    const [dataFix, setDataFix] = useState<ICourse | null>();
    // const tableRef = useRef<ActionType>();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const fetch = async () => {
        setLoading(true);
        const res = await getListCourses();
        if (res && res.data) {
            setDataListCourse(res.data);
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
    const handleDeleteCourse = async (_id: number | undefined) => {
        if (_id) {
            const res = await callDeleteCourse(_id);
            if (res && res.data) {
                message.success('Xóa khóa học thành công');
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
        setSearchLevel([])
    }

    useEffect(() => {
        fetch();
    }, [])
    const handelSearch = async () => {
        const res = await searchCourse(search, searchLevel)
        if (res && res.data) {
            setDataListCourse(res.data)
        }
        else {
            notification.error({
                message: 'Đã xáy ra lỗi'
            })
        }
    }
    const columns = [
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
            title: 'Tên khóa học',
            dataIndex: 'course_name',
            sorter: (a: ICourse, b: ICourse) => {
                if (a.course_name < b.course_name) {
                    return -1;
                }
                if (a.course_name > b.course_name) {
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
            title: 'Level',
            dataIndex: 'level_required',
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
            sorter: (a: ICourse, b: ICourse) => {
                if (a.level_required! < b.level_required!) {
                    return -1;
                }
                if (a.level_required! > b.level_required!) {
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
                return <img width={100} src={backEndUrl + '/images/course/' + image} />
            }
        },
        {
            key: '6',
            title: 'Create at',
            dataIndex: 'createdAt',
            sorter: (a: ICourse, b: ICourse) => {
                if (a.createdAt! < b.createdAt!) {
                    return -1;
                }
                if (a.createdAt! > b.createdAt!) {
                    return 1;
                }
                return 0;
            },
            render: (a: ICourse) => {
                return <>{dayjs(a.createdAt).format('DD/MM/YYYY')}</>
            }
        },
        {
            key: '7',
            title: 'Actions',
            render: (_: any, record: ICourse) => (
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
                        title={"Xác nhận xóa khóa học"}
                        description={"Bạn có chắc chắn muốn xóa khóa học này ?"}
                        onConfirm={() => handleDeleteCourse(record.id)}
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
            const res = await getCourseWithLessons(id);
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
                        height: 100,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <div style={{ display: 'flex' }}>
                        <Form.Item
                            label="Tên khóa học"
                        >
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Nhập tên khóa học tìm kiếm"
                                style={{ minWidth: 300 }} />
                        </Form.Item>
                        <Form.Item
                            label="Level"
                            style={{ minWidth: 150, marginLeft: 20 }}
                        >
                            <Select onChange={(value) => setSearchLevel(value)} value={searchLevel} allowClear
                                mode={search == "" ? "multiple" : "tags"}
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
                            <b>Danh sách Khóa học</b>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button onClick={() => handleShowModel()} style={{ marginRight: 20 }} icon={<PlusOutlined />} type="primary">Thêm mới</Button>
                                <p onClick={fetch} style={{ cursor: 'pointer' }}><ReloadOutlined /></p>
                            </div>
                        </div>
                        <div style={{ marginTop: 10 }}>
                            <Table
                                loading={loading}
                                columns={columns}
                                dataSource={dataListCourse}
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
            {showModel && <ModalCourse data={dataFix} open={showModel} handelCancel={handelCancel} />}
        </>
    )
}
export default AdminCourse