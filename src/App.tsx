import './App.css'
import React, { useState } from 'react'
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  ReferenceLine,
  TooltipProps,
} from 'recharts'
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent'

type Sample = {
  name: string
  uv: number | null
  uvy: number | null
  pv: number | null
  pvy: {
    total: number
    cart: number
  } | null
  amt: number | null
  cnt: number | null
}

type DataKey = keyof Sample

const data: Sample[] = [
  {
    name: '2024/01',
    uv: 1000000,
    uvy: null,
    pv: 100000,
    pvy: null,
    amt: -50000,
    cnt: 490,
  },
  {
    name: '2024/02',
    uv: 880000,
    uvy: null,
    pv: 120000,
    pvy: null,
    amt: -50000,
    cnt: 590,
  },
  {
    name: '2024/03',
    uv: 900000,
    uvy: null,
    pv: 50000,
    pvy: null,
    amt: -50000,
    cnt: 350,
  },
  {
    name: '2024/04',
    uv: 700000,
    uvy: 800000,
    pv: 0,
    pvy: null,
    amt: -50000,
    cnt: 480,
  },
  {
    name: '2024/05',
    uv: null,
    uvy: 850000,
    pv: 90000,
    pvy: null,
    amt: -50000,
    cnt: 460,
  },
  {
    name: '2024/06',
    uv: null,
    uvy: 900000,
    pv: 50000,
    pvy: {
      total: 70000,
      cart: 5000,
    },
    amt: -50000,
    cnt: 380,
  },
  {
    name: '2024/07',
    uv: 0,
    uvy: 1000000,
    pv: 0,
    pvy: 0,
    amt: 0,
    cnt: 0,
  },
]

type TooltipType = {
  label: string
  payload: Sample
  active: boolean
}

declare type MyTooltip<Sample extends ValueType> = TooltipProps<
  Sample,
  NameType
>

export default function App() {
  // const BackgroundRender = (targetBar: Object) => {
  //   const { x, y, width, height, week } = targetBar;

  //   console.log(targetBar);
  //   let expandedWidth = 2;
  //   let expandedHeight = 25;

  //   // if (week !== props.selectedWeek) {
  //   //   return <path x="0" y="0" height="0" width="0" />;
  //   // }

  //   return (
  //     <>
  //       <path fill="#cccccc" d="M-1-1v4h4v-4z" />
  //       <path
  //         fill="#692e45"
  //         opacity=".71"
  //         d="M1-1h.8l-4 4v-.8zM3-1v.8l-4 4h-.8z"
  //       />
  //     </>
  //   );
  // };
  const CandyBar = (props) => {
    const { x: oX, y: oY, width: oWidth, height: oHeight, value, fill } = props

    const x = oX
    const y = oHeight < 0 ? oY + oHeight : oY
    const width = oWidth
    const height = Math.abs(oHeight)

    return (
      <rect
        fill={fill}
        mask="url(#mask-stripe)"
        x={x}
        y={y}
        width={width}
        height={height}
      />
    )
  }

  const [currentLabel, setCurrentLabel] = useState('')
  const [activeDataKey, setActiveDataKey] = useState<DataKey | ''>('')

  //ホバーしているCellのlabel名を取得する
  const barOverEvent = (data: any) => {
    const { dataKey } = data.tooltipPayload[0]
    if (data) {
      setCurrentLabel(data.name)
      setActiveDataKey(dataKey)
    }
  }

  const barLeaveEvent = () => {
    setCurrentLabel('')
    setActiveDataKey('')
  }

  const CustomTooltip = ({ active, payload, label }: MyTooltip<ValueType>) => {
    if (active && payload && payload.length !== 0) {
      if(currentLabel !== '') {
        // 棒グラフホバー時
        console.log({payload})
        const hoverData = payload.find((data) => data.dataKey === activeDataKey)
        return (
          <>
            <div className="custom-tooltip">
              <p className="label">{label}</p>
              <div className="box">
                <p className="paybox"></p>
                {`${hoverData?.name}  ${hoverData?.value?.toLocaleString()}`}
              </div>
              {/* {payload[1].payload?.pvy?.total && (
                <div className="box">
                  <p className="paybox"></p>
                  {`出金  ${payload[1].payload.pvy.cart}`}
                </div>
              )} */}
              {/* <div className="box">
                <p className="drawalbox"></p>
                {`出金 ${payload[1]?.amt}`}
              </div>
              <div className="box">
                <p className="balancebox">
                  <p className="balanceborder"></p>
                </p>
                {`${payload[2].uv}`}
              </div> */}
            </div>
          </>
        )
      } else {
        // 棒グラフホバー時以外は折れ線グラフの値を表示する
        const hoverData = payload.find((data) => data.dataKey === 'uv')
        console.log({hoverData})
        if(hoverData) {
          return (
            <div className="custom-tooltip">
              <p className="label">{label}</p>
              <div className="box">
                <p className="paybox"></p>
                {`${hoverData?.name}  ${hoverData?.value?.toLocaleString()}`}
              </div>
            </div>
          )
        }
      }
    }
    return null
  }

  return (
    <ComposedChart
      width={800}
      height={400}
      data={data}
      margin={{
        top: 20,
        right: 25,
        bottom: 20,
        left: 100,
      }}
      stackOffset="sign"
      barGap={-20}
    >
      <pattern
        id="pattern-stripe"
        width="4"
        height="8"
        patternUnits="userSpaceOnUse"
        opacity="0.5"
        patternTransform="rotate(45)"
      >
        <rect
          width="3"
          height="8"
          transform="translate(0,0)"
          fill="white"
        ></rect>
      </pattern>
      <mask id="mask-stripe">
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#pattern-stripe)"
          opacity="0.5"
        />
      </mask>
      <Legend />
      <ReferenceLine y={0} stroke="#000" />
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="name"
        xAxisId={0}
        // scale="band"
        padding={{ left: 10, right: 10 }}
      />
      <XAxis dataKey="name" xAxisId={1} hide />
      <YAxis
        tickFormatter={(key) =>
          (key / 100).toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })
        }
        domain={['dataMin - 100000', 'auto']}
        label={{ value: '入出金(計)', position: 'left' }}
        yAxisId={0}
      />
      <YAxis
        tickFormatter={(key) =>
          (key / 100).toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })
        }
        orientation="right"
        domain={['dataMin - 1000000', 'auto']}
        label={{ value: '残高', position: 'right' }}
        yAxisId={1}
      />
      <Tooltip  content={<CustomTooltip />} cursor={false} isAnimationActive={false} />
      <Bar
        dataKey="pv"
        name="入金"
        barSize={20}
        xAxisId={0}
        opacity={0.7}
        fill="rgba(83, 178, 231, 1)"
        onMouseOver={barOverEvent}
        onMouseLeave={barLeaveEvent}
      />
      <Bar
        dataKey="pvy.total"
        name="入金（予測）"
        barSize={20}
        fill="rgba(83, 178, 231, 1)"
        xAxisId={0}
        shape={<CandyBar />}
        onMouseOver={barOverEvent}
        onMouseLeave={barLeaveEvent}
        // background={<BackgroundRender />}
      />
      <Bar
        dataKey="amt"
        barSize={20}
        xAxisId={0}
        name="出金"
        fill="rgba(241, 98, 124, 1)"
        onMouseLeave={barLeaveEvent}
        onMouseOver={barOverEvent}
      />

      <Line
        yAxisId={1}
        type="basic"
        dataKey="uv"
        name="残高"
        legendType="circle"
        stroke="rgba(141, 183, 58, 1)"
        strokeWidth={4}
      />

      {/* <Line yAxisId={0} dataKey="cnt" name="入金予測" hide /> */}
      <Line
        hide
        yAxisId={1}
        type="basic"
        dataKey="uvy"
        stroke="rgba(141, 183, 58, 1)"
        strokeDasharray="19 11"
        strokeWidth={4}
        name="残高(予測)"
      />
    </ComposedChart>
  )
}
