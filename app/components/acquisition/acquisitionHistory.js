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
    angular.module('administration').controller('AcquisitionHistoryController', ['$scope', 'administrationServices', 'administrationAPI', 'acquisitionAPI', 'CONFIG', acquisitionHistoryController]);

    function acquisitionHistoryController($scope, administrationServices, administrationAPI, acquisitionAPI, CONFIG) {
    	
        if (administrationServices.isUserAnAdministrator()) {

            /**
             * Get history
             */
            $scope.getHistory = function() {
                var options = {};
                
                options['startIndex'] = $scope.startIndex;
                options['offset'] = $scope.offset;
                options['sortOrder'] = $scope.sortOrder;
                options['orderby'] = $scope.orderBy;
                options['filter'] = $scope.filtersActive;
                options['status'] = $scope.status;
                options['minPriority'] = $scope.minPriority;
                options['maxPriority'] = $scope.maxPriority;
                options['startDate'] = $scope.startDate;
                options['endDate'] = $scope.endDate;

                acquisitionAPI.getHistory(options, function(data) {
                    $scope.history = data;
                }, function() {
                    alert($filter('translate')('error.getHistory'));
                });
            };
            
            /**
             * Sort history 
             */
            $scope.sortHistory = function(order) {
            	if($scope.sortOrder === "DESC") {
            		$scope.sortOrder = "ASC";
            	} else {
            		$scope.sortOrder = "DESC";
            	}
            	$scope.orderBy = order;
            	
            	// Update data
            	$scope.getHistory();
            }
            
            $scope.toggleFiltre = function() {
            	$scope.displayFiltres = !$scope.displayFiltres;
             }
            
            $scope.applyFilters = function() {
            	$scope.displayFiltres = false;
            	$scope.filtersActive = true;
            	// Update data
            	$scope.getHistory();
            }
            
            $scope.removeFilters = function() {
            	$scope.filtersActive = false;
            	// Update data
            	$scope.getHistory();
            }

            /*
             * Init the context
             */
            $scope.init = function() {
            	$scope.displayFiltres = false;
            	$scope.filtersActive = false;
                $scope.availableStatus = [
                              {id: '1', name: 'All'},
                              {id: '2', name: 'New'},
                              {id: '3', name: 'Download TODO'},
                              {id: '4', name: 'Download in progress'},
                              {id: '5', name: 'Download error'},
                              {id: '6', name: 'Download done'},
                              {id: '7', name: 'Archive TODO'},
                              {id: '8', name: 'Archive error'},
                              {id: '9', name: 'Catalog TODO'},
                              {id: '10', name: 'Catalog error'},
                              {id: '11', name: 'Catalog done'},
                              {id: '12', name: 'Duplicated'}];
                
                $scope.startIndex = 0;
                $scope.offset = CONFIG.offset;
                $scope.sortOrder = 'DESC';
                $scope.orderBy = null;
                $scope.status = "1";
                $scope.minPriority;
                $scope.maxPriority;
                $scope.startDate;
                $scope.endDate;
                
                $scope.history = [];
            };
            

            /**
             * Checks if string date is valid
             */
            $scope.isValidDate = function(date) {
                var dateWrapper = new Date(date);
                return !isNaN(dateWrapper.getDate());
            };

            $scope.init();
            $scope.getHistory();
            $scope.$emit('showAcquisition');
        }
    };
})();
