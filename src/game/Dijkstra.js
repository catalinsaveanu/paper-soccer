class Dijkstra {
    shortestPath(edges, numVertices, startVertex) {
        var i,j;
        var done = new Array(numVertices);
        done[startVertex] = true;
        var pathLengths = new Array(numVertices);
        var predecessors = new Array(numVertices);


        for (i = 0; i < numVertices; i++) {
            pathLengths[i] = edges[startVertex][i];
            if (edges[startVertex][i] !== Infinity) {
                predecessors[i] = startVertex;
            }
        }

        pathLengths[startVertex] = 0;

        for (i = 0; i < numVertices - 1; i++) {
            var closest = -1;
            var closestDistance = Infinity;
            for (j = 0; j < numVertices; j++) {
                if (!done[j] && pathLengths[j] < closestDistance) {
                    closestDistance = pathLengths[j];
                    closest = j;
                }
            }
            done[closest] = true;
            for (j = 0; j < numVertices; j++) {
                if (!done[j]) {
                    var possiblyCloserDistance = pathLengths[closest] + edges[closest][j];
                    if (possiblyCloserDistance < pathLengths[j]) {
                        pathLengths[j] = possiblyCloserDistance;
                        predecessors[j] = closest;
                    }
                }
            }
        }

        return {
            "startVertex": startVertex,
            "pathLengths": pathLengths,
            "predecessors": predecessors
        };
    }

    constructPath(edgeMatrix, numVertices, startVertex, endVertex) {
        let shortestPathInfo = this.shortestPath(edgeMatrix, numVertices, startVertex);
        var path = [];

        while (endVertex !== shortestPathInfo.startVertex) {
            path.unshift(endVertex);
            endVertex = shortestPathInfo.predecessors[endVertex];
        }
        
        return path;
    }
}

export default Dijkstra;