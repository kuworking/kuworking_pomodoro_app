import React from 'react'
import styled from '@emotion/styled'
import { useTheme } from '../theme/provider'

export const useThemeSwitch = () => {
  const { mode, toogle } = useTheme()

  return [
    mode,
    () => (
      <Div day={mode === 'light'} onClick={toogle} id="gtm_switch_DayNight_1">
        <div id="gtm_switch_DayNight_2">
          <div id="gtm_switch_DayNight_3">
            <img src="/global/moon.svg" alt="noche" />
            <img src="/global/sun.svg" alt="día" />
          </div>
        </div>
      </Div>
    ),
  ]
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
