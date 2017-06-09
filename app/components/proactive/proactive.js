(function() {

    'use strict';

    angular.module('administration')
    	   .controller('ProactiveController', ['$scope', '$location', 'administrationServices', 'administrationAPI', proactiveController]);

    function proactiveController($scope, $location, administrationServices, administrationAPI)
    {
        /**
         * Get accounts
         */ 
        $scope.getAccounts = function() 
        {
            administrationAPI.getProactiveAccounts(function(data) {
                if (data.ErrorMessage) {
                    console.log('error - ' + data.ErrorMessage);
                } else {
                    $scope.accounts = data;
                }
            }, function() {
                console.log("error : cannot get proactive accounts");
            });
        };

        /**
         * Go to update account page
         */
        $scope.updateAccount = function(account)
        {
        	$location.path('proactive-account-update/' + account.id);
        }
        
        
        /**************************************************************
         * Init
         */
        if (administrationServices.isUserAnAdministrator() === false) {
        	return;
        }
        
        $scope.accounts = [];
		$scope.errorMessage = "";
		$scope.successMessage = "";
		
		$scope.$emit('showProactiveAccounts');
		
        $scope.getAccounts();
    };
})();