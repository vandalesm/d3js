import React, { Component } from 'react'
import * as d3 from 'd3'

class D3Practice01 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            width: 1000,
            height: 500,
            timer: {}
        }
        this.svg = {}
    }
    componentDidMount() {
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', this.state.width)
            .attr('height', this.state.height)
    }
    update(data) {
        let radScale = d3.scaleSqrt()
            .domain([d3.min(data), d3.max(data)])
            .range([10, this.state.height / 5])

        let xScale = d3.scaleBand()
            .domain(data.map((v, i) => i))
            .range([radScale(data[0]), this.state.width - (radScale(data[data.length - 1]) / 2)])
            .padding(0.05)

        let circles = this.svg.selectAll('circle').data(data)
        circles.enter().append('circle')
            .attr('cx', (d, i) => xScale(i))
            .attr('cy', this.state.height / 2)
            .attr('fill', 'red')
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .attr('r', 0)
            .transition()
            .duration(800)
            .attr('r', d => radScale(d))
            .attr('fill', 'green')
        circles.merge(circles)
            .attr('fill', 'blue')
            .transition()
            .duration(800)
            .attr('r', d => radScale(d))
            .attr('cx', (d, i) => xScale(i))
        circles.exit()
            .attr('fill', 'red')
            .transition().duration(800).attr('r', 0).remove()
    }
    handleStartClick() {
        let timer = setInterval(() => {
            let data = Array(Math.round(Math.random() * 10) + 1).fill(0)
            data = data.map(v => Math.random() * 10)
            this.update(data)
        }, 2000)
        this.setState({timer})
    }
    handleStopClick() {
        clearInterval(this.state.timer)
    }
    componentWillUnmount() {
        clearInterval(this.state.timer)
    }
    render() {
        return (
            <div style={{ padding: '20px' }}>
                <div>
                    <button onClick={this.handleStartClick.bind(this)}>start</button>
                    <button onClick={this.handleStopClick.bind(this)}>stop</button>
                </div>
                <div ref={comp => this.container = comp} style={{ display: 'inline-block', border: '1px solid black', padding: '10px' }}>
                </div>
            </div>
        )
    }
}

export default D3Practice01