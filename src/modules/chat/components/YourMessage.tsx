import { Typography } from "antd";
import { format } from "date-fns";
import styled from "styled-components";

export interface YourMessageProps {
  text: string;
  hiddenDate: boolean;
  createdAt: string;
}

const WrapperStyled = styled.div`
  .date {
    font-size: 11px;
    color: #a7a7a7;
  }

  .content-text {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
    .content {
      background-color: #0084ff;
      padding: 8px 12px;
      line-height: 20px;
      border-radius: 20px;
      color: #fff;
      margin-right: 10px;
    }
  }
`;

export default function YourMessage({
  text,
  hiddenDate,
  createdAt,
}: YourMessageProps) {
  return (
    <WrapperStyled>
      <div style={{ textAlign: "center" }} hidden={hiddenDate}>
        <Typography.Text className="date">
          {format(new Date(createdAt), "HH:mm, dd MMM yyyy")}
        </Typography.Text>
      </div>
      <div className="content-text">
        <Typography.Text className="content">{text}</Typography.Text>
      </div>
    </WrapperStyled>
  );
}
