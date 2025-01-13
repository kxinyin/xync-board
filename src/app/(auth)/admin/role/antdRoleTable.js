"use client";

import { Button, message, Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import AntdRoleModal from "./antdRoleModal";

export default function AntdRoleTable({ rolesData, modulesData }) {
  const defaultRecord = { name: "", is_enabled: true, permission: [] };

  const [messageApi, contextHolder] = message.useMessage();

  const [dataSource, setDataSource] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [record, setRecord] = useState({ ...defaultRecord });

  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    setRecord({ ...defaultRecord });
    setIsOpen(false);
  };

  useEffect(() => {
    if (rolesData) setDataSource(rolesData);
  }, [rolesData]);

  const dataName = rolesData.map((each) => {
    return { text: each.name, value: each.role_id };
  });

  const dataStatus = [
    { text: "Active", value: true },
    { text: "Inactive", value: false },
  ];

  const columns = [
    {
      title: "Role Name",
      key: "name",
      dataIndex: "name",
      filters: dataName,
      onFilter: (value, record) => record.role_id === value,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "No. of Employee Assign",
      key: "employee_count",
      dataIndex: "employee_count",
      align: "center",
      sorter: (a, b) => a.employee_count - b.employee_count,
    },
    {
      title: "Status",
      key: "is_enabled",
      dataIndex: "is_enabled",
      align: "center",
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
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}

      <AntdRoleModal
        open={isOpen}
        record={record}
        closeModal={closeModal}
        setDataSource={setDataSource}
        messageApi={messageApi}
        modulesData={modulesData}
      />

      <div className="flex items-center justify-end pb-6">
        <Button color="primary" variant="solid" onClick={openModal}>
          New Role
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
