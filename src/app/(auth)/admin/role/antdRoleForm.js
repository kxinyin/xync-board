import { Col, Divider, Form, Input, Row, Switch, Transfer } from "antd";

export default function AntdRoleForm({
  form,
  modulesData,
  permission,
  handleTransferChange,
}) {
  return (
    <Form form={form} layout="vertical">
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Form.Item label="Role Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Enter role name" />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item
            label="Permission"
            name="permission"
            rules={[{ required: true }]}
          >
            <Transfer
              dataSource={modulesData.map((data) => {
                return { name: data.name, key: data.id };
              })}
              titles={["Available", "Assigned"]}
              render={(item) => item.name}
              targetKeys={permission}
              onChange={handleTransferChange}
              listStyle={{ width: "100%", height: 350 }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Divider style={{ margin: "0 0 1.5rem" }}></Divider>

      <Form.Item
        layout="horizontal"
        label="Role Status"
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
