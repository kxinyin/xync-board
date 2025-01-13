"use client";

import { login } from "@/src/auth/helpers";
import { Button, Form, Input, Typography } from "antd";
import { redirect, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function AntdLoginForm() {
  const { Text } = Typography;

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const errorMessages = "Invalid username or password.";

  const [hasError, setHasError] = useState(false);

  const handleSubmit = async (values) => {
    const res = await login(values);

    if (res.success) {
      setHasError(false);

      if (callbackUrl) redirect(callbackUrl);
      else redirect("/");
    } else {
      setHasError(true);
    }
  };

  return (
    <div
      className="bg-background shadow-xl rounded-xl p-6 
                 sm:mx-auto sm:w-full sm:max-w-sm
                 lg:p-8"
    >
      <h1 className="text-center text-foreground text-2xl font-semibold mb-12">
        Log in to Xync Board
      </h1>

      <Form
        name="LoginForm"
        layout="vertical"
        wrapperCol={{ span: 24 }}
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item label="Username" name="username">
          <Input />
        </Form.Item>

        <Form.Item label="Password" name="password">
          <Input.Password />
        </Form.Item>

        <Form.Item
          label={null}
          className={`text-center ${hasError ? "block" : "hidden"}`}
        >
          <Text type="danger">{errorMessages}</Text>
        </Form.Item>

        <Form.Item label={null}>
          <Button
            block
            type="primary"
            htmlType="submit"
            className={`${hasError ? "mt-0" : "mt-5"}`}
          >
            Log In
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
