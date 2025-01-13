import { Col, Divider, Form, Input, Radio, Row, Select } from "antd";

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
            label="Username"
            name="username"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter username" readOnly={!isNewEmp} />
          </Form.Item>
        </Col>

        <Col xs={isNewEmp ? 24 : 0} md={12}>
          {isNewEmp && (
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true }]}
              extra={
                <span className="text-sm">
                  This is a temporary password. Users must change it on their
                  first login.
                </span>
              }
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          )}
        </Col>
      </Row>

      <Divider style={{ margin: "0 0 1.5rem" }}></Divider>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={13}>
          <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Enter full name" />
          </Form.Item>
        </Col>

        <Col xs={isNewEmp ? 0 : 24} md={6}>
          {!isNewEmp && (
            <Form.Item label="Employee ID" name="employee_id">
              <Input readOnly />
            </Form.Item>
          )}
        </Col>

        <Col xs={10} md={5}>
          <Form.Item label="Resigned" name="resigned">
            <Radio.Group>
              <Radio.Button value={false}>No</Radio.Button>
              <Radio.Button value={true}>Yes</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>

        <Col xs={10} md={6}>
          <Form.Item label="Gender" name="gender">
            <Radio.Group>
              <Radio.Button value="female">Female</Radio.Button>
              <Radio.Button value="male">Male</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>

        <Col xs={24} md={9}>
          <Form.Item label="Role" name="role_id" rules={[{ required: true }]}>
            <Select
              placeholder="Please select a role"
              options={rolesData.map((role) => {
                return { value: role.role_id, label: role.name };
              })}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={9}>
          <Form.Item
            label="Branch"
            name="branch_name"
            rules={[{ required: true, message: "Please select a branch" }]}
          >
            <Select
              placeholder="Please select a branch"
              options={branchesData.map((branch) => {
                return { value: branch.branch_id, label: branch.name };
              })}
            />
          </Form.Item>
        </Col>
      </Row>

      <Divider style={{ margin: "0 0 1.5rem" }}></Divider>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Form.Item label="Contact No." name="contact_no">
            <Input placeholder="Enter contact no." />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item label="New IC No." name="new_ic_no">
            <Input placeholder="Enter new IC no." />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item label="Old IC No." name="old_ic_no">
            <Input placeholder="Enter old IC no." />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item label="Address" name="address">
            <Input.TextArea placeholder="Enter address" rows={2} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
