import { Image, Typography } from "antd";
import { format } from "date-fns";
import styled from "styled-components";

export interface YourMessageProps {
  text: string;
  hiddenDate: boolean;
  createdAt: string;
  type: string;
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
    margin-right: 10px;
    .content {
      background-color: #0084ff;
      padding: 8px 12px;
      line-height: 20px;
      border-radius: 20px;
      color: #fff;
    }
  }
`;

export default function YourMessage({
  text,
  hiddenDate,
  createdAt,
  type,
}: YourMessageProps) {
  return (
    <WrapperStyled>
      <div style={{ textAlign: "center" }} hidden={hiddenDate}>
        <Typography.Text className="date">
          {format(new Date(createdAt), "HH:mm, dd MMM yyyy")}
        </Typography.Text>
      </div>
      <div className="content-text">
        {type === "image" ? (
          <Image width={200} src={text} />
        ) : (
          <Typography.Text className="content">{text}</Typography.Text>
        )}
      </div>
    </WrapperStyled>
  );
}
