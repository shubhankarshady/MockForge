import React from 'react'
import AddNewInterview from '@/components/shared/AddNewInterview'
import InterviewList from '@/components/shared/InterviewList'

import DashboardHero from '@/components/shared/DashboardHero'

function Dashboard() {
  return (
    <div className="p-10">

      <DashboardHero />

     

      <div className="grid grid-cols-1 md:grid-cols-3 my-5">
        <AddNewInterview />
      </div>

      <InterviewList />

    </div>
  );
}

export default Dashboard;