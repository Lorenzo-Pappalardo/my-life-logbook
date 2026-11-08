export const prettifyDate = (dateText: string | null | undefined): string => {
    if (dateText == undefined || isNaN(Date.parse(dateText))) return '';

    const date = new Date(dateText);
    return `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
};
