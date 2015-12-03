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

    /* Controller Stats */

    angular.module('administration').controller('StatsController', ['$scope', 'administrationServices', 'administrationAPI', statsController]);

    function statsController($scope, administrationServices, administrationAPI) {

        if (administrationServices.isUserAnAdministrator()) {

            $scope.stats = [];
            $scope.statsYears = [];
            $scope.statsDate;
            $scope.totalVolume;
            $scope.totalQuantity;

            /*
             * Get stats for each collection
             */
            $scope.getStats = function(startDate, endDate) {
                administrationAPI.getCollectionsStats(startDate, endDate, function(data) {
                    $scope.stats = data["collectionStats"];
                    $scope.totalVolume = Math.round(data["productVolume"]);
                    $scope.totalQuantity = data["productQuantity"];
                    $scope.busy = false;
                });
            };
            
            /*
             * Get available years
             */
            $scope.getYears = function() {
            	var currentYear = new Date().getFullYear();
            	while(currentYear >= 2015) {
            		$scope.statsYears.push(currentYear);
            		currentYear--;
            	}
            	$scope.statsYears.reverse();
            };
            
            /*
             * Set year to compute stats
             */
            $scope.setYear = function(year) {
            	var startDate = null;
            	var endDate = null;
            	if(year) {
            		startDate = new Date(year, 0, 1);
            		endDate = new Date(year, 11, 31);
            	}
            	$scope.getStats(startDate, endDate);
            };

            /*
             * Init the context
             */
            $scope.init = function() {
                $scope.busy = true;
                $scope.getStats();
                $scope.getYears();
                $scope.$emit('showStats');
            };

            $scope.init();

        }
    };
})();
