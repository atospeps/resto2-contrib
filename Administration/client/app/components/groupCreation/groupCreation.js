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

    angular.module('administration').controller('GroupCreationController', ['$scope', '$filter', 'administrationServices', 'administrationAPI', 'CONFIG', groupCreationController]);
    function groupCreationController($scope, $filter, administrationServices, administrationAPI) {

        if (administrationServices.isUserAnAdministrator()) {
            $scope.group = [];
			$scope.errorMessage = "";
			$scope.successMessage = "";
            $scope.createGroup = function() {
                if ($scope.group.name === undefined) {
        			$scope.successMessage = "";
        			$scope.errorMessage = "You must set the name of the group";
                    return;
                }

                var data = {
                		"groupName" : $scope.group.name,
                		"groupDescription" : $scope.group.description
                };
                administrationAPI.addGroup(data, function() {
        			$scope.errorMessage = "";
        			$scope.successMessage = "Group " + $scope.group.name + " created";
                    $scope.group = [];
                }, function(e) {
        			$scope.successMessage = "";
        			$scope.errorMessage = "Cannot create group " + $scope.group.name;
                });
            };
        }
    }
    ;
})();