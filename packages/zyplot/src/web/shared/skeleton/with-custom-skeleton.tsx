import type {ComponentType, ReactNode} from 'react'

type CustomSkeletonProps = {
  isLoading?: boolean
  skeleton?: ReactNode
}

export const withCustomSkeleton = <Props extends CustomSkeletonProps>(Component: ComponentType<Props>) => {
  const Wrapped = (props: Props) => {
    if (props.isLoading && props.skeleton) {
      return props.skeleton
    }

    return <Component {...props} />
  }

  Wrapped.displayName = `withCustomSkeleton(${Component.displayName ?? Component.name})`

  return Object.assign(Wrapped, Component)
}
