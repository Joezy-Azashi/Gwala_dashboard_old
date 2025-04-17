import { Dialog, DialogTitle, Box } from "@mui/material";
import React from "react";
import { TextField } from "../UI";
import { useLocale } from "../../locales";
import moment from "moment";
import { differenceTwoDate } from "../../utils";
import { useNavigate } from "react-router";

const ModalRequest = ({ type, data, open, onClose }) => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate();

  return (
    <Dialog
      open={open}
      sx={{
        "& .MuiDialog-paper": { width: "100%" },
      }}
      maxWidth="md"
      onClose={onClose}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 600,
          color: "var(--color-dark-blue)",
        }}
      >{`${type} - Request Details`}</DialogTitle>

      <div className="container" style={{ padding: "15px" }}>
        <div className="row" style={{ justifyContent: "center" }}>
          <div className="col-4">
            <TextField
              label={formatMessage({ id: "employee.name" })}
              type={"text"}
              autoComplete="off"
              value={`${data?.user?.firstName} ${data?.user?.lastName}`}
              fullWidth
              margin="dense"
              InputProps={{
                readOnly: true,
              }}
            />
          </div>

          <div className="col-4">
            <TextField
              label={formatMessage({ id: "employee.phone" })}
              type={"text"}
              autoComplete="off"
              value={data?.user?.phone?.number}
              fullWidth
              margin="dense"
              InputProps={{
                readOnly: true,
              }}
            />
          </div>

          <div className="col-4">
            <TextField
              label={formatMessage({ id: "profile.email" })}
              type={"text"}
              autoComplete="off"
              value={data?.user?.email}
              fullWidth
              margin="dense"
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
        </div>
        <div className="row" style={{ justifyContent: "center" }}>
          <div className="col-auto">
            <TextField
              label={formatMessage({ id: "employer.branch" })}
              type={"text"}
              autoComplete="off"
              value={data?.user?.company?.name}
              fullWidth
              margin="dense"
              InputProps={{
                readOnly: true,
              }}
            />
          </div>

          {type == "Phone" && (
            <>
              <div className="col-auto">
                <TextField
                  label={"New phone"} // New Phone translate
                  type={"text"}
                  autoComplete="off"
                  value={data?.oldPassword}
                  fullWidth
                  margin="dense"
                />
              </div>

              <div className="col-auto">
                <TextField
                  label={"Request Submission Date"} // New Phone translate
                  type={"text"}
                  autoComplete="off"
                  value={data?.oldPassword}
                  fullWidth
                  margin="dense"
                />
              </div>
            </>
          )}

          {type === "Absence" && (
            <div className="col-auto">
              <TextField
                label={formatMessage({
                  id: "timetracker.vacation.reason",
                })} // New Phone translate
                type={"text"}
                autoComplete="off"
                value={data?.description}
                fullWidth
                margin="dense"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
          )}
          {type === "Vacation" || type === "Absence" && (
            <div className="col-auto">
              <TextField
                label={formatMessage({
                  id: "timetracker.vacation.day.requested",
                })} // New Phone translate
                type={"text"}
                autoComplete="off"
                value={`${differenceTwoDate(
                  data.startDate,
                  data.endDate
                )} days `}
                fullWidth
                margin="dense"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
          )}
          <div className="row" style={{ justifyContent: "center" }}>
            <div className="col-auto">
              <TextField
                label={"Start Date"} // New Phone translate
                type={"text"}
                autoComplete="off"
                value={
                  data?.startDate && moment(data.startDate).format("DD/MM/YYYY")
                }
                fullWidth
                margin="dense"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            <div className="col-auto">
              <TextField
                label={"End Date"} // New Phone translate
                type={"text"}
                autoComplete="off"
                value={
                  data?.endDate && moment(data.endDate).format("DD/MM/YYYY")
                }
                fullWidth
                margin="dense"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
          </div>
        </div>
        <div className="row" style={{ justifyContent: "center" }}>
          <div
            style={{
              color: "var(--color-dark-blue)",
              fontWeight: 600,
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/timetracker/${data?.user?._id}`)}
          >
            See requests history
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalRequest;
