import React, { useEffect, useMemo, useRef } from 'react'
import { withRouter, Router } from 'next/router'
import { useTheme, Spacer } from 'components'
import SideItem, { SideItemProps, Sides } from './side-item'
import useConfigs from 'lib/states/use-config'

export interface Props {
  router: Router
}

export type SideGroupProps = Props & SideItemProps

export type SideChildren = Sides | Array<Sides>

export const SideGroup: React.FC<{ sides?: SideChildren }> = React.memo(({ sides }) => {
  if (!sides) return null
  sides = Array.isArray(sides) ? sides : [sides]
  return <SideItem sides={sides} />
})

export const Sidebar: React.FC<SideGroupProps> = React.memo(({ sides }) => {
  const theme = useTheme()
  const boxRef = useRef<HTMLDivElement>(null)
  const { shouldScroll, updateShouldScroll } = useConfigs()
  const totalHeight = useMemo<number>(() => {
    if (!sides || !Array.isArray(sides)) return 0
    return sides.length * 36
  }, [sides])

  useEffect(() => {
    if (!boxRef.current || !shouldScroll) return
    updateShouldScroll && updateShouldScroll(false)
    boxRef.current.scrollTo({ top: boxRef.current.scrollHeight })
  }, [shouldScroll])

  return (
    <div ref={boxRef} className="sides box">
      <SideItem sides={sides}>
        <SideGroup />
      </SideItem>
      <Spacer />
      <style jsx>{`
        .sides {
          height: ${totalHeight}px;
          width: 100%;
          padding-bottom: ${theme.layout.gap};
        }
        
        .box {
          overflow-y: auto;
          overflow-x: hidden;
          height: calc(100vh - 140px);
        }
        
        .box::-webkit-scrollbar {
          width: 5px;
          background-color: ${theme.palette.accents_1};
        }
        
        .box::-webkit-scrollbar-thumb {
          background-color: ${theme.palette.accents_2};
          border-radius: ${theme.layout.radius};
        }

        .box>:global(.item) {
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  )
})

export default withRouter(Sidebar)
