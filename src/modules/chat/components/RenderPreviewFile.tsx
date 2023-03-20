import * as React from "react";
import { DefaultExtensionType, defaultStyles, FileIcon } from "react-file-icon";
import path from "path-browserify";
import { Typography } from "antd";
import styled from "styled-components";
import { PlayCircleOutlined } from "@ant-design/icons";

export interface RenderPreviewFileProps {
  type: string;
  file: File;
  file_name: string;
}

const RenderPreviewFileWrap = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  background: #e4e6eb;
  padding: 10px 20px;
  border-radius: 20px;
  width: max-content;
  svg {
    width: 24px;
    margin-right: 10px;
  }
`;

export function RenderPreviewFile({
  type,
  file,
  file_name,
}: RenderPreviewFileProps) {
  if (type.includes("image")) {
    return (
      <img
        width={60}
        height={60}
        style={{ objectFit: "cover", display: "block" }}
        src={URL.createObjectURL(file)}
        alt={file_name}
      />
    );
  } else if (type.includes("video")) {
    return (
      <div style={{ position: "relative" }}>
        <video
          width={60}
          height={60}
          style={{ objectFit: "cover", display: "block" }}
          src={URL.createObjectURL(file)}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            color: "#fff",
            fontSize: "24px",
          }}
        >
          <PlayCircleOutlined />
        </div>
      </div>
    );
  } else {
    const extension = path.extname(file_name).slice(1);
    return (
      <RenderPreviewFileWrap>
        <FileIcon
          extension={extension}
          {...defaultStyles[extension as DefaultExtensionType]}
        />
        <Typography.Text className="file-name">{file_name}</Typography.Text>
      </RenderPreviewFileWrap>
    );
  }
}
