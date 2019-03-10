import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as d3Force from 'd3-force'
import { scaleOrdinal } from 'd3-scale'
import { schemeSet1 } from 'd3-scale-chromatic'
class NetworkGraph extends Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        nodes: PropTypes.array,
        links: PropTypes.array,
    }
    static defaultProps = {
        width: 600,
        height: 600,
        nodes: [
            { id: 'A', group: 1 },
            { id: 'B', group: 1 },
            { id: 'C', group: 1 },
            { id: 'D', group: 2 },
            { id: 'E', group: 2 },

        ],
        links: [
            { source: 'A', target: 'B', value: 3 },
            { source: 'A', target: 'C', value: 3 },
            { source: 'B', target: 'C', value: 2 },
            { source: 'B', target: 'D', value: 2 },
            { source: 'C', target: 'D', value: 5 },
            { source: 'C', target: 'E', value: 5 },
            { source: 'D', target: 'E', value: 1 },
            { source: 'D', target: 'A', value: 1 },
            { source: 'E', target: 'A', value: 4 },
            { source: 'E', target: 'B', value: 4 },

        ]
    }
    constructor(props) {
        super(props)
        this.state = {
            nodes: props.nodes,
            links: props.links,
            selectedNode: false,
            animating: 0
        }
        this.getColor = scaleOrdinal(schemeSet1)
        this.simulation = d3Force.forceSimulation()
    }
    componentDidMount() {
        this.setupForce()
    }
    componentWillReceiveProps() {
        console.log(this.state.animating)
        if(this.state.animating === 2 ) {
            this.setState({nodes: this.props.nodes, links: this.props.links},()=>{
                this.setupForce()
            })
        }
    }
    setupForce() {
        const { width, height } = this.props
        this.simulation = d3Force.forceSimulation(this.state.nodes)
            .force('charge', d3Force.forceManyBody().strength(-15))
            .force('center', d3Force.forceCenter(width / 2, height / 2))
            .force('collision', d3Force.forceCollide().radius(15))
            .force('links', d3Force.forceLink().links(this.state.links).id(d => d.id))
            .on('tick', this.handleTick.bind(this))
            .on('end', ()=>this.setState({animating: 2}))
    }
    handleTick() {
        this.setState({animating: 1})
        this.setState({
            nodes: Object.assign([], this.state.nodes),
            links: Object.assign([], this.state.links)
        })
    }
    render() {
        const { width, height } = this.props
        const { nodes, links } = this.state
        return (
            <div style={{ display: 'inline-block', width, height, border: '1px solid #ccc' }}>
                <svg width={width} height={height}>
                    <g className='links' stroke='#000' strokeOpacity='0.2'>
                        {links.map((v, i) => {
                            return (
                                <g key={i}>
                                <line key={i} x1={v.source.x} y1={v.source.y} x2={v.target.x} y2={v.target.y} strokeWidth={Math.sqrt(v.value)} />
                                </g>
                            )
                        })}
                    </g>
                    <g className='nodes'>
                        {nodes.map((v, i) => {
                            return (
                                <g key={i}>
                                    <circle r={8} cx={v.x} cy={v.y} fill={this.getColor(v.group)} stroke='#fff' strokeWidth='1.5'
                                    />
                                    <title>{v.id}</title>
                                </g>
                            )
                        })}
                    </g>
                </svg>
            </div>
        )
    }
}

export default NetworkGraph