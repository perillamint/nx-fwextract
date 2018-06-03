'use strict';

const fs = require('fs');
const assert = require('assert');
const elfy = require('elfy');
const yaml = require('js-yaml');
const {hexy} = require('hexy');

// Config -- TODO: Move it to param

const config = yaml.safeLoad(fs.readFileSync('./config.yaml'));

const wlan = elfy.parse(fs.readFileSync(config.input.wlan_elf));

let wlan_data = null;
let wlan_rodata = null;

for (let i = 0; i < wlan.body.sections.length; i++) {
    const section = wlan.body.sections[i];

    switch (section.name) {
        case '.rodata':
            wlan_rodata = section.data;
            break;
        case '.data':
            wlan_data = section.data;
            break;
    }
}

// Extract calibration data
const caldata_off = wlan_data.indexOf('NVRAMRev=', 'utf8');
const caldata_end = wlan_data.indexOf('00', caldata_off, 'hex');

assert(caldata_off > 0);
assert(caldata_end > 0);

console.log(`WLAN caldata found: 0x${caldata_off.toString(16)} - 0x${caldata_end.toString(16)}`);

const caldata = wlan_data.slice(caldata_off, caldata_end);

fs.writeFileSync(config.output.wlan_caldata_file, caldata);

// Extract WLAN FW

// Broadcom Debug symbol
const brcmfw_dbpp_off = wlan_data.indexOf('DBPP', 'utf8');
let brcmfw_off = -1;

// Now, find first zero in backward.

for (let i = brcmfw_dbpp_off; i > brcmfw_dbpp_off - 1024; i--) {
    if (wlan_data.readUInt8(i) == 0x00) {
        brcmfw_off = i+1;
        break;
    }
}

const brcmfw_tail_off = wlan_data.indexOf('4356a3-roml', brcmfw_off, 'utf8');
const brcmfw_end = wlan_data.indexOf('00', brcmfw_tail_off, 'hex');

assert(brcmfw_off > 0);
assert(brcmfw_end > 0);

console.log(`WLAN firmware found: 0x${brcmfw_off.toString(16)} - 0x${brcmfw_end.toString(16)}`);

const brcmfw = wlan_data.slice(brcmfw_off, brcmfw_end);

fs.writeFileSync(config.output.wlan_firmware_file, brcmfw);

// BT

const bt = elfy.parse(fs.readFileSync(config.input.bt_elf));

let bt_rodata = null;

for (let i = 0; i < bt.body.sections.length; i++) {
    const section = bt.body.sections[i];

    switch (section.name) {
        case '.rodata':
            bt_rodata = section.data;
            break;
    }
}

// Extract BT FW

// VERY HACKY EXTRACTION
// TODO: Do extraction in proper way

const btfw_off = bt_rodata.indexOf('4CFC4600', 'hex');
const btfw_end = bt_rodata.indexOf('FC04FFFFFFFF', 'hex') + 6;

assert(btfw_off > 0);
assert(btfw_end > 0);

console.log(`BT firmware found: 0x${btfw_off.toString(16)} - 0x${btfw_end.toString(16)}`);

const btfw = bt_rodata.slice(btfw_off, btfw_end);
fs.writeFileSync(config.output.bt_firmware_file, btfw);
