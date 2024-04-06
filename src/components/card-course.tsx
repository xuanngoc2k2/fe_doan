import { Card, Progress, ProgressProps } from 'antd';
import './styles/card-course.scss';
import {
    FieldTimeOutlined,
    UsergroupAddOutlined,
    //  UsergroupAddOutlined 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
// interface CourseProps {
//     title: string;
//     answer?: string;
//     isQuestion: boolean;
//     description?: string;
// }

const twoColors: ProgressProps['strokeColor'] = {
    '0%': '#108ee9',
    '100%': '#87d068',
};
const CardCourse: React.FC = () => {
    return (
        <div className='card-course' style={{ marginBottom: 20 }}>
            <Link to="/">
                <Card
                    // style={{ position: 'relative' }}
                    hoverable
                    cover={<img alt="example" src="https://monday.edu.vn/wp-content/uploads/2023/08/tu-vung-tieng-han-so-cap-1-theo-chu-de.jpg" />}
                >
                    <div className='course-info'>
                        <div className='course-name'>
                            <h2>Tiếng hàn tổng hợp sơ cấp 1</h2>
                            <p>Để có cái nhìn tổng quan về ngành IT - Lập trình web các bạn nên xem các videos tại khóa này trước nhé.</p>
                        </div>
                        <div className='course-time'>
                            <p><FieldTimeOutlined style={{ color: '#1677ff', fontSize: 20 }} /> 0 Hours</p>
                            {/* <p><UsergroupAddOutlined style={{ color: '#1677ff', fontSize: 20 }} /> 888888</p> */}
                        </div>
                    </div>
                    <div className='course-progress'>
                        <Progress strokeColor={twoColors} percent={10} showInfo={false} />
                        <p>{10}% Hoàn thành</p>
                    </div>
                    <div className='course-people'>
                        <UsergroupAddOutlined /> <span>8.888</span>
                    </div>
                    {/* <Meta title="Europe Street beat" description="www.instagram.com" /> */}
                </Card>
            </Link>
        </div>
    );
};

export default CardCourse;
