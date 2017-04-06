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

    /* Controller Users */

    angular.module('administration').controller('HomeController', ['$scope', '$filter', 'administrationServices', 'administrationAPI', homeController]);

    function homeController($scope, $filter, administrationServices, administrationAPI) {

        if (administrationServices.isUserAnAdministrator()) {
            /*
             * Init the context
             */
            $scope.init = function() {
                administrationAPI.getUsersStats(function(data) {
                    $scope.nb_users = data.users.count;
                }, function() {
                    alert($filter('translate')('error.getStats'));
                });

                $scope.$emit('showHome');
            };

            $scope.init();
        }
    }
    ;

})();
