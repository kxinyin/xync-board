import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  Row,
  Switch,
  Tag,
} from "antd";

export default function AntdProfileForm({
  form,
  isDefaultProfile,
  defaultDescriptions,
}) {
  return (
    <Form form={form} layout="vertical">
      {!isDefaultProfile && (
        <>
          <Form.Item
            layout="horizontal"
            label="Load Profile Name"
            name="name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter load profile name" />
          </Form.Item>

          <Divider style={{ margin: "0 0 1.5rem" }}></Divider>

          <Descriptions
            column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
            size="small"
            title={
              <div>
                Default Columns
                <span className="pl-3 text-sm font-normal">
                  (Click{" "}
                  <span className="font-semibold">"Default Load Profile"</span>{" "}
                  button to edit.)
                </span>
              </div>
            }
            items={defaultDescriptions}
          />

          <Divider style={{ margin: "1.5rem 0" }} />

          <Form.List name="columns">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    title={`Extra Column ${name + 1}`}
                    extra={
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        style={{ color: "red" }}
                      />
                    }
                    style={{ marginBottom: "16px" }}
                  >
                    <Row gutter={[16, 16]} align="bottom">
                      <Col xs={24} sm={10}>
                        <Form.Item
                          {...restField}
                          label="Full Name"
                          name={[name, "name"]}
                        >
                          <Input placeholder="Enter full name" />
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={10}>
                        <Form.Item
                          {...restField}
                          label="Excel Name"
                          name={[name, "excel_name"]}
                        >
                          <Input placeholder="Enter excel name" />
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={4}>
                        <Form.Item
                          {...restField}
                          name={[name, "multiple"]}
                          valuePropName="checked"
                        >
                          <Checkbox>Multiple</Checkbox>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Column
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Divider style={{ margin: "0 0 1.5rem" }}></Divider>

          <Form.Item
            layout="horizontal"
            label="Load Profile Status"
            name="is_enabled"
            rules={[{ required: true }]}
          >
            <Switch
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              style={{ marginLeft: "6px" }}
            />
          </Form.Item>
        </>
      )}

      {isDefaultProfile && (
        <Form.List name="columns">
          {(fields) => (
            <>
              {fields.map(({ key, name, ...restField }) => {
                const profile = form.getFieldValue().columns[name];

                return (
                  <Row key={key} gutter={[16, 16]} align="bottom">
                    <Col xs={20}>
                      <Form.Item
                        {...restField}
                        label={profile.name}
                        name={[name, "excel_name"]}
                        layout="horizontal"
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 14 }}
                      >
                        <Input placeholder="Enter excel name" />
                      </Form.Item>
                    </Col>

                    <Col xs={4}>
                      <Form.Item>
                        {profile.multiple && <Tag color="green">Multiple</Tag>}
                      </Form.Item>
                    </Col>
                  </Row>
                );
              })}
            </>
          )}
        </Form.List>
      )}
    </Form>
  );
}
