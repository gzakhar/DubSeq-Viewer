// Setting constants
const wWidth = 1000
const wHeight = 600

// Creating a svg element in html.
const svg = d3.select('.canvas')
    .append('svg')
    .attr("width", wWidth)
    .attr("height", wHeight)

// Creating margins and containers
const margin = {top: 100, right: 20, bottom: 50, left: 50};
const graphWidth = wWidth - margin.left - margin.right;
const graphHeight = wHeight - margin.top - margin.bottom;

// Creating gene chart
const geneChart = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', margin.top)
    .attr('transform', `translate(${margin.left}, 50)`)

// Creating the graph
const graph = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

// Creating the graphs with axis
const xAxisGroup = graph.append('g')
    .attr('transform', `translate(0, ${graphHeight})`);
const yAxisGroup = graph.append('g')
    .attr('transfrom', `translate(${graphWidth}, 0)`);

// Labling the X-Y axis
graph.append("text")
    .attr("transform",`translate(${graphWidth/2}, ${graphHeight + margin.bottom - 5})`)
    .style("text-anchor", "middle")
    .text("Position along the genome (bp)")
graph.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (graphHeight / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Fragment Fitness Score");

// Accessing the files.
Promise.all([
    d3.json("gscore_base.json"),
    d3.json("fscore.json"),
    d3.json("fscore_base.json"),
    d3.json("fscore_combined.json")
  ]).then(data =>  {
    
    // MIN-MAX for x axis
    const minGenePos = d3.min(data[0], d => d.pos_from)
    const maxGenePos =  d3.max(data[0], d => d.pos_to)
    
    // MIN-MAX for y axis
    const minScore = d3.min(data[1], d => d.score)
    const maxScore = d3.max(data[1], d => d.score) 
    const rangeScore = maxScore - minScore;

    // Setting the yScale of the data
    const yScale = d3.scaleLinear()
        .domain([minScore, maxScore])
        .range([graphHeight, 0]);
    
    // Setting the xScale of the data
    const xScale = d3.scaleLinear()
        .domain([0, maxGenePos])
        .range([0, graphWidth]);
    
    // Create and call all axis
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    // giving the tag <rect> access to all the data
    const rects = graph.selectAll("rect")
        .data(data[3]);

    // Entering fragment onto the chart
    rects.enter()
        .append("rect")
        .attr('x', d => xScale(d.pos_from))
        .attr('y', d => yScale(d.score))
        .attr('height', 2)
        .attr('width', d => xScale(d.pos_to - d.pos_from))
        .attr('fill', 'grey')

    // giving geneChart rects
    const genes = geneChart.selectAll('rect')
        .data(data[0]);

    // Entering genes onto the chart
    genes.enter()
        .append("rect")
        .attr('x', d => xScale(d.pos_from))
        .attr('height', 2)
        .attr('width', d => xScale(d.pos_to - d.pos_from))
        .attr('fill', 'red');
    
    const geneLable = geneChart.selectAll('text')
        .data(data[0]);

    genes.enter()
        .append('text')
        .attr('x', d => xScale(d.pos_from))
        .text(d => d.gene_name)
    });
