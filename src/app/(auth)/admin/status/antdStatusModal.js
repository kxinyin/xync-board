import { Button, Form, Modal } from "antd";
import { useEffect, useState } from "react";
import AntdStatusForm from "./antdStatusForm";
import { sortBy } from "lodash";
import { createStatus, updateStatus } from "@/src/services/api/status";

export default function AntdStatusModal({
  open,
  record,
  closeModal,
  setDataSource,
  messageApi,
  rolesData,
}) {
  const [form] = Form.useForm();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isNewStatus, setIsNewStatus] = useState(false);
  const [flag, setFlag] = useState([]);
  const [color, setColor] = useState();

  const handleSubmit = async () => {
    try {
      setConfirmLoading(true);

      const values = await form.validateFields();
      values.flag = flag;
      values.color = color;

      const { success, message, data } = isNewStatus
        ? await createStatus(values)
        : await updateStatus(record.status_id, values);

      if (success) {
        const flag_name = rolesData
          .filter((item) => data.flag.includes(item.role_id))
          .map((item) => item.name);

        const newData = { ...data, flag_name };

        setDataSource((prev) =>
          isNewStatus
            ? [...prev, newData]
            : prev.map((item) =>
                item.status_id === data.status_id ? newData : item
              )
        );

        setConfirmLoading(false);
        handleCancel();

        messageApi.success(message);
      } else {
        messageApi.error(message);
      }
    } catch (error) {
      setConfirmLoading(false);
      form.scrollToField(error.errorFields[0].name[0]);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFlag([]);
    setColor();
    closeModal();
  };

  const handleTransferChange = (nextTargetKeys) => {
    const rolesArr = rolesData.map((each) => each.role_id);

    const reordered = sortBy(nextTargetKeys, (item) => rolesArr.indexOf(item));
    setFlag(reordered);
  };

  const handleColorChange = (color) => {
    setColor(color.toHexString());
  };

  useEffect(() => {
    if (open && record) {
      form.setFieldsValue(record);

      if (record.status_id) {
        setIsNewStatus(false);
        setFlag(record.flag);
        setColor(record.color);
      } else {
        setIsNewStatus(true);
      }
    }
  }, [open, record]);

  return (
    <Modal
      centered
      width={600}
      maskClosable={false}
      open={open}
      title={record?.code || "New Status"}
      closable={false}
      confirmLoading={confirmLoading}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okButtonProps={{ disabled: confirmLoading }}
      cancelButtonProps={{ disabled: confirmLoading }}
      footer={(_, { OkBtn }) => (
        <>
          <Button
            key="cancel"
            color="danger"
            variant="outlined"
            onClick={handleCancel}
            disabled={confirmLoading}
          >
            Cancel
          </Button>

          <OkBtn />
        </>
      )}
    >
      <AntdStatusForm
        form={form}
        rolesData={rolesData}
        flag={flag}
        color={color}
        handleTransferChange={handleTransferChange}
        handleColorChange={handleColorChange}
      />
    </Modal>
  );
}
