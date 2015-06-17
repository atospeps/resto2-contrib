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

    angular.module('administration').controller('GroupsController', ['$scope', '$location', 'administrationServices', 'administrationAPI', 'CONFIG', groupsController]);

    function groupsController($scope, $location, administrationServices, administrationAPI, CONFIG) {

        if (administrationServices.isUserAnAdministrator()) {

            // Get groups
            $scope.getGroups = function() {

                // Get results 
                administrationAPI.getGroups(function(data) {
                    if (data.ErrorMessage) {
                        console.log('error - ' + data.ErrorMessage);
                    } else {
                        $scope.groups = data;

                        //show table of results
                        $scope.showGroups = true;
                    }
                }, function(){
                    console.log("error : cannot get groups");
                });
            };

            /**
             * Select group
             * 
             * @param {String} group
             * 
             */
            $scope.selectGroup = function(group) {
                $scope.init();
                $scope.selectedGroup = group;
                $location.path($location.path() + '/' + group.id);
            };

            /*
             * init the context
             */
            $scope.init = function() {
                $scope.groups = [];
                $scope.showGroups = false;
                $scope.selectedGroup = null;

                $scope.$emit('showGroups');
            };

            $scope.init();
            $scope.getGroups();
            
        }
    }
    ;
})();