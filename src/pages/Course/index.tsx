import { Col, message, Row } from "antd";
import CardCourse from "../../components/card-course";
import './course.scss';
import { getListCourses } from "../../apis";
import { useEffect, useState } from "react";
// const fakeCourse = [
//     {
//         course_name: 'Sơ cấp 1',
//         description: 'Kiến thức nhập môn tiếng Hàn',
//         images: 'https://monday.edu.vn/wp-content/uploads/2023/08/tu-vung-tieng-han-so-cap-1-theo-chu-de.jpg',
//         progress: 50,
//         time: 30,
//         count: 502,
//         id: 1
//     },
//     {
//         course_name: 'Sơ cấp 2',
//         description: 'Kiến thức nhập môn tiếng Hàn',
//         images: 'https://korealink.edu.vn/cms/static/site/korealink/uploads/ckeditor/images.thumb.f8ecd972-1eca-410e-8000-98675b00bc88.jpg',
//         progress: 50,
//         time: 30,
//         count: 502,
//         id: 2
//     },
//     {
//         course_name: 'Trung cấp 3',
//         description: 'Kiến thức nhập môn tiếng Hàn',
//         images: 'https://korealink.edu.vn/cms/static/site/korealink/uploads/ckeditor/images.thumb.a6e32547-7cc3-4319-83a7-dd0aafe7c0b0.jpg',
//         progress: 50,
//         time: 30,
//         count: 502,
//         id: 3
//     },
//     {
//         course_name: 'Trung cấp 4',
//         description: 'Kiến thức nhập môn tiếng Hàn',
//         images: 'https://monday.edu.vn/wp-content/uploads/2023/08/tu-vung-tieng-han-so-cap-1-theo-chu-de.jpg',
//         progress: 50,
//         time: 30,
//         count: 502,
//         id: 4
//     },
//     {
//         course_name: 'Sơ cấp 1',
//         description: 'Kiến thức nhập môn tiếng Hàn',
//         images: 'https://monday.edu.vn/wp-content/uploads/2023/08/tu-vung-tieng-han-so-cap-1-theo-chu-de.jpg',
//         progress: 50,
//         time: 30,
//         count: 502,
//         id: 5
//     },
//     {
//         course_name: 'Sơ cấp 2',
//         description: 'Kiến thức nhập môn tiếng Hàn',
//         images: 'https://monday.edu.vn/wp-content/uploads/2023/08/tu-vung-tieng-han-so-cap-1-theo-chu-de.jpg',
//         progress: 50,
//         time: 30,
//         count: 502,
//         id: 6
//     },
//     {
//         course_name: 'Trung cấp 3',
//         description: 'Kiến thức nhập môn tiếng Hàn',
//         images: 'https://monday.edu.vn/wp-content/uploads/2023/08/tu-vung-tieng-han-so-cap-1-theo-chu-de.jpg',
//         progress: 50,
//         time: 30,
//         count: 502
//     },
//     {
//         course_name: 'Trung cấp 4',
//         description: 'Kiến thức nhập môn tiếng Hàn',
//         images: 'https://monday.edu.vn/wp-content/uploads/2023/08/tu-vung-tieng-han-so-cap-1-theo-chu-de.jpg',
//         progress: 50,
//         time: 30,
//         count: 502
//     }
// ]
function Course() {
    const [listCourse, setListCourse] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
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