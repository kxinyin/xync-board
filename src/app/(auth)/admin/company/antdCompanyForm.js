"use client";

import { updateCompanyInfo } from "@/src/services/api/company";
import { scrollToTop } from "@/src/services/scrollUtils";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, message, Row, Space } from "antd";
import { useState } from "react";

export default function AntdCompanyForm({ data }) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [initialData, setInitailData] = useState(data);

  const handleSubmit = async (values) => {
    const { success, message, data } = await updateCompanyInfo(values);

    if (success) {
      setInitailData(data);
      messageApi.success(message);
    } else {
      messageApi.error(message);
    }

    scrollToTop();
  };

  const handleCancel = () => {
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialData}
      onFinish={handleSubmit}
    >
      {contextHolder}

      <Row gutter={[16, 16]}>
        {/* Company Information */}
        <Col xs={24} xl={12}>
          <Card title="Company Information">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Company Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the company name",
                    },
                  ]}
                >
                  <Input placeholder="Enter company name" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Company Registration No."
                  name="register_no"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the company registration number",
                    },
                  ]}
                >
                  <Input placeholder="Enter company registration number" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Company Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the company email",
                    },
                    { type: "email", message: "Enter a valid email" },
                  ]}
                >
                  <Input placeholder="Enter company email" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Contact Number"
                  name="contact_no"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the contact number",
                    },
                  ]}
                >
                  <Input placeholder="Enter contact number" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Branches */}
        <Col xs={24} xl={12}>
          <Card title="Branches" style={{ marginBottom: "16px" }}>
            <Form.List name="branch">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card
                      key={key}
                      title={`Branch ${name + 1}`}
                      extra={
                        <MinusCircleOutlined
                          onClick={() => remove(name)}
                          style={{ color: "red" }}
                        />
                      }
                      style={{ marginBottom: "16px" }}
                    >
                      {/* First Row: Name and Area */}
                      <Row gutter={16}>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            {...restField}
                            label="Name"
                            name={[name, "name"]}
                            rules={[
                              {
                                required: true,
                                message: "Please input branch name!",
                              },
                            ]}
                          >
                            <Input placeholder="Enter branch name" />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                          <Form.Item
                            {...restField}
                            label="Area"
                            name={[name, "area"]}
                            rules={[
                              {
                                required: true,
                                message: "Please input branch area!",
                              },
                            ]}
                          >
                            <Input placeholder="Enter branch area" />
                          </Form.Item>
                        </Col>
                      </Row>

                      {/* Second Row: Address */}
                      <Row>
                        <Col xs={24}>
                          <Form.Item
                            {...restField}
                            label="Address"
                            name={[name, "address"]}
                            rules={[
                              {
                                required: true,
                                message: "Please input branch address!",
                              },
                            ]}
                          >
                            <Input.TextArea
                              placeholder="Enter branch address"
                              rows={2}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  ))}

                  {/* Add Branch Button */}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Branch
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>
        </Col>
      </Row>

      {/* Buttons */}
      <Form.Item>
        <Row justify="end">
          <Space>
            <Button danger onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Space>
        </Row>
      </Form.Item>
    </Form>
  );
}
