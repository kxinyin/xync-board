"use client";

import { Col, Form, Row } from "antd";
import AntdCustomerForm from "./antdContentCustomerForm";
import AntdAgreementForm from "./antdContentAgreementForm";

export default function AntdCustomerContent({
  clientsData,
  batchesData,
  employeesData,
  loadProfilesData,
  statusesData,
}) {
  const [customerForm] = Form.useForm();
  const [agreementForm] = Form.useForm();

  return (
    <>
      <Row gutter={[16, 16]} className="py-6">
        <Col xs={24} lg={12}>
          <div className="bg-neutral-100 p-6 rounded-xl dark:bg-neutral-800">
            <h2 className="text-lg font-semibold pb-6">Customer Details</h2>
            <AntdCustomerForm
              form={customerForm}
              clientsData={clientsData}
              batchesData={batchesData}
              employeesData={employeesData}
              loadProfilesData={loadProfilesData}
            />
          </div>
        </Col>

        <Col xs={24} lg={12}>
          <div className="bg-neutral-100 p-6 rounded-xl dark:bg-neutral-800">
            <h2 className="text-lg font-semibold pb-6">Agreement Details</h2>
            <AntdAgreementForm
              form={agreementForm}
              statusesData={statusesData}
            />
          </div>
        </Col>
      </Row>

      <Row>
        <Col>Follow Up / Internal Remark / Employee Note</Col>
      </Row>
    </>
  );
}
