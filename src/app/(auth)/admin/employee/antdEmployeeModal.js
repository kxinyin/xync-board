import { Button, Form } from "antd";
import Modal from "antd/es/modal/Modal";
import { useEffect, useState } from "react";
import AntdEmployeeForm from "./antdEmployeeForm";
import { createEmployee, updateEmployee } from "@/src/services/api/employee";

export default function AntdEmployeeModal({
  open,
  record,
  closeModal,
  setDataSource,
  messageApi,
  rolesData,
  branchesData,
}) {
  const [form] = Form.useForm();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isNewEmp, setIsNewEmp] = useState(false);

  const handleSubmit = async () => {
    try {
      setConfirmLoading(true);

      const values = await form.validateFields();

      const { success, message, data } = isNewEmp
        ? await createEmployee(values)
        : await updateEmployee(values.employee_id, values);

      if (success) {
        const selectedRole = rolesData.find(
          (role) => role.role_id === values.role_id
        );

        const newData = { ...data, role_name: selectedRole.name };

        setDataSource((prev) =>
          isNewEmp
            ? [...prev, newData]
            : prev.map((item) =>
                item.employee_id === data.employee_id ? newData : item
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
    closeModal();
  };

  useEffect(() => {
    if (open && record) {
      form.setFieldsValue(record);

      if (record.employee_id) setIsNewEmp(false);
      else setIsNewEmp(true);
    }
  }, [open, record]);

  return (
    <Modal
      centered
      width={700}
      maskClosable={false}
      open={open}
      title={record?.name || "New Employee"}
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
      <AntdEmployeeForm
        form={form}
        isNewEmp={isNewEmp}
        rolesData={rolesData}
        branchesData={branchesData}
      />
    </Modal>
  );
}
