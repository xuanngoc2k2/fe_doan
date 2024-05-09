import { Col, message, Pagination, Row } from "antd";
import CardCourse from "../../components/card-course";
import './course.scss';
import { getListCourses } from "../../apis";
import { useEffect, useState } from "react";

function Course() {
    const [listCourse, setListCourse] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;
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
    const indexOfLastCourse = currentPage * pageSize;
    const indexOfFirstCourse = indexOfLastCourse - pageSize;
    const currentCourses = listCourse.slice(indexOfFirstCourse, indexOfLastCourse);

    // Xử lý sự kiện khi chuyển trang
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    }

    return (
        <div style={{ marginBottom: 20 }}>
            <Row>
                <Col span={2} offset={4}>
                    <div className="home-title">Khóa học</div>
                </Col>
            </Row>
            <Row className="course-list-item">
                {currentCourses.map((c) => {
                    return <Col span={5} className="course-item">
                        <CardCourse course={c} />
                    </Col>
                })}
            </Row>
            <Row>
                <Col span={24} style={{ textAlign: 'center' }}>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={listCourse.length}
                        onChange={handlePageChange}
                    />
                </Col>
            </Row>
        </div>);
}

export default Course;