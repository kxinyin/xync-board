import { Col, ColorPicker, Form, Input, Row, Switch, Transfer } from "antd";

export default function AntdStatusForm({
  form,
  rolesData,
  flag,
  color,
  handleTransferChange,
  handleColorChange,
}) {
  return (
    <Form form={form} layout="vertical">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Form.Item label="Code" name="code" rules={[{ required: true }]}>
            <Input placeholder="Enter code" />
          </Form.Item>
        </Col>

        <Col xs={24} md={6}>
          <Form.Item label="Color" name="color" rules={[{ required: true }]}>
            <ColorPicker
              showText
              value={color}
              onChangeComplete={handleColorChange}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={6}>
          <Form.Item
            label="Status"
            name="is_enabled"
            rules={[{ required: true }]}
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true }]}
          >
            <Input.TextArea placeholder="Enter description" rows={2} />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item label="Flag" name="flag" rules={[{ required: true }]}>
            <Transfer
              dataSource={rolesData.map((data) => {
                return { name: data.name, key: data.role_id };
              })}
              titles={["Available", "Assigned"]}
              render={(item) => item.name}
              targetKeys={flag}
              onChange={handleTransferChange}
              listStyle={{ width: 250 }}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
