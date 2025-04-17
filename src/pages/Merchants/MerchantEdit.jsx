import React, { useEffect, useState } from 'react'
import SideContainer from '../../containers/SideContainer'
import { useLocale } from '../../locales';
import { Avatar, Box, Typography } from '@mui/material';
import CreateMerchantForm from '../../components/Merchants/CreateMerchantForm';
import { Redirect } from '../../components/UI';
import moment from 'moment';
import { useNavigate } from 'react-router';
import axios from '../../api/request';

const RightSide = ({ userDate, profileImage }) => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate()
  const [data, setData] = useState([])

  const getCashBack = () => {
    axios.get(`/v2/cashback/history?merchantId=${userDate?.id}&limit=3&page=1`)
      .then((res) => {
        setData(res?.balances?.docs)
      })
      .catch((error) => {

      })
  }

  useEffect(() => {
    if (userDate?.id) getCashBack()
  }, [userDate])

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
      <div style={{ paddingTop: "2rem" }}>
        <Avatar
          src={profileImage || userDate?.logo}
          sx={{
            width: 140,
            height: 140,
            textTransform: "capitalize",
            fontSize: "5rem",
          }}
        >
          {userDate?.name?.split(" ")[0][0]}
          {userDate?.name?.split(" ")?.length > 1 && userDate?.name?.split(" ")[1][0]}
        </Avatar>
      </div>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
        <Box
          onClick={() => { !userDate?.transactions ? "" : navigate(`/history-of-transaction/${userDate?.id}`, { state: { name: userDate?.name } }) }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            cursor: !userDate?.transactions ? "default" : "pointer"
          }}>
          <Typography sx={{ fontSize: "15px", fontWeight: 600, color: "#002b69" }}>{formatMessage({ id: "merchants.transactionhistory" })}</Typography>
          <Redirect />
        </Box>

        {!userDate?.transactions ?
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "13px"
            }}
          >
            {formatMessage({ id: "employee.norecords" })}
          </div> :
          userDate?.transactions?.slice(0, 3)?.map((el) => {
            return (
              <Box key={el?.id} sx={{ display: "flex", justifyContent: "space-between", width: "100%", fontSize: "15px", color: '#002b69' }}>
                <Box>{moment(el?.startDate).format("DD/MM/YYYY, hh:mm")}</Box>
                <Box>{el?.amount} MAD</Box>
              </Box>
            )
          })}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
        <Box
          onClick={() => { !userDate?.reimbursements ? "" : navigate(`/merchant-reimbursements/${userDate?.id}`, { state: { name: userDate?.name } }) }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            cursor: !userDate?.reimbursements ? "default" : "pointer"
          }}>
          <Typography sx={{ fontSize: "15px", fontWeight: 600, color: "#002b69" }}>{formatMessage({ id: "merchants.reimbursementhistory" })}</Typography>
          <Redirect />
        </Box>

        {!userDate?.reimbursements ?
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "13px"
            }}
          >
            {formatMessage({ id: "employee.norecords" })}
          </div> :
          userDate?.reimbursements?.slice(0, 3)?.map((el) => {
            return (
              <Box key={el?.id} sx={{ display: "flex", justifyContent: "space-between", width: "100%", fontSize: "15px", color: '#002b69' }}>
                <Box>{moment(el?.startDate).format("DD/MM/YYYY, hh:mm")}</Box>
                <Box>{el?.amount} MAD</Box>
              </Box>
            )
          })}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
        <Box
          onClick={() => { data?.length < 1 ? "" : navigate(`/tracker`, { state: { cashback: true, id: data[0]?.merchantId } }) }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            cursor: data?.length < 1 ? "default" : "pointer"
          }}>
          <Typography sx={{ fontSize: "15px", fontWeight: 600, color: "#002b69" }}>{formatMessage({ id: "merchants.cashbackops" })}</Typography>
          <Redirect />
        </Box>

        {data?.length < 1 ?
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "13px"
            }}
          >
            {formatMessage({ id: "employee.norecords" })}
          </div> :
          data?.map((el) => {
            return (
              <Box key={el?.userId} sx={{ display: "flex", justifyContent: "space-between", width: "100%", fontSize: "15px", color: '#002b69' }}>
                <Box>{moment(el?.createdAt).format("DD/MM/YYYY, hh:mm")}</Box>
                <Box>{el?.amount} MAD</Box>
              </Box>
            )
          })}
      </Box>
    </Box>
  );
};

const LeftSide = ({ setUserDate, setProfileImage }) => {
  return (
    <Box>
      <CreateMerchantForm setUserDate={setUserDate} setProfileImage={setProfileImage} />
    </Box >
  )
}

function MerchantEdit() {
  const [userDate, setUserDate] = useState("")
  const [profileImage, setProfileImage] = useState()

  return (
    <SideContainer
      RightSideComponent={
        <RightSide
          userDate={userDate}
          profileImage={profileImage}
        />
      }
      LeftSideComponent={
        <LeftSide
          setUserDate={setUserDate}
          setProfileImage={setProfileImage}
        />
      }
    />
  )
}

export default MerchantEdit