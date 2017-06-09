(function() {

    'use strict';

    angular.module('administration').controller('GroupCreationController', ['$scope', '$filter', '$location', 'administrationServices', 'administrationAPI', 'CONFIG', groupCreationController]);
    
    function groupCreationController($scope, $filter, $location, administrationServices, administrationAPI)
    {
    	/**
    	 * Create group
    	 */
        $scope.createGroup = function()
        {
            if ($scope.group.name === undefined) {
    			$scope.successMessage = "";
    			$scope.errorMessage = "You must set the name of the group";
                return;
            }

            var data = {
        		"groupName" : $scope.group.name,
        		"groupDescription" : $scope.group.description,
        		"groupCanWps" : $scope.group.canwps,
        		"groupProactiveId" : $scope.group.proactive ? $scope.group.proactive.id : ""
            };
            
            administrationAPI.addGroup(data, function() {
    			$scope.errorMessage = "";
    			$scope.successMessage = "Group " + $scope.group.name + " created";
                $scope.group = [];
                $location.path('/groups');
            }, function(e) {
    			$scope.successMessage = "";
    			$scope.errorMessage = "Cannot create group " + $scope.group.name;
            });
        };
        
        /**
         * Get Proactive accounts
         */
        function getProactiveAccounts()
        {
            administrationAPI.getProactiveAccounts(function(data) {
                $scope.proactiveAccounts = data;
            }, function(data) {
            	console.warn("error: cannot get proactive accounts");
            });
        }
        
        /*****************************************************
         * Init
         */
        
        if (administrationServices.isUserAnAdministrator() === false) {
        	return;
        }
        	
        $scope.group = {canwps:'f'};
		$scope.errorMessage = "";
		$scope.successMessage = "";
		
		getProactiveAccounts();
    }
})();