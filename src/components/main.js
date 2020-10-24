import React, { useState, useEffect, useRef } from 'react'
import { Global, css } from '@emotion/core'
import styled from '@emotion/styled'

import { Insomnia } from '@ionic-native/insomnia'
import { ThemeSwitch } from './theme/themeswitch'

const GlobalStyles = () => (
  <Global
    styles={css`
      html {
        background-size: cover;
        box-sizing: border-box;
        height: 100%;
        min-height: 100%;
        font-size: 62.5%;
      }
      body {
        font-family: 'Staatliches';
        text-rendering: optimizeLegibility;
        margin: 0;
        font-size: 16px; /* fallback for rem */
        font-size: 1.6rem;
      }
    `}
  />
)

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// Because setInterval and React have different ways of doing things

const useInterval = (callback, delay) => {
  const savedCallback = useRef() // { current: null }
  // useRef allows me to use a box to add stuff that I can read between rerenders

  // Remember the latest callback, and executes
  useEffect(() => {
    savedCallback.current = callback
    Insomnia.keepAwake()
  }, [callback]) // re-run when callback changes

  // Set up the interval.
  useEffect(() => {
    if (delay !== null) {
      savedCallback.current() // to avoid the first delay
      let id = setInterval(() => savedCallback.current(), delay)
      return () => clearInterval(id)
    }
  }, [delay]) // re-run when delay changes
}

const useTimer = () => {
  const [counter, setCounter] = useState(0)
  const [segment, setSegment] = useState('')
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [start, setStart] = useState(false)

  const counting = () => {
    let timer = new Date(segment - counter * 1000)
    setMinutes(timer.getMinutes())
    setSeconds(timer.getSeconds())
    if (parseInt(segment - counter * 1000) <= 0) {
      setStart(false)
      setSegment(0)
      setCounter(0)
      audio.play()
    } else {
      setCounter(counter + 1)
    }
  }

  useInterval(counting, start ? 1000 : null)

  const start_counter = time => {
    // I don't use Date.now() since setInterval is not restarted at every render, so it keeps track of the timer
    setSegment(0)
    setStart(false)
    setCounter(0)
    setSegment(time * 60 * 1000)
    setStart(true)
  }

  return [
    start_counter,
    () => (
      <div className="timer">
        {minutes > 9 ? minutes : '0' + minutes} : {seconds > 9 ? seconds : '0' + seconds}
      </div>
    ),
  ]
}

const Tool = () => {
  const [start_counter, Timer] = useTimer()

  /* radio button logic */
  /* ------------------ */
  const [checked, setChecked] = useState(0) /* values from 0 to 4 */
  const starting_audio = typeof window !== 'undefined' ? new Audio('audio/chime00.mp3') : ''
  const [audio, setAudio] = useState(starting_audio)

  useEffect(() => {
    try {
      audio.play()
    } catch (e) {}
  }, [audio])

  const radio_select = value => {
    setChecked(value)
    let new_audio = new Audio('audio/chime0' + value + '.mp3') // need to be loaded here that tab is for sure active
    setAudio(new_audio)
  }
  /* ------------------ */

  return (
    <Layout>
      <GlobalStyles />
      <div>
        <ThemeSwitch />

        <div className="grid">
          <div className="header">
            <h1>POMODORO TIMER</h1>
            <div>kuworking.com</div>
          </div>

          <div className="minigrid">
            <div className="title">
              <div>25 min blocks</div>
              <div>5 min break after 1 block</div>
              <div>15 min break after 4 blocks</div>
            </div>

            <div className="audios">
              {[...Array(5).keys()].map((el, i) => (
                <Radio key={i}>
                  <label>
                    <input
                      type="radio"
                      onChange={() => radio_select(i)}
                      name="audio"
                      value={i}
                      checked={checked === i}
                      aria-checked={checked === i}
                    />
                    <span></span>
                    <span>0{i + 1}</span>
                  </label>
                </Radio>
              ))}
            </div>
          </div>

          <Timer />

          <Box onClick={() => start_counter(25)} style={{ gridColumn: '1/3' }} bg="#c6f3f3" c="#585858">
            <div>BLOCK</div>
            <div>25 min</div>
          </Box>
          <Box onClick={() => start_counter(5)} bg="#ff8477">
            <div>5 BREAK</div>
            <div>5 min</div>
          </Box>
          <Box onClick={() => start_counter(15)} bg="#ff8477">
            <div>15 BREAK</div>
            <div>15 min</div>
          </Box>
        </div>
      </div>
    </Layout>
  )
}

export default Tool

const q = u => `@media (min-width: ${u}px)`
const qq = u => `@media (max-width: ${u}px)`

const Layout = styled.main`
  display: flex;
  align-items: baseline;
  justify-content: center;
  height: 100vh;

  transition: 0.2s all ease-in;
  background: ${props => props.theme.color_background};
  color: ${props => props.theme.color_text};

  & > div {
    max-width: 500px;
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    margin: 10px;

    & > div.grid {
      display: grid;
      grid-template-columns: auto auto;
      grid-gap: 10px;
      width: 100%;

      & > div.header {
        grid-column: 1/3;
        background: #e8e8e8;
        color: #ffffff;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        & > h1 {
          margin: 0;
          text-shadow: 1px 0px 1px #000;

          border-radius: 3px;
          padding: 10px;

          font-size: 3.3rem;
          ${q(400)} {
            font-size: 4.4rem;
          }
          ${q(500)} {
            font-size: 5rem;
          }
        }

        & > div {
          color: #000;
        }
      }

      & > div.minigrid {
        grid-column: 1/3;
        display: grid;
        grid-template-columns: 1fr auto;
        grid-gap: 10px;

        & > div.title {
          background-color: #e8e8e8;
          color: #7d7d7d;

          align-items: center;
          justify-content: center;
          align-content: center;
          display: grid;
          border-radius: 3px;

          font-size: 1.5rem;
          padding: 0 10px;
          ${q(500)} {
            padding: 0 40px;
          }
        }

        & > div.audios {
          background: #e8e8e8;
          color: #7d7d7d;

          width: 50px;
          ${q(400)} {
            width: 100px;
          }
          height: fit-content;
          border-radius: 3px;
          text-transform: uppercase;
          text-align: center;
          padding: 5px;

          font-size: 1.5rem;
        }
      }

      & > div.timer {
        grid-column: 1/3;

        grid-column: 1/3;
        height: 200px;
        border-radius: 3px;
        border: 1px solid #ccc;
        align-items: center;
        justify-content: center;
        display: flex;
        font-size: 10rem;
        color: #fff;
        text-shadow: 1px 1px 3px #000;
      }
    }
  }
`

const Box = styled.div`
  border-radius: 3px;
  color: ${p => p.c || '#fff'};

  font-weight: 700;
  padding: 10px;

  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;

  font-size: 1.5rem;
  ${q(400)} {
    font-size: 1.7rem;
  }
  ${q(500)} {
    font-size: 2rem;
  }

  background: ${p => p.bg};
  cursor: pointer;

  & > div:nth-of-type(1) {
    font-size: 2em;
  }

  &:hover {
    background: #ccc;
  }
`

const Radio = styled.div`
  margin: 3px;
  cursor: pointer;
  width: 15px;
  height: 15px;
  position: relative;
  display: flex;

  &::before {
    content: '';
    border-radius: 100%;
    border: 2px solid #ccc;
    background: #fff;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    box-sizing: border-box;
    pointer-events: none;
    z-index: 0;
  }

  & > label {
    padding-left: 20px;
    cursor: pointer;

    & > input {
      display: none;
      opacity: 0;
      z-index: 2;
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      cursor: pointer;

      &:focus {
        outline: none;
      }
    }

    & > span:not(:last-of-type) {
      background: #fff;
      width: 0;
      height: 0;
      border-radius: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      transition: width 0.2s ease-in, height 0.2s ease-in;
      pointer-events: none;
      z-index: 1;

      &::before {
        content: '';
        opacity: 0;
        width: calc(15px - 4px);
        position: absolute;
        height: calc(15px - 4px);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 1px solid #ff8477;
        border-radius: 100%;
      }
    }

    & > input:checked + span:not(:last-of-type) {
      width: calc(100% - 8px);
      height: calc(100% - 8px);
      transition: width 0.2s ease-out, height 0.2s ease-out;

      &:before {
        opacity: 1;
        transition: opacity 1s ease;
      }
    }

    & > span:last-of-type {
      display: inline-block;
      width: max-content;
    }
  }
`
