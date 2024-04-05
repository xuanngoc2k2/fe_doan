import { Col, Row } from "antd";
import { Link } from "react-router-dom";

function Footer() {
    return (<>
        <Row className="footer-container">
            <Col span={8} className="footer-logo">
                <Link to={'/'}>
                    <img width={70} src="../../../src/assets/images/logo.png" />
                </Link>
                <div style={{ color: "red" }}>Email:<a href="/"> admin@heykorean.com</a></div>
            </Col>
            <Col span={16} className="footer-content">
                <div className="footer-menu">
                    <p className="footer-item-menu-title">KHÓA HỌC</p>
                    <ul>
                        <li><a>Sơ cấp 1</a></li>
                        <li><a>Sơ cấp 2</a></li>
                        <li><a>Trung cấp 3</a></li>
                        <li><a>Trung cấp 4</a></li>
                    </ul>
                </div>
                <div className="footer-menu">
                    <p className="footer-item-menu-title">ÔN THI</p>
                    <ul>
                        <li><a>Làm đề TOPIK I</a></li>
                        <li><a>Làm đề TOPIK II</a></li>
                        <li><a>Làm đề EPS</a></li>
                    </ul>
                </div>
                <div className="footer-menu">
                    <p className="footer-item-menu-title">TỪ VỰNG</p>
                    <ul>
                        <li><a>Từ vựng của tôi</a></li>
                        <li><a>Học mới từ vựng</a></li>
                    </ul>
                </div>
            </Col>
        </Row>
    </>
    );
}

export default Footer;