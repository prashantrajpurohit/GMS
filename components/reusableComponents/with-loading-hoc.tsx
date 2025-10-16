"use client"
import React, { FC, ComponentType } from 'react'
import { Skeleton } from '../ui/skeleton'

interface WithLoadingProps {
  loading: boolean
}

const withLoading = <P extends object>(WrappedComponent: ComponentType<P>): FC<P & WithLoadingProps> => {
  const MemoizedComponent = React.memo(WrappedComponent) as ComponentType<P>

  const ComponentWithLoading: FC<P & WithLoadingProps> = ({ loading, ...props }) => {
    
    if (loading) return <Skeleton className="h-20 w-full" />;
    
    return <MemoizedComponent {...(props as P)} />
  }

  return ComponentWithLoading
}

export default withLoading
