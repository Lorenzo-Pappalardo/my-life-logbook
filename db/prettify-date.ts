export const prettifyDate = (dateText: string | null | undefined): string => {
    if (dateText == undefined || isNaN(Date.parse(dateText))) return '';

    const date = new Date(dateText);
    return `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
};

export const unprettifyDate = (dateText: string | null | undefined): string => {
    if (dateText == undefined || isNaN(Date.parse(dateText))) return '';

    const [year, month, day] = dateText.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};
