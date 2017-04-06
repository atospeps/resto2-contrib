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

    angular.module('administration').config(['$routeProvider',
        function($routeProvider) {

            $routeProvider
                    .when('/home', {
                        templateUrl: "app/components/home/home.html",
                        controller: "HomeController"
                    })
                    .when('/users', {
                        templateUrl: "app/components/users/users.html",
                        controller: "UsersController"
                    })
                    .when('/groups', {
                        templateUrl: "app/components/groups/groups.html",
                        controller: "GroupsController"
                    })
                    .when('/collections', {
                        templateUrl: "app/components/collections/collections.html",
                        controller: "CollectionsController"
                    })
                    .when('/history', {
                        templateUrl: "app/components/history/history.html",
                        controller: "HistoryController"
                    })
                    .when('/acquisition', {
                        templateUrl: "app/components/acquisition/acquisition.html",
                        controller: "AcquisitionController"
                    })
                    .when('/acquisitionHistory', {
                        templateUrl: "app/components/acquisition/acquisitionHistory.html",
                        controller: "AcquisitionHistoryController"
                    })
                    .when('/acquisitionDashboard', {
                        templateUrl: "app/components/acquisition/acquisitionDashboard.html",
                        controller: "AcquisitionDashboardController"
                    })
                    .when('/stats', {
                        templateUrl: "app/components/stats/stats.html",
                        controller: "StatsController"
                    })
                    .when('/users/:userid', {
                        templateUrl: 'app/components/user/user.html',
                        controller: 'UserController'
                    })
                    .when('/users/:userid/:section', {
                        templateUrl: 'app/components/user/user.html',
                        controller: 'UserController'
                    })
                    .when('/userCreation', {
                        templateUrl: 'app/components/userCreation/userCreation.html',
                        controller: 'UserCreationController'
                    })
                    .when('/groups/:groupid', {
                        templateUrl: 'app/components/group/group.html',
                        controller: 'GroupController'
                    })
                    .when('/groupCreation', {
                        templateUrl: "app/components/groupCreation/groupCreation.html",
                        controller: "GroupCreationController"
                    })
                    .otherwise({
                        redirectTo: '/home'
                    });

        }]);
})();