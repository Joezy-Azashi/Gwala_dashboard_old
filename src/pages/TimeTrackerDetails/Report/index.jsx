import React from 'react'
import TimeTrackingTabs from '../../../components/TimeTrackingReportTab'

function Report({ name, reportTabChange, selectDay, setSelectDay }) {
  return (
    <div>
      <TimeTrackingTabs
        name={name}
        reportTabChange={reportTabChange}
        selectDay={selectDay}
        setSelectDay={setSelectDay}
      />
    </div>
  )
}

export default Report;
