export async function sleep(ms) {
    return new Promise((resolve => {
        setTimeout(() => {
            resolve(true);
        }, ms);
    }));
};

export function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

export function getTokenQuantityWithPrecision(token) {
    return token.details.quantity && token.details.precision
        ? Number(token.details.quantity) / Math.pow(10, token.details.precision)
        : 0;
};

export function getKeeperLinkToInstall() {
    let keeperLink = 'https://chrome.google.com/webstore/detail/waves-keeper/lpilbniiabackdjcionkobglmddfbcjo';
    switch (getCurrentBrowser()) {
        case 'firefox':
            keeperLink = 'https://addons.mozilla.org/en-US/firefox/addon/waves-keeper/';
            break;
        case 'edge':
            keeperLink = 'https://www.microsoft.com/en-us/p/waves-keeper/9npz1hrq32nt?activetab=pivot%3Aoverviewtab'
            break;
        case 'opera':
            keeperLink = 'https://addons.opera.com/ru/extensions/details/waves-keeper/';
            break;
        default:
            break;
    }
    return keeperLink;
};

export function getCurrentBrowser() {
    // Opera 8.0+
    const isOpera = (!!window.opr && !!window.opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    if (isOpera) {
        return 'opera';
    }

    // Firefox 1.0+
    const isFirefox = typeof window.InstallTrigger !== 'undefined';
    if (isFirefox) {
        return 'firefox';
    }

    // Safari 3.0+ "[object HTMLElementConstructor]"
    const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) {
        return p.toString() === "[object SafariRemoteNotification]";
    })(!window['safari'] || (typeof window.safari !== 'undefined' && window.safari.pushNotification));
    if (isSafari) {
        return 'safari';
    }

    // Internet Explorer 6-11
    const isIE = /*@cc_on!@*/false || !!document.documentMode;
    if (isIE) {
        return 'ie';
    }

    // Edge 20+
    const isEdge = !isIE && !!window.StyleMedia;
    if (isEdge) {
        return 'edge';
    }

    // Chrome 1 - 71
    const isChrome = !!window.chrome;
    if (isChrome) {
        return 'chrome';
    }

    return '';
};

export function getWavesExplorerLinkToTx(txId) {
    const explorerHost = window.location.host === 'tokenrating.wavesexplorer.com'
        ? 'https://wavesexplorer.com'
        : 'https://wavesexplorer.com/testnet';

    return txId
        ? `${explorerHost}/tx/${txId}`
        : '#';
};

export function copyToClipboard(value) {
    const textField = document.createElement('textarea');
    textField.innerText = value;

    document.body.appendChild(textField);

    textField.select();
    textField.focus();

    const result = document.execCommand('copy');

    textField.remove();

    return result;
}

export const round8 = (n) => String(Math.trunc(n * 1e8) / 1e8);
export const round3 = (n) => String(Math.trunc(n * 1000) / 1000);
export const round2 = (n) => String(Math.trunc(n * 100) / 100);


