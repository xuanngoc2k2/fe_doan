/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Checkbox, Empty, Form, Input, Modal, notification, Select, Tag, theme, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { IVocabulary } from "../../../custom/type";
import {
    addVocabOfList,
    backEndUrl,
    getVocabNotOfList,
} from "../../../apis";
import Table, { ColumnType } from "antd/es/table";
import { Option } from "antd/es/mentions";

function ModalListVocab({ open, handelCancel, idList }: { open: boolean, handelCancel: () => void, idList?: number }) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(true);
    const [listVocab, setListVocab] = useState<IVocabulary[] | []>([]);
    const [selectedVocab, setSelectedVocab] = useState<IVocabulary[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [search, setSearch] = useState<{ word: string, id: number, meaning: string, level: string[] } | null>();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const fetch = async () => {
        setLoading(true);
        const rs = await getVocabNotOfList(Number(idList));
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
    useEffect(() => {
        fetch();
    }, [])
    const handleCheckboxChange = (record: IVocabulary, checked: boolean) => {
        if (checked) {
            setSelectedVocab([...selectedVocab, record]);
        } else {
            setSelectedVocab(selectedVocab.filter(item => item.id !== record.id));
        }
    };
    const handleSelectAll = (checked: boolean) => {
        setSelectAll(checked);
        if (checked) {
            setSelectedVocab([...listVocab]);
        } else {
            setSelectedVocab([]);
        }
    };

    const columns: ColumnType<IVocabulary>[] = [
        {
            key: '1',
            align: 'center',
            width: 100,
            title: (
                <div>
                    <Tooltip title="Chọn tất cả"><Checkbox checked={selectAll} onChange={(e) => handleSelectAll(e.target.checked)}>
                    </Checkbox></Tooltip>
                </div>
            ),
            render: (_text, record) => (
                <Checkbox
                    onChange={(e) => handleCheckboxChange(record, e.target.checked)}
                    checked={selectedVocab.some(item => item.id === record.id)}
                />
            ),
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
            key: '7',
            title: 'Create at',
            dataIndex: 'createdAt',
            sorter: (a: IVocabulary, b: IVocabulary) => {
                if (a.createdAt! < b.createdAt!) {
                    return -1;
                }
                if (a.createdAt! > b.createdAt!) {
                    return 1;
                }
                return 0;
            }
        }
    ]
    const handleSumbit = async () => {
        if (selectedVocab.length) {
            const res = await addVocabOfList(selectedVocab, Number(idList));
            if (res && res.data) {
                notification.success({ message: "Thêm mới thành công" });
                handelCancel();
            }
            else {
                notification.error({ message: "Đã xảy ra lỗi" })
            }
        }
    }
    const handleResetSearch = () => {
        setSearch(null);
        fetch();
    }

    const handelSearch = async () => {
        if (search?.id || search?.level.length || search?.meaning || search?.word) {
            setLoading(true);
            const res = await getVocabNotOfList(Number(idList), search.id, search.word, search.meaning, search.level);
            if (res && res.data) {
                setListVocab(res.data)
            }
            else {
                notification.error({ message: "Đã xảy ra một số lỗi!" })
            }
            setLoading(false)
        }
    }
    return (
        <Modal
            title={'Danh sách từ vựng'}
            onCancel={handelCancel}
            open={open}
            footer={
                <>
                    <Button type="primary" htmlType="submit" onClick={handleSumbit}>{"Thêm"}</Button>
                    <Button style={{ marginLeft: 10 }} onClick={handelCancel}>Cancel</Button>
                </>
            }
            width={1200}
        >
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
            <div style={{ marginTop: 10 }}>
                {listVocab.length == 0 ? <h1 style={{ color: 'red' }}>Danh sách này đã có hết từ vựng trong hệ thống!!!</h1> :
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
                    </Table>}
            </div>
        </Modal >);
}

export default ModalListVocab;