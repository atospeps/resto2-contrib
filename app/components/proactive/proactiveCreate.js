(function() {

    'use strict';

    angular.module('administration')
    	   .controller('ProactiveCreateController', ['$scope', '$location', 'administrationServices', 'administrationAPI', proactiveCreateController]);

    function proactiveCreateController($scope, $location, administrationServices, administrationAPI)
    {
    	/**
    	 * Create new Proactive account
    	 */
        $scope.createAccount = function()
        {
            if ($scope.account.login === undefined) {
    			$scope.successMessage = "";
    			$scope.errorMessage = "You must set the login";
                return;
            }
            if ($scope.account.password === undefined) {
    			$scope.successMessage = "";
    			$scope.errorMessage = "You must set the password";
                return;
            }

            var data = {
	    		"accountLogin" : $scope.account.login,
	    		"accountPassword" : $scope.account.password
            };
            
            administrationAPI.addProactiveAccount(data, function() {
    			$scope.errorMessage = "";
    			$scope.successMessage = "Proactive account " + $scope.account.login + " created";
                $scope.account = [];
                $location.path('/proactive-accounts');
            }, function(e) {
    			$scope.successMessage = "";
    			$scope.errorMessage = "Cannot create Proactive account " + $scope.account.login;
            });
        };
        
        /**************************************************************
         * Init
         */
        if (administrationServices.isUserAnAdministrator() === false) {
        	return;
        }
        
        $scope.account = {};
		$scope.errorMessage = "";
		$scope.successMessage = "";
		
		$scope.$emit('showProactiveAccount');
    };
})();