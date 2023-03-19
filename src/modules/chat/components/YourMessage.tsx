import { Typography } from "antd";
import { format } from "date-fns";
import styled from "styled-components";
import { FileRender } from "./FileRender";

export interface YourMessageProps {
  text: string;
  hiddenDate: boolean;
  createdAt: string;
  type?: string;
  file_name?: string;
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
    .file-icon {
      width: fit-content;
      cursor: pointer;
      display: flex;
      align-items: center;
      background: #e4e6eb;
      padding: 10px 20px;
      border-radius: 20px;
      svg {
        width: 24px;
      }
      .file-name {
        margin-left: 10px;
        font-weight: 500;
      }
    }
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
  file_name,
}: YourMessageProps) {
  return (
    <WrapperStyled>
      <div style={{ textAlign: "center" }} hidden={hiddenDate}>
        <Typography.Text className="date">
          {format(new Date(createdAt), "HH:mm, dd MMM yyyy")}
        </Typography.Text>
      </div>
      <div className="content-text">
        <FileRender text={text} type={type} file_name={file_name} />
      </div>
    </WrapperStyled>
  );
}
