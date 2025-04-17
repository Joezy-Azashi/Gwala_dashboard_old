import React from "react";
import {
  Autocomplete,
  Box,
  DialogContent,
  Grid,
  Typography,
} from "@mui/material";
import { TextField } from "../UI";
import { useLocale } from "../../locales";
import pic from "../../assets/picture.png";
import word from "../../assets/word.png";
import pdf from "../../assets/pdf.png";

function EdocDetail({ detailInfo }) {
  const { formatMessage } = useLocale();
  return (
    <DialogContent>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label={formatMessage({ id: "edoc.docname" })}
            value={detailInfo.name}
            fullWidth
            margin="dense"
            inputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            multiple
            id="tags-readOnly"
            options={[detailInfo?.employee?.firstName === undefined ? " " : detailInfo?.employee?.firstName + " " + detailInfo?.employee?.lastName].map((option) => option)}
            defaultValue={[detailInfo?.employee?.firstName === undefined ? " " : detailInfo?.employee?.firstName + " " + detailInfo?.employee?.lastName].map((option) => option)}
            readOnly
            renderInput={(params) => (
              <TextField
                {...params}
                label={formatMessage({ id: "edoc.employeename" })}
              />
            )}
            sx={{
              "& .MuiChip-root": {
                backgroundColor: detailInfo?.employee?.firstName === undefined ? "var(--color-white)" : "var(--color-dark-blue)",
                color: "#fff",
                borderRadius: "8px",
              },
              "& .MuiSvgIcon-root": {
                display: "none",
              },
              marginTop: ".5rem"
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Autocomplete
            multiple
            id="tags-readOnly"
            options={detailInfo.edoc_tags.map((option) => option?.name)}
            defaultValue={detailInfo.edoc_tags.map((option) => option?.name)}
            readOnly
            renderInput={(params) => (
              <TextField
                {...params}
                label={formatMessage({ id: "edoc.tags" })}
              />
            )}
            sx={{
              "& .MuiChip-root": {
                backgroundColor: "var(--color-dark-blue)",
                color: "#fff",
                borderRadius: "8px",
              },
              "& .MuiSvgIcon-root": {
                display: "none",
              },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Autocomplete
            multiple
            id="tags-readOnly"
            options={detailInfo?.shared_with.map(
              (option) => option.firstName + " " + option.lastName
            )}
            defaultValue={detailInfo?.shared_with.map(
              (option) => option.firstName + " " + option.lastName
            )}
            readOnly
            renderInput={(params) => (
              <TextField
                {...params}
                label={formatMessage({ id: "edoc.detailsharedwith" })}
              />
            )}
            sx={{
              "& .MuiChip-root": {
                backgroundColor: "var(--color-dark-blue)",
                color: "#fff",
                borderRadius: "8px",
              },
              "& .MuiSvgIcon-root": {
                display: "none",
              },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            value={detailInfo?.description}
            sx={{ backgroundColor: "var(--color-white)" }}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            inputProps={{ readOnly: true }}
            label={formatMessage({ id: "edoc.description" })}
            fullWidth
            multiline
            rows={2}
          />
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{
              border: "1px dashed var(--color-dark-blue)",
              backgroundColor: "#E6F0FF",
              padding: "1.2rem",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span
              style={{
                padding: "10px 10px 5px 10px",
                backgroundColor: "#CFE2FF",
                borderRadius: "5px",
              }}
            >
              <img
                src={
                  detailInfo?.file?.file_type.split("/")[1] === "pdf"
                    ? pdf
                    : detailInfo?.file?.file_type.split("/")[1] === "docx" ||
                      detailInfo?.file?.file_type.split("/")[1] === "doc"
                      ? word
                      : pic
                }
                alt="file"
              />
            </span>

            <Box>
              <Typography variant="body2" color={"#000"} fontWeight={"600"}>
                {detailInfo?.name}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </DialogContent>
  );
}

export default EdocDetail;
