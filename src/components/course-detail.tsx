import { Button, Card, message, Tooltip } from "antd";
// import { useParams } from "react-router-dom";
import './styles/course-detail.scss'
import ListLesson from "./list-lesson";
import { useParams } from "react-router-dom";
import { backEndUrl, getCourseDetail } from "../apis";
import { useEffect, useState } from "react";
import { ICourse } from "../custom/type";

// const course = {
//     course_name: 'Tiếng hàn tổng hợp sơ cấp 1',
//     description: 'To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here',
//     images: 'https://monday.edu.vn/wp-content/uploads/2023/08/tu-vung-tieng-han-so-cap-1-theo-chu-de.jpg',
//     progress: 50,
//     time: 30,
//     count: 502,
//     id: 1,
//     lesson: [
//         {
//             isVideo: true,
//             lesson_name: "Scratch",
//             duration: "2:00",
//             isComplete: true,
//             id: 1
//         },
//         {
//             isVideo: true,
//             lesson_name: "Scratch",
//             duration: "2:00",
//             isComplete: true,
//             id: 2

//         },
//         {
//             isVideo: true,
//             lesson_name: "Scratch",
//             duration: "2:00",
//             isComplete: true,
//             id: 3

//         },
//         {
//             isVideo: false,
//             lesson_name: "Scratch",
//             duration: "2:00",
//             isComplete: true,
//             id: 4
//         },
//         {
//             isVideo: true,
//             lesson_name: "Scratch",
//             duration: "2:00",
//             isComplete: true,
//             id: 5
//         },
//         {
//             isVideo: false,
//             lesson_name: "Scratch",
//             duration: "2:00",
//             isComplete: false,
//             id: 4
//         },
//         {
//             isVideo: true,
//             lesson_name: "Scratch",
//             duration: "2:00",
//             isComplete: false,
//             id: 5
//         },
//         {
//             isVideo: true,
//             lesson_name: "Scratch",
//             duration: "2:00",
//             isComplete: false,
//             id: 4
//         },
//         {
//             isVideo: true,
//             lesson_name: "Scratch",
//             duration: "2:00",
//             isComplete: false,
//             id: 5
//         },
//         {
//             isVideo: true,
//             lesson_name: "Scratch",
//             duration: "2:00",
//             isComplete: false,
//             id: 4
//         },
//         {
//             isVideo: true,
//             lesson_name: "Scratch",
//             duration: "2:00",
//             isComplete: false,
//             id: 5
//         },
//         {
//             isVideo: true,
//             lesson_name: "Scratch",
//             duration: "2:00",
//             isComplete: false,
//             id: 4
//         },
//         {
//             isVideo: true,
//             lesson_name: "Scratch",
//             duration: "2:00",
//             isComplete: false,
//             id: 5
//         },
//         {
//             isVideo: true,
//             lesson_name: "Scratch",
//             duration: "2:00",
//             isComplete: false,
//             id: 4
//         },
//         {
//             isVideo: true,
//             lesson_name: "Scratch",
//             duration: "2:00",
//             isComplete: false,
//             id: 5
//         },
//         {
//             isVideo: true,
//             lesson_name: "Scratch",
//             duration: "2:00",
//             isComplete: false,
//             id: 4
//         },
//         {
//             isVideo: true,
//             lesson_name: "Scratch",
//             duration: "2:00",
//             isComplete: false,
//             id: 5
//         },
//         {
//             isVideo: true,
//             lesson_name: "Scratch",
//             duration: "2:00",
//             isComplete: false,
//             id: 4
//         },
//         {
//             isVideo: true,
//             lesson_name: "Scratch",
//             duration: "2:00",
//             isComplete: true,
//             id: 5
//         }
//     ]
// }

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
                        <Button type="primary">Start Course</Button>
                    </Card>
                </div>
            }</>
    );
}

export default CourseDetail;
