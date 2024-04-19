import { BookOutlined, CheckCircleFilled, LockOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Space } from "antd";
import './styles/list-lesson.scss'
import { Link } from "react-router-dom";
import { ILesson } from "../custom/type";
function ListLesson({ lessons, courseId }: { lessons?: ILesson[], courseId: number }) {
    return (<>
        <Space style={{ fontFamily: 'Segoe UI' }} className="list-lesson" size={30}>
            {lessons?.map((lesson, index) => {
                return (
                    <Link style={{ color: 'black' }} to={(index > 0 && !lessons[index - 1].isComplete) ? '' : `/lesson/${courseId}/${lesson.id}`}>
                        <div key={index} className="item-lesson-detail">
                            <div style={{ display: 'flex', width: '80%' }}>
                                <p className="item-lesson-title">Lesson {index + 1}: {lesson.lesson_name}</p>
                            </div>
                            <div style={{ display: 'flex', marginRight: 4, width: '25%', justifyContent: 'flex-end' }}>
                                <p className="item-lesson-duration">{lesson.isQuestion ? <BookOutlined className="item-lesson-icon" /> : <PlayCircleOutlined className="item-lesson-icon" />}{lesson.duration}</p>
                                <p className="item-lesson-isComplete">{lesson.isComplete && <CheckCircleFilled style={{ color: 'green', marginLeft: 10, marginRight: 2 }} />}</p>
                                <p className="item-lesson-isComplete">{index > 0 && !lessons[index - 1].isComplete && <LockOutlined style={{ color: 'green', marginLeft: 10, marginRight: 2 }} />}</p>
                            </div>
                        </div>
                    </Link>)
            })}
        </Space></>);
}

export default ListLesson;