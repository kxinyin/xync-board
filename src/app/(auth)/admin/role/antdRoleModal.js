import { Button, Form, Modal } from "antd";
import { useEffect, useState } from "react";
import AntdRoleForm from "./antdRoleForm";
import { sortBy } from "lodash";
import { createRole, updateRole } from "@/src/services/api/role";

export default function AntdRoleModal({
  open,
  record,
  closeModal,
  setDataSource,
  messageApi,
  modulesData,
}) {
  const [form] = Form.useForm();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isNewRole, setIsNewRole] = useState(false);
  const [permission, setPermission] = useState([]);

  const handleSubmit = async () => {
    try {
      setConfirmLoading(true);

      const values = await form.validateFields();
      values.permission = permission;

      const { success, message, data } = isNewRole
        ? await createRole(values)
        : await updateRole(record.role_id, values);

      if (success) {
        setDataSource((prev) =>
          isNewRole
            ? [...prev, data]
            : prev.map((item) => (item.role_id === data.role_id ? data : item))
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
    setPermission([]);
    closeModal();
  };

  const handleTransferChange = (nextTargetKeys) => {
    const modulesArr = modulesData.map((each) => each.id);

    const reordered = sortBy(nextTargetKeys, (item) =>
      modulesArr.indexOf(item)
    );

    setPermission(reordered);
  };

  useEffect(() => {
    if (open && record) {
      form.setFieldsValue(record);

      if (record.role_id) {
        setIsNewRole(false);
        setPermission(record.permission);
      } else {
        setIsNewRole(true);
      }
    }
  }, [open, record]);

  return (
    <Modal
      centered
      width={600}
      maskClosable={false}
      open={open}
      title={record?.name || "New Role"}
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
      <AntdRoleForm
        form={form}
        modulesData={modulesData}
        permission={permission}
        handleTransferChange={handleTransferChange}
      />
    </Modal>
  );
}
