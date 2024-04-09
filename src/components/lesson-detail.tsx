import { useParams } from "react-router-dom";
import ListLesson from "./list-lesson";
import './styles/lesson-detail.scss'
// import { Divider } from "antd";

import video from "./testmp4.mp4"
import { Avatar, Button, Drawer, Input, message, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import { PlusOutlined, WechatOutlined } from "@ant-design/icons";
import AddNode from "./add-note";
import ReactQuill from "react-quill";
const course = {
    course_name: 'Tiếng hàn tổng hợp sơ cấp 1',
    description: 'To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here',
    images: 'https://monday.edu.vn/wp-content/uploads/2023/08/tu-vung-tieng-han-so-cap-1-theo-chu-de.jpg',
    progress: 50,
    time: 30,
    count: 502,
    id: 1,
    lessons: [
        {
            isVideo: true,
            lesson_name: "Tiếng hàn tổng hợp sơ cấp 1",
            duration: "2:00",
            description: 'To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here',
            isComplete: true,
            id: 1
        },
        {
            isVideo: true,
            lesson_name: "ScratchTiếng hàn tổng hợp sơ cấp 1Tiếng hàn tổng hợp sơ cấp 1Tiếng hàn tổng hợp sơ cấp 1Tiếng hàn tổng hợp sơ cấp 1",
            description: 'To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here',
            duration: "2:00",
            isComplete: true,
            id: 2

        },
        {
            isVideo: true,
            lesson_name: "Scratch",
            duration: "2:00",
            description: 'To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here',
            isComplete: true,
            id: 3

        },
        {
            isVideo: false,
            lesson_name: "Scratch",
            duration: "2:00",
            description: 'To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here',
            isComplete: true,
            id: 4
        },
        {
            isVideo: true,
            lesson_name: "Scratch",
            duration: "2:00",
            description: 'To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here',
            isComplete: true,
            id: 5
        },
        {
            isVideo: false,
            lesson_name: "Scratch",
            duration: "2:00",
            description: 'To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here',
            isComplete: false,
            id: 4
        },
        {
            isVideo: true,
            lesson_name: "Scratch",
            duration: "2:00",
            description: 'To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here',
            isComplete: false,
            id: 5
        },
        {
            isVideo: true,
            lesson_name: "Scratch",
            duration: "2:00",
            description: 'To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here',
            isComplete: false,
            id: 4
        },
        {
            isVideo: true,
            lesson_name: "Scratch",
            duration: "2:00",
            description: 'To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here',
            isComplete: false,
            id: 5
        },
        {
            isVideo: true,
            lesson_name: "Scratch",
            duration: "2:00",
            description: 'To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here',
            isComplete: false,
            id: 4
        },
        {
            isVideo: true,
            lesson_name: "Scratch",
            duration: "2:00",
            description: 'To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here',
            isComplete: false,
            id: 5
        },
        {
            isVideo: true,
            lesson_name: "Scratch",
            duration: "2:00",
            description: 'To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here',
            isComplete: false,
            id: 4
        },
        {
            isVideo: true,
            lesson_name: "Scratch",
            duration: "2:00",
            isComplete: false,
            id: 5
        },
        {
            isVideo: true,
            description: 'To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here',
            lesson_name: "Scratch",
            duration: "2:00",
            isComplete: false,
            id: 4
        },
        {
            isVideo: true,
            lesson_name: "Scratch",
            duration: "2:00",
            description: 'To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here',
            isComplete: false,
            id: 5
        },
        {
            isVideo: true,
            lesson_name: "Scratch",
            duration: "2:00",
            description: 'To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here',
            isComplete: false,
            id: 4
        },
        {
            isVideo: true,
            lesson_name: "Scratch",
            description: 'To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here',
            duration: "2:00",
            isComplete: false,
            id: 5
        },
        {
            isVideo: true,
            lesson_name: "Scratch",
            duration: "2:00",
            description: 'To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here',
            isComplete: false,
            id: 4
        },
        {
            isVideo: false,
            lesson_name: "Scratch",
            duration: "2:00",
            isComplete: false,
            description: 'To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here',
            id: 5
        }
    ]
}
const lesson =
{
    isVideo: true,
    lesson_name: "Tiếng hàn tổng hợp sơ cấp 1",
    duration: "2:00",
    description: 'To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here',
    isComplete: true,
    id: 1
};
const listComment = [
    {
        comment: 'vps là j nó có phải sever k ạ',
        createAt: '11/17/2023',
        userName: 'Nguyễn Xuân Ngọc',
        userImage: 'https://docs.nestjs.com/assets/logo-small.svg'
    },
    {
        comment: 'vps là j nó có phải sever k ạ',
        createAt: '4/9/2024',
        userName: 'Nguyễn Xuân Ngọc',
        userImage: 'https://docs.nestjs.com/assets/logo-small.svg'
    },
    {
        comment: 'vps là j nó có phải sever k ạ',
        createAt: '4/7/2024',
        userName: 'Nguyễn Xuân Ngọc',
        userImage: 'https://docs.nestjs.com/assets/logo-small.svg'
    },
    {
        comment: 'vps là j nó có phải sever k ạ',
        createAt: '11/17/2002',
        userName: 'Nguyễn Xuân Ngọc',
        userImage: 'https://docs.nestjs.com/assets/logo-small.svg'
    },
    {
        comment: 'vps là j nó có phải sever k ạ',
        createAt: '11/17/2002',
        userName: 'Nguyễn Xuân Ngọc',
        userImage: 'https://docs.nestjs.com/assets/logo-small.svg'
    },
    {
        comment: 'vps là j nó có phải sever k ạ',
        createAt: '11/17/2002',
        userName: 'Nguyễn Xuân Ngọc',
        userImage: 'https://docs.nestjs.com/assets/logo-small.svg'
    },
    {
        comment: 'vps là j nó có phải sever k ạ',
        createAt: '11/17/2002',
        userName: 'Nguyễn Xuân Ngọc',
        userImage: 'https://docs.nestjs.com/assets/logo-small.svg'
    },
    {
        comment: 'vps là j nó có phải sever k ạ',
        createAt: '11/17/2002',
        userName: 'Nguyễn Xuân Ngọc',
        userImage: 'https://docs.nestjs.com/assets/logo-small.svg'
    },
    {
        comment: 'vps là j nó có phải sever k ạ',
        createAt: '11/1/2002',
        userName: 'Nguyễn Xuân Ngọc',
        userImage: 'https://docs.nestjs.com/assets/logo-small.svg'
    }
]
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
function LessonDetail() {
    const { courseId } = useParams();

    const [currentTime, setCurrentTime] = useState('');
    const [showAddNote, setShowAddNote] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [openComment, setOpenComment] = useState(false);
    const [comment, setComment] = useState('');
    const [showInputComment, setShowInputComment] = useState(false);
    const showDrawer = () => {
        setOpenComment(true);
    };

    const onCloseDrawer = () => {
        setOpenComment(false);
    };
    const handleAddNote = () => {
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

    const handelCancel = () => {
        setShowAddNote(false);
        setOpenComment(false)
        if (videoRef.current) {
            videoRef.current.play(); // Resume video when AddNote is closed
        }
    }
    const handelComment = () => {
        listComment.push({
            comment: comment,
            createAt: '11/17/2002',
            userName: 'Nguyễn Xuân Ngọc',
            userImage: 'https://docs.nestjs.com/assets/logo-small.svg'

        })
        console.log(comment);
    }
    useEffect(() => {
        // Xử lý logic khi có sự thay đổi trong listComment
    }, [listComment])

    return (
        <>
            <div className="lesson-detail-container">
                <div className="lesson-detail-list-lesson">
                    <ListLesson courseId={Number(courseId)} lessons={course.lessons} />
                </div>
                <div className="lesson-detail-content">
                    <>
                        <video
                            className="lesson-detail-main-content"
                            controls
                            ref={videoRef}
                            onTimeUpdate={(e) => {
                                const Event = e.target as HTMLVideoElement;
                                setCurrentTime(formatTimeFromSeconds(Math.floor(Event.currentTime)));
                            }}
                        >
                            <source src={video} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <div className="lesson-detail-main-des">
                            <p className="lesson-detail-name">{lesson.lesson_name}</p>
                            <p className="lesson-detail-description">{lesson.description}</p>
                            <Button className="button-add-note" onClick={handleAddNote}><PlusOutlined />Thêm ghi chú tại {currentTime != '' ? currentTime : '0:00'}</Button>
                        </div>
                    </>
                </div>
                <Button className="button-comments" onClick={showDrawer}><WechatOutlined /> Trao đổi</Button>
                <div className="comment-component">
                    {showAddNote && <AddNode handelCancel={handelCancel} time={currentTime} />}
                </div>
                <Drawer
                    title=""
                    width={700}
                    onClose={onCloseDrawer}
                    open={openComment}
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
                                            <Button type="primary" onClick={handelComment}>
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
                                    <Avatar size={40} style={{ backgroundColor: '#f2f3f5' }} src={comment.userImage} />
                                </div>
                                <div className="block-user-comment-input user-comment">
                                    <p className="comment-user">{comment.userName}</p>
                                    <p className="comment-content">{comment.comment}</p>
                                    <p className="comment-createAt">{calculateDistanceToNow(comment.createAt)}</p>
                                </div>
                            </div>
                        })}
                    </Space>
                </Drawer>
            </div >
            {/* <Divider /> */}
        </>);
}

export default LessonDetail;