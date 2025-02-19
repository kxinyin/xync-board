import { Button, Space } from "antd";
import AntdToggleBatchViewButton from "../antdToggleViewButton";

export default function AntdBatchTable({}) {
  return (
    <>
      <div className="flex items-center justify-between pb-6">
        <AntdToggleBatchViewButton />

        <Space>
          <Button color="primary" variant="solid">
            Import New Batch
          </Button>
        </Space>
      </div>
    </>
  );
}
