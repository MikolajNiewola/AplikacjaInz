export const sanitizeNumber = (text) => {
    let cleaned = String(text).replace(/,/g, '.');

    cleaned = cleaned.replace(/[^0-9.]/g, '');

    const parts = cleaned.split('.');
    if (parts.length > 2) {
        cleaned = parts[0] + '.' + parts.slice(1).join('');
    }

    let [intPart, decimalPart] = cleaned.split('.');

    if (intPart.length > 1) {
        intPart = intPart.replace(/^0+/, '');
        if (intPart === '') intPart = '0';
    }

    if (decimalPart?.length > 2) {
        decimalPart = decimalPart.slice(0, 2);
    }

    return decimalPart !== undefined ? `${intPart}.${decimalPart}` : intPart;
};