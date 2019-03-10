import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { scaleBand, scaleLinear } from 'd3-scale'
import { axisLeft, axisBottom } from 'd3-axis'
import { select } from 'd3-selection'
import { Motion, spring } from 'react-motion'

class BarChart extends Component {
    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired
        })),
        width: PropTypes.number,
        height: PropTypes.number,
        hAxisWidth: PropTypes.number,
        vAxisWidth: PropTypes.number,
        onBarClick: PropTypes.func
    }
    static defaultProps = {
        data: [
            { name: 'A', value: 3 },
            { name: 'B', value: 5 },
            { name: 'C', value: 20 },
            { name: 'D', value: 30 },
            { name: 'E', value: 50 },
        ],
        width: 400,
        height: 200,
        hAxisWidth: 30,
        vAxisWidth: 20,
    }
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidUpdate() {
        const yScale = scaleLinear()
            .domain([0, Math.max(...this.props.data.map(d => d.value))])
            .range([this.props.height - (this.props.vAxisWidth + 10), 0])
        const yAxis = axisLeft(yScale).ticks(10)
        select(this.yAxisGroup).call(yAxis)

        const xScale = scaleBand()
            .domain(this.props.data.map(v => v.name))
            .range([0, this.props.width - this.props.hAxisWidth])
            .padding(0.1)
        select(this.xAxisGroup).call(axisBottom(xScale))
    }
    handleOnClick(item) {
        this.props.onBarClick && this.props.onBarClick(item)
    }
    render() {
        const { data, width, height } = this.props
        const maxValue = Math.max(...data.map(d => d.value))
        const yScale = scaleLinear()
            .domain([0, maxValue])
            .range([0, height - (this.props.vAxisWidth + 10)])
        const xScale = scaleBand()
            .domain(data.map(v => v.name))
            .range([0, width - this.props.hAxisWidth])
            .padding(0.1)

        return (
            <div style={{ border: '1px solid transparent', display: 'inline-block', backgroundColor: 'whitesmoke' }}>
                <svg width={width} height={height}>
                    {
                        data.map((v, idx) => {
                            return (
                                <Motion key={idx} defaultStyle={{ h: 0, h2: 0 }}
                                    style={{ 
                                        h: spring(yScale(v.value), { stiffness: 150, damping: 20 }),
                                        h2: spring(yScale(v.value), { stiffness: 350, damping: 15 }),
                                     }}>
                                    {
                                        ({ h, h2 }) => {
                                            return (
                                                <g transform={'translate(' + (xScale(v.name) + this.props.hAxisWidth) + ',' + (-this.props.vAxisWidth) + ')'}>
                                                    <rect
                                                        fill='teal'
                                                        onMouseOver={(e) => e.target.style.fill = 'blue'}
                                                        onMouseOut={(e) => e.target.style.fill = ''}
                                                        height={h}
                                                        y={height - h}
                                                        width={xScale.bandwidth()}
                                                        onClick={this.handleOnClick.bind(this, v)}
                                                    />
                                                    <text
                                                        x={xScale.bandwidth() / 2}
                                                        y={yScale(v.value) <= 20 ? height - h2 - 10 : height - h2 + 10}
                                                        dy='0.5em'
                                                        fill={yScale(v.value) <= 20 ? 'black' : 'white'}
                                                        textAnchor='middle'
                                                    >{v.value}</text>
                                                </g>
                                            )
                                        }
                                    }
                                </Motion>
                            )
                        })
                    }
                    <g ref={comp => this.yAxisGroup = comp} transform={'translate(' + this.props.hAxisWidth + ', 10)'} />
                    <g ref={comp => this.xAxisGroup = comp} transform={'translate(' + this.props.hAxisWidth + ', ' + (this.props.height - this.props.vAxisWidth) + ')'} />
                </svg>
            </div>
        )
    }
}

export default BarChart
