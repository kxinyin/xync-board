import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";

export default function ConfirmDeletionRecord({
  open,
  deleteLoading,
  handleSubmit,
  handleCancel,
  moduleName,
  deleteName,
}) {
  return (
    <Modal
      centered
      width={400}
      maskClosable={false}
      closable={false}
      open={open}
      title={
        <>
          <ExclamationCircleOutlined style={{ color: "red" }} />
          &ensp;Confirm Deletion
        </>
      }
      confirmLoading={deleteLoading}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okButtonProps={{ disabled: deleteLoading, danger: true }}
      cancelButtonProps={{ disabled: deleteLoading }}
      okText="Delete"
    >
      <div className="space-y-4 text-center">
        <p style={{ color: "red" }}>
          Warning: This action{" "}
          <span className="font-black">cannot be undone.</span>
        </p>

        <p className="text-lg font-black">
          Delete {moduleName}: {deleteName}
        </p>

        {/* // Todo: create a text box for confirmation */}
      </div>
    </Modal>
  );
}
