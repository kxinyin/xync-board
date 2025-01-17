import {
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Switch,
} from "antd";

export default function AntdClientForm({ form, typesData }) {
  return (
    <Form form={form} layout="vertical">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Client Name"
            name="name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter client name" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Client Registration No."
            name="register_no"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter client registration number" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label="Client Email" name="email">
            <Input placeholder="Enter client email" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Contact Person"
            name="contact_person"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter contact person" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Contact Number (1)"
            name="contact_no_1"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter contact number (1)" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label="Contact Number (2)" name="contact_no_2">
            <Input placeholder="Enter contact number (2)" />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item
            label="Client Address"
            name="address"
            rules={[{ required: true }]}
          >
            <Input.TextArea placeholder="Enter client address" rows={2} />
          </Form.Item>
        </Col>
      </Row>

      <Divider style={{ margin: "0 0 1.5rem" }}></Divider>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item
            label="Client Type"
            name="client_type"
            rules={[{ required: true }]}
          >
            <Radio.Group>
              {typesData.map((type, index) => (
                <Radio.Button key={index} value={type}>
                  {type}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Form.Item
            label="Commission Rate (%)"
            name="commission_rate"
            rules={[
              { required: true, message: "Please input the commission rate!" },
              {
                type: "number",
                min: 0,
                max: 100,
                message: "Please input a valid percentage between 0 and 100!",
              },
            ]}
          >
            <InputNumber
              placeholder="0 - 100"
              min={0}
              max={100}
              addonAfter="%"
            />
          </Form.Item>
        </Col>
      </Row>

      <Divider style={{ margin: "0 0 1.5rem" }}></Divider>

      <Form.Item
        layout="horizontal"
        label="Client Status"
        name="is_enabled"
        rules={[{ required: true }]}
      >
        <Switch
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          style={{ marginLeft: "6px" }}
        />
      </Form.Item>
    </Form>
  );
}
