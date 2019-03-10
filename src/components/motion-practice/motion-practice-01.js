import React, { Component } from 'react'
import styled from 'styled-components'
import posed from 'react-pose'

class MotionPractice01 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isVisible: false,
            data: ['victor', 'marlyn', 'venice', 'vanica', 'eve', 'lolo', 'lola', 'aunty', 'uncle', ''],
            color: Math.random() * 55 + 200 ,
        }
    }
    componentDidMount() {
        this.setState({ isVisible: true })
    }
    render() {
        return (
            <Block column style={{ margin: '20px' }}>
                <Block>
                    <button onClick={() => this.setState({ isVisible: !this.state.isVisible })}>toggle</button>
                    <button onClick={() => this.setState({ color: Math.random() * 55 + 200 },()=>console.log(this.state.color))}>color</button>
                </Block>

                <Block column style={{ width: '200px', paddingTop: '200px' }}>
                    {this.state.data.map((v, i) =>
                        <Box key={i} pose={this.state.isVisible ? 'visible' : 'hidden'} i={i} color={this.state.color}>{v}</Box>
                    )}
                </Block>
            </Block>
        )
    }
}

export default MotionPractice01

const PBox = posed.div({
    hoverable: true,
    init: { scale: 1 },
    hover: { scale: 1.1 },
    drag: { scale: 1.1 },
    draggable: true,
    //dragEnd: {
        // transition: 'spring'
    //},
    visible: {
        x: 0,
        transition: ({ i }) => ({
            type: 'spring',
            stiffness: 10,
            damping: 0,
            delay: i * 100
        }),
    },
    hidden: {
        x: -500,
        transition: ({ i }) => ({
            type: 'spring',
            stiffness: 100,
            damping: 5,
            delay: i * 50
        })
    },
})

const Block = styled.div`
display: flex;
flex-direction: ${p => p.column ? 'column' : 'row'};
justify-content: space-around;
align-items: center;
`
const Box = styled(PBox)`
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: white;
    background-color: ${p => 'rgba(' + p.color * Math.random() + ',' + p.color * Math.random() + ',' + p.color * Math.random() + ',0.7)'};
    width: ${p => 200 - (p.i * 10)}px;
    height: ${p => 200 - (p.i * 10)}px;
    border: 3px solid white;
    opacity: 0.9;
    border-radius: 50%;
    margin-top: -70%;
`