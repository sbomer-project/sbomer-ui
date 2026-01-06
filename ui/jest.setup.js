// Polyfill for TextEncoder/TextDecoder required by React Router v7
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
