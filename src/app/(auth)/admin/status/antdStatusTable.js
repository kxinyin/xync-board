"use client";

import { deleteStatus } from "@/src/services/api/status";
import { Button, message, Popconfirm, Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import AntdStatusModal from "./antdStatusModal";

export default function AntdStatusTable({ statusData, rolesData }) {
  const defaultRecord = {
    code: "",
    description: "",
    color: "",
    flag: [],
    is_enabled: true,
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

  const confirmDelete = async (status_id) => {
    setDeleteLoading(true);

    const { success, message } = await deleteStatus(status_id);

    if (success) {
      setDataSource((prev) =>
        prev.filter((item) => item.status_id !== status_id)
      );

      messageApi.success(message);
    } else {
      messageApi.error(message);
    }

    setDeleteLoading(false);
  };

  useEffect(() => {
    if (statusData) setDataSource(statusData);
  }, [statusData]);

  const dataCode = statusData.map((each) => {
    return { text: each.code, value: each.code };
  });

  const dataFlag = rolesData.map((each) => {
    return { text: each.name, value: each.name };
  });

  const dataStatus = [
    { text: "Active", value: true },
    { text: "Inactive", value: false },
  ];

  const columns = [
    {
      title: "Code",
      key: "code",
      dataIndex: "code",
      filters: dataCode,
      onFilter: (value, record) => record.code === value,
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: "Flag",
      key: "flag_name",
      dataIndex: "flag_name",
      filters: dataFlag,
      onFilter: (value, record) => {
        return record.flag_name
          .join(", ")
          .toLowerCase()
          .includes(value.toLowerCase());
      },
      render: (text) => text.join(", "),
    },
    { title: "Description", key: "description", dataIndex: "description" },
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

          <Popconfirm
            title="Delete Status"
            description={
              <span>
                Are you sure you want to delete{" "}
                <span className="font-black">{record.code}</span>?
              </span>
            }
            placement="topRight"
            onConfirm={() => confirmDelete(record.status_id)}
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

      <AntdStatusModal
        open={isOpen}
        record={record}
        closeModal={closeModal}
        setDataSource={setDataSource}
        messageApi={messageApi}
        rolesData={rolesData}
      />

      <div className="flex items-center justify-end pb-6">
        <Button color="primary" variant="solid" onClick={openModal}>
          New Status
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
