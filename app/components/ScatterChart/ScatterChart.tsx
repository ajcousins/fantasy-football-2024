'use client'
import { useEffect, useRef } from "react";
import * as d3 from 'd3';
import styles from './ScatterChart.module.css';
import { AppendedPlayer } from "@/app/types/premierLeague";

interface IProps {
  players: AppendedPlayer[]
}

const MARGIN = {
  TOP: 50,
  RIGHT: 50,
  BOTTOM: 100,
  LEFT: 70,
}

const CANVAS_DIMS = {
  WIDTH: 800,
  HEIGHT: 530,
}

const innerChartDims = {
  width: CANVAS_DIMS.WIDTH - MARGIN.LEFT - MARGIN.RIGHT,
  height: CANVAS_DIMS.HEIGHT - MARGIN.TOP - MARGIN.BOTTOM,
}

const ScatterChart = ({ players }: IProps) => {
  const ref = useRef(null);
  console.log('players:', players);

  useEffect(() => {
    // const data = [25, 10, 10, 12, 15];
    const data = players.map(p => ({
      x: {
        name: 'Cost',
        value: Number(p.now_cost) / 10,
      },
      y: {
        name: 'Form',
        value: Math.max(0, Number(p.form ?? 0)),
      },
      player: p
    }));

    const svg = d3.select('#chart-area').append('svg')
      .attr('width', CANVAS_DIMS.WIDTH)
      .attr('height', CANVAS_DIMS.HEIGHT)

    const g = svg.append('g')
      .attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

    const x = d3.scaleLinear()
      .domain([d3.min(data, d => d.x.value) ?? 0, d3.max(data, d => d.x.value) ?? 0])
      .range([0, innerChartDims.width])

    const y = d3.scaleLinear()
      .domain([d3.min(data, d => d.y.value) ?? 0, d3.max(data, d => d.y.value) ?? 0])
      .range([innerChartDims.height, 0])

    const xAxisCall = d3.axisBottom(x)
    g.append('g')
      .attr('transform', `translate(0, ${innerChartDims.height})`)
      .call(xAxisCall)

    g.append('text')
      .attr('x', innerChartDims.width / 2)
      .attr('y', innerChartDims.height + 50)
      .attr('text-anchor', 'middle')
      .text('Cost (£m)')

    const yAxisCall = d3.axisLeft(y)
    g.append('g')
      .call(yAxisCall)

    g.append('text')
      .attr('x', - (innerChartDims.height / 2))
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text('Form')

    g.append('text')
      .attr('id', 'info')
      .attr('x', innerChartDims.width)
      .attr('y', innerChartDims.height + 50)
      .attr('text-anchor', 'end')

    const circles = g.selectAll('circle')
      .data(data)

    const info = d3.select('#info')

    circles.enter().append('circle')
      .attr('cx', d => x(d.x.value))
      .attr('cy', d => y(d.y.value))
      .attr('r', 3)
      .attr('fill', 'red')
      .on('mouseover', (e, d) => {
        info.text(`${d.player.first_name} ${d.player.second_name}`)
      })
      .on('mouseout', () => {
        info.text('')
      })

  }, []);

  return <svg
    className={styles['chart-area']}
    width={CANVAS_DIMS.WIDTH}
    height={CANVAS_DIMS.HEIGHT}
    id='chart-area'
    ref={ref}
  />;
}

export default ScatterChart;