import { Col, Divider, Form, Input, Radio, Row, Select, Switch } from "antd";

export default function AntdEmployeeForm({
  form,
  isNewEmp,
  rolesData,
  branchesData,
}) {
  return (
    <Form form={form} layout="vertical">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Employee Username"
            name="username"
            rules={[{ required: true }]}
            extra={
              isNewEmp && (
                <span className="text-sm">
                  This is the login username. It must be unique and cannot be
                  changed.
                </span>
              )
            }
          >
            <Input placeholder="Enter employee username" readOnly={!isNewEmp} />
          </Form.Item>
        </Col>

        <Col xs={isNewEmp ? 24 : 0} md={12}>
          {isNewEmp && (
            <Form.Item
              label="Employee Password"
              name="password"
              rules={[{ required: true }]}
              extra={
                <span className="text-sm">
                  This is a temporary password. Users must change it upon their
                  first login.
                </span>
              }
            >
              <Input.Password placeholder="Enter employee password" />
            </Form.Item>
          )}
        </Col>
      </Row>

      <Divider style={{ margin: "0 0 1.5rem" }}></Divider>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Form.Item
            label="Employee Name"
            name="name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter employee name" />
          </Form.Item>
        </Col>

        <Col xs={10} md={8}>
          <Form.Item label="Gender" name="gender">
            <Radio.Group>
              <Radio.Button value="female">Female</Radio.Button>
              <Radio.Button value="male">Male</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item label="Role" name="role_id" rules={[{ required: true }]}>
            <Select
              placeholder="Please select a role"
              options={rolesData.map((role) => {
                return { value: role.role_id, label: role.name };
              })}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            label="Branch"
            name="branch_name"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Please select a branch"
              options={branchesData.map((branch) => {
                return { value: branch.branch_id, label: branch.name };
              })}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item label="Contact Number" name="contact_no">
            <Input placeholder="Enter contact number" />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item label="New IC No." name="new_ic_no">
            <Input placeholder="Enter new IC number" />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item label="Old IC No." name="old_ic_no">
            <Input placeholder="Enter old IC number" />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item label="Employee Address" name="address">
            <Input.TextArea placeholder="Enter employee address" rows={2} />
          </Form.Item>
        </Col>
      </Row>

      <Divider style={{ margin: "0 0 1.5rem" }}></Divider>

      <Form.Item
        layout="horizontal"
        label="Employee Status"
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
