"use client";

import { Button, Space, Table, Tag } from "antd";
import { DeleteOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import AntdToggleBatchViewButton from "./antdToggleViewButton";
import { useEffect, useState } from "react";
import { getCustomers } from "@/src/services/api/customer";
import { API_PAGE_SIZE } from "@/src/lib/constants";
import { mapTableFilterData } from "@/src/lib/utils/dataUtils";

export default function AntdCustomerTable({}) {
  const defaultRecord = {};
  const pageSize = API_PAGE_SIZE;

  const [pageNo, setPageNo] = useState(1);
  const [dataSource, setDataSource] = useState([]);
  const [record, setRecord] = useState({ ...defaultRecord });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const hasSelected = selectedRowKeys.length > 0;

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleBulkDelete = () => {
    console.log("Bulk delete:", selectedRowKeys);
  };

  const handleBulkAssign = () => {
    console.log("Bulk assign:", selectedRowKeys);
  };

  useEffect(() => {
    const fetchData = async () => {
      const customers = await getCustomers(pageNo);
      if (customers.success) setDataSource(customers.data);
    };

    fetchData();
  }, [pageNo]);

  const dataBatchNo = mapTableFilterData(dataSource, "batch_no");
  const dataCustomerName = mapTableFilterData(dataSource, "name");
  const dataNewIcNo = mapTableFilterData(dataSource, "new_ic_no");
  const dataOldIcNo = mapTableFilterData(dataSource, "old_ic_no");
  const dataAge = mapTableFilterData(dataSource, "age");
  const dataAgreementNo = mapTableFilterData(dataSource, "agreement_no");
  const dataNoPlate = mapTableFilterData(dataSource, "no_plate");
  const dataModel = mapTableFilterData(dataSource, "model");
  const dataStatus = mapTableFilterData(dataSource, "status");
  const dataCollector = mapTableFilterData(dataSource, "employee_username");

  const columns = [
    {
      title: "No.",
      key: "index",
      dataIndex: "index",
      render: (text, record, index) => (pageNo - 1) * pageSize + index + 1,
    },
    {
      title: "Batch No.",
      key: "batch_no",
      dataIndex: "batch_no",
      fixed: "left",
      filters: dataBatchNo,
      filterSearch: true,
      onFilter: (value, record) => record.batch_no.startsWith(value),
      sorter: (a, b) => a.batch_no.localeCompare(b.batch_no),
    },
    { title: "File No." },
    {
      title: "Customer Name",
      key: "name",
      dataIndex: "name",
      fixed: "left",
      filters: dataCustomerName,
      filterSearch: true,
      onFilter: (value, record) => record.name.startsWith(value),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "New IC",
      key: "new_ic_no",
      dataIndex: "new_ic_no",
      filters: dataNewIcNo,
      filterSearch: true,
      onFilter: (value, record) => record.new_ic_no.startsWith(value),
      sorter: (a, b) => a.new_ic_no.localeCompare(b.new_ic_no),
    },
    {
      title: "Old IC",
      key: "old_ic_no",
      dataIndex: "old_ic_no",
      filters: dataOldIcNo,
      filterSearch: true,
      onFilter: (value, record) => record.old_ic_no.startsWith(value),
      sorter: (a, b) => a.old_ic_no.localeCompare(b.old_ic_no),
    },
    {
      title: "Age",
      key: "age",
      dataIndex: "age",
      filters: dataAge,
      filterSearch: true,
      onFilter: (value, record) => record.age.startsWith(value),
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Agreement No.",
      key: "agreement_no",
      dataIndex: "agreement_no",
      filters: dataAgreementNo,
      filterSearch: true,
      onFilter: (value, record) => record.agreement_no.startsWith(value),
      sorter: (a, b) => a.agreement_no.localeCompare(b.agreement_no),
    },
    {
      title: "Agreement Date",
      key: "agreement_date",
      dataIndex: "agreement_date",
    },
    {
      title: "No. Plate",
      key: "no_plate",
      dataIndex: "no_plate",
      filters: dataNoPlate,
      filterSearch: true,
      onFilter: (value, record) => record.no_plate.startsWith(value),
      sorter: (a, b) => a.no_plate.localeCompare(b.no_plate),
    },
    {
      title: "Model",
      key: "model",
      dataIndex: "model",
      filters: dataModel,
      filterSearch: true,
      onFilter: (value, record) => record.model.startsWith(value),
      sorter: (a, b) => a.model.localeCompare(b.model),
    },
    { title: "Next Call", key: "next_call_at", dataIndex: "next_call_at" },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      filters: dataStatus,
      filterSearch: true,
      onFilter: (value, record) => record.status.startsWith(value),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Collector",
      key: "employee_username",
      dataIndex: "employee_username",
      filters: dataCollector,
      filterSearch: true,
      onFilter: (value, record) => record.employee_username.startsWith(value),
      sorter: (a, b) => a.employee_username.localeCompare(b.employee_username),
    },
    { title: "Last Remark" },
    { title: "Last Remark Date" },
    { title: "Amount", key: "amount", dataIndex: "amount" },
    { title: "Total Paid", key: "total_paid", dataIndex: "total_paid" },
    { title: "Balance" },
    { title: "Last Paid Date", key: "last_paid_at", dataIndex: "last_paid_at" },
    { title: "Branch Name" },
    { title: "Last Internal Remark" },
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
              // open customer details
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
      <div className="flex items-center justify-between pb-6">
        <AntdToggleBatchViewButton />

        <Space>
          {hasSelected ? (
            <Tag bordered={false} color="green">
              Selected{" "}
              <span className="font-black">{selectedRowKeys.length}</span> items
            </Tag>
          ) : (
            <Tag bordered={false}>No item selected</Tag>
          )}

          <Button
            color="danger"
            variant="outlined"
            disabled={!hasSelected}
            onClick={handleBulkDelete}
          >
            <DeleteOutlined /> Delete
          </Button>

          <Button
            color="primary"
            variant="outlined"
            disabled={!hasSelected}
            onClick={handleBulkAssign}
          >
            <UserOutlined /> Assign To
          </Button>

          <Button color="primary" variant="solid">
            <PlusOutlined /> New Customer
          </Button>
        </Space>
      </div>

      <Table
        size="middle"
        dataSource={dataSource.map((data, index) => {
          return { ...data, key: index };
        })}
        columns={columns}
        loading={dataSource.length === 0}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
          fixed: "left",
        }}
        scroll={{ x: "max-content" }}
        pagination={{ pageSize }}
      />
    </>
  );
}
