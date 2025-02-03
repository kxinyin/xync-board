import { Button, Form, Modal } from "antd";
import { useEffect, useState } from "react";
import AntdProfileForm from "./antdProfileForm";
import {
  createLoadProfile,
  updateLoadProfile,
} from "@/src/services/api/load-profile";

export default function AntdProfileModal({
  open,
  record,
  closeModal,
  setDataSource,
  messageApi,
  defaultDescriptions,
}) {
  const [form] = Form.useForm();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isNewLoadProfile, setIsNewLoadProfile] = useState(false);
  const [isDefaultProfile, setIsDefaultProfile] = useState(false);

  const handleSubmit = async () => {
    try {
      setConfirmLoading(true);

      const values = await form.validateFields();

      const { success, message, data } = isNewLoadProfile
        ? await createLoadProfile(values)
        : await updateLoadProfile(record.load_profile_id, values);

      if (success) {
        setDataSource((prev) =>
          isNewLoadProfile
            ? [...prev, data]
            : prev.map((item) =>
                item.load_profile_id === data.load_profile_id ? data : item
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

      const isDefault = record.load_profile_id === "1";
      setIsDefaultProfile(isDefault);
      setIsNewLoadProfile(!record.load_profile_id);
    }
  }, [open, record]);

  return (
    <Modal
      centered
      width={650}
      maskClosable={false}
      open={open}
      title={
        isDefaultProfile
          ? "Default Load Profile"
          : record?.name || "New Load Profile"
      }
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
      <AntdProfileForm
        form={form}
        isDefaultProfile={isDefaultProfile}
        defaultDescriptions={defaultDescriptions}
      />
    </Modal>
  );
}
