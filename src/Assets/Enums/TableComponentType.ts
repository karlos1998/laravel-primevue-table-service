export enum TableComponentType {
    CALENDAR = 'calendar',
    INPUT_TEXT = 'input_text',
    SLIDER = 'slider',
    DROPDOWN = 'dropdown',
}

export const tableComponentTypeEqualsTo = (type: TableComponentType, typeSting: string): boolean => type === typeSting;
