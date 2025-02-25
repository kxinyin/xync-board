import { Col, DatePicker, Form, Input, InputNumber, Row, Select } from "antd";
import { useEffect, useState } from "react";

export default function AntdAgreementForm({
  form,
  statusesData,
  total_paid = 0,
}) {
  const [balance, setBalance] = useState(0);

  const handleTotalAmountChange = (total_amount) => {
    const balance = total_amount - total_paid;
    form.setFieldValue("total_amount", total_amount);
    setBalance(balance);
  };

  const handleAmountChange = (value) => {
    const com_amount = form.getFieldValue("commission_amount") || 0;
    const total_amount = value + com_amount;
    handleTotalAmountChange(total_amount);
  };

  const handleCommissionChange = (value) => {
    const amount = form.getFieldValue("amount") || 0;
    const total_amount = amount + value;
    handleTotalAmountChange(total_amount);
  };

  useEffect(() => {
    const total_amount = form.getFieldValue("total_amount") || 0;
    handleTotalAmountChange(total_amount);
  }, []);

  return (
    <Form form={form} layout="vertical">
      <Row gutter={[16, 16]}>
        <Col
          xs={{ order: 1, span: 24 }}
          md={{ order: 2, span: 12 }}
          lg={{ order: 1, span: 24 }}
          xxl={{ order: 2, span: 12 }}
        >
          <Row gutter={[16, 0]}>
            {/* Agreement No. */}
            <Col xs={12} xl={12} xxl={12}>
              <Form.Item
                label="Agreement No."
                name="agreement_no"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter agreement no." />
              </Form.Item>
            </Col>

            {/* Status */}
            <Col xs={12} xl={12} xxl={12}>
              <Form.Item
                label="Status"
                name="status_id"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Please select a status"
                  options={statusesData.map((status) => {
                    return { value: status.status_id, label: status.code };
                  })}
                />
              </Form.Item>
            </Col>

            {/* Agreement Data */}
            <Col xs={12} xl={12} xxl={12}>
              <Form.Item
                label="Agreement Date"
                name="agreement_date"
                rules={[{ required: true }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>

            {/* Agreement Expiry Date */}
            <Col xs={12} xl={12} xxl={12}>
              <Form.Item
                label="Agr. Expiry Date"
                name="agreement_expiry_date"
                rules={[{ required: true }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
          </Row>
        </Col>

        <Col
          xs={{ order: 2, span: 24 }}
          md={{ order: 1, span: 12 }}
          lg={{ order: 2, span: 24 }}
          xxl={{ order: 1, span: 12 }}
        >
          <Form.Item
            label="Amount"
            name="amount"
            layout="horizontal"
            labelCol={{ xs: 8, sm: 10, md: 8, lg: 10, xxl: 10 }}
            wrapperCol={{ xs: 16, sm: 10, md: 16, lg: 10, xxl: 14 }}
            rules={[{ required: true }]}
            style={{ marginBottom: 0 }}
          >
            <InputNumber
              prefix="RM"
              precision={2}
              min={0}
              step={1}
              variant="filled"
              style={{ width: "100%" }}
              onChange={handleAmountChange}
            />
          </Form.Item>

          <Form.Item
            label="Commission"
            name="commission_amount"
            layout="horizontal"
            labelCol={{ xs: 8, sm: 10, md: 8, lg: 10, xxl: 10 }}
            wrapperCol={{ xs: 16, sm: 10, md: 16, lg: 10, xxl: 14 }}
            rules={[{ required: true }]}
            style={{ marginBottom: 0 }}
          >
            <InputNumber
              prefix="RM"
              precision={2}
              min={0}
              step={1}
              variant="filled"
              style={{ width: "100%" }}
              onChange={handleCommissionChange}
            />
          </Form.Item>

          {/* Read Only */}
          <Form.Item
            label="Total Amount"
            layout="horizontal"
            labelCol={{ xs: 8, sm: 10, md: 8, lg: 10, xxl: 10 }}
            wrapperCol={{ xs: 16, sm: 10, md: 16, lg: 10, xxl: 14 }}
            style={{ marginBottom: 0 }}
          >
            <InputNumber
              value={form.getFieldValue("total_amount")}
              prefix="RM"
              precision={2}
              min={0}
              variant="borderless"
              style={{ width: "100%" }}
              readOnly
            />
          </Form.Item>

          {/* Read Only */}
          <Form.Item
            label="Total Paid"
            layout="horizontal"
            labelCol={{ xs: 8, sm: 10, md: 8, lg: 10, xxl: 10 }}
            wrapperCol={{ xs: 16, sm: 10, md: 16, lg: 10, xxl: 14 }}
            style={{ marginBottom: 0 }}
          >
            <InputNumber
              value={total_paid}
              prefix="RM"
              precision={2}
              min={0}
              variant="borderless"
              style={{ width: "100%" }}
              readOnly
            />
          </Form.Item>

          {/* Read Only */}
          <Form.Item
            label="Balance"
            layout="horizontal"
            labelCol={{ xs: 8, sm: 10, md: 8, lg: 10, xxl: 10 }}
            wrapperCol={{ xs: 16, sm: 10, md: 16, lg: 10, xxl: 14 }}
            style={{ marginBottom: 0 }}
          >
            <InputNumber
              value={balance}
              prefix="RM"
              precision={2}
              min={0}
              variant="borderless"
              style={{ width: "100%", color: "red" }}
              className="font-semibold"
              readOnly
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
