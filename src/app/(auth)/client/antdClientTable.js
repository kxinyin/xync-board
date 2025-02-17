"use client";

import { deleteClient } from "@/src/services/api/client";
import { mapTableFilterData, statusFilterData } from "@/src/lib/utils/dataUtils";
import { Button, message, Popconfirm, Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import AntdClientModal from "./antdClientModal";
import ConfirmDeletionRecord from "@/src/components/confirm-deletion/record";

export default function AntdClientTable({ clientsData, typesData }) {
  const defaultRecord = {
    name: "",
    register_no: "",
    email: "",
    contact_person: "",
    contact_no_1: "",
    contact_no_2: "",
    address: "",
    client_type: "",
    commission_rate: "",
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

    const client_id = record.client_id;

    const { success, message } = await deleteClient(client_id);

    if (success) {
      setDataSource((prev) =>
        prev.filter((item) => item.client_id !== client_id)
      );

      closeDeleteModal();
      messageApi.success(message);
    } else {
      messageApi.error(message);
    }

    setDeleteLoading(false);
  };

  useEffect(() => {
    if (clientsData) setDataSource(clientsData);
  }, [clientsData]);

  const dataName = mapTableFilterData(clientsData, "name");
  const dataContactPerson = mapTableFilterData(clientsData, "contact_person");
  const dataContactNo1 = mapTableFilterData(clientsData, "contact_no_1");
  const dataClientType = typesData.map((type) => ({ text: type, value: type }));
  const dataComRate = mapTableFilterData(clientsData, "commission_rate");
  const dataStatus = statusFilterData;

  const columns = [
    {
      title: "Client Name",
      key: "name",
      dataIndex: "name",
      filters: dataName,
      filterSearch: true,
      onFilter: (value, record) => record.name.startsWith(value),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Contact Person",
      key: "contact_person",
      dataIndex: "contact_person",
      filters: dataContactPerson,
      filterSearch: true,
      onFilter: (value, record) => record.contact_person.startsWith(value),
      sorter: (a, b) => a.contact_person.localeCompare(b.contact_person),
    },
    {
      title: "Contact No. (1)",
      key: "contact_no_1",
      dataIndex: "contact_no_1",
      responsive: ["md"],
      filters: dataContactNo1,
      filterSearch: true,
      onFilter: (value, record) => record.contact_no_1.startsWith(value),
      sorter: (a, b) => a.contact_no_1.localeCompare(b.contact_no_1),
    },
    {
      title: "Client Type",
      key: "client_type",
      dataIndex: "client_type",
      align: "center",
      responsive: ["lg"],
      filters: dataClientType,
      onFilter: (value, record) => record.client_type.startsWith(value),
      sorter: (a, b) => a.client_type.localeCompare(b.client_type),
    },
    {
      title: "Comm. Rate (%)",
      key: "commission_rate",
      dataIndex: "commission_rate",
      align: "center",
      responsive: ["lg"],
      filters: dataComRate,
      onFilters: (value, record) => record.commission_rate.startsWith(value),
      sorter: (a, b) => a.commission_rate - b.commission_rate,
      render: (value) => value + "%",
    },
    {
      title: "Total Batch",
      key: "batch_next_no",
      dataIndex: "batch_next_no",
      align: "center",
      responsive: ["xl"],
      render: (value) => value - 1,
      sorter: (a, b) => a.batch_next_no - b.batch_next_no,
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
            title="Delete Client"
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
        moduleName="Client"
        deleteName={record.name}
      />

      <AntdClientModal
        open={isOpen}
        record={record}
        closeModal={closeModal}
        setDataSource={setDataSource}
        messageApi={messageApi}
        typesData={typesData}
      />

      <div className="flex items-center justify-end pb-6">
        <Button color="primary" variant="solid" onClick={openModal}>
          New Client
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
