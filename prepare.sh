#!/bin/bash

BT_NCA="./nca/010000000000000b.nca"
WLAN_NCA="./nca/0100000000000016.nca"

HACTOOL="hactool"
NX2ELF="nx2elf"

HACTOOL_OPTS="" # You can specify keyfile here

set -e

mkdir -p bt-exefs
mkdir -p wlan-exefs

${HACTOOL} $BT_NCA $HACTOOL_OPTS --exefsdir=./bt-exefs
${HACTOOL} $WLAN_NCA $HACTOOL_OPTS --exefsdir=./wlan-exefs

${NX2ELF} ./bt-exefs/main
${NX2ELF} ./wlan-exefs/main

mkdir -p elf

cp -f ./bt-exefs/main.elf ./elf/bt.elf
cp -f ./wlan-exefs/main.elf ./elf/wlan.elf

mkdir -p vendor
