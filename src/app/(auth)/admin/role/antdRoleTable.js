"use client";

import { Button, message, Popconfirm, Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import AntdRoleModal from "./antdRoleModal";
import { mapTableFilterData, statusFilterData } from "@/src/services/dataUtils";
import { deleteRole } from "@/src/services/api/role";
import ConfirmDeletionRecord from "@/src/components/confirm-deletion/record";

export default function AntdRoleTable({ rolesData, modulesData }) {
  const defaultRecord = { name: "", is_enabled: true, permission: [] };

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

    const role_id = record.role_id;

    const { success, message } = await deleteRole(role_id);

    if (success) {
      setDataSource((prev) => prev.filter((item) => item.role_id !== role_id));

      closeDeleteModal();
      messageApi.success(message);
    } else {
      messageApi.error(message);
    }

    setDeleteLoading(false);
  };

  useEffect(() => {
    if (rolesData) setDataSource(rolesData);
  }, [rolesData]);

  const dataName = mapTableFilterData(rolesData, "name", "role_id");
  const dataStatus = statusFilterData;

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
      title: "No. of Employees Assigned",
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
            title="Delete Role"
            description={
              <span>
                Are you sure you want to delete{" "}
                <span className="font-black">{record.name}</span>?
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
        moduleName="Role"
        deleteName={record.name}
      />

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
