var d3 = require('d3');
var fs = require('fs');

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

graph = JSON.parse(fs.readFileSync("./test.json"))

var link = svg.append("g")
  .attr("class", "links")
  .selectAll("line")
  .data(graph.links)
  .enter().append("line")
  .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

var node = svg.append("g")
  .attr("class", "nodes")
  .selectAll("circle")
  .data(graph.nodes)
  .enter().append("circle")
  .attr("locked", 0)
  .attr("r", 5)
  .attr("fill", function(d) { return color(d.group); })
  .on("click", clicked)
  .call(d3.drag()
    .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

node.append("title")
  .text(function(d) { return d.id; });

simulation
  .nodes(graph.nodes)
  .on("tick", ticked);

simulation.force("link")
  .links(graph.links);

function ticked() {
  link
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

  node
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  if (d.locked == 1 ) {
    d.fx = d.x;
    d.fy = d.y;
  } else {
    d.fx = null;
    d.fy = null;
  }
}

function clicked(d, i) {
  if (d3.event.defaultPrevented) return; // dragged

  //d3.select(this).transition()
  //    .style("fill", "black")
  //    .attr("r", 64)
  //  .transition()
  //    .attr("r", 32)
  //    .style("fill", color(i));

  if ( d.locked ) {
    d.fx = null;
    d.fy = null;
    d.locked = 0;
  } else {
    d.fx = d.x;
    d.fy = d.y;
    d.locked = 1;
  }
}
