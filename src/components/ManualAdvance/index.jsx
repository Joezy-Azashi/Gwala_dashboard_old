import React, { useEffect } from "react";
import EdocsUpload from "../E-documents/EdocsUpload";
import { useLocale } from "../../locales";
import { Button } from "../UI";
import { Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import { read, utils } from "xlsx";
import { checkEmployees } from "../../api/advance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setAdvances } from "../../store/reducer/userReducer";
const ManualAdvance = ({ open, onClose }) => {
  const { formatMessage } = useLocale();

  const dispatch = useDispatch();
  const [file, setFile] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const readExcelFile = async (file) => {
    try {
      setLoading(true);
      const data = await readFileAsBinaryString(file);
      const workbook = read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0]; // Assuming you want the first sheet
      const sheet = utils.sheet_to_json(workbook.Sheets[sheetName]);

      if (sheet.length <= 5000) {
        const result = await checkEmployees(sheet);

        dispatch(setAdvances(result));
        navigate("/advance/manualy");
      } else {
        toast("You can't upload more than 5000 employees", {
          position: "top-right",
          theme: "colored",
          type: "error",
        });
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const readFileAsBinaryString = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        resolve(e.target.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsBinaryString(file);
    });
  };

  const handleSubmit = () => {
    if (file.length > 0) readExcelFile(file[0]);
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": { width: "50%" },
      }}
      PaperProps={{ sx: { borderRadius: "35px" } }}
      maxWidth="md"
    >
      <DialogContent
        sx={{
          padding: "15px",
          display: "flex",
          gap: "19px",
          flexDirection: "column",
        }}
      >
        <EdocsUpload
          setFile={setFile}
          file={file}
          title={formatMessage({ id: "advance.ulpoad.manual.title" })}
          description={formatMessage({
            id: "advance.ulpoad.manual.description",
          })}
          accept={{
            "application/vnd.ms-excel": [".xls", ".xlsx"],
            "text/csv": [".csv"],
          }}
        >
          {error && (
            <p style={{ fontSize: "14px", color: "red", lineHeight: "24px" }}>
              {formatMessage({ id: "advance.ulpoad.manual.error" })}
            </p>
          )}
          <Button
            text={formatMessage({ id: "advance.sent" })}
            loading={loading}
            onClick={handleSubmit}
          />
        </EdocsUpload>
      </DialogContent>
    </Dialog>
  );
};

export default ManualAdvance;
