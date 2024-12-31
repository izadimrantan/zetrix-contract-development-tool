'use strict';

function init() {
    return true;
}

function main(input_str) {
    let input = JSON.parse(input_str);
    let params = input.params;

    let result = {};
    if (input.method === 'dummyInvoke') {
        result.data = "please change";
    } else {
        throw 'Unknown operating: ' + input.method + '.';
    }
}

function query(input_str) {
    let input = JSON.parse(input_str);
    let params = input.params;

    let result = {};
    if (input.method === 'dummyQuery') {
        result.data = "please change";
    } else {
        throw 'Unknown operating: ' + input.method + '.';
    }

    return JSON.stringify(result);
}
