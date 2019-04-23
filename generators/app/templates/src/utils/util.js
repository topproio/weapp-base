const formatNumber = n => {
    n = n.toString();
    return n[1] ? n : '0' + n;
};
const formatTime = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
};
const empty = function (name, reg, err) {
    if (!(reg.test(name))) {
        wx.showToast({
            title: err,
            icon: 'none'
        });
    }
};
const getValidateProxy = function (target, validators) {
    return new Proxy(target, {
        _validators: validators,
        set(obj, prop, value) {
            /**
             * if (value === '') {
             * return target[prop] = false;
             *}
             */
            const validResult = this._validators[prop](value);
            if (validResult.valid) {
                return Reflect.set(obj, prop, value);
            } else {
                wx.showToast({
                    title: `${validResult.error}`,
                    icon: 'none'
                });
                return obj[prop] = false;
            }
        }
    });
};
function arrayBufferToHexString(buffer) {
    /**
     * let bufferType = Object.prototype.toString.call(buffer);
     * if (buffer !== '[object ArrayBuffer]') {
     *     console.log('no ArrayBuffer');
     *     return;
     * }
     */
    const dataView = new DataView(buffer);
    let hexStr = '';
    for (let i = 0; i < dataView.byteLength; i++) {
        const str = dataView.getUint8(i);
        let hex = (str && 0xff).toString(16);
        hex = (hex.length === 1) ? '0' + hex : hex;
        hexStr += hex;
    }
    return hexStr.toUpperCase();
}
function hexStringToArrayBuffer(str) {
    const buffer = new ArrayBuffer(str.length);
    const dataView = new DataView(buffer);
    let ind = 0;
    for (let i = 0, len = str.length; i < len; i += 2) {
        const code = parseInt(str.substr(i, 2), 16);
        dataView.setUint8(ind, code);
        ind++;
    }
    return buffer;
}
module.exports = {
    formatTime: formatTime,
    empty: empty,
    getValidateProxy: getValidateProxy,
    arrayBufferToHexString: arrayBufferToHexString,
    hexStringToArrayBuffer: hexStringToArrayBuffer,
};
