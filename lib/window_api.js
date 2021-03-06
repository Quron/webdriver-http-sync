
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
var parseResponseData;

parseResponseData = require('./parse_response');

module.exports = function(http) {
  return {
    switchToDefaultFrame: function() {
      http.post('/frame');
    },
    switchToFrame: function(indexOrNameOrId) {
      http.post('/frame', {
        id: indexOrNameOrId
      });
    },
    getCurrentWindowHandle: function() {
      var response;
      response = http.get('/window_handle');
      return parseResponseData(response);
    },
    getWindowHandles: function() {
      var response;
      response = http.get('/window_handles');
      return parseResponseData(response);
    },
    switchToWindow: function(name) {
      http.post('/window', {
        name: name
      });
    },
    closeWindow: function() {
      http["delete"]('/window');
    },
    getWindowSize: function(windowHandle) {
      var response;
      if (windowHandle == null) {
        windowHandle = 'current';
      }
      response = http.get("/window/" + windowHandle + "/size");
      return parseResponseData(response);
    },
    setWindowSize: function(width, height, windowHandle) {
      if (windowHandle == null) {
        windowHandle = 'current';
      }
      http.post("/window/" + windowHandle + "/size", {
        width: width,
        height: height
      });
    },
    getWindowPosition: function(windowHandle) {
      var response;
      if (windowHandle == null) {
        windowHandle = 'current';
      }
      response = http.get("/window/" + windowHandle + "/position");
      return parseResponseData(response);
    },
    setWindowPosition: function(x, y, windowHandle) {
      if (windowHandle == null) {
        windowHandle = 'current';
      }
      http.post("/window/" + windowHandle + "/position", {
        x: x,
        y: y
      });
    },
    maximizeWindow: function(windowHandle) {
      if (windowHandle == null) {
        windowHandle = 'current';
      }
      http.post("/window/" + windowHandle + "/maximize");
    }
  };
};
