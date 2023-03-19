import { CloseOutlined } from "@ant-design/icons";
import * as React from "react";
import styled from "styled-components";
import { FileInterface } from "./ChatWindow";

export interface PreviewFileProps {
  listFile: FileInterface[];
}

const PreviewStyled = styled.div`
  display: flex;
  .file {
    margin-right: 15px;
    border: 1px solid #ccc;
    position: relative;
    .close {
      position: absolute;
      top: -10px;
      right: -10px;
      cursor: pointer;
      background: #3e4042;
      border-radius: 50%;
      padding: 4px;
    }
  }
`;

export function PreviewFile({ listFile }: PreviewFileProps) {
  return (
    <PreviewStyled>
      {listFile.map((val) => (
        <div className="file">
          <img
            width={60}
            src={URL.createObjectURL(val.file)}
            alt={val.file_name}
          />
          <div className="close">
            <CloseOutlined style={{ fontSize: 15, color: "#fff" }} />
          </div>
        </div>
      ))}
    </PreviewStyled>
  );
}
