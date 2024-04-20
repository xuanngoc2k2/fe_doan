import { Col, message, Row } from "antd";
import CardCourse from "../../components/card-course";
import './course.scss';
import { getListCourses } from "../../apis";
import { useEffect, useState } from "react";

function Course() {
    const [listCourse, setListCourse] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                //xem có user không
                // const response = await getListCourses();
                //nếu có user
                const response = await getListCourses();
                if (response.data) {
                    setListCourse(response.data);
                }
            }
            catch {
                message.open({
                    type: 'error',
                    content: 'Lỗi lấy data'
                })
            }
        }
        fetchData()
    }, [])
    console.log(listCourse);
    return (
        <div style={{ marginBottom: 20 }}>
            <Row>
                <Col span={2} offset={4}>
                    <div className="home-title">Khóa học</div>
                </Col>
            </Row>
            <Row className="course-list-item">
                {listCourse.map((c) => {
                    return <Col span={5} className="course-item">
                        <CardCourse course={c} />
                    </Col>
                })}
            </Row>
        </div>);
}

export default Course;