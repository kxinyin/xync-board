import { createClient, updateClient } from "@/src/services/api/client";
import { Form, Modal } from "antd";
import { useEffect, useState } from "react";
import AntdClientForm from "./antdClientForm";

export default function AntdClientModal({
  open,
  record,
  closeModal,
  setDataSource,
  messageApi,
  typesData,
}) {
  const [form] = Form.useForm();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isNewClient, setIsNewClient] = useState(false);

  const handleSubmit = async () => {
    try {
      setConfirmLoading(true);

      const values = await form.validateFields();

      const { success, message, data } = isNewClient
        ? await createClient(values)
        : await updateClient(record.client_id, values);

      if (success) {
        setDataSource((prev) =>
          isNewClient
            ? [...prev, data]
            : prev.map((item) =>
                item.client_id === data.client_id ? data : item
              )
        );

        handleCancel();

        messageApi.success(message);
      } else {
        messageApi.error(message);
      }

      setConfirmLoading(false);
    } catch (error) {
      setConfirmLoading(false);
      form.scrollToField(error.errorFields[0].name[0]);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    closeModal();
  };

  useEffect(() => {
    if (open && record) {
      form.setFieldsValue(record);

      if (record.client_id) {
        setIsNewClient(false);
      } else {
        setIsNewClient(true);
      }
    }
  }, [open, record]);

  return (
    <Modal
      centered
      width={650}
      maskClosable={false}
      closable={false}
      open={open}
      title={record?.name || "New Client"}
      confirmLoading={confirmLoading}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okButtonProps={{ disabled: confirmLoading }}
      cancelButtonProps={{ disabled: confirmLoading, danger: true }}
      okText={isNewClient ? "Create" : "Save"}
    >
      <AntdClientForm form={form} typesData={typesData} />
    </Modal>
  );
}
