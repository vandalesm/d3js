import { select } from 'd3-selection'

export function setup(containerElement) {
    const width = containerElement.getBoundingClientRect().width
    const height = containerElement.getBoundingClientRect().height
    const svg = createSvg(containerElement, width, height)
    svg.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'black')

    createCircle(svg)
    return svg
}

export function update(svg, width, height) {
    svg.attr('width', width).attr('height', height)
    const rect = svg.select('rect')
    rect.attr('width', width).attr('height', height)
}

function createSvg(containerElement, width, height) {
    return select(containerElement)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
}

function createCircle(svg) {
    const circle = svg.append('circle')
        .attr('cx', 400)
        .attr('cy', 300)
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .attr('fill', '#40C0C0')
        .attr('r', 0)
        .transition()
        .duration(600)
        .attr('r', 100)
    return circle
}