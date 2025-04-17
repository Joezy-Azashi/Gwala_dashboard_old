import Card from "../../components/home/Card";
import {
  useGetTransactions,
  getAllWorkdaysCurrentUser,
  getStats,
} from "../../api";
import ChartCard from "../../components/home/ChartCard";
import { useEffect, useState } from "react";
import { Grid, Box, Hidden, Autocomplete } from "@mui/material";
import { useNavigate } from "react-router";
import { useLocale } from "../../locales";
import { useSelector } from "react-redux";
import EmployerCDPForm from "../../components/EmployerCDPForm";
import TimeTrackingCard from "../../components/home/TimeTrackingCard";


const Home = () => {
  const { formatMessage } = useLocale();
  const transactions = useGetTransactions();
  const [stat, setStat] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data } = getStats();
  const navigate = useNavigate();

  const INITIAL_FILTER = {
    sort_worked_minutes: 1,
    sort_alphabeticaly: 1,
    status: "",
    startDate: "",
    endDate: "",
  };

  const keys = {
    totalEmployees: formatMessage({ id: "stats.employees" }),
    isVerified: formatMessage({ id: "stats.activeemployees" }),
    totalEmployers: formatMessage({ id: "stats.admins" }),
    totalTransactions: formatMessage({ id: "stats.advances" }),
  };

  useEffect(() => {
    setLoading(true);
    let tmp = [];
    for (const property in data?.data) {
      if (
        property != "isPhoneVerified" &&
        property != "isNotPhoneVerified" &&
        keys[property]
      ) {
        tmp.push({
          user: { firstName: keys[property] },
          amount: data?.data[property],
        });
        setLoading(false);
      }
    }
    setStat([...tmp]);
  }, [data, formatMessage]);

  const [locale, setLang] = useState("fr");
  const [open, setOpen] = useState(false);
  const { lang, isDefaultPasswordChanged, role } = useSelector(
    (state) => state.userInfos
  );

  useEffect(() => {
    if (role !== "Admin" && isDefaultPasswordChanged === false) {
      setOpen(true);
    }
    setLang(lang);
  }, [lang, isDefaultPasswordChanged]);

  return (
    <Box sx={{ padding: "2rem 35px" }}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <Card
            title={formatMessage({ id: "statsgeneral.home" })}
            loading={loading}
            array={stat}
          />

          {/* {role === "Employer" && (
            <Box mt={4}>
              <TimeTrackingCard />
            </Box>
          )} */}
        </Grid>

        <Hidden mdUp>
          <Grid item xs={12} sm={6}>
            <Card
              title={formatMessage({ id: "lasttransactions.home" })}
              loading={loading}
              array={transactions?.data?.data?.docs}
              voir={transactions?.data?.data?.nextPage != null ? true : false}
              voirFunc={() => navigate("/transaction")}
            />
          </Grid>
        </Hidden>

        <Grid item xs={12} sm={12} md={6} lg={6} mb={10}>
          <ChartCard />
        </Grid>
        <Hidden mdDown>
          <Grid item md={3} lg={3}>
            <Card
              title={formatMessage({ id: "lasttransactions.home" })}
              array={transactions?.data?.data?.docs || []}
              loading={loading}
              voir={transactions?.data?.data?.nextPage != null ? true : false}
              voirFunc={() => navigate("/transaction")}
            />
          </Grid>
        </Hidden>
      </Grid>
      <EmployerCDPForm open={open} setOpen={setOpen} />
    </Box>
  );
};

export default Home;
