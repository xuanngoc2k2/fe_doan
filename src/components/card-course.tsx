import { Card, Progress, ProgressProps } from 'antd';
import './styles/card-course.scss';
import {
    FieldTimeOutlined,
    UsergroupAddOutlined,
    //  UsergroupAddOutlined 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
interface CourseProps {
    course: {
        course_name: string;
        description: string;
        images?: string;
        progress?: number;
        time: number;
        count: number;
    }
}

const twoColors: ProgressProps['strokeColor'] = {
    '0%': '#108ee9',
    '100%': '#87d068',
};
const CardCourse: React.FC<CourseProps> = ({ course }) => {
    return (
        <div className='card-course' style={{ marginBottom: 20 }}>
            <Link to="/">
                <Card
                    // style={{ position: 'relative' }}
                    hoverable
                    cover={<img style={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} alt="example" src={course.images ? course.images : "https://monday.edu.vn/wp-content/uploads/2023/08/tu-vung-tieng-han-so-cap-1-theo-chu-de.jpg"} />}
                >
                    <div className='course-info'>
                        <div className='course-name'>
                            <h2>{course.course_name}</h2>
                            <p>{course.description}</p>
                        </div>
                        <div className='course-time'>
                            <p><FieldTimeOutlined style={{ color: '#1677ff', fontSize: 20 }} /> {course.time} Hours</p>
                            {/* <p><UsergroupAddOutlined style={{ color: '#1677ff', fontSize: 20 }} /> 888888</p> */}
                        </div>
                    </div>
                    <div className='course-progress'>
                        <Progress strokeColor={twoColors} percent={10} showInfo={false} />
                        <p>{course.progress ? course.progress : 0}% Hoàn thành</p>
                    </div>
                    <div className='course-people'>
                        <UsergroupAddOutlined /> <span>{course.count}</span>
                    </div>
                    {/* <Meta title="Europe Street beat" description="www.instagram.com" /> */}
                </Card>
            </Link>
        </div>
    );
};

export default CardCourse;
