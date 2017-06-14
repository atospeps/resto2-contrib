(function() {

    'use strict';

    angular.module('administration')
    	   .controller('WpsRightsController', ['$scope', '$location', '$filter', 'administrationServices', 'administrationAPI', 'wpsAPI', wpsRightsController]);

    function wpsRightsController($scope, $location, $filter, administrationServices, administrationAPI, wpsAPI)
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
        	if ($scope.masterCheckbox === true) {
        		angular.forEach($scope.processings, function(processing) {
        			processing.selected = true;
            	});
        	} else {
        		angular.forEach($scope.processings, function(processing) {
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
                $scope.masterCheckbox = false;
        		angular.forEach($scope.processings, function(processing) {
        			processing.selected = ($scope.selectedGroup.wpsRights.indexOf(processing.identifier) !== -1);
            	});
            }, function() {
            	showErrorMessage("error: cannot get WPS rights for group " + groupid);
            });
        };
        
        /**
         * Save WPS rights
         */
        $scope.save = function()
        {
        	saveGroup($scope.selectedGroup.id, function(data){
        		saveWpsRights($scope.selectedGroup.id, function(data){
        			showSuccessMessage("WPS rights saved!");
        		}, function(data){
        			showErrorMessage(data.ErrorMessage ? data.ErrorMessage : "WPS rights update error! WPS rights not saved!");
        		});
        	}, function(data){
        		showErrorMessage(data.ErrorMessage ? data.ErrorMessage : "Group update error! Wps rights not saved!");
        	});
        };
        

        /************************************************************************
         * PRIVATE METHODS
         * 
         ************************************************************************/
        
        /**
         * Get groups
         */
        function getWpsGroups()
        {
            administrationAPI.getWpsGroups(function(data) {
            	$scope.groups = [];
            	angular.forEach(data, function(group) {
            		// ignore admin group, no need to set wps rights
            		if (group.groupname !== 'admin') {
            			$scope.groups.push(group);
            		}
            	});
            }, function() {
            	showErrorMessage("error: cannot get groups");
            });
        }
        
        /**
         * Get Proactive accounts
         */ 
        function getProactiveAccounts() 
        {
            administrationAPI.getProactiveAccounts(function(data) {
                $scope.proactiveAccounts = data;
            }, function() {
            	showErrorMessage("error: cannot get proactive accounts");
            });
        }
        
        /**
         * Get all WPS processings available for the selected groups
         */
        function getProcessings()
        {
        	$scope.processings = [];
        	wpsAPI.getProcessings(function(processings){
        		angular.forEach(processings, function(processing) {
            		$scope.processings.push({
            			'identifier': processing.identifier,
            			'selected': false
            		});
            	});
        	}, function(data){
        		showErrorMessage("error: cannot get WPS processings");
        	});
        }
        
        /**
         * Save Group
         */
        function saveGroup(groupid, success, error)
        {
    		administrationAPI.updateGroup(groupid, {
    			"groupProactiveId": $scope.selectedGroup.proactive.id
    		}, function(data) {
    			success(data);
    		}, function(data) {
    			error(data);
    		});
        }
        
        /**
         * Save WPS rights
         */
        function saveWpsRights(groupid, success, error)
        {
        	var wpsRights = [];
    		angular.forEach($scope.processings, function(processing) {
    			if (processing.selected) {
    				wpsRights.push(processing.identifier);
    			};
        	});
    		administrationAPI.updateWpsRights(groupid, {
    			'rights': wpsRights
    		}, function(data) {
    			success(data);
    		}, function(data) {
    			error(data);
    		});
        }

        /**
         * Returns the selected processings
         */
        function getSelectedProcessings()
        {
    		return $filter('filter')($scope.processings, function(processing) {
				return processing.selected;
			});
        }
        
        /**
         * Update state of the master checkbox
         */
        function updateMasterCheckbox()
        {
   			$scope.masterCheckbox = ($scope.processings.length && getSelectedProcessings().length === $scope.processings.length);
        }
        
        /**
         * Show a success message
         */
        function showSuccessMessage(msg)
        {
        	$scope.successMessage = msg;
        	$scope.errorMessage = "";
        }
        
        /**
         * Show an error message
         */
        function showErrorMessage(msg)
        {
        	$scope.successMessage = "";
        	$scope.errorMessage = msg;
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
		$scope.masterCheckbox = false;
		
		$scope.$emit('showWpsRights');
		
        getWpsGroups();
        getProactiveAccounts();
        getProcessings();
        
        var unwatch = $scope.$watch('processings', updateMasterCheckbox, true);
		$scope.$on('$destroy',function(){unwatch();});
    };
})();
