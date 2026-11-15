export const prettifyDate = (value: Date | string | null | undefined): string => {
    if (value == undefined || value === '') return '';

    const date: Date = value instanceof Date ? value : new Date(value);
    return `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
};

export const unprettifyDate = (dateText: string | null | undefined): string => {
    if (dateText == undefined || isNaN(Date.parse(dateText))) return '';

    const [year, month, day] = dateText.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};
