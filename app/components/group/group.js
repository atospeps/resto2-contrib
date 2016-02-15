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

    /* Controller Group */

    angular.module('administration').controller('GroupController', ['$scope', 'administrationServices', '$location', '$routeParams', 'administrationAPI', 'CONFIG', '$q', groupController]);

    function groupController($scope, administrationServices, $location, $routeParams, administrationAPI, CONFIG, $q) {

        if (administrationServices.isUserAnAdministrator()) {

            /*
             * Init the context
             */
            $scope.init = function() {
                $scope.successMessage = "";
                $scope.errorMessage = "";
                $scope.getGroup();
                $scope.$emit('showGroup');
            };

            /*
             * Get group
             */
            $scope.getGroup = function() {
                administrationAPI.getGroup($routeParams.groupid, function(data) {
                    $scope.selectedGroup = data;
                });
            };

            /*
             * Delete group
             */
            $scope.deleteGroup = function() {
                var x = confirm("Delete group ?");
                if (x) {
                    administrationAPI.deleteGroup($routeParams.groupid, function(data) {
            			$scope.errorMessage = "";
            			$scope.successMessage = "Group successfully deleted !";
                        $location.path('/groups');
                    }, function(data) {
            			$scope.successMessage = "";
            			$scope.errorMessage = "Error, Group has not be deleted !"
            		});
                }
            };
            
            /**
             * Save Group
             */
            $scope.saveGroup = function() {
            	if($scope.selectedGroup.groupname === undefined) {
        			$scope.successMessage = "";
        			$scope.errorMessage = "Groupname is mandatory, cannot update group";
        			return;
            	}
            	$scope.groupData = { 
            			"groupName" : $scope.selectedGroup.groupname.trim(),
            			"groupDescription" : $scope.selectedGroup.description.trim(),
    			};
        		administrationAPI.updateGroup($routeParams.groupid, $scope.groupData, function(data) {
        			$scope.errorMessage = "";
        			$scope.successMessage = "Group successfully saved !";
        		}, function(data) {
        			$scope.successMessage = "";
        			$scope.errorMessage = data.ErrorMessage;
        		});
            }

            $scope.init();
        }
    }
    ;
})();

