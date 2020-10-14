export interface IInitRequired {

    init(over: (err?: Error) => void): void;

    preload(over: (err?: Error) => void): number;

}

export interface ITable<T> {
    [name: string]: T;
}

export interface I2DVector {

    x: number;

    y: number;

}

export interface IImage {
    
    res: string;

    pos: I2DVector;

    size: I2DVector;

}

export interface ILocaleText {

    zh?: string;

    en?: string;

}
