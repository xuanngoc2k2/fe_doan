import { useParams } from "react-router-dom";
import ListLesson from "./list-lesson";
import './styles/lesson-detail.scss'
// import { Divider } from "antd";

import video from "./testmp4.mp4"
import { Button, Drawer, Space } from "antd";
import { useRef, useState } from "react";
import { PlusOutlined, WechatOutlined } from "@ant-design/icons";
import AddNode from "./add-note";
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
function formatTimeFromSeconds(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds.toString();
    return minutes + ':' + formattedSeconds;
}
function LessonDetail() {
    const { courseId } = useParams();

    const [currentTime, setCurrentTime] = useState('');
    const [showAddNote, setShowAddNote] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [openComment, setOpenComment] = useState(false);

    const showDrawer = () => {
        setOpenComment(true);
        if (videoRef.current) {
            videoRef.current.pause(); // Pause video when showing AddNote
        }
    };

    const onClose = () => {
        setOpenComment(false);
    };
    const handleAddNote = () => {
        setShowAddNote(true);
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
                    title="Drawer with extra actions"
                    width={700}
                    onClose={onClose}
                    open={openComment}
                    extra={
                        <Space>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button type="primary" onClick={onClose}>
                                OK
                            </Button>
                        </Space>
                    }
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Drawer>
            </div>
            {/* <Divider /> */}
        </>);
}

export default LessonDetail;