class NDimensionalPoint {
    constructor(...coordinates) {
        if (coordinates.length === 0) {
            throw new Error('Point must have at least one coordinate');
        }

        // Validate that all coordinates are numbers
        for (let coord of coordinates) {
            if (typeof coord !== 'number' || isNaN(coord)) {
                throw new Error('All coordinates must be valid numbers');
            }
        }

        this.coordinates = [...coordinates];
        this.dimensions = coordinates.length;
    }

    // Get coordinate at specific dimension (0-indexed)
    getCoordinate(dimension) {
        if (dimension < 0 || dimension >= this.dimensions) {
            throw new Error(`Invalid dimension: ${dimension}. Point has ${this.dimensions} dimensions.`);
        }
        return this.coordinates[dimension];
    }

    // Set coordinate at specific dimension
    setCoordinate(dimension, value) {
        if (dimension < 0 || dimension >= this.dimensions) {
            throw new Error(`Invalid dimension: ${dimension}. Point has ${this.dimensions} dimensions.`);
        }
        if (typeof value !== 'number' || isNaN(value)) {
            throw new Error('Coordinate value must be a valid number');
        }
        this.coordinates[dimension] = value;
    }

    // Get all coordinates as array
    getCoordinates() {
        return [...this.coordinates];
    }

    // Get number of dimensions
    getDimensions() {
        return this.dimensions;
    }

    // Calculate Euclidean distance to another point
    distanceTo(otherPoint) {
        if (!(otherPoint instanceof NDimensionalPoint)) {
            throw new Error('Parameter must be an NDimensionalPoint instance');
        }
        if (this.dimensions !== otherPoint.dimensions) {
            throw new Error('Points must have the same number of dimensions');
        }

        let sumOfSquares = 0;
        for (let i = 0; i < this.dimensions; i++) {
            const diff = this.coordinates[i] - otherPoint.coordinates[i];
            sumOfSquares += diff * diff;
        }
        return Math.sqrt(sumOfSquares);
    }

    // Calculate Manhattan distance to another point
    manhattanDistanceTo(otherPoint) {
        if (!(otherPoint instanceof NDimensionalPoint)) {
            throw new Error('Parameter must be an NDimensionalPoint instance');
        }
        if (this.dimensions !== otherPoint.dimensions) {
            throw new Error('Points must have the same number of dimensions');
        }

        let sum = 0;
        for (let i = 0; i < this.dimensions; i++) {
            sum += Math.abs(this.coordinates[i] - otherPoint.coordinates[i]);
        }
        return sum;
    }

    // Add another point (vector addition)
    add(otherPoint) {
        if (!(otherPoint instanceof NDimensionalPoint)) {
            throw new Error('Parameter must be an NDimensionalPoint instance');
        }
        if (this.dimensions !== otherPoint.dimensions) {
            throw new Error('Points must have the same number of dimensions');
        }

        const newCoordinates = this.coordinates.map((coord, i) =>
            coord + otherPoint.coordinates[i]
        );
        return new NDimensionalPoint(...newCoordinates);
    }

    // Subtract another point (vector subtraction)
    subtract(otherPoint) {
        if (!(otherPoint instanceof NDimensionalPoint)) {
            throw new Error('Parameter must be an NDimensionalPoint instance');
        }
        if (this.dimensions !== otherPoint.dimensions) {
            throw new Error('Points must have the same number of dimensions');
        }

        const newCoordinates = this.coordinates.map((coord, i) =>
            coord - otherPoint.coordinates[i]
        );
        return new NDimensionalPoint(...newCoordinates);
    }

    // Multiply by scalar
    multiplyByScalar(scalar) {
        if (typeof scalar !== 'number' || isNaN(scalar)) {
            throw new Error('Scalar must be a valid number');
        }

        const newCoordinates = this.coordinates.map(coord => coord * scalar);
        return new NDimensionalPoint(...newCoordinates);
    }

    // Calculate magnitude (distance from origin)
    magnitude() {
        const sumOfSquares = this.coordinates.reduce((sum, coord) => sum + coord * coord, 0);
        return Math.sqrt(sumOfSquares);
    }

    // Normalize the point (unit vector)
    normalize() {
        const mag = this.magnitude();
        if (mag === 0) {
            throw new Error('Cannot normalize zero vector');
        }
        return this.multiplyByScalar(1 / mag);
    }

    // Calculate dot product with another point
    dotProduct(otherPoint) {
        if (!(otherPoint instanceof NDimensionalPoint)) {
            throw new Error('Parameter must be an NDimensionalPoint instance');
        }
        if (this.dimensions !== otherPoint.dimensions) {
            throw new Error('Points must have the same number of dimensions');
        }

        return this.coordinates.reduce((sum, coord, i) =>
            sum + coord * otherPoint.coordinates[i], 0
        );
    }

    // Check if two points are equal
    equals(otherPoint, tolerance = 1e-10) {
        if (!(otherPoint instanceof NDimensionalPoint)) {
            return false;
        }
        if (this.dimensions !== otherPoint.dimensions) {
            return false;
        }

        return this.coordinates.every((coord, i) =>
            Math.abs(coord - otherPoint.coordinates[i]) < tolerance
        );
    }

    // Create a copy of the point
    copy() {
        return new NDimensionalPoint(...this.coordinates);
    }

    // String representation
    toString() {
        return `(${this.coordinates.join(', ')})`;
    }

    // JSON representation
    toJSON() {
        return {
            coordinates: this.coordinates,
            dimensions: this.dimensions
        };
    }

    // Create point from JSON
    static fromJSON(json) {
        return new NDimensionalPoint(...json.coordinates);
    }

    // Generate random point in n dimensions within given bounds
    static random(dimensions, minValue = 0, maxValue = 1) {
        if (dimensions < 1) {
            throw new Error('Dimensions must be at least 1');
        }

        const coordinates = [];
        for (let i = 0; i < dimensions; i++) {
            coordinates.push(Math.random() * (maxValue - minValue) + minValue);
        }
        return new NDimensionalPoint(...coordinates);
    }

    // Create origin point (all coordinates are 0)
    static origin(dimensions) {
        if (dimensions < 1) {
            throw new Error('Dimensions must be at least 1');
        }

        const coordinates = new Array(dimensions).fill(0);
        return new NDimensionalPoint(...coordinates);
    }
}

export default NDimensionalPoint;