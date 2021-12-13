export declare class ByteConversionUtilities {
    static normalize(value: number, min: number, max: number, newMin: number, newMax: number): number;
    static numberToByteArray(value: number, size: number): number[];
    static boolToByteArray(value: boolean): Array<number>;
    static int8ToByteArray(value: number): Array<number>;
    static int16ToByteArray(value: number): Array<number>;
    static int32ToByteArray(value: number): Array<number>;
    static int64ToByteArray(value: number): Array<number>;
    static floatToByteArray(value: number): Array<number>;
    static doubleToByteArray(value: number): Array<number>;
    static stringToByteArray(value: string): Array<number>;
    static sliceBytes(bytes: Array<number>, startingIndex: number, count: number): Array<number>;
    static getBoolBytes(bytes: Array<number>, currentIndex: number): Array<number>;
    static getInt8Bytes(bytes: Array<number>, currentIndex: number): Array<number>;
    static getInt16Bytes(bytes: Array<number>, currentIndex: number): Array<number>;
    static getInt32Bytes(bytes: Array<number>, currentIndex: number): Array<number>;
    static getInt64Bytes(bytes: Array<number>, currentIndex: number): Array<number>;
    static getFloatBytes(bytes: Array<number>, currentIndex: number): Array<number>;
    static getDoubleBytes(bytes: Array<number>, currentIndex: number): Array<number>;
    static getStringBytes(bytes: Array<number>, currentIndex: number): Array<number>;
    static byteArrayToNumber(bytes: Array<number>): number;
    static byteArrayToBool(bytes: Array<number>): boolean;
    static byteArrayToInt8(bytes: Array<number>): number;
    static byteArrayToInt16(bytes: Array<number>): number;
    static byteArrayToInt32(bytes: Array<number>): number;
    static byteArrayToInt64(bytes: Array<number>): number;
    static byteArrayToFloat(bytes: Array<number>): number;
    static byteArrayToDouble(bytes: Array<number>): number;
    static byteArrayToString(bytes: Array<number>): string;
    static incrementByteValue(byte: number, incrementBy: number): number;
    static byteToNibbles(byte: number): Array<number>;
    static nibblesToByte(nibbles: Array<number>): number;
    static convertNumberToHexString(value: number): string;
    static convertNumbersToHexCsvString(values: Array<number>): string;
    static clamp(value: number, minValue: number, maxValue: number): number;
    static clampByte(value: number): number;
    private static _uint8MinValue;
    static readonly uint8MinValue: number;
    private static _uint8MaxValue;
    static readonly uint8MaxValue: number;
    private static _int8MinValue;
    static readonly int8MinValue: number;
    private static _int8MaxValue;
    static readonly int8MaxValue: number;
    private static _uint16MinValue;
    static readonly uint16MinValue: number;
    private static _uint16MaxValue;
    static readonly uint16MaxValue: number;
    private static _int16MinValue;
    static readonly int16MinValue: number;
    private static _int16MaxValue;
    static readonly int16MaxValue: number;
    private static _uint32MinValue;
    static readonly uint32MinValue: number;
    private static _uint32MaxValue;
    static readonly uint32MaxValue: number;
    private static _int32MinValue;
    static readonly int32MinValue: number;
    private static _int32MaxValue;
    static readonly int32MaxValue: number;
    private static _uint64MinValue;
    static readonly uint64MinValue: number;
    private static _uint64MaxValue;
    static readonly uint64MaxValue: number;
    private static _int64MinValue;
    static readonly int64MinValue: number;
    private static _int64MaxValue;
    static readonly int64MaxValue: number;
}