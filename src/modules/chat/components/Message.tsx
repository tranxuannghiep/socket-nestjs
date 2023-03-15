import { Avatar, Typography } from "antd";
import { format } from "date-fns";
import styled from "styled-components";

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

  .content {
    margin-left: 30px;
    margin-top: 10px;
    display: inline-block;
    background-color: #e4e6eb;
    padding: 8px 12px;
    line-height: 20px;
    border-radius: 18px;
    max-width: 300px;
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
}

export default function Message({
  text,
  createdAt,
  user,
  hiddenInfo,
  hiddenDate,
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
      <div>
        <Typography.Text className="content">{text}</Typography.Text>
      </div>
    </WrapperStyled>
  );
}
