[![CircleCI](https://circleci.com/gh/TheMagoo73/winston-datadog-formatter.svg?style=svg)](https://circleci.com/gh/TheMagoo73/winston-datadog-formatter)  [![codecov](https://codecov.io/gh/TheMagoo73/winston-datadog-formatter/branch/master/graph/badge.svg)](https://codecov.io/gh/TheMagoo73/winston-datadog-formatter)  [![Maintainability](https://api.codeclimate.com/v1/badges/50d8bf6b4e412d28c11e/maintainability)](https://codeclimate.com/github/TheMagoo73/winston-datadog-formatter/maintainability)  ![npm](https://img.shields.io/npm/v/winston-datadog-formatter.svg)

# winston-datadog-formatter
### Formatting Winston logging for DataDog processing and storage

## Installation

```
npm install --save winston-datadog-udp-transport
```

## Example

The following example configures the Winston logger to use the DataDog formatter, and UDP transport to ship logs to DataDog via a local installation of the DataDog agent with UDP enabled. For more information on using UDP log shipping with the DataDog agent see [winston-datadog-udp-transport](https://github.com/TheMagoo73/winston-datadog-udp-transport)

