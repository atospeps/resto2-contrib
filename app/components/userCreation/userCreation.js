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

    angular.module('administration').controller('UserCreationController', ['$scope', '$location', '$filter', 'administrationServices', 'administrationAPI', 'CONFIG', userCreationController]);
    function userCreationController($scope, $location, $filter, administrationServices, administrationAPI) {

        if (administrationServices.isUserAnAdministrator()) {


            $scope.profile = [];
            $scope.createUser = function() {

                if ($scope.profile.email === undefined || $scope.profile.password === undefined) {
                    alert($filter('translate')('user.please set email and password'));
                    return;
                }

                var options = [];
                options['email'] = $scope.profile.email;
                options['password'] = $scope.profile.password;
                options['username'] = $scope.profile.username;
                options['givenname'] = $scope.profile.givenname;
                options['lastname'] = $scope.profile.lastname;
                administrationAPI.addUser(options, function(data) {
                	if (data.ErrorMessage) {
                		alert(data.ErrorMessage);
                	} else {
                		alert($filter('translate')('user.user_created'));
                		$location.path('/users');
                	}
                }, function(e) {
                    alert($filter('translate')('user.error') + e.ErrorMessage);
                });
            };
        }
    }
    ;
})();