/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BookOutlined, DeleteOutlined, EditOutlined, PlayCircleOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, notification, Popconfirm, Select, Space, Table, theme } from "antd"
import { Content } from "antd/es/layout/layout";
import { Option } from "antd/es/mentions";
import { useEffect, useState } from "react";
import { ICourse, ILesson } from "../../../custom/type";
import { backEndUrl, callDeleteCourse, deleteLesson, getCourseDetail, getLesson, getListCourses, getListLesson, searchLesson } from "../../../apis";
import { ColumnType } from "antd/es/table";
import ModalLesson from "./modal-lesson";
// import { ActionType } from '@ant-design/pro-components';
import dayjs from 'dayjs';


const AdminLesson: React.FC = () => {
    const [dataListLesson, setDataListLesson] = useState<ILesson[] | []>([]);
    const [dataListCourse, setDataListCourse] = useState<ICourse[] | []>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [searchByCourse, setSearchByCourse] = useState<number>();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [showModel, setShowModel] = useState(false);
    const [dataFix, setDataFix] = useState<ILesson | null>();
    // const tableRef = useRef<ActionType>();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const fetch = async () => {
        setLoading(true);
        const res = await getListLesson();
        const resp = await getListCourses();
        if (res && res.data && resp && resp.data) {
            setDataListLesson(res.data);
            setDataListCourse(resp.data);
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
    const handleDeleteLesson = async (_id: number | undefined) => {
        if (_id) {
            const res = await deleteLesson(_id);
            if (res && res.data) {
                message.success('Xóa bài học thành công');
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
        setSearchByCourse(undefined)
    }

    useEffect(() => {
        fetch();
    }, [])

    // const video = document.createElement('video');
    // video.src = `${backEndUrl}/video/testmp4.mp4`;
    // video.onloadedmetadata = function () {
    //     console.log('Video duration:', video.duration, 'seconds');
    // };
    const handelSearch = async () => {
        const res = await searchLesson(search, searchByCourse!)
        if (res && res.data) {
            setDataListLesson(res.data)
        }
        else {
            notification.error({
                message: 'Đã xáy ra lỗi'
            })
        }
    }
    const columns: ColumnType<ILesson>[] = [
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
            title: 'Tên bài học',
            dataIndex: 'lesson_name',
            sorter: (a: ILesson, b: ILesson) => {
                if (a.lesson_name < b.lesson_name) {
                    return -1;
                }
                if (a.lesson_name > b.lesson_name) {
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
            title: 'Thumbnail',
            dataIndex: 'thumbnail',
            render: (_: any, record: ILesson) => (
                <a href={`${backEndUrl}/video/${record.content}`} target="_blank">
                    <img width={100} src={`${backEndUrl}/images/lesson/${record.thumbnail}`} />
                </a>
            )
        },
        {
            key: '5',
            title: 'Thứ tự bài học',
            dataIndex: 'order',
            align: 'center',
            render: (content: string) => {
                return <p>{content}</p>
            }
        },
        {
            key: '6',
            title: 'Thời lượng',
            dataIndex: 'duration',
            align: 'center',
            render: (_: any, record: ILesson) => {
                return <p className="item-lesson-duration">{record.isQuestion ? <BookOutlined className="item-lesson-icon" /> : <PlayCircleOutlined className="item-lesson-icon" />}{record.duration}</p>

            }
        },
        {
            key: '9',
            title: 'Khóa học',
            dataIndex: 'course',
            align: 'center',
            render: (course: ICourse) => {
                return <p className="item-lesson-duration">{course && course.course_name}</p>

            }
        },
        {
            key: '7',
            title: 'Create at',
            dataIndex: 'createdAt',
            sorter: (a: ILesson, b: ILesson) => {
                if (a.createdAt! < b.createdAt!) {
                    return -1;
                }
                if (a.createdAt! > b.createdAt!) {
                    return 1;
                }
                return 0;
            },
            render: (a: ILesson) => {
                return <>{dayjs(a.createdAt).format('DD/MM/YYYY')}</>
            }
        },
        {
            key: '8',
            title: 'Actions',
            render: (_: any, record: ILesson) => (
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
                        title={"Xác nhận xóa bài học"}
                        description={"Bạn có chắc chắn muốn xóa bài học này ?"}
                        onConfirm={() => handleDeleteLesson(record.id)}
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
            const res = await getLesson(id);
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
                            label="Tên bài học"
                        >
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Nhập tên bài học tìm kiếm"
                                style={{ minWidth: 300 }} />
                        </Form.Item>
                        <Form.Item
                            label="Khóa học"
                            style={{ minWidth: 350, marginLeft: 20 }}
                        >
                            <Select onChange={(value) => setSearchByCourse(value)} value={searchByCourse} allowClear
                                placeholder="Chọn khóa học">
                                {dataListCourse.map((course) => {
                                    return (
                                        <Option value={`${course.id}`}>{course.course_name}</Option>
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
                            <b>Danh sách bài học</b>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button onClick={() => handleShowModel()} style={{ marginRight: 20 }} icon={<PlusOutlined />} type="primary">Thêm mới</Button>
                                <p onClick={fetch} style={{ cursor: 'pointer' }}><ReloadOutlined /></p>
                            </div>
                        </div>
                        <div style={{ marginTop: 10 }}>
                            <Table
                                loading={loading}
                                columns={columns}
                                dataSource={dataListLesson}
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
            {showModel && <ModalLesson dataListCourse={dataListCourse} data={dataFix} open={showModel} handelCancel={handelCancel} />}
        </>
    )
}
export default AdminLesson