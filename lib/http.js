/*
Copyright (c) 2013, Groupon, Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

Redistributions of source code must retain the above copyright notice,
this list of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in the
documentation and/or other materials provided with the distribution.

Neither the name of GROUPON nor the names of its contributors may be
used to endorse or promote products derived from this software without
specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// Generated by CoffeeScript 2.0.0-beta6
void function () {
  var _, assert, CONNECT_TIMEOUT, createSession, emitter, EventEmitter, getProtocol, getUrlParts, httpsync, json, log, makeRequest, normalizeUrl, parseUrl, registerEventHandler, TIMEOUT, verbose;
  httpsync = require('http-sync');
  _ = require('underscore');
  assert = require('assertive');
  parseUrl = require('url').parse;
  json = require('./json');
  EventEmitter = require('events').EventEmitter;
  TIMEOUT = 6e4;
  CONNECT_TIMEOUT = 2e3;
  normalizeUrl = function (serverUrl, sessionRoot, url) {
    if (url.indexOf('http') === 0) {
      return url;
    } else {
      return serverUrl + sessionRoot + url;
    }
  };
  emitter = new EventEmitter;
  log = function (message) {
    return emitter.emit('request', message);
  };
  verbose = function (message) {
    return emitter.emit('response', message);
  };
  registerEventHandler = function (event, callback) {
    if (!(event === 'request' || event === 'response'))
      throw new Error("Invalid event name '" + event + "'. The WebDriver http module only emits 'request' and 'response' events.");
    return emitter.on(event, callback);
  };
  getProtocol = function (protocolPart) {
    return protocolPart.replace(/:$/, '');
  };
  getUrlParts = function (url) {
    var parts;
    parts = parseUrl(url);
    return {
      port: parts.port,
      path: parts.path,
      host: parts.hostname,
      protocol: getProtocol(parts.protocol)
    };
  };
  makeRequest = function (request, data) {
    if (data) {
      return request.end(data);
    } else {
      return request.end();
    }
  };
  createSession = function (http, desiredCapabilities) {
    var response, sessionId;
    response = http.post('/session', { desiredCapabilities: desiredCapabilities });
    assert.equal('Failed to start Selenium session. Check the selenium.log.', response.statusCode, 200);
    sessionId = json.tryParse(response.body).sessionId;
    assert.truthy(sessionId);
    return sessionId;
  };
  module.exports = function (serverUrl, desiredCapabilities, param$) {
    var cache$, connectTimeout, del, get, http, post, request, sessionId, sessionRoot, timeout;
    {
      cache$ = param$;
      timeout = cache$.timeout;
      connectTimeout = cache$.connectTimeout;
    }
    if (null != timeout)
      timeout;
    else
      timeout = TIMEOUT;
    if (null != connectTimeout)
      connectTimeout;
    else
      connectTimeout = CONNECT_TIMEOUT;
    sessionRoot = '';
    request = function (url, method, data) {
      var httpSyncRequest, options;
      if (null == method)
        method = 'get';
      if (null == data)
        data = null;
      options = { method: method };
      options = _.extend({}, options, getUrlParts(url));
      httpSyncRequest = httpsync.request(options);
      httpSyncRequest.setTimeout(timeout, function () {
        throw new Error('Request timed out after ' + timeout + 'ms to: ' + url);
      });
      httpSyncRequest.setConnectTimeout(connectTimeout, function () {
        throw new Error('Request connection timed out after ' + connectTimeout + 'ms to: ' + url);
      });
      return makeRequest(httpSyncRequest, data);
    };
    get = function (url) {
      var response;
      url = normalizeUrl(serverUrl, sessionRoot, url);
      log('[WEB] GET ' + url);
      response = request(url);
      verbose(response);
      return response;
    };
    post = function (url, data) {
      var method, response;
      if (null == data)
        data = {};
      url = normalizeUrl(serverUrl, sessionRoot, url);
      method = 'POST';
      log('[WEB] POST ' + url);
      data = JSON.stringify(data);
      response = request(url, method, data);
      verbose(response);
      return response;
    };
    del = function (url) {
      var method, response;
      url = normalizeUrl(serverUrl, sessionRoot, url);
      method = 'DELETE';
      log('[WEB] DELETE ' + url);
      response = request(url, method);
      verbose(response);
      return response;
    };
    http = {
      get: get,
      post: post,
      'delete': del,
      on: registerEventHandler
    };
    sessionId = createSession(http, desiredCapabilities);
    sessionRoot = '/session/' + sessionId;
    return http;
  };
}.call(this);