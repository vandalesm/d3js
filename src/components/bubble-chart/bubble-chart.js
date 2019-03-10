import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Block from '../../common/block'
import * as fn from './functions.js'

class BubbleChart extends Component {
    static propTypes = {
        data: PropTypes.array,
        width: PropTypes.number,
        height: PropTypes.number,
    }
    static defaultProps = {
        data: [],
        width: 500,
        height: 500,
    }
    constructor(props) {
        super(props)
        this.state = {
            data: props.data,
        }
        this.updateDimensions = this.updateDimensions.bind(this)
        this.svg = {}
    }
    componentDidMount() {
        this.svg = fn.setup(this.containerElem)
        window.addEventListener('resize', this.updateDimensions)
        console.log('didmount')
    }
    componentWillUnmount() {
        console.log('componentdWillUnmount')
        window.removeEventListener('resize', this.updateDimensions)
    }
    updateDimensions() {
        const width = this.containerElem.getBoundingClientRect().width
        const height = this.containerElem.getBoundingClientRect().height
        fn.update(this.svg, width, height)
    }

    render() {
        return (
            <Block innerRef={c => this.containerElem = c} fullFlex>
            </Block>
        )
    }
}

export default BubbleChart