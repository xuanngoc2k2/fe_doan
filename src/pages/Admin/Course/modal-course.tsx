import { Modal } from "antd";

function ModalCourse({ id, open, handelCancle }: { id?: number; open: boolean, handelCancle: () => void }) {
    return (
        <Modal
            title="Basic Modal"
            onCancel={handelCancle}
            open={open}
        >
            <p>Some contents..{id}.</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </Modal>);
}

export default ModalCourse;