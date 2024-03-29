export enum TableComponentType {
    CALENDAR = 'calendar',
    INPUT_TEXT = 'input_text',
    DROPDOWN = 'dropdown',
}

export const tableComponentTypeEqualsTo = (type: TableComponentType, typeSting: string): boolean => type === typeSting;
