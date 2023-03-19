import { Avatar, Typography } from "antd";
import { format } from "date-fns";
import styled from "styled-components";
import { FileRender } from "./FileRender";

const WrapperStyled = styled.div`
  &:last-child {
    margin-bottom: 10px;
  }
  .author {
    margin-left: 5px;
    font-weight: bold;
  }

  .date {
    font-size: 11px;
    color: #a7a7a7;
  }

  .content-text {
    margin-left: 30px;
    margin-top: 10px;
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
      display: inline-block;
      background-color: #e4e6eb;
      padding: 8px 12px;
      line-height: 20px;
      border-radius: 18px;
      max-width: 300px;
    }
  }
`;

export interface MessageProps {
  id: number;
  text: string;
  createdAt: string;
  user: {
    id: number;
    firstname: string;
    lastname: string;
    image: string | null;
  };
  hiddenInfo: boolean;
  hiddenDate: boolean;
  type?: string;
  file_name?: string;
}

export default function Message({
  text,
  createdAt,
  user,
  hiddenInfo,
  hiddenDate,
  type,
  file_name,
}: MessageProps) {
  return (
    <WrapperStyled>
      <div style={{ textAlign: "center" }} hidden={hiddenDate}>
        <Typography.Text className="date">
          {format(new Date(createdAt), "HH:mm, dd MMM yyyy")}
        </Typography.Text>
      </div>
      <div hidden={hiddenInfo}>
        <Avatar size="small" src={user.image}>
          A
        </Avatar>
        <Typography.Text className="author">
          {user.firstname + " " + user.lastname}
        </Typography.Text>
      </div>
      <div className="content-text">
        <FileRender text={text} type={type} file_name={file_name} />
      </div>
    </WrapperStyled>
  );
}
