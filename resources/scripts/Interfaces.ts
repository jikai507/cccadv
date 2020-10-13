export interface ITable<T> {
    [name: string]: T;
}

export interface I2DVector {

    x: number;

    y: number;

}

export interface IInitRequired {
    init(over: (err?: string) => void): void;
}

export interface ILocaleText {

    zh?: string;

    en?: string;

}
