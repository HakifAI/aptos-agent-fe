import Big from "big.js";

export function formatAptosAmount(amount: number | string, decimals = 8): string {
    const bigAmount = new Big(amount);
    return bigAmount.div(new Big(10).pow(decimals)).toFixed(decimals);
}

type EntryFunctionPayload = {
    function: string;
    type_arguments: string[];
    arguments: any[];
    type: string;
};

export function decodeFunctionName(payload: EntryFunctionPayload): {
    moduleAddress: string;
    moduleName: string;
    functionName: string;
    fullName: string;
} {
    const [moduleAddress, moduleName, functionName] = payload.function.split("::");

    return {
        moduleAddress,
        moduleName,
        functionName,
        fullName: `${moduleName}::${functionName}`,
    };
};

const truncateFractionAndFormat = (
    parts: Intl.NumberFormatPart[],
    digits: number
): string => {
    const values = parts
        .map(({ type, value }) => {
            if (type !== 'fraction' || !value || value.length < digits) {
                return value;
            }

            let retVal = '';
            for (let idx = 0, counter = 0; idx < value.length && counter < digits; idx++) {
                if (value[idx] !== '0') {
                    counter++;
                }
                retVal += value[idx];
            }
            return retVal;
        })
        .reduce((string, part) => string + part, '');
    return values;
};

export const formatNumber = (n: number | string, digits: number = 4): string => {
    if (!n) return '0';

    if (typeof n === 'string') n = Number(n);

    const formatter = new Intl.NumberFormat(
        'en-US',
        Math.abs(n) < 1
            ? { maximumSignificantDigits: digits }
            : { maximumFractionDigits: digits }
    );

    return truncateFractionAndFormat(formatter.formatToParts(n), digits);
};

