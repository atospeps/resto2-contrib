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
            .constant('CONFIG', {
                'restoServerUrl': 'http://192.168.56.103/resto/',
                'acquisitionStatsUrl': 'http://vmpeps01/acq-rest',
                'acquisitionModuleUrl': 'http://vmpeps01:8080',
                'administrationEndpoint': '/administration',
                'offset': 20,
                'version': 1.0,
                'autoRefreshTimer' : '1', /*Minutes*/
                'productType' : ["SLC", "GRD", "OCN", "S2MSI1C"],
                'productPlatform' : ["S1A", "S1B", "S2A", "S2B"],
                'productStatus' : ["DOWNLOAD_TODO", "DOWNLOAD_IN_PROGRESS", "DOWNLOAD_ERROR", "DOWNLOAD_DONE", "ARCHIVE_TODO", "ARCHIVE_ERROR", "CATALOG_TODO", "CATALOG_ERROR", "CATALOG_DONE", "DUPLICATED"],
                'theia': {
                    'name': 'theia',
                    'signUpUrl': 'https://sso.theia-land.fr/theia/app/register/register.xhtml',
                    'authorizeUrl': 'https://sso.theia-land.fr/oauth2/authorize',
                    'clientId': '<your client id>',
                    "requiredUrlParams": [
                        "scope"
                    ]
                }
            });

})();
