(function() {

    'use strict';

    angular.module('administration')
    	   .controller('WpsRightsController', ['$scope', '$location', 'administrationServices', 'administrationAPI', 'wpsAPI', wpsRightsController]);

    function wpsRightsController($scope, $location, administrationServices, administrationAPI, wpsAPI)
    {
    	/************************************************************************
         * SCOPES METHODS
         * 
         ************************************************************************/
        
        /**
         * (Un)Select all the displayed processings
         */
        $scope.toggleSelection = function()
        {
        	if ($scope.masterCheckbox === true) {dd('t');
        		angular.forEach($scope.processings, function(processing) {dd(processing);
        			processing.selected = true;
            	});
        	} else {dd('f');
        		angular.forEach($scope.processings, function(processing) {dd(processing);
        			processing.selected = false;
            	});
        	}
        };
        
        /**
         * Get the processings available for the selected groups
         * 
         * @param {int} groupid
         */
        $scope.getWpsGroupRights = function(groupid)
        {
            administrationAPI.getWpsGroupRights(groupid, function(data) {
                $scope.selectedGroup.wpsRights = data;
                dd('wpsGroupRights', data);
            }, function() {
                console.log("error: cannot get WPS rights for group " + groupid);
            });
        };
        

        /************************************************************************
         * PRIVATE METHODS
         * 
         ************************************************************************/
        
        /**
         * Get groups
         */
        function getGroups()
        {
            administrationAPI.getGroups(function(data) {
            	$scope.groups = data;
            	dd('groups', data);
            }, function(){
                console.log("error: cannot get groups");
            });
        }
        
        /**
         * Get Proactive accounts
         */ 
        function getProactiveAccounts() 
        {
            administrationAPI.getProactiveAccounts(function(data) {
                $scope.proactiveAccounts = data;
                dd('proactiveAccounts', data);
            }, function() {
                console.log("error: cannot get proactive accounts");
            });
        }
        
        /**
         * Get the processings available for the selected groups
         */
        function getWpsRights()
        {
        	var processings = wpsAPI.GetCapabilities();
        	$scope.processings = [];
        	for (var i in processings) {dd(processings[i]);
        		$scope.processings.push({
        			'identifier': processings[i],
        			'selected': false
        		});
        	}
        	dd($scope.processings);
        }
        
        
        /**************************************************************
         * Init
         */
        
        if (administrationServices.isUserAnAdministrator() === false) {
        	return;
        }
        
		$scope.errorMessage = "";
		$scope.successMessage = "";
		$scope.selectedGroup = null;
		
		$scope.$emit('showWpsRights');
		
        getGroups();
        getProactiveAccounts();
        getWpsRights();
    };
})();
