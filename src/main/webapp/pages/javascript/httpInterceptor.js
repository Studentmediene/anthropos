/*
 * Copyright 2014 Studentmediene i Trondheim AS
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

app.factory('HttpInterceptor', function ($q) {
        /*
         This interceptor will intercept http requests that have failed.

         If the reason for failing is 401 it means we are not logged in on our server.
         So we show a login form and wait for the LoginCtrl to tell us that the user is logged in.
         All failed 401 requests will be put in a buffer so they can be resent when logged in.

         */

        return {
            'responseError': function (response) {
                if (response.status === 401) {
                    // redirect to login page
                    window.location.href="/#/login"
                }
                return $q.reject(response);
            }
        };
    });