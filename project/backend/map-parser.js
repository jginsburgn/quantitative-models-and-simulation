const fs = require('fs');
const probabilityDistributions = require('probability-distributions');

const rawMap = fs.readFileSync('map.json');
var map = JSON.parse(rawMap.toString());

map.getVertex = function(id) {
    const vertices = this.vertices;
    for (var i = 0; i < vertices.length; i++) {
        var currentVertex = vertices[i];
        if (currentVertex.id === id) return currentVertex;
    }
    console.log(`Vertex with id ${id} not found.`);
    return undefined;
}

map.connectVertices = function() {
    const vertices = this.vertices;
    for (var i = 0; i < vertices.length; i++) {
        var currentVertex = vertices[i];
        currentVertex.edges = [];
    }
    const edges = this.edges;
    for (var i = 0; i < edges.length; i++) {
        var currentEdge = edges[i];
        var from = this.getVertex(currentEdge.from);
        var to = this.getVertex(currentEdge.to);
        from.edges.push(currentEdge);
        to.edges.push(currentEdge);
    }
}

map.resettleDelays = function() {
    const vertices = this.vertices;
    for (var i = 0; i < vertices.length; i++) {
        var currentVertex = vertices[i];
        if (currentVertex.isEndPoint) continue;
        const stdDev = currentVertex.vertexDelay.stdDev;
        const mean = currentVertex.vertexDelay.mean;
        currentVertex.delay = probabilityDistributions.rnorm(1, mean, stdDev)[0];
    }
    const edges = this.edges;
    for (var i = 0; i < edges.length; ++i) {
        var currentEdge = edges[i];
        const stdDev = currentEdge.edgeDelay.stdDev;
        const mean = currentEdge.edgeDelay.mean;
        currentEdge.delay = probabilityDistributions.rnorm(1, mean, stdDev)[0];
    }
}

map.connectVertices();
map.resettleDelays();

module.exports = map;