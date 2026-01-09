export class Index {
    private map: Map<any, number>;

    constructor() {
        this.map = new Map();
    }

    has(value: any): boolean {
        return this.map.has(value);
    }

    get(value: any): number | undefined {
        return this.map.get(value);
    }

    set(value: any, rowIndex: number): void {
        this.map.set(value, rowIndex);
    }

    delete(value: any): void {
        this.map.delete(value);
    }

    clear(): void {
        this.map.clear();
    }
}
