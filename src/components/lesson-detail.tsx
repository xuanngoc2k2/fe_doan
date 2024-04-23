import { useNavigate, useParams } from "react-router-dom";
import ListLesson from "./list-lesson";
import './styles/lesson-detail.scss'
// import { Divider } from "antd";
import { Avatar, Button, Drawer, Input, message, Popconfirm, Space, Tag } from "antd";
import { useEffect, useRef, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined, WechatOutlined } from "@ant-design/icons";
import AddNode from "./add-note";
import ReactQuill from "react-quill";
import { addNote, backEndUrl, deleteNote, getAllNote, getCourseDetail, updateDoneLesson, updateNote } from "../apis";
import { IComment, ICourse, ILesson } from "../custom/type";
// const listComment = [
//     {
//         commentAt: '2:00',
//         comment: 'vps là j nó có phải sever k ạ',
//         createAt: '11/17/2023',
//         userName: 'Nguyễn Xuân Ngọc',
//         userImage: 'https://docs.nestjs.com/assets/logo-small.svg'
//     },
//     {
//         commentAt: '4:00',
//         comment: 'vps là j nó có phải sever k ạ',
//         createAt: '4/9/2024',
//         userName: 'Nguyễn Xuân Ngọc',
//         userImage: 'https://docs.nestjs.com/assets/logo-small.svg'
//     },
//     {
//         commentAt: '6:00',
//         comment: 'Dài quá Dài quá Dài quá Dài quá Dài quá Dài quá Dài quá Dài quáDài quá Dài quá Dài quá Dài quá Dài quá Dài quá Dài quá Dài quáDài quá Dài quá Dài quá Dài quá Dài quá Dài quá Dài quá Dài quáDài quá Dài quá Dài quá Dài quá Dài quá Dài quá Dài quá Dài quáDài quá Dài quá Dài quá Dài quá Dài quá Dài quá Dài quá Dài quáDài quá Dài quá Dài quá Dài quá Dài quá Dài quá Dài quá Dài quá',
//         createAt: '4/7/2024',
//         userName: 'Nguyễn Xuân Ngọc',
//         userImage: 'https://docs.nestjs.com/assets/logo-small.svg'
//     },
//     {
//         commentAt: '7:15',
//         comment: 'vps là j nó có phải sever k ạ',
//         createAt: '11/17/2002',
//         userName: 'Nguyễn Xuân Ngọc',
//         userImage: 'https://docs.nestjs.com/assets/logo-small.svg'
//     },
//     {
//         commentAt: '2:00',
//         comment: 'vps là j nó có phải sever k ạ',
//         createAt: '11/17/2002',
//         userName: 'Nguyễn Xuân Ngọc',
//         userImage: 'https://docs.nestjs.com/assets/logo-small.svg'
//     },
//     {
//         commentAt: '2:00',
//         comment: 'vps là j nó có phải sever k ạ',
//         createAt: '11/17/2002',
//         userName: 'Nguyễn Xuân Ngọc',
//         userImage: 'https://docs.nestjs.com/assets/logo-small.svg'
//     },
//     {
//         commentAt: '2:00',
//         comment: 'vps là j nó có phải sever k ạ',
//         createAt: '11/17/2002',
//         userName: 'Nguyễn Xuân Ngọc',
//         userImage: 'https://docs.nestjs.com/assets/logo-small.svg'
//     },
//     {
//         commentAt: '2:00',
//         comment: 'vps là j nó có phải sever k ạ',
//         createAt: '11/17/2002',
//         userName: 'Nguyễn Xuân Ngọc',
//         userImage: 'https://docs.nestjs.com/assets/logo-small.svg'
//     },
//     {
//         commentAt: '2:00',
//         comment: 'vps là j nó có phải sever k ạ',
//         createAt: '11/1/2002',
//         userName: 'Nguyễn Xuân Ngọc',
//         userImage: 'https://docs.nestjs.com/assets/logo-small.svg'
//     }
// ]
function formatTimeFromSeconds(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds.toString();
    return minutes + ':' + formattedSeconds;
}
function calculateDistanceToNow(dateString: string) {
    const date = new Date(dateString);

    const now = new Date();

    const distance = now.getTime() - date.getTime();

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    // Tạo chuỗi kết quả
    let resultString = '';
    if (years > 0) {
        resultString = `${years} năm trước`;
    } else if (months > 0) {
        resultString = `${months} tháng trước`;
    } else if (days === 0) {
        resultString = 'Hôm nay';
    } else if (days === 1) {
        resultString = 'Hôm qua';
    } else {
        resultString = `${days} ngày trước`;
    }

    return resultString;
}
function timeStringToSeconds(timeString: string) {
    // Tách giờ và phút từ chuỗi thời gian
    const [minutes, seconds] = timeString.split(':').map(Number);

    // Chuyển đổi giờ và phút thành số giây
    const totalSeconds = minutes * 60 + seconds;

    return totalSeconds;

}

function LessonDetail() {
    const { courseId, lessonId } = useParams();
    const [course, setCourse] = useState<ICourse | null>();
    const [lesson, setLesson] = useState<ILesson | null>();
    const [currentTime, setCurrentTime] = useState('');
    const [showAddNote, setShowAddNote] = useState(false);
    const [isEdit, setIsEdit] = useState<number>();
    const [editText, setEditText] = useState<string>('');
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [openCommentDrawer, setOpenCommentDrawer] = useState(false);
    const [openNoteDrawer, setOpenNoteDrawer] = useState(false);
    const [comment, setComment] = useState('');
    const [showInputComment, setShowInputComment] = useState(false);
    const [listNote, setListNote] = useState<IComment[] | []>([]);
    const [listComment, setListComment] = useState<IComment[] | []>([]);
    const navigator = useNavigate();
    const fetch = async () => {
        try {
            const res = await getCourseDetail(Number(courseId));
            if (res.data) {
                setCourse(res.data)
                const lessons = res.data.lessons;
                lessons.map((les: ILesson, index: number) => {
                    if (les.id === Number(lessonId)) {
                        if (index == 0) {
                            setLesson(les);
                        }
                        else {
                            if (lessons[index - 1].isComplete) {
                                setLesson(les);

                            }
                            else {
                                while (!lessons[index - 1].isComplete) {
                                    index -= 1;
                                }
                                navigator(`/lesson/${courseId}/${index + 1}`)
                            }
                        }
                    }
                })
                fetchListNote();
                fetchListComment();
            }
            else {
                message.error("Lỗi lấy data")
            }
        }
        catch (error) {
            message.error(String(error))
        }
    }
    const fetchListNote = async () => {
        const resNote = await getAllNote(Number(lessonId));
        if (resNote.statusCode == 201) {
            setListNote(resNote.data);
        }
        else {
            message.error("Lay data note lôi");
        }
    }
    const fetchListComment = async () => {
        const resCom = await getAllNote(Number(lessonId), true);
        if (resCom.statusCode == 201) {
            setListComment(resCom.data)
        }
        else {
            message.error("Lay data comment lôi");
        }
    }
    useEffect(() => {
        fetch()
    }, [Number(lessonId), listNote.length])

    const showDrawerComment = () => {
        setOpenCommentDrawer(true);
    };

    const onCloseCommentDrawer = () => {
        setOpenCommentDrawer(false);
        setShowInputComment(false)
    };
    const onCloseNoteDrawer = () => {
        setOpenNoteDrawer(false);
    }
    const handleShowAddNote = () => {
        if (currentTime !== '') {
            setShowAddNote(true);
        }
        else {
            message.open({
                type: 'error',
                content: 'Video chưa được phát !!',
                style: {
                    marginTop: '20vh',
                }
            })
        }
        if (videoRef.current) {
            videoRef.current.pause(); // Pause video when showing AddNote
        }
    };
    const handleAddNote = async (note: string) => {
        if (note.trim() === '') {
            message.error("Không được để trống");
        }
        else {
            try {
                const res = await addNote(
                    note,
                    Number(lessonId!),
                    currentTime
                )
                if (res.statusCode == 201) {
                    message.success("Tạo ghi chú thành công")
                    fetchListNote()
                    handelCancel();
                }
                else {
                    message.error("Tạo mới lỗi")
                }
            }
            catch (error) {
                message.error(String(error))
            }
        }
    }
    const handelCancel = () => {
        setShowAddNote(false);
        setOpenCommentDrawer(false)
        if (videoRef.current) {
            videoRef.current.play(); // Resume video when AddNote is closed
        }
    }
    const handleDeleteNote = async (id: number) => {
        try {
            const res = await deleteNote(id);
            if (res.data) {
                message.success("Xóa thành công")
                fetchListNote()
            }
            else {
                message.error("Xóa lỗi")
            }
        }
        catch (error) {
            message.error(String(error))
        }
    }
    const handelComment = async (isEdit?: number) => {
        console.log(isEdit, comment)
        if (isEdit) {
            const res = await updateNote(isEdit, editText)
            if (res.data.success == true) {
                message.success("Cập nhật thành công");
                handelEditNote(-1, '');
                fetchListNote();
            }
            else {
                message.error("Cập nhật lỗi")
            }
        }
        else {
            if (comment.split('<p><br></p>').filter((item) => item.trim() !== '').join('') != '') {
                try {
                    const res = await addNote(comment, Number(lessonId));
                    if (res.statusCode === 201) {
                        message.success("Comment thành công");
                        setComment('');
                        fetchListComment();
                    }
                    else {
                        message.error("Comment lỗi")
                    }
                }
                catch (error) {
                    message.error(String(error))
                }
            }
            else {
                message.error("Comment không được để trống")
            }
        }
    }

    const handleShowNote = () => {
        setOpenNoteDrawer(true);
    }
    const handleFinish = async () => {
        if (!lesson?.isComplete) {
            try {
                const res = await updateDoneLesson(Number(lesson?.id));
                if (res.data) {
                    message.success("Đã hoàn thành bài học");
                    navigator(`/lesson/${courseId}/${lesson!.id + 1}`)
                }
                else {
                    message.error("Học lỗi")
                }
            }
            catch (error) {
                message.error(String(error))
            }
        }
    }
    const handelEditNote = (id: number, comment: string) => {
        setEditText(comment);
        setIsEdit(id)
    }
    return (
        <>
            <div className="lesson-detail-container">
                <div className="lesson-detail-list-lesson">
                    <ListLesson active={Number(lessonId)} courseId={Number(courseId)} lessons={course?.lessons} />
                </div>
                {lesson && <div className="lesson-detail-content">
                    <>
                        <video
                            key={lesson.id}
                            onEnded={handleFinish}
                            autoPlay
                            ref={videoRef}
                            className="lesson-detail-main-content"
                            controls
                            onTimeUpdate={(e) => {
                                const Event = e.target as HTMLVideoElement;
                                setCurrentTime(formatTimeFromSeconds(Math.floor(Event.currentTime)));
                            }}
                        >
                            {/* <ReactPlayer url={`${backEndUrl}/video/${lesson?.content}`} controls={true} /> */}
                            <source src={`${backEndUrl}/video/${lesson?.content}`} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <div className="lesson-detail-main-des">
                            <p className="lesson-detail-name">Lesson {lesson?.order}: {lesson?.lesson_name}</p>
                            <p className="lesson-detail-description">{lesson?.description}</p>
                            <Button className="button-add-note" onClick={handleShowAddNote}><PlusOutlined />Thêm ghi chú tại {currentTime != '' ? currentTime : '0:00'}</Button>
                        </div>
                    </>
                </div>}
                {/* Button trao đổi */}
                <Button className="button-comments" onClick={showDrawerComment}><WechatOutlined /> Trao đổi</Button>
                <div className="comment-component">
                    {showAddNote && <AddNode handleAddNote={handleAddNote} handelCancel={handelCancel} time={currentTime} />}
                </div>
                {/* Drawer bình luận */}
                <Drawer
                    title=""
                    width={700}
                    onClose={onCloseCommentDrawer}
                    open={openCommentDrawer}
                >
                    <Space size={20} style={{ width: '100%' }} direction="vertical">
                        <div>
                            <div className="block-user-comment" style={{ width: '100%', display: 'flex' }}>
                                <div className="block-user-comment-avatar"><Avatar size={40} style={{ backgroundColor: '#f2f3f5' }} /></div>
                                {showInputComment ?
                                    <div className="block-user-comment-input">
                                        <ReactQuill theme="snow"
                                            value={comment} onChange={setComment}
                                        />
                                        <div className="block-user-comment-btn">
                                            <Button onClick={() => setShowInputComment(false)}>HỦY BỎ</Button>
                                            <Button type="primary" onClick={() => handelComment()}>
                                                BÌNH LUẬN
                                            </Button>
                                        </div>
                                    </div> :
                                    <div className="block-user-comment-input">
                                        <Input onFocus={() => setShowInputComment(true)} placeholder="Bạn có thắc mắc gì trong bài học này?" />
                                    </div>}
                            </div>
                        </div>
                        {listComment.map((comment) => {
                            return <div className="block-user-comment">
                                <div className="block-user-comment-avatar">
                                    <Avatar size={40} style={{ backgroundColor: '#f2f3f5' }} src={`${backEndUrl}/images/users/${comment.user?.image}`} />
                                </div>
                                <div className="block-user-comment-input user-comment">
                                    <p className="comment-user">{comment.user?.full_name}</p>
                                    <p className="comment-content" dangerouslySetInnerHTML={{ __html: comment.comment }}></p>
                                    <p className="comment-createAt">{calculateDistanceToNow(comment.createdAt)}</p>
                                </div>
                            </div>
                        })}
                    </Space>
                </Drawer>
                <Drawer
                    placement="left"
                    title="Ghi chú"
                    width={700}
                    onClose={onCloseNoteDrawer}
                    open={openNoteDrawer}
                >
                    <Space size={20} style={{ width: '100%' }} direction="vertical">
                        {listNote.map((comment) => {
                            return (
                                <div className="block-note">
                                    <div className="block-note-title">
                                        <a style={{
                                            color: '#cf1f2f'
                                        }} href="#" onClick={() => {
                                            if (videoRef.current?.currentTime) {
                                                console.log(timeStringToSeconds(comment.commentAt!))
                                                videoRef.current.currentTime = timeStringToSeconds(comment.commentAt!);
                                            }
                                        }}><Tag style={{ fontSize: 21, borderRadius: '20px', padding: '3px 10px' }} color="red">
                                                {comment.commentAt}
                                            </Tag>
                                            {lesson?.lesson_name}
                                        </a>
                                        <div>
                                            <EditOutlined style={{ color: '#047ecf' }} onClick={() => handelEditNote(comment.id, comment.comment)} className="block-note-title-btn" />
                                            <Popconfirm
                                                title="Xóa ghi chú"
                                                description="Bạn có chắc muốn xóa ghi chú này"
                                                okText="Chắn chắn"
                                                cancelText="Không"
                                                onConfirm={() => handleDeleteNote(comment.id)}
                                            >
                                                <DeleteOutlined style={{ color: 'red' }} className="block-note-title-btn" /></Popconfirm>
                                        </div>
                                    </div>
                                    <div className="block-note-content">
                                        {isEdit == comment.id ?
                                            <>
                                                <ReactQuill
                                                    theme="snow"
                                                    value={editText}
                                                    onChange={setEditText}
                                                />
                                                <div className="block-user-comment-btn">
                                                    <Button onClick={() => handelEditNote(-1, '')}>Hủy bỏ</Button>
                                                    <Button type="primary" onClick={() => handelComment(isEdit)}>
                                                        Lưu
                                                    </Button>
                                                </div>
                                            </> :
                                            <p className="note-content" dangerouslySetInnerHTML={{ __html: comment.comment }}></p>}
                                    </div>
                                </div>)
                        })}
                    </Space>
                </Drawer>
                <Button className="button-note" onClick={handleShowNote}><WechatOutlined /> Ghi chú</Button>
            </div >
            {/* <Divider /> */}
        </>);
}

export default LessonDetail;