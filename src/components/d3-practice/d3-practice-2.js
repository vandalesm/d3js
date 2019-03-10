import React, { Component } from 'react'
import * as d3 from 'd3'

class D3Practice02 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            width: 1000,
            height: 500,
        }
        this.svg = {}
    }
    componentDidMount() {
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', this.state.width)
            .attr('height', this.state.height)
    }
    componentWillUnmount() {
    }
    
    render() {
        return (
            <div style={{ padding: '20px' }}>
                <div ref={comp => this.container = comp} style={{ display: 'inline-block', border: '1px solid black', padding: '10px' }}>
                </div>
            </div>
        )
    }
}

export default D3Practice02