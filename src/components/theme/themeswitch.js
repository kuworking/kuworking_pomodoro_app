import React from 'react'
import styled from '@emotion/styled'
import { useTheme } from '../theme/provider'

export const ThemeSwitch = () => {
  const { mode, toogle } = useTheme()

  return (
    <Div day={mode === 'light'} onClick={toogle} id="gtm_switch_DayNight_1">
      <div id="gtm_switch_DayNight_2">
        <div id="gtm_switch_DayNight_3">
          <img src="/moon.svg" alt="night" />
          <img src="/sun.svg" alt="day" />
        </div>
      </div>
    </Div>
  )
}

const Div = styled.div`
  cursor: pointer;
  margin: 4px;

  display: flex;
  align-items: center;
  justify-content: center;

  & > div {
    width: 20px;
    height: 20px;
    overflow: hidden;

    & > div {
      position: relative;
      display: flex;
      flex-direction: column;
      transition: margin-top 0.2s ease-in;
      margin-top: ${props => (props.day ? '-20px' : '0px')};

      & img {
        width: 20px;
        height: 20px;
      }
    }
  }
`
