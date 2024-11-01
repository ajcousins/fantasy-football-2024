'use client'
import { useEffect, useRef } from "react";
import * as d3 from 'd3';
import styles from './ScatterChart.module.css';
import { AppendedPlayer } from "@/app/types/premierLeague";
import { TEAM_COLOURS } from "@/app/consts";

interface DataPoint {
  x: {
    name: string;
    value: number;
  },
  y: {
    name: string;
    value: number;
  },
  player: AppendedPlayer
}

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

const MAX_CIRCLE_RADIUS = 20;
const MIN_CIRCLE_RADIUS = 1;

const innerChartDims = {
  width: CANVAS_DIMS.WIDTH - MARGIN.LEFT - MARGIN.RIGHT,
  height: CANVAS_DIMS.HEIGHT - MARGIN.TOP - MARGIN.BOTTOM,
}

const reOrder = (data: DataPoint[], team?: string): DataPoint[] =>
  data.sort((a, b) => {
    if (!team) return 0;
    if (a.player.teamShortName === team) {
      return b.player.teamShortName === team ? 0 : 1
    }
    return b.player.teamShortName === team ? -1 : 0
  })


const ScatterChart = ({ players }: IProps) => {
  const ref = useRef(null);

  const highestPoints = players
    .reduce((acc, cur) => cur.total_points > acc ? cur.total_points : acc, 0)

  useEffect(() => {
    const allData: DataPoint[] = players.map(p => ({
      x: {
        name: 'Cost',
        value: Number(p.now_cost) / 10,
      },
      y: {
        name: 'Form',
        value: Math.max(0, Number(p.form ?? 0)),
      },
      player: p
    }))

    const svg = d3.select('#chart-area')

    const g = svg.append('g')
      .attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

    const x = d3.scaleLog()
      .domain([d3.min(allData, d => d.x.value) ?? 0, d3.max(allData, d => d.x.value) ?? 0])
      .range([0, innerChartDims.width])

    const y = d3.scaleLinear()
      .domain([d3.min(allData, d => d.y.value) ?? 0, d3.max(allData, d => d.y.value) ?? 0])
      .range([innerChartDims.height, 0])

    const xAxisCall = d3.axisBottom(x)
    g.append('g')
      .attr('transform', `translate(0, ${innerChartDims.height})`)
      .call(xAxisCall)
      .style('zIndex', 100)

    g.append('text')
      .attr('x', innerChartDims.width / 2)
      .attr('y', innerChartDims.height + 50)
      .attr('text-anchor', 'middle')
      .text('Cost (£m)')

    const yAxisCall = d3.axisLeft(y)
    g.append('g')
      .call(yAxisCall)
      .style('zIndex', 100)

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

    update(allData);

    function update(
      data: DataPoint[],
      team?: string
    ) {
      const info = d3.select('#info')

      // Join circles with new data
      const circles = g.selectAll('circle').data(data)

      // Remove redundant circles
      circles.exit().remove()

      // Append new circles
      circles.enter().append('circle')
        .attr('class', 'circles')
        .attr('cx', d => x(d.x.value))
        .attr('cy', d => y(d.y.value))
        .attr('r', d => Math.max((d.player.total_points / highestPoints) * MAX_CIRCLE_RADIUS, MIN_CIRCLE_RADIUS))
        .attr('fill', d => `${TEAM_COLOURS[d.player.teamShortName]}`)
        .on('mouseover', (e, d) => {
          info.text(`${d.player.first_name} ${d.player.second_name}`)
          const newData = reOrder(data, d.player.teamShortName);
          update(newData, d.player.teamShortName);
        })
        .on('mouseout', () => {
          info.text('')
          update(allData);
        })

      circles
        .attr('cx', d => x(d.x.value))
        .attr('cy', d => y(d.y.value))
        .attr('r', d => Math.max((d.player.total_points / highestPoints) * MAX_CIRCLE_RADIUS, MIN_CIRCLE_RADIUS))
        .attr('fill', d => {
          if (!team) return `${TEAM_COLOURS[d.player.teamShortName]}`
          return team === d.player.teamShortName ? `${TEAM_COLOURS[d.player.teamShortName]}` : '#eeeeee'
        })
        .attr('stroke', d => {
          if (!team) return null
          return team === d.player.teamShortName ? null : '#eeeeee'
        })

      circles.enter()
        .append('circle')
    }

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