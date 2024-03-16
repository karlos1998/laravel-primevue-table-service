export enum TableComponentType {
    CALENDAR = 'calendar',
    INPUT_TEXT = 'input_text',
}

export const tableComponentTypeEqualsTo = (type: TableComponentType.CALENDAR, typeSting: string): boolean => type === typeSting;
