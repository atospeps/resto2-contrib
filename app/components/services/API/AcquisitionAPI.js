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
     Created on : 06 mai 2015, 10:27:08
     Author     : remi.mourembles@capgemini.com
     */

    angular.module('administration')
            .factory('acquisitionAPI', ['$http', 'CONFIG', acquisitionAPI]);
    function acquisitionAPI($http, config) {

        var api = {
            getHistory: getHistory,
            getDashboardStats: getDashboardStats,
            getDatasource: getDatasource,
            getDatasourceData: getDatasourceData,
            updateProducts: updateProducts
        };
        return api;

        /**
         * Get history 
         * 
         * @param {array} options
         * @param {function} callback
         * @param {function} error
         * @returns {undefined}
         */
        function getHistory(options, callback, error) {

            var url = config.acquisitionStatsUrl + '/historique';
            
            $http.post(url, options)
                    .success(function(data) {
                        callback(data);
                    })
                    .error(function() {
                    	error('error - get acquisition history');
                    });
        };

        /**
         * Get dashboard stats 
         * 
         * @param {array} options
         * @param {function} callback
         * @param {function} error
         * @returns {undefined}
         */
        function getDashboardStats(options, callback, error) {

            var url = config.acquisitionStatsUrl + '/statistiques';
            
            if(options.startDate != null && options.endDate != null) {
            	url += "?startDate=" + options.startDate + "&endDate=" + options.endDate;
            }
            
            $http.get(url)
                    .success(function(data) {
                        callback(data);
                    })
                    .error(function() {
                    	error('error - get acquisition dashboard');
                    });
        };

        /**
         * Get datasources state 
         * 
         * @param {function} callback
         * @param {function} error
         * @returns {undefined}
         */
        function getDatasource(callback, error) {

            var url = config.acquisitionModuleUrl + '/config';
            
            $http.get(url, {timeout: 10000})
                    .success(function(data) {
                        callback(data);
                    })
                    .error(function() {
                    	error('error - get acquisition datasource');
                    });
        };

        /**
         * Get datasource data 
         * 
         * @param {String} datasourceName
         * @param {function} callback
         * @param {function} error
         * @returns {undefined}
         */
        function getDatasourceData(datasourceName, callback, error) {

            var url = config.acquisitionModuleUrl + '/queue/' + datasourceName + "/list";
            
            $http.get(url,  {timeout: 25000})
                    .success(function(data) {
                        callback(data);
                    })
                    .error(function() {
                    	error();
                    }); 
        };

        /**
         * Get datasource data 
         * 
         * @param {array} options
         * @param {function} callback
         * @param {function} error
         * @returns {undefined}
         */
        function updateProducts(options, callback, error) {
            var url = config.acquisitionModuleUrl + '/queue/' + options.datasourceName + "/update";
            
            var data = {};
            if(options.priority) {
            	data.priority = options.priority;
            } else {
            	data.priority = -1;
            }
            if(options.status) {
            	data.status = options.status;
            }
            if(options.products) {
            	data.products = [];
            	for(var i=0; i < options.products.length; i++) {
            		data.products.push(options.products[i].identifier);
            	}
            }
            
            $http.post(url, data)
                    .success(function(data) {
                        callback(data);
                    })
                    .error(function() {
                    	error('error - update products');
                    });
        };
    };
})();
