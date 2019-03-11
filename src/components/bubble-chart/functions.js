import { select } from 'd3-selection'
//import { easeBackOut } from 'd3-ease'
import { scalePow } from 'd3-scale'
import { max } from 'd3-array'
import { rgb } from 'd3-color'
import { forceSimulation, forceX, forceY, forceManyBody } from 'd3-force'

export function setup(containerElement) {
    const width = containerElement.getBoundingClientRect().width
    const height = containerElement.getBoundingClientRect().height
    const svg = createSvg(containerElement, width, height)
    svg.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'black')

    const chart = {
        svg,
        width,
        height,
        nodes: [],
        bubbles: svg.selectAll('.bubble'),
        simulation: null
    }
    return chart
}

function createSvg(containerElement, width, height) {
    return select(containerElement)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
}

export function createNodes(chart, data) {
    const maxValue = max(data, d => +d.value)

    const radiusScale = scalePow()
        .exponent(1.2)
        .range([2, 55])
        .domain([0, maxValue])

    chart.nodes = data.map(d => {
        return {
            id: d.id,
            radius: radiusScale(+d.value),
            value: d.value,
            group: d.group,
            x: Math.random() * (900),
            y: Math.random() * (800),
            rawData: d
        }
    })

    chart.nodes.sort((a, b) => b.value - a.value)
    return chart
}

export function createBubbles(chart) {
    chart.bubbles = chart.bubbles.data(chart.nodes, d => d.id)
    const ent = chart.bubbles.enter().append('circle')
        .classed('bubble', true)
        .attr('r', 0)
        .attr('fill', '#40C0C0')
        .attr('opacity', 0.98)
        .attr('stroke', rgb('#40C0C0').brighter(2))
        .attr('stroke-width', 1.3)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
    chart.bubbles = chart.bubbles.merge(ent)

    chart.bubbles.transition()
        .delay(300)
        .duration(1000)
        .attr('r', d => d.radius)

    chart.svg.selectAll('.bubble').data(chart.nodes, d => d.id).exit()
        .transition()
        .duration(300)
        .attr('r', 0)
        .remove()
    return chart
}

export function createSimulation(chart, forceStrength) {
    chart.simulation = forceSimulation()
        .velocityDecay(0.2)
        .force('x', forceX().strength(forceStrength).x(chart.width / 2))
        .force('y', forceY().strength(forceStrength).y(chart.height / 2))
        .force('charge', forceManyBody().strength(d => -Math.pow(d.radius, 2.0) * forceStrength))
        .on('tick', () => {
            chart.bubbles
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
        })

    //  chart.simulation.stop()
    return chart
}
export function update(chart, data, shouldRegenNode) {
    chart.svg.attr('width', chart.width).attr('height', chart.height)
    const rect = chart.svg.select('rect')
    rect.attr('width', chart.width).attr('height', chart.height)

    if (shouldRegenNode) {
        chart = createNodes(chart, data)
        chart = createBubbles(chart)
        chart = createSimulation(chart, 0.03)

        chart.simulation.nodes(chart.nodes)
    }
    return chart
}
export function addSplitForces(chart, strength, groupPositions) {
    chart.simulation.force('x', forceX().strength(strength).x(d=>groupPositions.find(f=>f.group===d.group).x))
    chart.simulation.force('y', forceY().strength(strength).y(d=>groupPositions.find(f=>f.group===d.group).y))
    chart.simulation.alpha(1).restart()
}
export function addCenterForce(chart, strength) {
    chart.simulation.force('x', forceX().strength(strength).x(chart.width / 2))
    chart.simulation.force('y', forceY().strength(strength).y(chart.height / 2))
    chart.simulation.alpha(1).restart()
}
export function moveForceX(chart, strength, position) {
    chart.simulation.force('x', forceX().strength(strength).x(position))
    chart.simulation.alpha(1).restart()
}
