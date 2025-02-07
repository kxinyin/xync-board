"use client";

import { Button, message, Popconfirm, Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import AntdProfileModal from "./antdProfileModal";
import { deleteLoadProfile } from "@/src/services/api/load-profile";
import { mapTableFilterData, statusFilterData } from "@/src/services/dataUtils";
import ConfirmDeletionRecord from "@/src/components/confirm-deletion/record";

export default function AntdProfileTable({ loadProfilesData }) {
  const defaultRecord = { name: "", columns: [], is_enabled: true };

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

    const load_profile_id = record.load_profile_id;

    const { success, message } = await deleteLoadProfile(load_profile_id);

    if (success) {
      setDataSource((prev) =>
        prev.filter((item) => item.load_profile_id !== load_profile_id)
      );

      closeDeleteModal();
      messageApi.success(message);
    } else {
      messageApi.error(message);
    }

    setDeleteLoading(false);
  };

  useEffect(() => {
    if (loadProfilesData) setDataSource(loadProfilesData);
  }, [loadProfilesData]);

  const dataName = mapTableFilterData(loadProfilesData, "name");
  const dataStatus = statusFilterData;

  const columns = [
    {
      title: "Load Profile Name",
      key: "name",
      dataIndex: "name",
      filters: dataName,
      onFilter: (value, record) => record.name === value,
      sorter: (a, b) => a.name.localeCompare(b.name),
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
            title="Delete Load Profile"
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
        moduleName="Load Profile"
        deleteName={record.name}
      />

      <AntdProfileModal
        open={isOpen}
        record={record}
        closeModal={closeModal}
        setDataSource={setDataSource}
        messageApi={messageApi}
        defaultDescriptions={dataSource
          ?.find((profile) => profile.load_profile_id === "1")
          ?.columns.map(({ id: key, name: label, excel_name: children }) => {
            return { key, label, children };
          })}
      />

      <div className="flex items-center justify-end pb-6">
        <Space>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => {
              setRecord({
                ...dataSource.find(
                  (profile) => profile.load_profile_id === "1"
                ),
              });
              openModal();
            }}
          >
            Default Load Profile
          </Button>

          <Button
            color="primary"
            variant="solid"
            onClick={() => {
              setRecord({ ...defaultRecord });
              openModal();
            }}
          >
            New Load Profile
          </Button>
        </Space>
      </div>

      <Table
        dataSource={dataSource
          .filter((profile) => profile.load_profile_id !== "1")
          .map((data, index) => {
            return { ...data, key: index };
          })}
        columns={columns}
        loading={dataSource.length === 0}
      />
    </>
  );
}
