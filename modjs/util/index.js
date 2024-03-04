var http = require('http');

var store = {};
module.exports = {
    retryObj: {},
    get(url) {
        return new Promise((resolve, reject) => {
            http.get(url, function (res) {
                var chunks = [];
                var size = 0;
                res.on('data', function (chunk) {
                    chunks.push(chunk);
                    size += chunk.length;
                });
                res.on('end', function () {
                    var data = Buffer.concat(chunks, size);
                    var html = data.toString();
                    resolve(html);
                });
            }).on('error', (err) => {
                reject(err);
            });
        });
    },
    storeData(storeKey, key, obj, timeout, maxCount) {
        store[storeKey] = store[storeKey] || {
            'store_item_count': 0
        };
        maxCount = maxCount || Infinity;
        timeout = timeout || Infinity;
        if (!obj) {
            return;
        }
        var b = {};
        b.ts = Date.now();
        b.data = obj;
        b.timeout = timeout;
        var count = store[storeKey]['store_item_count'];
        if (count >= maxCount) {
            var firstTs = Infinity;
            var toDelKey = null;
            for (var key in store[storeKey]) {
                if (key != 'store_item_count') {
                    if (store[storeKey][key].ts < firstTs) {
                        firstTs = store[storeKey][key].ts;
                        toDelKey = key;
                    }
                }
            }
            delete store[storeKey][toDelKey];
            store[storeKey]['store_item_count']--;
        }
        store[storeKey]['store_item_count']++;
        store[storeKey][key] = b;
    },
    getData(storeKey, key) {
        if (!store[storeKey]) {
            return;
        }
        var b = store[storeKey][key];
        if (b && Date.now() - b.ts < b.timeout) {
            return b.data;
        } else if (b) {
            delete store[storeKey][key];
        }
    },
    deleteData(storeKey, key) {
        if (!store[storeKey]) {
            return;
        }
        if (key) {
            delete store[storeKey][key];
        } else {
            delete store[storeKey]
        }
    },
    formatTime(date, format, ifUTC) {
        format = format || 'yyyy-MM-dd hh:mm:ss.SSS';
        date = date instanceof Date ? date : new Date(date);
        if (ifUTC) {
            date = date.getTime() - 8 * 60 * 60 * 1000;
            date = new Date(date);
        }
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        const millis = date.getMilliseconds();
        format = format.replace('yyyy', year);
        format = format.replace('MM', ('0' + month).slice(-2));
        format = format.replace('dd', ('0' + day).slice(-2));
        format = format.replace('hh', ('0' + hour).slice(-2));
        format = format.replace('mm', ('0' + minute).slice(-2));
        format = format.replace('ss', ('0' + second).slice(-2));
        format = format.replace('SSS', millis);
        return format;
    }
}