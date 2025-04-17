import React, { useState } from "react";
import { Box } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import TimeTrackingStepperDaily from "../TimeTrackingStepperDaily";
import TimeTrackingStepperWeekly from "../TimeTrackingStepperWeekly";
import TimeTrackingStepperMonthly from "../TimeTrackingStepperMonthly";
import TimeTrackingStepperYearly from "../TimeTrackingStepperYearly";
import { useLocale } from "../../locales";

function TimeTrackingTabs({ name, reportTabChange, selectDay, setSelectDay }) {
    const [tabIndex, setTabIndex] = useState(0)
    const { formatMessage } = useLocale();

    const tabHandler = (e, val) => {
        setTabIndex(val);
    };

    return (
        <Box>
            <TabContext value={reportTabChange}>

                <TabPanel value={0} sx={{paddingTop: '12px'}}>
                    <TimeTrackingStepperDaily
                        name={name}
                        selectDay={selectDay}
                        setSelectDay={setSelectDay}
                    />
                </TabPanel>

                <TabPanel value={1} sx={{paddingTop: '12px'}}>
                    <TimeTrackingStepperWeekly
                        name={name}
                    />
                </TabPanel>

                <TabPanel value={2} sx={{paddingTop: '12px'}}>
                    <TimeTrackingStepperMonthly />
                </TabPanel>

                <TabPanel value={3} sx={{paddingTop: '12px'}}>
                    <TimeTrackingStepperYearly />
                </TabPanel>
            </TabContext>
        </Box>
    )
}

export default TimeTrackingTabs;
