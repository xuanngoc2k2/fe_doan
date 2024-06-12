/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, GetProp, Input, message, Modal, notification, Upload, UploadFile, UploadProps } from "antd";
import { useEffect, useState } from "react";
import { INews } from "../../../custom/type";
import {
    backEndUrl,
    callUploadSingleFile,
    createNewNews,
    updateNews,
} from "../../../apis";
// import ReactQuill from "react-quill";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

function ModalNews({ data, open, handelCancel }: { data?: INews | null; open: boolean, handelCancel: () => void }) {
    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
    const [dataNews, setDataNews] = useState<INews | undefined>();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const { quill, quillRef } = useQuill({
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                [{ align: [] }],

                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ indent: '-1' }, { indent: '+1' }],

                [{ size: ['small', false, 'large', 'huge'] }],
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ color: [] }, { background: [] }],

                ['clean'],
            ],
            clipboard: {
                matchVisual: false,
            },
        }
    });
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    const onChangeUpload: UploadProps['onChange'] = ({ file: newFileList }) => {
        newFileList.status = 'done';
        setFileList([newFileList]);
    };

    const upImage = async (file: UploadFile) => {
        const uploadedFile = file.originFileObj as File;
        if (uploadedFile != null) {
            try {
                const imageExtensions = /\.(jpg|jpeg|png|gif)$/i;
                const isImage = imageExtensions.test(uploadedFile.name);
                if (!isImage) {
                    notification.error({ message: "Chỉ cho phép upload file hình ảnh dạng ['jpg', 'jpeg', 'png', 'gif']!" });
                    return null;
                }
                const res = await callUploadSingleFile(uploadedFile, 'news');
                if (res.fileName) {
                    const newInfo = { ...(dataNews || {}), image: res.fileName } as INews;
                    setDataNews(newInfo); // Cập nhật userInfo.image
                    return newInfo; // Trả về userInfo đã được cập nhật
                }
            } catch (error) {
                message.error("Lỗi");
            }
            return null; // Trả về null nếu có lỗi xảy ra
        }
    }
    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as FileType);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };
    useEffect(() => {
        if (data) {
            setDataNews(data)
            setFileList([{
                uid: '-1',
                name: data.image!,
                status: 'done',
                url: `${backEndUrl}/images/news/${data.image!}`,
            },])
        }
        if (quill) {
            quillRef.current.firstChild.innerHTML = data?.content || '';
            quill.on('text-change', () => {
                setDataNews((prev) => ({ ...prev, content: quillRef.current.firstChild.innerHTML }))
            })
        }
    }, [quill]);
    const handleSubmit = async () => {
        if (dataNews?.content != '') {
            if (!data && dataNews?.content) {
                let newNews = dataNews; // Khởi tạo updatedUserInfo bằng userInfo ban đầu

                if (fileList[0] && fileList[0].originFileObj) {
                    newNews = await upImage(fileList[0]) || newNews; // Nếu upImage trả về null, giữ nguyên userInfo
                }
                console.log(newNews);
                const res = await createNewNews(newNews!);
                if (res && res.data) {
                    notification.success({
                        message: "Tạo mới thành công"
                    })
                    handelCancel()
                }
                else {
                    notification.error({
                        message: "Đã xảy ra lỗi thêm"
                    })
                }
            }
            else {
                let dataUpdateNews = dataNews; // Khởi tạo updatedUserInfo bằng userInfo ban đầu
                if (fileList[0] && fileList[0].originFileObj) {
                    // Nếu có file ảnh, thực hiện upload ảnh và cập nhật userInfo.image
                    dataUpdateNews = await upImage(fileList[0]) || dataUpdateNews; // Nếu upImage trả về null, giữ nguyen userInfo
                }
                console.log(dataUpdateNews);
                const res = await updateNews(dataUpdateNews!.id!, dataUpdateNews!);
                if (res && res.data) {
                    notification.success({
                        message: "Cập nhật thành công"
                    })
                    handelCancel()
                }
                else {
                    notification.error({
                        message: "Đã xảy ra lỗi cập nhật"
                    })
                }
            }
        }
    }
    return (
        <Modal
            title={data ? 'Thông tin tin tức' : 'Thêm mới tin tức'}
            onCancel={handelCancel}
            open={open}
            width={1000}
            footer={false}
        >
            <Form layout="vertical" initialValues={{
                content: data?.content || '',
            }}>
                <Form.Item
                    label="Nội dung"
                    name={'content'}
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                >
                    <Input name="content" style={{ display: 'none' }} value={dataNews?.content} />
                    <div ref={quillRef}>
                    </div>
                    {/* <ReactQuill
                        theme="snow"
                        value={data?.content || ''}
                        onChange={(value) => {
                            setDataNews((prev) => ({ ...prev, content: value }))
                        }}
                    /> */}
                </Form.Item>

                <Form.Item label="Hình ảnh" valuePropName="fileList" getValueFromEvent={normFile}>
                    <Upload
                        fileList={fileList}
                        onChange={onChangeUpload}
                        onPreview={onPreview}
                        maxCount={1} listType="picture-card">
                        <button style={{ border: 0, background: 'none' }} type="button">
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={handleSubmit}>{data ? "Lưu" : "Tạo mới"}</Button>
                    <Button style={{ marginLeft: 10 }} onClick={handelCancel}>Cancel</Button>
                </Form.Item>
            </Form>
        </Modal>);
}

export default ModalNews;