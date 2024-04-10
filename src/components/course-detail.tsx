import { Button, Card, Tooltip } from "antd";
// import { useParams } from "react-router-dom";
import './styles/course-detail.scss'
import ListLesson from "./list-lesson";
import { useParams } from "react-router-dom";

const course = {
    course_name: 'Tiếng hàn tổng hợp sơ cấp 1',
    description: 'To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here,To style the .course-detail-lesson element with a border, you can specify the border properties in your CSS. Here',
    images: 'https://monday.edu.vn/wp-content/uploads/2023/08/tu-vung-tieng-han-so-cap-1-theo-chu-de.jpg',
    progress: 50,
    time: 30,
    count: 502,
    id: 1,
    lesson: [
        {
            isVideo: true,
            lesson_name: "Scratch",
            duration: "2:00",
            isComplete: true,
            id: 1
        },
        {
            isVideo: true,
            lesson_name: "Scratch",
            duration: "2:00",
            isComplete: true,
            id: 2

        },
        {
            isVideo: true,
            lesson_name: "Scratch",
            duration: "2:00",
            isComplete: true,
            id: 3

        },
        {
            isVideo: false,
            lesson_name: "Scratch",
            duration: "2:00",
            isComplete: true,
            id: 4
        },
        {
            isVideo: true,
            lesson_name: "Scratch",
            duration: "2:00",
            isComplete: true,
            id: 5
        },
        {
            isVideo: false,
            lesson_name: "Scratch",
            duration: "2:00",
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
            lesson_name: "Scratch",
            duration: "2:00",
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
            lesson_name: "Scratch",
            duration: "2:00",
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
            lesson_name: "Scratch",
            duration: "2:00",
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
            lesson_name: "Scratch",
            duration: "2:00",
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
            lesson_name: "Scratch",
            duration: "2:00",
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
            lesson_name: "Scratch",
            duration: "2:00",
            isComplete: false,
            id: 4
        },
        {
            isVideo: true,
            lesson_name: "Scratch",
            duration: "2:00",
            isComplete: true,
            id: 5
        }
    ]
}

function CourseDetail() {
    const { id } = useParams();
    const truncateDescription = (text: string, maxLength: number) => {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + "...";
        } else {
            return text;
        }
    };
    return (
        <>
            <div className="course-detail">
                <Card className="course-detail-lesson" title={course.course_name + id}>
                    <ListLesson courseId={course.id} lessons={course.lesson} />
                </Card>
                <Card className="course-detail-demo">
                    <div className="course-detail-demo-des">
                        <img src={course.images} />
                        <p>{course.description.length > 120 ? <Tooltip placement="bottomRight" title={course.description}>{truncateDescription(course.description, 120)}</Tooltip> : course.description}</p>
                    </div>
                    <Button type="primary">Start Course</Button>
                </Card>
            </div></>
    );
}

export default CourseDetail;
