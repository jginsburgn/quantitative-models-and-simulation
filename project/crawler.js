const map = require('./map-parser.js');

function getOppositeVertex(edge, vertex) {
    if (edge.from.id === edge.id) {
        return map.getVertex(edge.to);
    }
    return map.getVertex(edge.from);
}

// returns true if vertex is member of path.
function pathContains(path, vertex) {
    for (var i = 0; i < path.length; i += 2) {
        var currentVertex = path[i];
        if (currentVertex.id === vertex.id) {
            return true;
        }
    }
    return false;
}

function exploreEdge(partialPath, currentEdge, paths) {
    var unexploredVertex = getOppositeVertex(currentEdge, partialPath[partialPath.length - 1]);
    // End and add path to paths if unexplored vertex is a meeting point.
    if (unexploredVertex.isEndPoint) {
        partialPath.push(currentEdge);
        partialPath.push(unexploredVertex);
        paths.push(partialPath);
        return;
    }
    // End and do not add path to path if 'unexplored' vertex is indeed explored.
    else if (pathContains(partialPath, unexploredVertex)) {
        return;
    }
    // Add midpoint to partial path and explore neighbor vertices.
    else {
        partialPath.push(currentEdge);
        partialPath.push(unexploredVertex);
        for (var i = 0; i < unexploredVertex.edges.length; ++i) {
            var edgeToExplore = unexploredVertex.edges[i];
            exploreEdge(partialPath.slice(), edgeToExplore, paths);
        }
    }
}

function getPathsToDestination(origin) {
    var paths = [];
    var initialEdges = origin.edges;
    for (var i = 0; i < initialEdges.length; i++) {
        var currentEdge = initialEdges[i];
        exploreEdge([origin].slice(), currentEdge, paths);
    }
    return paths;
}

function getPathDelay(path) {
    var delay = 0;
    for (var i = 0; i < path.length - 1 /*Endpoints have no delay*/; ++i) {
        var currentStop = path[i];
        delay += currentStop.delay;
    }
    return delay;
}

function getFastestPath(paths) {
    var minimumDelay = Infinity;
    var fastestPath = undefined;
    for (var i = 0; i < paths.length; ++i) {
        var currentPath = paths[i];
        if (minimumDelay > getPathDelay(currentPath)) fastestPath = currentPath;
    }
    return fastestPath;
}

module.exports = function(originId) {
    map.resettleDelays();
    const possiblePaths = getPathsToDestination(map.getVertex(originId));
    const path = getFastestPath(possiblePaths);
    var result = [];
    for (var i = 1; i < path.length; i+=2) {
        var edge = path[i];
        var object = {};
        object.delay = edge.delay;
        if (edge.to[0] == '3' && edge.to[2] == ':') {
            var next = "Baja a piso " + edge.to.slice(-1) + ".";
            object.nextStep = next;
        } else if (edge.to[0] == '4' && edge.to[1] == ':') {
            var next = "Salir por la puerta e ir hacia punto de encuentro.";
            object.nextStep = next;
        } else {
            object.nextStep = edge.to;
        }
        object.id = edge.from;
        result.push(object);
    }
    return result;
}