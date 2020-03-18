import React, { useMemo } from 'react'
import withDefaults from '../utils/with-defaults'
import useTheme from '../styles/use-theme'

type Justify = 'start' | 'end' | 'center' | 'space-around' | 'space-between'
type Align = 'top' | 'middle' | 'bottom'

interface Props {
  gap?: number
  justify?: Justify
  align?: Align
  component?: keyof JSX.IntrinsicElements
  className?: string
}

const defaultProps = {
  gap: 0,
  justify: 'start' as 'start',
  align: 'top' as 'top',
  component: 'div' as 'div',
  className: '',
}

export type RowProps = Props & typeof defaultProps & React.HTMLAttributes<any>

const getFlexAlignment = (justify: Justify, align: Align) => {
  const flexJustifyMap: { [key in Justify]?: string } = {
    end: 'flex-end',
    center: 'center',
    'space-around': 'space-around',
    'space-between': 'space-between',
  }
  const flexAlignMap: { [key in Align]?: string } = {
    middle: 'center',
    bottom: 'flex-end',
  }
  return {
    justifyValue: flexJustifyMap[justify] || 'normal',
    alignValue: flexAlignMap[align] || 'normal',
  }
}

const Container: React.FC<React.PropsWithChildren<RowProps>> = React.memo(({
  children, component, gap, justify, align, className, ...props
}) => {
  const Component = component
  const theme = useTheme()
  const { justifyValue, alignValue } = useMemo(
  () => getFlexAlignment(justify, align),
  [justify, align],
  )
  
  return (
    <Component className={`row ${className}`} {...props}>
      {children}
      <style jsx>{`
      .row {
        display: flex;
        position: relative;
        box-sizing: border-box;
        margin-left: calc(${gap} * ${theme.layout.gap} / 2);
        margin-right: calc(${gap} * ${theme.layout.gap} / 2);
        --row-gap: calc(${gap} * ${theme.layout.gap});
        justify-content: ${justifyValue};
        align-items: ${alignValue};
      }
    `}</style>
    </Component>
  )
})

export default withDefaults(Container, defaultProps)
