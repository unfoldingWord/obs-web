interface String {
    format(...args: string[]): string;
    endsWith(suffix: string): boolean;
    startsWith(prefix: string): boolean;
    toInt(): number;
    toFloat(): number;
    getHostName(): string;
}
