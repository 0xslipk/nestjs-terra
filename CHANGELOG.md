# Changelog

## 2.0.0
Published by **[jarcodallo](https://github.com/jarcodallo)** on **2021/11/29**
- [#100](https://github.com/jarcodallo/nestjs-terra/pull/100) Use terra.js v3

## 1.1.0
Published by **[jarcodallo](https://github.com/jarcodallo)** on **2021/10/28**
- [#98](https://github.com/jarcodallo/nestjs-terra/pull/98) Use columbus-5 new endpoints

## 1.0.2
Published by **[jarcodallo](https://github.com/jarcodallo)** on **2021/10/28**
- [#99](https://github.com/jarcodallo/nestjs-terra/pull/99) Update dependencies

## 1.0.1
Published by **[jarcodallo](https://github.com/jarcodallo)** on **2021/10/06**
- Update dependencies

## 1.0.0
Published by **[jarcodallo](https://github.com/jarcodallo)** on **2021/08/11**
- [#89](https://github.com/jarcodallo/nestjs-terra/pull/89) Terrajs columbus-5 compatibility

### BREAKING CHANGE
- Update terra.js from `1.8.9` to `2.0.2` (columbus-5).
- Renamed constant from `TERRA_LCD_BASE_URL` to `MAINNET_LCD_BASE_URL`.
- Renamed constant from `TERRA_TESTNET_LCD_BASE_URL` to `TESTNET_LCD_BASE_URL`.
- Renamed constant from `TERRA_MAINNET_CHAIN_ID` to `MAINNET_CHAIN_ID`.
- Renamed constant from `TERRA_TESTNET_CHAIN_ID` to `MAINNET_CHAIN_ID`.

## 0.2.1
Published by **[jarcodallo](https://github.com/jarcodallo)** on **2021/09/19**
- [#96](https://github.com/jarcodallo/nestjs-terra/pull/96) Export everything in terrajs
- [#95](https://github.com/jarcodallo/nestjs-terra/pull/95) Update lint config
- [#86](https://github.com/jarcodallo/nestjs-terra/pull/86) Remove Dependabot Badge

### BREAKING CHANGE
- Replace `TerraLCDClient` with terrajs `LCDClient` interface.
- Replace `InjectTerraLCDClient` with `InjectLCDClient` decorator.

## 0.1.5
Published by **[jarcodallo](https://github.com/jarcodallo)** on **2021/08/11**
- [#85](https://github.com/jarcodallo/nestjs-terra/pull/85) Update terra.js dependency

## 0.1.4
Published by **[jarcodallo](https://github.com/jarcodallo)** on **2021/07/13**
- [#77](https://github.com/jarcodallo/nestjs-terra/pull/77) Update dependencies

## 0.1.3
Published by **[jarcodallo](https://github.com/jarcodallo)** on **2021/06/28**
- [#6](https://github.com/jarcodallo/nestjs-terra/pull/60) Update dependencies

## 0.1.2
Published by **[jarcodallo](https://github.com/jarcodallo)** on **2021/04/26**
- [#6](https://github.com/jarcodallo/nestjs-terra/pull/6) Expose Tequila Base Url

## 0.1.0
Published by **[jarcodallo](https://github.com/jarcodallo)** on **2021/04/23**
- [#3](https://github.com/jarcodallo/nestjs-terra/pull/3) Release v0.1.0 - TerraModule implementation
- [#2](https://github.com/jarcodallo/nestjs-terra/pull/2) Change re-export of terra.js utils
- [#1](https://github.com/jarcodallo/nestjs-terra/pull/1) Terra blockchain utilities for NestJS based on [Terra.js](https://github.com/terra-project/terra.js)
