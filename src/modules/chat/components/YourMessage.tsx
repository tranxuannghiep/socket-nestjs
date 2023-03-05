import { Typography } from "antd";
import styled from "styled-components";

export interface YourMessageProps {
  text: string;
}

const WrapperStyled = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  .content {
    background-color: #0084ff;
    padding: 8px 12px;
    line-height: 20px;
    border-radius: 20px;
    color: #fff;
  }
`;

export default function YourMessage({ text }: YourMessageProps) {
  return (
    <WrapperStyled
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: 10,
      }}
    >
      <Typography.Text className="content">{text}</Typography.Text>
    </WrapperStyled>
  );
}
