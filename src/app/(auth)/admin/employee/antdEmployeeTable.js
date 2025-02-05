"use client";

import { Button, message, Popconfirm, Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import AntdEmployeeModal from "./antdEmployeeModal";
import { deleteEmployee } from "@/src/services/api/employee";
import { mapTableFilterData, statusFilterData } from "@/src/services/dataUtils";
import ConfirmDeletionRecord from "@/src/components/confirm-deletion/record";

export default function AntdEmployeeTable({
  employeesData,
  rolesData,
  branchesData,
}) {
  const defaultRecord = {
    username: "",
    password: "",
    name: "",
    gender: "female",
    role_name: "",
    branch_name: "",
    contact_no: "",
    new_ic_no: "",
    old_ic_no: "",
    address: "",
    is_enabled: true,
  };

  const [messageApi, contextHolder] = message.useMessage();

  const [dataSource, setDataSource] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [record, setRecord] = useState({ ...defaultRecord });
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    setRecord({ ...defaultRecord });
    setIsOpen(false);
  };

  const openDeleteModal = () => setIsOpenDelete(true);

  const closeDeleteModal = () => {
    setRecord({ ...defaultRecord });
    setIsOpenDelete(false);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);

    const employee_id = record.employee_id;

    const { success, message } = await deleteEmployee(employee_id);

    if (success) {
      setDataSource((prev) =>
        prev.filter((item) => item.employee_id !== employee_id)
      );

      closeDeleteModal();
      messageApi.success(message);
    } else {
      messageApi.error(message);
    }

    setDeleteLoading(false);
  };

  useEffect(() => {
    if (employeesData) setDataSource(employeesData);
  }, [employeesData]);

  const dataName = mapTableFilterData(employeesData, "name");
  const dataUsername = mapTableFilterData(employeesData, "username");
  const dataRole = mapTableFilterData(rolesData, "name", "role_id");
  const dataBranch = mapTableFilterData(branchesData, "name", "branch_id");
  const dataStatus = statusFilterData;

  const columns = [
    {
      title: "Employee Name",
      key: "name",
      dataIndex: "name",
      filters: dataName,
      filterSearch: true,
      onFilter: (value, record) => record.name.startsWith(value),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Username",
      key: "username",
      dataIndex: "username",
      filters: dataUsername,
      filterSearch: true,
      onFilter: (value, record) => record.username.startsWith(value),
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Role",
      key: "role_name",
      dataIndex: "role_name",
      responsive: ["sm"],
      filters: dataRole,
      onFilter: (value, record) => record.role_id === value,
      sorter: (a, b) => a.role_name.localeCompare(b.role_name),
    },
    {
      title: "Branch",
      key: "branch_name",
      dataIndex: "branch_name",
      align: "center",
      responsive: ["md"],
      filters: dataBranch,
      onFilter: (value, record) => record.branch_name === value,
      sorter: (a, b) => a.branch_name.localeCompare(b.branch_name),
    },
    {
      title: "Status",
      key: "is_enabled",
      dataIndex: "is_enabled",
      align: "center",
      responsive: ["md"],
      filters: dataStatus,
      onFilter: (value, record) => record.is_enabled === value,
      sorter: (a, b) => a.is_enabled - b.is_enabled,
      render: (value, index) => (
        <Tag key={index} color={value ? "green" : "red"}>
          {value ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "",
      key: "actions",
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            color="primary"
            variant="outlined"
            size="small"
            onClick={() => {
              setRecord(record);
              openModal();
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete Employee"
            description={
              <span>
                Are you sure you want to delete{" "}
                <span className="font-black">{record.username}</span>?
              </span>
            }
            placement="topRight"
            onConfirm={() => {
              setRecord(record);
              openDeleteModal();
            }}
            okButtonProps={{ loading: deleteLoading, danger: true }}
            okText="Delete"
          >
            <Button color="danger" variant="outlined" size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}

      <ConfirmDeletionRecord
        open={isOpenDelete}
        deleteLoading={deleteLoading}
        handleSubmit={confirmDelete}
        handleCancel={closeDeleteModal}
        moduleName="Employee"
        deleteName={record.username}
      />

      <AntdEmployeeModal
        open={isOpen}
        record={record}
        closeModal={closeModal}
        setDataSource={setDataSource}
        messageApi={messageApi}
        rolesData={rolesData}
        branchesData={branchesData}
      />

      <div className="flex items-center justify-end pb-6">
        <Button color="primary" variant="solid" onClick={openModal}>
          New Employee
        </Button>
      </div>

      <Table
        dataSource={dataSource.map((data, index) => {
          return { ...data, key: index };
        })}
        columns={columns}
        loading={dataSource.length === 0}
      />
    </>
  );
}
