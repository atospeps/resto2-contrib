(function() {

    'use strict';

    angular.module('administration').controller('GroupController', ['$scope', 'administrationServices', '$location', '$routeParams', 'administrationAPI', 'CONFIG', '$q', groupController]);

    function groupController($scope, administrationServices, $location, $routeParams, administrationAPI, CONFIG, $q)
    {
        /**
         * Delete group
         */
        $scope.deleteGroup = function() {
            var x = confirm("Delete group ?");
            if (x) {
                administrationAPI.deleteGroup($routeParams.groupid, function(data) {
        			$scope.errorMessage = "";
        			$scope.successMessage = "Group successfully deleted!";
                    $location.path('/groups');
                }, function(data) {
        			$scope.successMessage = "";
        			$scope.errorMessage = "Error! Group has not be deleted!"
        		});
            }
        };
        
        /**
         * Save Group
         */
        $scope.saveGroup = function()
        {
        	if($scope.group.groupname === undefined) {
    			$scope.successMessage = "";
    			$scope.errorMessage = "Groupname is mandatory. Cannot update group.";
    			return;
        	}
        	$scope.groupData = { 
        			"groupName" : $scope.group.groupname.trim(),
        			"groupDescription" : $scope.group.description ? $scope.group.description.trim() : '',
        			"groupCanWps" : $scope.group.canwps,
        			"groupProactiveId" : $scope.group.canwps === 't' && $scope.group.proactive ? $scope.group.proactive.id : ""
			};
    		administrationAPI.updateGroup($routeParams.groupid, $scope.groupData, function(data) {
    			$scope.errorMessage = "";
    			$scope.successMessage = "Group successfully saved!";
    		}, function(data) {
    			$scope.successMessage = "";
    			$scope.errorMessage = data.ErrorMessage ? data.ErrorMessage : "Error! Group has not be saved!";
    		});
        }

        /**
         * Get group
         */
        function getGroup(callback)
        {
            administrationAPI.getGroup($routeParams.groupid, function(data) {
                $scope.group = data;
                callback();
            }, function(data) {
            	console.warn("error: cannot get groups");
            	callback();
            });
        }
        
        /**
         * Get Proactive accounts
         */
        function getProactiveAccounts(callback)
        {
            administrationAPI.getProactiveAccounts(function(data) {
                $scope.proactiveAccounts = data;
                callback();
            }, function(data) {
            	console.warn("error: cannot get proactive accounts");
            	callback();
            });
        }

        /*****************************************************
         * Init
         */
        
        if (administrationServices.isUserAnAdministrator() === false) {
        	return;
        }

        $scope.successMessage = "";
        $scope.errorMessage = "";
        
        getGroup(function(){
        	getProactiveAccounts(function(){
                angular.forEach($scope.proactiveAccounts, function (account) {
                	if (account.id === $scope.group.proactiveid) {
                		$scope.selectedAccount = account;
                	}
                });
        	});
        });
        
        $scope.$emit('showGroup');
    }
    ;
})();

