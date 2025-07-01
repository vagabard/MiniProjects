import NDimensionalPoint from './NDimensionalPoint.js';

class PointCollection {
    constructor() {
        this.points = [];
        this.lines = [];
    }

    // Add a point to the collection
    addPoint(point) {
        if (!(point instanceof NDimensionalPoint)) {
            throw new Error('Only NDimensionalPoint instances can be added');
        }
        this.points.push(point);
    }

    // Add a line to the collection
    // use the index of the points in the array to create a line
    addLine(pointa, pointb) {
        if (typeof pointa !== 'number' || isNaN(pointa)) {
            throw new Error('First parameter must be a valid number');
        }
        if (typeof pointb !== 'number' || isNaN(pointb)) {
            throw new Error('Second parameter must be a valid number');
        }
        this.lines.push([pointa, pointb]);
    }

    // Remove a point at specific index
    removePoint(index) {
        if (index < 0 || index >= this.points.length) {
            throw new Error('Invalid index');
        }
        return this.points.splice(index, 1)[0];
    }

    // Get point at index
    getPoint(index) {
        if (index < 0 || index >= this.points.length) {
            throw new Error('Invalid index');
        }
        return this.points[index];
    }

    // Get all points
    getAllPoints() {
        return [...this.points];
    }

    // Get number of points
    size() {
        return this.points.length;
    }

    // Clear all points
    clear() {
        this.points = [];
        this.lines = [];
    }

    // Generate multiple random points
    generateRandomPoints(count, dimensions, minValue = 0, maxValue = 1) {
        for (let i = 0; i < count; i++) {
            this.addPoint(NDimensionalPoint.random(dimensions, minValue, maxValue));
        }
    }

    // Find closest point to a given point
    findClosestPoint(targetPoint) {
        if (this.points.length === 0) {
            return null;
        }

        let closestPoint = this.points[0];
        let minDistance = targetPoint.distanceTo(closestPoint);

        for (let i = 1; i < this.points.length; i++) {
            const distance = targetPoint.distanceTo(this.points[i]);
            if (distance < minDistance) {
                minDistance = distance;
                closestPoint = this.points[i];
            }
        }

        return { point: closestPoint, distance: minDistance };
    }

    // Calculate centroid of all points
    getCentroid() {
        if (this.points.length === 0) {
            return null;
        }

        const dimensions = this.points[0].getDimensions();
        const sumCoordinates = new Array(dimensions).fill(0);

        for (const point of this.points) {
            if (point.getDimensions() !== dimensions) {
                throw new Error('All points must have the same number of dimensions');
            }

            for (let i = 0; i < dimensions; i++) {
                sumCoordinates[i] += point.getCoordinate(i);
            }
        }

        const avgCoordinates = sumCoordinates.map(sum => sum / this.points.length);
        return new NDimensionalPoint(...avgCoordinates);
    }

    // String representation
    toString() {
        return this.points.map((point, index) => `${index}: ${point.toString()}`).join('\n');
    }

    // Create a deep copy of this PointCollection
    copy() {
        const newCollection = new PointCollection();
        for (const point of this.points) {
            newCollection.addPoint(point.copy()); // Assuming NDimensionalPoint has a copy method
        }
        // Copy lines array
        newCollection.lines = [...this.lines];
        return newCollection;
    }
}

export default PointCollection;