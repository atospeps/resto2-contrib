(function() {

    'use strict';

    angular.module('administration')
    	   .constant('PWD_MASK', '*****')
    	   .controller('ProactiveUpdateController', ['$scope', '$location', '$routeParams', 'administrationServices', 'administrationAPI',
    	                                             'PWD_MASK', proactiveUpdateController]);

    function proactiveUpdateController($scope, $location, $routeParams, administrationServices, administrationAPI, PWD_MASK)
    {
        /**
         * Get Proactive account
         */
        function getAccount() {
            administrationAPI.getProactiveAccount($routeParams.accountid, function(data) {
            	data.password = PWD_MASK;
                $scope.account = data;
                $scope.oldAccount = data;
            });
        };
        
        /**
         * Delete Proactive account
         */
        $scope.deleteAccount = function()
        {
            var x = confirm("Delete account?");
            if (x) {
                administrationAPI.deleteProactiveAccount($routeParams.accountid, function(data) {
                    $location.path('/proactive-accounts');
                }, function(data) {
        			$scope.successMessage = "";
        			$scope.errorMessage = "Error, Account has not be deleted!"
        		});
            }
        };

    	/**
    	 * Update new Proactive account
    	 */
        $scope.updateAccount = function()
        {
            if (!$scope.account.login) {
    			$scope.successMessage = "";
    			$scope.errorMessage = "You must set the login";
                return;
            }
            if (!$scope.account.password) {
    			$scope.successMessage = "";
    			$scope.errorMessage = "You must set the password";
                return;
            }

            var data = {
            	"oldLogin" : $scope.oldAccount.login,
	    		"accountLogin" : $scope.account.login
            };
            if (!!$scope.account.password && $scope.account.password !== PWD_MASK) {
            	data["accountPassword"] = $scope.account.password;
            }
            
            administrationAPI.updateProactiveAccount($routeParams.accountid, data, function() {
            	$scope.successMessage = "Proactive account successfully updated!";
            	$scope.errorMessage = "";
                //$location.path('/proactive-accounts');
            }, function(e) {
    			$scope.successMessage = "";
    			$scope.errorMessage = "Cannot update Proactive account " + $scope.account.login;
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
		
		getAccount();
    };
})();