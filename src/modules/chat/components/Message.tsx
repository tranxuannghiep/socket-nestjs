import { Avatar, Typography } from "antd";
import styled from "styled-components";

const WrapperStyled = styled.div`
  margin-bottom: 10px;
  .author {
    margin-left: 5px;
    font-weight: bold;
  }

  .date {
    margin-left: 10px;
    font-size: 11px;
    color: #a7a7a7;
  }

  .content {
    margin-left: 30px;
    background-color: #e4e6eb;
    padding: 8px 12px;
    line-height: 20px;
    border-radius: 18px;
    max-width: 300px;
  }
`;

export interface MessageProps {
  userId?: string | number;
  text: string;
  displayName: string;
  createAt: string;
  photoUrl: string | null;
}

export default function Message({
  text,
  displayName,
  createAt,
  photoUrl,
}: MessageProps) {
  return (
    <WrapperStyled>
      <div>
        <Avatar size="small" src={photoUrl}>
          A
        </Avatar>
        <Typography.Text className="author">{displayName}</Typography.Text>
        <Typography.Text className="date">{createAt}</Typography.Text>
      </div>
      <div style={{ marginTop: 10 }}>
        <Typography.Text className="content">{text}</Typography.Text>
      </div>
    </WrapperStyled>
  );
}
