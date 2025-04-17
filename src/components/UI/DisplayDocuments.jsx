import React from "react";
import ImgKyc from "./ImgKyc";
import Confirm from "./Confirm";
import { useLocale } from "../../locales";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
const Documents = ({
  files,
  visible,
  setVisible,
  userId,
  hideButton = false,
  approuveKyc,
  title,
  type = "kyc",
  approveLoading,
  rejectLoading,
}) => {
  const { formatMessage } = useLocale();
  const [loaded, setLoadedImg] = useState(false);
  return (
    <Confirm
      confirmText={formatMessage({ id: "advance.confirm.approve" })}
      cancelText={formatMessage({ id: "advance.confirm.rejeter" })}
      onCancel={() => approuveKyc(userId, "NOT")}
      visible={visible}
      onSubmit={() => approuveKyc(userId, "VERIFIED")}
      setHidden={() => setVisible(false)}
      hideButton={hideButton}
      title={title}
      approveLoading={approveLoading}
      rejectLoading={rejectLoading}
    >
      <div className="files">
        {loaded ? (
          <CircularProgress />
        ) : (
          files?.map((el, key) =>
            type == "kyc" ? (
              <ImgKyc
                src={`account/kyc/${el.path}`}
                key={key}
                // onLoad={() => setLoadedImg(true)}
              />
            ) : (
              <ImgKyc
                src={`/v2/expenses/view/${el.path}`}
                key={key}
                // onLoad={() => setLoadedImg(true)}
              />
            )
          )
        )}
      </div>
    </Confirm>
  );
};

export default Documents;
