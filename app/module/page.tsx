"use client"
import GlobalTable from '@/components/reusableComponents/global-table'
import withLoading from '@/components/reusableComponents/with-loading-hoc'
import { RoleApis } from '@/lib/controller/httpApis'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import ModuleRows from './module-rows'
const { getRoleModules } = new RoleApis()
const MyComponentWithLoading = withLoading(GlobalTable);
const heading = [
  { name: "Sr. No", align: "center" },
  { name: "Module Name", align: "center" },
  { name: "Status", align: "center" }
]
const page = () => {

  const { data, isLoading, error } = useQuery({
    queryKey: ['roleModules'],
    queryFn: getRoleModules,
  })

  return (
    <div>
      <MyComponentWithLoading
        label='Modules Names'
        heading={heading}
        loading={isLoading}
        rowdata={data?.data || []}
        Component={ModuleRows}
      />
    </div>
  )
}

export default page