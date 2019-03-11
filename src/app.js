import React, { Component } from 'react'
import styled from 'styled-components'
import BarChart from './components/bar-chart'
import NetworkGraph from './components/network-graph'
import BubbleChart from './components/bubble-chart'
import D3Practice01 from './components/d3-practice/d3-practice-1'
import D3Practice02 from './components/d3-practice/d3-practice-2'
import MotionPractice01 from './components/motion-practice/motion-practice-01'

import Block from './common/block'

import * as exData from './data.js'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataHeader: [],
      dataDetail: [],
      testData: [],
      randomNetData: exData.getSampleNodes(150),
      activeComp: 'BubbleChart',
      components: [
        { name: 'NetworkGraph' },
        { name: 'BarCharts' },
        { name: 'BubbleChart' },
        { name: 'D3Practice01' },
        { name: 'D3Practice02' },
        { name: 'MotionPractice01' }
      ],
      bubbleChartViewMode: 'GROUP'
    }
  }
  componentDidMount() {
    this.setState({
      dataHeader: this.generateRandomData(5, 30, 1),
      dataDetail: this.generateRandomData(10, 100, 1),
      testData: this.generateRandomData(50, 10000, 9),
      randomNetData: exData.getSampleNodes(150),
    })
  }
  generateBarChartData() {
    this.setState({
      dataHeader: this.generateRandomData(5, 30, 1),
      dataDetail: this.generateRandomData(10, 100, 1),
      testData: this.generateRandomData(50, 10000, 9),
    })
  }
  generateRandomData(numberOfItems, limit, numberOfGroup) {
    var arr = Array(numberOfItems).fill({ name: 'x', value: 1 })
    return arr.map((v, idx) => { return { 
      id: Math.floor(Math.random() * 10000000),
      name: 'x' + idx, 
      value: Math.round(Math.random() * limit) + 1, 
      group: 'group#' + (Math.round(Math.random() * (numberOfGroup-1)))
    } })
  }
  handleOnBarClick(item) {
    this.setState({ dataDetail: this.generateRandomData(item.value, 100) })
  }
  handleButtonClick(comp) {
    const activeComp = comp.name
    this.setState({ activeComp })
  }
  render() {
    return (
      <Block column>
        <Block justifyContentCenter alignItemsCenter withWrap>
          {this.state.components.map((v, i) => {
            return (
              <Button key={i} onClick={this.handleButtonClick.bind(this, v)} active={this.state.activeComp === v.name}>
                {v.name}
              </Button>
            )
          })}
        </Block>
        <Block justifyContentCenter alignItemsCenter>
          {this.state.activeComp === 'NetworkGraph' &&
            <NetworkGraph width={1200} height={900} nodes={this.state.randomNetData.nodes} links={this.state.randomNetData.links} />
          }
          {this.state.activeComp === 'BarCharts' &&
            <Block column>
              <Block justifyContentCenter alignItemsCenter>
                <Button onClick={this.generateBarChartData.bind(this)}>Generate Random Data</Button>
              </Block>
              <Block>
                <Block>
                  <BarChart data={this.state.dataHeader} height={300} onBarClick={this.handleOnBarClick.bind(this)} />
                </Block>
                <Block>
                  <BarChart data={this.state.dataDetail} width={800} height={300} hAxisWidth={30} />
                </Block>
              </Block>
            </Block>
          }
          {this.state.activeComp === 'BubbleChart' &&
            <Block column fullFlex>
              <Block>
                <Button onClick={this.generateBarChartData.bind(this)}>Generate Random Data</Button>
                <Button onClick={()=>this.setState({bubbleChartViewMode: 'GROUP'})}>GROUP</Button>
                <Button onClick={()=>this.setState({bubbleChartViewMode: 'SPLIT'})}>SPLIT</Button>
                <Button onClick={()=>this.setState({bubbleChartViewMode: 'SCATTER'})}>SCATTER</Button>
              </Block>
              <Block justifyContentCenter style={{height: '600px'}}>
                <BubbleChart data={this.state.testData} viewMode={this.state.bubbleChartViewMode} splitColumnCount={3} />
              </Block>
            </Block>
          }
          {this.state.activeComp === 'D3Practice01' && <D3Practice01 />}
          {this.state.activeComp === 'D3Practice02' && <D3Practice02 />}
          {this.state.activeComp === 'MotionPractice01' && <MotionPractice01 />}
        </Block>
      </Block>
    )
  }
}
export default App

const Button = styled(Block)`
justify-content: center;
align-items: center;
min-height: 40px;
min-width: 200px;
margin: 10px;
cursor: pointer;
background-color: rgba(55,55,55,0.1);
border-radius: 2px;
border: 1px solid transparent;
color: rgba(0, 0, 0, 0.8);
${p => p.active && `
  background-color: rgba(55,55,55,0.13);
  border: 1px solid rgba(55,55,55,0.1);
  color: rgba(0, 0, 0, 0.65);
  border-bottom: 4px solid #304ffe;
  border-radius: 2px 2px 4px 4px;
`}
&:hover {
  background-color: rgba(55,55,55,0.13);
  border: 1px solid rgba(55,55,55,0.1);
  color: rgba(0, 0, 0, 0.65);
  ${p => p.active && `
  border-bottom: 4px solid #304ffe;
  border-radius: 2px 2px 4px 4px;
  `}
}
`