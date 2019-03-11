import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Block from '../../common/block'
import * as fn from './functions.js'

class BubbleChart extends Component {
    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
            group: PropTypes.string.isRequired
        })),
        viewMode: PropTypes.oneOf(['GROUP', 'SPLIT', 'SCATTER']),
        splitColumnCount: PropTypes.number
    }
    static defaultProps = {
        data: [],
        splitColumnCount: 5
    }
    constructor(props) {
        super(props)
        this.state = {
            data: props.data,
        }
        this.updateDimensions = this.updateDimensions.bind(this)
        this.chart = {
            svg: null,
            width: null,
            height: null,
            nodes: null,
            bubbles: null,
            simulation: null
        }
    }
    componentDidMount() {
        this.chart = fn.setup(this.containerElem, this.props.data)
        this.chart = fn.update(this.chart, this.props.data)

        window.addEventListener('resize', this.updateDimensions)
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions)
    }

    componentDidUpdate(prevProps, prevState) {
        const shouldRegenNode = this.hasDataChanges(prevProps.data, this.props.data)
        this.chart = fn.update(this.chart, this.props.data, shouldRegenNode)
        if (shouldRegenNode || (prevProps.viewMode !== this.props.viewMode)) {
            this.setViewMode(this.chart, this.props.data, this.props.viewMode)
        }
    }
    hasDataChanges(prevData, data) {
        if (prevData.length !== data.length)
            return true
        const a = prevData.sort((a, b) => a.id - b.id)
        const b = data.sort((a, b) => a.id - b.id)
        for (let i = 0; i < a.length; i++) {
            if (a[i].id !== b[i].id)
                return true
        }
        return false
    }
    updateDimensions() {
        this.chart = fn.update(this.chart, this.props.data, false)
    }
    setViewMode(chart, data, viewMode) {
        switch (viewMode) {
            case 'GROUP':
                this.groupViewMode(chart)
                break
            case 'SPLIT':
                this.splitViewMode(chart, data)
                break
            case 'SCATTER':
                break
            default:
                break
        }
    }
    groupViewMode(chart) {
        fn.addCenterForce(chart, 0.03)
    }
    splitViewMode(chart, data) {
        const groups = data.filter((f, i, s) => s.findIndex(fi => fi.group === f.group) === i)
        const numCol = this.props.splitColumnCount
        const numRow = groups.length < numCol ? 1 : Math.ceil(groups.length / numCol)
        const unitWidth = chart.width / (numCol + 1)
        const unitHeight = chart.height / (numRow + 1)
        const groupPositions = groups
            .map((v, i) => {
                const x = unitWidth * ((i % numCol) + 1)
                const y = unitHeight * (Math.round((Math.floor(i / numCol)), 0) + 1)
                return {
                    group: v.group,
                    x,
                    y
                }
            })
        this.chart && fn.addSplitForces(this.chart, 0.03, groupPositions)
    }
    handleMouseDown(evt) {
        this.chart && fn.moveForceX(this.chart, 0.03, evt.clientX)
    }
    render() {
        return (
            <Block innerRef={c => this.containerElem = c} fullFlex onMouseDown={this.handleMouseDown.bind(this)}>
            </Block>
        )
    }
}

export default BubbleChart