import { Modal } from "antd";
// import { useState } from "react";

function ModalAnswer({ id }: { id: number }) {
    // const [open, setOpen] = useState(id ? true : false);
    return (
        <Modal
        // open={open}
        >
            <h1>Answer {id}</h1>
        </Modal>);
}

export default ModalAnswer;