/* eslint-disable no-underscore-dangle, prefer-destructuring */

/**
 * Winston Formatter for Datadog log format.
 * @module datadog-formatter
 * @exports datadogFormatter
 * @requires module:winston
 */

const { format } = require('winston');

let _additionalProperties;

const getTimeStamp = () => { return new Date().toISOString() }

const getAlertType = (level) => {
  switch (level) {
    case 'error': return 'error';
    case 'warn': return 'warning';
    default: return 'info';
  }
};

const formatBasicMessage = (msg) => {
  return {
    timestamp: getTimeStamp(),
    level: getAlertType(msg.level),
    message: msg.message,
  };
};

const formatAdditionalAttributes = (msg, props) => {
  const additional = {};
  if (msg.stack) {
    additional.stackTrace = msg.stack;
  }

  if (msg.id) {
    additional.errorId = msg.id;
  }

  return Object.assign({}, additional, props);
};

const parseAdditionalProperties = (additionalProperties) => {
  const properties = {};

  if (additionalProperties === undefined) {
    return properties;
  }

  additionalProperties.forEach((item) => {
    const kvp = item.split(':');
    properties[kvp[0]] = kvp[1];
  });

  return properties;
};

const datadogMsgFromWinstonMsg = (msg) => {
  const fmtMsg = Object.assign({},
    formatBasicMessage(msg),
    formatAdditionalAttributes(msg, _additionalProperties));

  // A carriage return is required at the end of the message to indicate the end of the message
  // See, https://github.com/DataDog/serilog-sinks-datadog-logs/blob/master/src/Serilog.Sinks.Datadog.Logs/Sinks/Datadog/DatadogSink.cs
  // [MessageDelimiter] for example.

  return `${JSON.stringify(fmtMsg)}\n`;
}

/**
 * Transforms a Winston message into a Log message
 * @param {String} - Winston logging message
 * @returns {string} - JSON string containing log message
 */
const datadogFormat = format((msg) => {
  datadogMsgFromWinstonMsg(msg)
});

/**
 * datadogFormatter constructor
 * @param {array} [additionalProperties] - Tags to apply to each logging message
 */
module.exports = (additionalProperties) => {
  _additionalProperties = parseAdditionalProperties(additionalProperties);
  return {
    format: datadogFormat,
  };
};
