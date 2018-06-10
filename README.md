# NX-FWExtract

## What is NX-FWExtract?
NX-FWExtract is semi-automated Nintendo Switch WLAN/BT firmware extractor.

You can use extracted result by embedding into Switch Linux kernel or put it in `/lib/firmware/brcm` on Switch Linux distribution ramdisk/rootfs

## How to use
#### Requirements
You should have Node.JS and NPM on your system to run this tool.

#### Derieve keydb from sytem image

1. use `tools/kezplez.py` to derieve keys from system image dump (Note that you will need `mmcblk1boot0.img` and `mmcblk1p3.img`)

#### System title extraction
First, you have to extract `010000000000000b.nca` and `0100000000000016.nca` from your Nintendo Switch.

you should have Nintendo Switch KeyDB file. You can derieve those 'Illegal numbers' database using `tools/kezplez.py`

You can get this file by following this procedure:

1. Dump your Nintendo Switch's `SYSTEM` partition, which has partition number 10. (use `gdisk` to read this info)
2. Decrypt your dump from 1 using [biskeydump payload](https://github.com/rajkosto/biskeydump) and [switch_decrypt](https://github.com/MCMrARM/switch_decrypt.git)
3. mount decrypted system image(it is vfat) and run [nx-decrypt.sh](https://gist.github.com/perillamint/49fd44e2bb13fabedb3e69a2997fb351) on `Contents` directory. (make sure you modified its config before run it!)
4. Pick two files from `nx-decrypt.sh` output directory.


#### Firmware extraction
Second, You have to copy obtained file into this repository's nca directory.

and run this commands in seriese.

(before it, you may need to edit `prepare.sh` to reflect your system status)

```
npm i
./prepare.sh
node index.js
```

It will put its result in `vendor` folder in this repository. You can use this firmwares to make Linux WLAN/BT works more stable.

## Special thanks
https://github.com/kiding/ for initial research of wlan system title.

## License
You can use this project's code under GPL-3.0 license.
