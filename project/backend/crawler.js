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
    var fromLevel = null, toLevel = null, aulas = null, objectId = null, accumulatedDelay = 0;
    for (var i = 1; i < path.length; i+=2) {
        var object = {};
        var edge = path[i];
        // set delay
        object.delay = edge.delay;
        // set nextStep
        if (edge.to[0] == '3' && edge.to[2] == ':') {
            if (i == 1) {
                aulas = edge.from[0];
                fromLevel = edge.from[1];
                objectId = edge.from;
            }
            toLevel = edge.to.slice(-1);
            if (i+2 < path.length){
                if (path[i+2].to[0] == '4'){
                    var next = "Desde dónde te encuentras, camina hacia las escaleras de emergencia.";
                    switch (aulas) {
                    case '1':
                        next = "Desde dónde te encuentras, camina hacia las escaleras de aulas 1 en la esquina del edificio.";
                        break;
                    case '2':
                        next = "Desde dónde te encuentras, camina hacia las escaleras centrales de aulas 2.";
                        break;
                    case '3':
                        next = "Desde dónde te encuentras, camina hacia las escaleras de aulas 3 en la esquina del ed   icio.";
                        break;
                    case '5':
                        if (fromLevel == '0')
                            next = "Desde dónde te encuentras, camina hacia las escaleras más cercanas.";
                        else
                            next = "Desde dónde te encuentras, camina hacia las escaleras de emergencia ubicadas por el elevador. ¡No use las escaleras centrales!";
                        break;
                    }
                    var levelChange = parseInt(fromLevel) - parseInt(toLevel)
                    next += (levelChange >= 0 ? " Baja " : " Sube ") + (levelChange >= 0 ? levelChange : -levelChange) + " nivel(es) al piso " + toLevel + ".";
                    object.nextStep = next;
                    object.delay = accumulatedDelay + edge.delay;
                    accumulatedDelay = 0;
                } else {
                    accumulatedDelay += edge.delay;
                    continue;
                }
            }
        } else if (edge.to[0] == '4' && edge.to[1] == ':') {
            var next = "Ve hacia la puerta de salida y quédese en el punto de encuentro. Cuidado con estructuras que puedan caer.";
            object.nextStep = next;
        } else {
            object.nextStep = edge.to;
        }
        // set ID
        if (objectId != null) {
            object.id = objectId;
            objectId = null;  
        } else {
            object.id = edge.from;
        }
        result.push(object);
    }
    return result;
}
