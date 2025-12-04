export class Grid <PointType extends string> {
  public gridMap: Map<string, PointType> = new Map();
  constructor (gridString: string, emptyChar?: string) {
    // Define 0,0 at top-left
    const rows = gridString.split('\n').filter(row => row.length > 0);
    for (let y = 0; y < rows.length; y++) {
      const row = rows[y];
      for (let x = 0; x < row.length; x++) {
        const char = row[x] as PointType;
        if (emptyChar !== undefined && char === emptyChar) continue;
        this.gridMap.set(`${x},${y}`, char);
      }
    }
  }

  getPoint (x: number, y: number): PointType | undefined {
    return this.gridMap.get(`${x},${y}`);
  }

  setPoint (x: number, y: number, value: PointType): void {
    this.gridMap.set(`${x},${y}`, value);
  }

  deletePoint (x: number, y: number): void {
    this.gridMap.delete(`${x},${y}`);
  }

  getNeighbors (x: number, y: number, orthogonalOnly: boolean = true): { x: number; y: number; value: PointType }[] {
    const deltas = [
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
    ];
    if (!orthogonalOnly) {
      deltas.push(
        { dx: -1, dy: -1 },
        { dx: -1, dy: 1 },
        { dx: 1, dy: -1 },
        { dx: 1, dy: 1 },
      );
    }
    const neighbors: { x: number; y: number; value: PointType }[] = [];
    for (const delta of deltas) {
      const neighborX = x + delta.dx;
      const neighborY = y + delta.dy;
      const neighborValue = this.getPoint(neighborX, neighborY);
      if (neighborValue !== undefined) {
        neighbors.push({ x: neighborX, y: neighborY, value: neighborValue });
      }
    }
    return neighbors;
  }

  get minX(): number {
    let minX = Infinity;
    for (const key of this.gridMap.keys()) {
      const [xStr] = key.split(',');
      const x = parseInt(xStr, 10);
      if (x < minX) minX = x;
    }
    return minX;
  }

  get maxX(): number {
    let maxX = -Infinity;
    for (const key of this.gridMap.keys()) {
      const [xStr] = key.split(',');
      const x = parseInt(xStr, 10);
      if (x > maxX) maxX = x;
    }
    return maxX;
  }

  get minY(): number {
    let minY = Infinity;
    for (const key of this.gridMap.keys()) {
      const [, yStr] = key.split(',');
      const y = parseInt(yStr, 10);
      if (y < minY) minY = y;
    }
    return minY;
  }

  get maxY(): number {
    let maxY = -Infinity;
    for (const key of this.gridMap.keys()) {
      const [, yStr] = key.split(",");
      const y = parseInt(yStr, 10);
      if (y > maxY) maxY = y;
    }
    return maxY;
  }

  * points(pointType?: PointType): Generator<{ x: number; y: number; value: PointType }> {
    for (const [key, value] of this.gridMap.entries()) {
      if (pointType !== undefined && value !== pointType) continue;
      const [xStr, yStr] = key.split(',');
      const x = parseInt(xStr, 10);
      const y = parseInt(yStr, 10);
      yield { x, y, value };
    }
  }

  toString(): string {
    let output = '';
    for (let y = this.minY; y <= this.maxY; y++) {
      for (let x = this.minX; x <= this.maxX; x++) {
        const point = this.getPoint(x, y);
        output += point !== undefined ? point : ' ';
      }
      output += '\n';
    }
    return output;
  }

  clone<NewPointType extends string = PointType>(): Grid<NewPointType> {
    return new Grid<NewPointType>(this.toString(), ' ');
  }

  get size(): number {
    return this.gridMap.size;
  }
}