import { Button, Card, message, Tag, Tooltip } from "antd";
// import { useParams } from "react-router-dom";
import './styles/course-detail.scss'
import ListLesson from "./list-lesson";
import { useNavigate, useParams } from "react-router-dom";
import { backEndUrl, getCourseDetail } from "../apis";
import { useEffect, useState } from "react";
import { ICourse } from "../custom/type";
import { FieldTimeOutlined } from "@ant-design/icons";

function CourseDetail() {
    const { id } = useParams();
    const [dataCourse, setDataCourse] = useState<ICourse | null>();
    const truncateDescription = (text: string, maxLength: number) => {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + "...";
        } else {
            return text;
        }
    };
    const nav = useNavigate();
    const fetch = async () => {
        try {
            const res = await getCourseDetail(Number(id));
            if (res.data) {
                setDataCourse(res.data)
            }
            else {
                message.error("Lỗi call api")
            }
        }
        catch (er) {
            message.error(String(er));
        }
    }
    useEffect(() => {
        fetch()
    }, [id])
    const lastLesson = () => {
        let lastLesson = 1;
        if (dataCourse && dataCourse.lessons) {
            for (const les of dataCourse.lessons) {
                if (!les.isComplete) {
                    lastLesson = les.id;
                    break;
                }
            }
        }
        return lastLesson;
    }
    const handleStartCourse = async () => {
        nav(`/lesson/${id}/${lastLesson()}`);
    }
    return (
        <>
            {dataCourse &&
                <div className="course-detail">
                    <Card className="course-detail-lesson" title={dataCourse?.course_name}>
                        <ListLesson courseId={dataCourse.id} lessons={dataCourse.lessons} />
                    </Card>
                    <Card className="course-detail-demo">
                        <div className="course-detail-demo-des">
                            <img src={`${backEndUrl}/images/course/${dataCourse.image}`} />
                            <p>{dataCourse.description.length > 120 ? <Tooltip placement="bottomRight" title={dataCourse.description}>{truncateDescription(dataCourse.description, 120)}</Tooltip> : dataCourse.description}</p>
                        </div>
                        <Button type="primary" onClick={handleStartCourse}>{!dataCourse.started ? "Bắt đầu" : "Tiếp tục"}</Button>
                        <Tag className="course-totalTime" color='geekblue' style={{ display: 'flex', marginInlineEnd: 0 }}><FieldTimeOutlined style={{ color: '#1677ff', fontSize: 20 }} /> <p style={{ fontSize: 14, fontWeight: 500, margin: 3 }}>{dataCourse.totalTime}</p></Tag>
                    </Card>
                </div>
            }</>
    );
}

export default CourseDetail;
