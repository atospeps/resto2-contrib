(function() {

    'use strict';

    /*
     * Copyright 2014 Jérôme Gasperi
     *
     * Licensed under the Apache License, version 2.0 (the "License");
     * You may not use this file except in compliance with the License.
     * You may obtain a copy of the License at:
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
     * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
     * License for the specific language governing permissions and limitations
     * under the License.
     */
    /* 
     Created on : 4 mars 2015, 10:27:08
     Author     : remi.mourembles@capgemini.com
     */

    angular.module('administration')
            .config(['$translateProvider', '$authProvider', 'CONFIG', configuration]);

    function configuration($translateProvider, $authProvider, CONFIG) {

        /*
         * Authentication configuration
         */
        $authProvider.baseUrl = '';
        $authProvider.loginUrl = CONFIG.restoServerUrl + '/api/users/connect';
        $authProvider.signupUrl = CONFIG.restoServerUrl + '/users';
        $authProvider.loginRedirect = '/ok';
        
        var redirectUri = window.location.href.split('#')[0];
        var key = 'oauth2';
        /*
         * Authentication providers
         */
        $authProvider.oauth2({
            name: CONFIG[key]['name'],
            url: CONFIG['restoServerUrl'] + '/api/auth/' + name,
            redirectUri: redirectUri,
            clientId: CONFIG[key]['clientId'],
            authorizationEndpoint: CONFIG[key]['authorizeUrl'],
            scope: CONFIG[key]['scope'] || null,
            requiredUrlParams: ['state']
        });

        /*
         * Internationalization
         * (See app/i18n/{lang}.json)
         */
        $translateProvider.useStaticFilesLoader({
            prefix: 'app/i18n/',
            suffix: '.json'
        });

        $translateProvider.preferredLanguage('en');

    }
    ;

    /**
     * Change $location.path action.
     * 
     * If reload is true -> reload page content,
     * else -> do not relaod page content
     */
    angular.module('administration')
            .run(['$route', '$rootScope', '$location', run]);

    function run($route, $rootScope, $location) {
        var original = $location.path;
        $location.path = function(path, reload) {
            if (reload === false) {
                var lastRoute = $route.current;
                var un = $rootScope.$on('$locationChangeSuccess', function() {
                    $route.current = lastRoute;
                    un();
                });
            }
            return original.apply($location, [path]);
        };
    }
    ;

})();