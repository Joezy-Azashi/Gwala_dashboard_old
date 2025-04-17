import React, { useState } from "react";
import Button from "./Button";
import styled from "styled-components";
import Input from "./Input";
import Select from "./Select";
import Confirm from "./Confirm";

const Conatiner = styled.div`
  img {
    max-width: 500px;
    border-radius: 30px;
  }
  .files {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 12px;
    justify-content: center;
    align-items: center;
  }
`;

const UploadDocuments = ({ visible, setVisible, onSubmit, dataType, setType, docLoading }) => {
  
  return (
    <Confirm
      visible={visible}
      cancelText="Cancel"
      confirmText="Submit"
      onSubmit={() => onSubmit(dataType)}
      onCancel={() => setVisible(false)}
      submitLoading={docLoading}
    >
      <Conatiner>
        <div className="files">
          <Select
            placeholder={"File type"}
            onChange={(e) => setType({ ...dataType, type: e.target.value })}
            value={dataType?.type}
          >
            <option>ID_CARD</option>
            <option>DRIVER_LICENCE</option>
            <option>PASSPORT</option>
          </Select>
          <div className="row">
            <div className="col-12">
              <Input
                type={"file"}
                placeholder={"front"}
                onChange={(e) => setType({ ...dataType, front: e.target.files[0] })}
              />
            </div>
            {dataType?.type == "ID_CARD" || dataType?.type == "DRIVER_LICENCE" ? (
              <div className="col-12">
                <Input
                  type={"file"}
                  placeholder={"back"}
                  onChange={(e) =>
                    setType({ ...dataType, back: e.target.files[0] })
                  }
                />
              </div>
            ) : ""}
          </div>
        </div>
      </Conatiner>
    </Confirm>
  );
};

export default UploadDocuments;
