import {
  CloseOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Tabs,
  Tooltip,
} from "antd";
import { startCase } from "lodash";
import { useEffect, useState } from "react";

export default function AntdCustomerForm({
  form,
  clientsData,
  batchesData,
  employeesData,
  loadProfilesData,
}) {
  const [guarantorActiveTabKey, setGuarantorActiveTabKey] = useState("0");
  const [referrerActiveTabKey, setReferrerActiveTabKey] = useState("0");
  const [loadProfileColumns, setLoadProfileColumns] = useState([]);

  const [contactPerson, setContactPerson] = useState("");

  const handleClientChange = (value) => {
    const client = clientsData.find((item) => item.client_id === value);
    setContactPerson(client.contact_person || "");
  };

  const handleLoadProfileChange = (value) => {
    const profile = loadProfilesData.find(
      (item) => item.load_profile_id === value
    );

    setLoadProfileColumns(profile ? profile.columns : []);

    form.setFieldsValue(
      profile
        ? Object.fromEntries(profile.columns.map((col) => [col.name, ""]))
        : {}
    );
  };

  useEffect(() => {
    const formValue = form.getFieldValue();

    if (Object.keys(formValue).length > 0) {
      handleClientChange(formValue.client_id);
      handleLoadProfileChange(formValue.load_profile_id);
    }
  }, [form]);

  return (
    <Form form={form} layout="vertical">
      <Row gutter={[16, 16]}>
        {/* Customer Name */}
        <Col xs={16} md={12} lg={16} xl={12}>
          <Form.Item
            label="Customer Name"
            name="name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter customer name" />
          </Form.Item>
        </Col>

        {/* Age */}
        <Col xs={8} md={4} lg={8} xl={4}>
          <Form.Item label="Age" name="age" rules={[{ required: true }]}>
            <InputNumber
              min={1}
              max={100}
              step={1}
              precision={0}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        {/* Gender */}
        <Col xs={12} md={8} lg={12} xl={8}>
          <Form.Item label="Gender" name="gender">
            <Radio.Group className="w-full text-center">
              <Radio.Button value="female" className="w-1/2">
                Female
              </Radio.Button>
              <Radio.Button value="male" className="w-1/2">
                Male
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>

        {/* Occupation */}
        <Col xs={12} md={8} lg={12} xl={8}>
          <Form.Item label="Occupation" name="occupation">
            <Input placeholder="Enter occupation" />
          </Form.Item>
        </Col>

        {/* New IC No. */}
        <Col xs={12} md={8} lg={12} xl={8}>
          <Form.Item label="New IC No." name="new_ic_no">
            <Input placeholder="Enter new IC number" />
          </Form.Item>
        </Col>

        {/* Old IC No. */}
        <Col xs={12} md={8} lg={12} xl={8}>
          <Form.Item label="Old IC No." name="old_ic_no">
            <Input placeholder="Enter old IC number" />
          </Form.Item>
        </Col>

        {/* Contact No. */}
        <Col xs={24} md={10} lg={24} xl={10}>
          <Card
            title="Contact No."
            size="small"
            style={{ marginBottom: "16px" }}
          >
            <Form.List name="contact_no">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} className="flex items-baseline gap-2">
                      <Form.Item
                        {...restField}
                        name={name}
                        rules={[
                          {
                            required: true,
                            message: "Please enter a contact number!",
                          },
                        ]}
                        className="w-full"
                      >
                        <Input placeholder="Enter contact number" />
                      </Form.Item>
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        style={{ color: "red" }}
                      />
                    </div>
                  ))}

                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Contact
                  </Button>
                </>
              )}
            </Form.List>
          </Card>
        </Col>

        {/* Address */}
        <Col xs={24} md={14} lg={24} xl={14}>
          <Card title="Address" size="small" style={{ marginBottom: "16px" }}>
            <Form.List name="address">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} className="flex items-baseline gap-2">
                      <Form.Item
                        {...restField}
                        name={name}
                        rules={[
                          {
                            required: true,
                            message: "Please enter a address!",
                          },
                        ]}
                        className="w-full"
                      >
                        <Input.TextArea placeholder="Enter address" />
                      </Form.Item>
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        style={{ color: "red" }}
                      />
                    </div>
                  ))}

                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Address
                  </Button>
                </>
              )}
            </Form.List>
          </Card>
        </Col>

        {/* Guarantor */}
        <Col xs={24} md={12} lg={24} xl={12}>
          <Card
            title="Guarantors"
            size="small"
            style={{ marginBottom: "16px" }}
          >
            <Form.List name="guarantor">
              {(fields, { add, remove }) => {
                const tabItems = fields.map(
                  ({ key, name, ...restField }, index) => ({
                    key: `${index}`,
                    label: (
                      <Space size="small">
                        Guarantor {index + 1}
                        <Tooltip title="Remove Guarantor">
                          <CloseOutlined
                            style={{ color: "red", cursor: "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent tab switch when closing
                              remove(name);
                              setGuarantorActiveTabKey(
                                fields.length > 1 ? "0" : ""
                              ); // Reset to first tab or Add
                            }}
                          />
                        </Tooltip>
                      </Space>
                    ),
                    children: (
                      <div key={key}>
                        <Form.Item
                          {...restField}
                          label="Name"
                          name={[name, "name"]}
                          rules={[
                            {
                              required: true,
                              message: "Enter guarantor's name!",
                            },
                          ]}
                        >
                          <Input placeholder="Enter guarantor name" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label="IC No."
                          name={[name, "ic_no"]}
                          rules={[
                            { required: true, message: "Enter IC number!" },
                          ]}
                        >
                          <Input placeholder="Enter IC number" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label="Contact No."
                          name={[name, "contact_no"]}
                          rules={[
                            {
                              required: true,
                              message: "Enter contact number!",
                            },
                          ]}
                        >
                          <Input placeholder="Enter contact number" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label="Address"
                          name={[name, "address"]}
                          rules={[
                            { required: true, message: "Enter address!" },
                          ]}
                        >
                          <Input.TextArea placeholder="Enter address" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label="Relationship"
                          name={[name, "relationship"]}
                          rules={[
                            {
                              required: true,
                              message: "Enter relationship!",
                            },
                          ]}
                        >
                          <Input placeholder="Enter relationship" />
                        </Form.Item>
                      </div>
                    ),
                  })
                );

                // Add "Add" button as a tab
                tabItems.push({
                  key: "add",
                  label: (
                    <Tooltip title="Add Guarantor">
                      <PlusOutlined />
                    </Tooltip>
                  ),
                  children: null,
                });

                return (
                  <Tabs
                    size="small"
                    type="card"
                    activeKey={guarantorActiveTabKey}
                    onChange={(key) => {
                      if (key === "add") {
                        add({}); // Add a new empty guarantor
                        setGuarantorActiveTabKey(`${fields.length}`); // Switch to new tab
                      } else {
                        setGuarantorActiveTabKey(key);
                      }
                    }}
                    items={tabItems}
                  />
                );
              }}
            </Form.List>
          </Card>
        </Col>

        {/* Referer */}
        <Col xs={24} md={12} lg={24} xl={12}>
          <Card title="Referrers" size="small" style={{ marginBottom: "16px" }}>
            <Form.List name="referrer">
              {(fields, { add, remove }) => {
                const tabItems = fields.map(
                  ({ key, name, ...restField }, index) => ({
                    key: `${index}`,
                    label: (
                      <Space size="small">
                        Referrer {index + 1}
                        <Tooltip title="Remove Referrer">
                          <CloseOutlined
                            style={{ color: "red", cursor: "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent tab switch when closing
                              remove(name);
                              setReferrerActiveTabKey(
                                fields.length > 1 ? "0" : ""
                              ); // Reset to first tab or Add
                            }}
                          />
                        </Tooltip>
                      </Space>
                    ),
                    children: (
                      <div key={key}>
                        <Form.Item
                          {...restField}
                          label="Name"
                          name={[name, "name"]}
                          rules={[
                            {
                              required: true,
                              message: "Enter referrer's name!",
                            },
                          ]}
                        >
                          <Input placeholder="Enter referrer name" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label="IC No."
                          name={[name, "ic_no"]}
                          rules={[
                            { required: true, message: "Enter IC number!" },
                          ]}
                        >
                          <Input placeholder="Enter IC number" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label="Contact No."
                          name={[name, "contact_no"]}
                          rules={[
                            {
                              required: true,
                              message: "Enter contact number!",
                            },
                          ]}
                        >
                          <Input placeholder="Enter contact number" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label="Address"
                          name={[name, "address"]}
                          rules={[
                            { required: true, message: "Enter address!" },
                          ]}
                        >
                          <Input.TextArea placeholder="Enter address" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label="Relationship"
                          name={[name, "relationship"]}
                          rules={[
                            {
                              required: true,
                              message: "Enter relationship!",
                            },
                          ]}
                        >
                          <Input placeholder="Enter relationship" />
                        </Form.Item>
                      </div>
                    ),
                  })
                );

                // Add "Add" button as a tab
                tabItems.push({
                  key: "add",
                  label: (
                    <Tooltip title="Add Referrer">
                      <PlusOutlined />
                    </Tooltip>
                  ),
                  children: null,
                });

                return (
                  <Tabs
                    size="small"
                    type="card"
                    activeKey={referrerActiveTabKey}
                    onChange={(key) => {
                      if (key === "add") {
                        add({}); // Add a new empty referrer
                        setReferrerActiveTabKey(`${fields.length}`); // Switch to new tab
                      } else {
                        setReferrerActiveTabKey(key);
                      }
                    }}
                    items={tabItems}
                  />
                );
              }}
            </Form.List>
          </Card>
        </Col>

        {/* Client Name */}
        <Col xs={16} md={11} lg={16} xl={11} xxl={9}>
          <Form.Item
            label="Client"
            name="client_id"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Please select a client"
              options={clientsData.map((client) => {
                return { value: client.client_id, label: client.name };
              })}
              onChange={handleClientChange}
            />
          </Form.Item>
        </Col>

        {/* Batch No. */}
        <Col xs={8} md={5} lg={8} xl={5} xxl={3}>
          <Form.Item label="Batch" name="batch_id" rules={[{ required: true }]}>
            <Select
              placeholder="Please select a batch"
              options={batchesData.map((batch) => {
                return {
                  value: batch.batch_id,
                  label: batch.client_batch_no,
                };
              })}
            />
          </Form.Item>
        </Col>

        {/* Contact Person */}
        <Col xs={12} md={8} lg={12} xl={8} xxl={6}>
          <Form.Item label="Contact Person">
            <Input value={contactPerson} readOnly />
          </Form.Item>
        </Col>

        {/* Employee */}
        <Col xs={12} md={6} lg={12} xl={8} xxl={6}>
          <Form.Item
            label="Collector"
            name="employee_id"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Please select a collector"
              options={employeesData.map((employee) => {
                return {
                  value: employee.employee_id,
                  label: employee.name,
                };
              })}
            />
          </Form.Item>
        </Col>

        {/* Load Profile */}
        <Col xs={12} md={6} lg={12} xl={8} xxl={6}>
          <Form.Item
            label="Load Profile"
            name="load_profile_id"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Please select a load profile"
              options={loadProfilesData.map((profile) => {
                return {
                  value: profile.load_profile_id,
                  label: profile.name,
                };
              })}
              onChange={handleLoadProfileChange}
            />
          </Form.Item>
        </Col>

        {/* Load Profile Data */}
        {loadProfileColumns.map((column) => (
          <Col key={column.name} xs={12} md={6} lg={12} xl={8} xxl={6}>
            <Form.Item
              label={startCase(column.name)}
              name={column.name}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
        ))}
      </Row>
    </Form>
  );
}
