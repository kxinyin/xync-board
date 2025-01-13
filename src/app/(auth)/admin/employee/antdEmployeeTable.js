"use client";

import { Button, message, Popconfirm, Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import AntdEmployeeModal from "./antdEmployeeModal";
import { deleteEmployee } from "@/src/services/api/employee";

export default function AntdEmployeeTable({
  employeesData,
  rolesData,
  branchesData,
}) {
  const defaultRecord = {
    username: "",
    password: "",
    name: "",
    resigned: false,
    gender: "female",
    role_id: "",
    role_name: "",
    branch_name: "",
    contact_no: "",
    new_ic_no: "",
    old_ic_no: "",
    address: "",
  };

  const [messageApi, contextHolder] = message.useMessage();

  const [dataSource, setDataSource] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [record, setRecord] = useState({ ...defaultRecord });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    setRecord({ ...defaultRecord });
    setIsOpen(false);
  };

  const confirmDelete = async (employee_id) => {
    setDeleteLoading(true);

    const { success, message } = await deleteEmployee(employee_id);

    if (success) {
      setDataSource((prev) =>
        prev.filter((item) => item.employee_id !== employee_id)
      );

      messageApi.success(message);
    } else {
      messageApi.error(message);
    }

    setDeleteLoading(false);
  };

  useEffect(() => {
    if (employeesData) setDataSource(employeesData);
  }, [employeesData]);

  const dataName = employeesData.map((each) => {
    return { text: each.name, value: each.name };
  });

  const dataUsername = employeesData.map((each) => {
    return { text: each.username, value: each.username };
  });

  const dataRole = rolesData.map((each) => {
    return { text: each.name, value: each.role_id };
  });

  const dataBranch = branchesData.map((each) => {
    return { text: each.name, value: each.branch_id };
  });
  const dataResigned = [
    { text: "Resigned", value: true },
    { text: "Active", value: false },
  ];

  const columns = [
    {
      title: "Id",
      key: "employee_id",
      dataIndex: "employee_id",
      responsive: ["lg"],
      sorter: (a, b) => a.employee_id - b.employee_id,
    },
    {
      title: "Full Name",
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
      responsive: ["md"],
      filters: dataBranch,
      onFilter: (value, record) => record.branch_name === value,
      sorter: (a, b) => a.branch_name.localeCompare(b.branch_name),
    },
    {
      title: "Status",
      key: "resigned",
      dataIndex: "resigned",
      align: "center",
      responsive: ["md"],
      filters: dataResigned,
      onFilter: (value, record) => record.resigned === value,
      sorter: (a, b) => a.resigned - b.resigned,
      render: (value, index) => (
        <Tag key={index} color={value ? "red" : "green"}>
          {value ? "Resigned" : "Active"}
        </Tag>
      ),
    },
    {
      title: "Actions",
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
            onConfirm={() => confirmDelete(record.employee_id)}
            okButtonProps={{ loading: deleteLoading }}
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
