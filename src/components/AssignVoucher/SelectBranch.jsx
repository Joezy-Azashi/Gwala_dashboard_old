import { Box, Typography } from '@mui/material';
import React from 'react'
import { useLocale } from '../../locales';

const SelectBranch = ({selectedBranch, filter, setFilter, setEmployees, handleSelectBranch, selectedUserState, convert}) => {
    const { formatMessage } = useLocale();

    return (
        <Box>
            <Typography textAlign={"center"} fontWeight={600} fontSize={"1rem"}>
              {formatMessage({ id: "advance.branch" })}
            </Typography>
            <Typography textAlign={"center"} variant="body2" mb={2}>
              {convert ? formatMessage({ id: "evoucher.choosebranchconvert" }) :
              formatMessage({ id: "evoucher.choosebranch" })}
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 7 }} mt={5}>
              {selectedUserState?.manages?.filter(ft => ft?.features?.includes("EVOUCHERS") || ft?.features?.includes("ALL"))?.length < 1 ?
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "15vh",
                    fontSize: "1.2rem",
                  }}
                >
                  {formatMessage({ id: "employee.norecords" })}
                </div> :
                selectedUserState?.manages?.filter(ft => ft?.features?.includes("EVOUCHERS") || ft?.features?.includes("ALL"))?.map((el, index) => {
                  return (
                    <Typography
                      key={index}
                      onClick={() => { handleSelectBranch(el); setEmployees([]); setFilter({ ...filter, companyId: el?._id }) }}
                      variant='body2'
                      sx={{
                        backgroundColor: selectedBranch.id === el?._id ? "#002B69" : "",
                        border: "1px solid #002B69",
                        padding: "13px 19px",
                        fontSize: "15px",
                        borderRadius: "20px",
                        cursor: "pointer",
                        color: selectedBranch.id === el?._id ? "#fff" : "",
                        whiteSpace: "nowrap",
                        zIndex: 1,
                        userSelect: "none"
                      }}>
                      {el?.name}
                    </Typography>
                  )
                })}
            </Box>

          </Box>
    )
}

export default SelectBranch