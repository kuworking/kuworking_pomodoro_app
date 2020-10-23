import React, { useState, useEffect, useRef } from 'react'
import styled from '@emotion/styled'

import { Layout } from '../../src/components/layout'
import { SPACE } from '../../src/components/shared'

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// Because setInterval and React have different ways of doing things

const useInterval = (callback, delay) => {
  const savedCallback = useRef() // { current: null }
  // useRef allows me to use a box to add stuff that I can read between rerenders

  // Remember the latest callback, and executes
  useEffect(() => {
    savedCallback.current = callback
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

const Tool = ({ pageContext }) => {
  const main_maxwidth = '1080px' /* 200 x 5 + 20 x 4, manually, to adjust the topbar to the width used here */

  /* radio button logic */
  /* ------------------ */
  const [checked, setChecked] = useState(0) /* values from 0 to 4 */
  const starting_audio = typeof window !== 'undefined' ? new Audio('tools/pomodoro/chime00.mp3') : ''
  const [audio, setAudio] = useState(starting_audio)

  useEffect(() => {
    audio.play()
  }, [audio])

  const radio_select = value => {
    setChecked(value)
    let new_audio = new Audio('tools/pomodoro/chime0' + value + '.mp3') // need to be loaded here that tab is for sure active
    setAudio(new_audio)
  }
  /* ------------------ */

  /* time logic */
  /* ------------------ */
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
  /* ------------------ */

  const seoProps = {
    ...pageContext.schema,
    content_type_og: 'website',
    title: 'Pomodoro Timer',
    description: 'Work better tracking your productivity with Pomodoro Timers, here you have an online tool',
    keywords: ['kuworking.com', 'online', 'resource', 'web', 'pomodoro', 'timer', 'productivity'],
    robots: 'index, follow',
    image: 'https://www.kuworking.com/global/kuworking.jpg',
  }

  const maxWidth = '1080px'
  const layout_props = { pageContext, seoProps, maxWidth }

  return (
    <Layout {...layout_props}>
      <Text>
        <h1>
          <em>POMODORO TIMER</em>
        </h1>
      </Text>

      <Title>
        <div>Trabaja en tramos de 25 min</div>
        <div>Toma un descanso de 5 min entre tramos</div>
        <div>Después de 4 pomodoros, toma un descanso de 15 min</div>
      </Title>

      <Timer>
        {minutes > 9 ? minutes : '0' + minutes} : {seconds > 9 ? seconds : '0' + seconds}
      </Timer>

      <Grid>
        <Box onClick={() => start_counter(25)}>
          <>
            <div>TRAMO</div>
            <div>START</div>
            <div>25 min</div>
          </>
        </Box>
        <Box onClick={() => start_counter(5)}>
          <>
            <div>MINI BREAK</div>
            <div>START</div>
            <div>5 min</div>
          </>
        </Box>
        <Box onClick={() => start_counter(15)}>
          <>
            <div>BREAK</div>
            <div>START</div>
            <div>15 min</div>
          </>
        </Box>
        <Box2>
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
                <span>Audio 0{i + 1}</span>
              </label>
            </Radio>
          ))}
        </Box2>
      </Grid>

      <SPACE blk space="40px" />
    </Layout>
  )
}

export default Tool

const Div = styled.main`
  display: flex;
  min-height: 100vh; /* needed for the sticky footer */
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
`

const Radio = styled.div`
  margin: 5px;
  cursor: pointer;
  width: ${props => (props.size ? props.size : 20)}px;
  height: ${props => (props.size ? props.size : 20)}px;
  position: relative;
  display: flex;

  &::before {
    content: '';
    border-radius: 100%;
    border: 5px solid #349bff;
    background: #000000;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    box-sizing: border-box;
    pointer-events: none;
    z-index: 0;
  }

  & > label {
    padding-left: 25px;
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
        width: calc(20px - 4px);
        position: absolute;
        height: calc(20px - 4px);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 5px solid #fff;
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

const Timer = styled.div`
  height: 300px;
  border-radius: 15px;
  border: 9px solid #000;
  background: linear-gradient(249deg, #dcee5c, #51e1cc);
  align-items: center;
  justify-content: center;
  display: flex;
  margin-bottom: 50px;
  font-size: 7em;
  color: #fff;
  text-shadow: 0px 10px 20px #000;
  width: 100%;

  @media (max-width: 800px) {
    height: 150px;
    font-size: 4em;
  }

  @media (max-width: 520px) {
    margin-bottom: 20px;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 235px);
  grid-column-gap: 40px;
  justify-items: center;
  justify-content: space-evenly;

  @media (max-width: calc(235px * 4 + 40px * 3 + 20px)) {
    grid-template-columns: repeat(3, 235px);
    grid-column-gap: auto;
    grid-row-gap: 40px;
  }

  @media (max-width: calc(235px * 3 + 40px * 3 + 20px)) {
    grid-template-columns: repeat(2, 235px);
  }

  @media (max-width: calc(235px * 2 + 40px * 3 + 20px)) {
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 5px;
    grid-row-gap: 30px;
    width: 100%;
  }
`

const ParentBox = styled.div`
  width: 100%;
  border-radius: 15px;
  text-transform: uppercase;
  color: #fff;
  font-weight: 700;
  text-align: center;
  padding: 10px;

  @media (max-width: 500px) {
    font-size: 0.8em;
  }
  @media (max-width: 400px) {
    font-size: 0.6em;
  }
`

const Box = styled(ParentBox)`
  background: linear-gradient(325deg, #fe3e2a, #fb3232);
  box-shadow: 0px 20px 0px 0px #dedede;
  cursor: pointer;
  transition: all 0.5s ease;

  &:hover {
    box-shadow: 0px 40px 0px 0px #dedede;
    & > div:nth-of-type(2) {
      letter-spacing: 0.05em;
      text-shadow: 0 6px 0px #000;
    }
  }

  & > div:nth-of-type(1) {
    font-size: 1.6em;
    color: #000;
  }
  & > div:nth-of-type(2) {
    transition: all 0.5s ease;
    font-size: 4em;
  }
  & > div:nth-of-type(3) {
    font-size: 1.2em;
  }
`

const Box2 = styled(ParentBox)`
  background: #7b7b7b;
  box-shadow: 0px 10px 0px 0px #ffcdcd;
`

const Text = styled.div`
  width: 100%;
  margin: 40px 20px 20px 20px;
  display: flex;
  justify-content: center;

  @media (max-width: 800px), (max-height: 800px) {
    margin: 40px 0px 20px 0px;
  }

  & > h1 {
    font-size: 2em;
    line-height: 1.3em;
    /* font-variant-caps: small-caps; */
    text-transform: uppercase;
    font-weight: 700;
    background-color: #efefef;
    background: linear-gradient(325deg, #fe3e2a, #fb3232);
    border-radius: 15px;
    padding: 40px;
    margin: 80px 0;
    color: #c3c3c3;

    @media (max-width: 800px), (max-height: 800px) {
      font-size: 1.5em;
      padding: 10px;
    }

    display: unset;
    font-weight: unset;
    margin-block-start: unset;
    margin-block-end: unset;
    margin-inline-start: unset;
    margin-inline-end: unset;

    & > em {
      display: block;
      font-size: 1.3em;
      font-weight: 700;
      font-style: normal;
      border-radius: 8px;
      color: #fff;
      text-shadow: 10px 0px 1px #ff0000bf;
      letter-spacing: -0.025em;
      background: unset;
    }

    & > span {
      font-size: 1.3em;
      font-weight: 700;
      font-style: normal;
      padding: 0 5px;
      border-radius: 8px;
      color: #fff;
      letter-spacing: -0.025em;
    }
  }
`

const Title = styled.div`
  background-color: #a2a2a2;
  padding: 10px 40px 20px 40px;
  margin: 40px;
  margin-top: 0px;
  color: #fff;
  font-size: 1.2em;
  font-weight: 700;
  border-radius: 8px;
  letter-spacing: -0.025em;
  min-width: 400px;

  & > div {
    margin-top: 5px;
  }

  @media (max-width: 500px) {
    display: none;
  }
`
