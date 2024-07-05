import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import * as Antd from "antd";
import { withSandbox } from "../src/utils/sandbox";
import { compileWithSucrase } from "../src/compiler/sucrase";
import { renderWithDependency } from "@/index";
const { Input, Row, Col, Typography } = Antd;

const INIT_CODE = `
<div>
  <Space size='large' style={{ marginTop: 20 }}>
    <Button type='primary'>Primary</Button>
    <Button type='dashed'>Dashed</Button>
  </Space>
  <Card title="Default size card" extra={<a href="#">More</a>} style={{ width: 300, marginTop: 20 }}>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
  </Card>
</div>
`;

function App() {
  const ref = useRef<HTMLDivElement>(null);
  const [code, setCode] = useState(INIT_CODE);

  const renderCode = (code: string) => {
    try {
      if (ref.current) {
        const el = ref.current;
        const sandbox = withSandbox({ React, console, alert, ...Antd });
        const compiledCode = compileWithSucrase(`<div>${code}</div>`);
        console.log("compiledCode", compiledCode);
        const Component = renderWithDependency(
          compiledCode,
          sandbox
        ) as JSX.Element;
        console.log("Component", Component);
        ReactDOM.render(Component, el);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    renderCode(code);
  }, [code]);

  return (
    <div style={{ boxSizing: "border-box", margin: 10 }}>
      <Typography.Title level={3}>Playground</Typography.Title>
      <Typography.Paragraph>
        支持Ant Design组件的实时预览。
      </Typography.Paragraph>
      <Row align="stretch" style={{ maxWidth: 1000 }}>
        <Col span={12}>
          <div
            style={{
              border: "1px solod #000",
              boxSizing: "border-box",
              height: "100%",
              maxWidth: 500,
              maxHeight: 300,
              overflow: "auto",
              padding: 10,
            }}
          >
            <div ref={ref}></div>
          </div>
        </Col>
        <Col span={12}>
          <Input.TextArea
            autoSize
            value={code}
            style={{
              minHeight: 300,
            }}
            onChange={(e) => {
              setCode(e.target.value);
            }}
          ></Input.TextArea>
        </Col>
      </Row>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
