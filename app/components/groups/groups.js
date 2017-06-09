(function() {

    'use strict';

    angular.module('administration').controller('GroupsController', ['$scope', '$location', 'administrationServices', 'administrationAPI', groupsController]);

    function groupsController($scope, $location, administrationServices, administrationAPI) {

        if (administrationServices.isUserAnAdministrator()) {

            // Get groups
            $scope.getGroups = function() {

                // Get results 
                administrationAPI.getGroups(function(data) {
                    if (data.ErrorMessage) {
                        console.log('error - ' + data.ErrorMessage);
                    } else {
                        $scope.groups = data;
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
                $location.path($location.path() + '/' + group.id);
            };

            /*
             * init the context
             */
            $scope.init = function() {
                $scope.groups = [];
                $scope.showGroups = false;

                $scope.$emit('showGroups');
            };

            $scope.init();
            $scope.getGroups();
            
        }
    }
    ;
})();