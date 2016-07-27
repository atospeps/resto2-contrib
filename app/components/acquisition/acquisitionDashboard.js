(function() {

    'use strict';
    
    angular.module('administration').controller('AcquisitionDashboardController', ['$scope', '$interval', 'administrationServices', 'acquisitionAPI', 'CONFIG', '$filter', acquisitionDashboardController]);

    function acquisitionDashboardController($scope, $interval, administrationServices, acquisitionAPI, CONFIG, $filter) {

        if (administrationServices.isUserAnAdministrator()) {

        	var promise;
        	
        	/**
        	 * Refresh data
        	 */
        	$scope.refresh = function() {
            	$scope.acquisitionState = "unknown";
        		$scope.getStats();
                $scope.getDatasource();
        	};
        	
        	/**
        	 * Launch auto refresh (return promise)
        	 */
        	$scope.startAutoRefresh = function() {
        		// convert timer from minute to millisecond
            	return $interval(function() {$scope.refresh();}, CONFIG.autoRefreshTimer * 60000);
        	};
        	
        	/**
        	 * Get datasources state
        	 */
        	$scope.getDatasource = function() {
                acquisitionAPI.getDatasource(function(data) {
                	$scope.datasources = [];
                    for (var key in data) {
                    	if(data[key] == "UNKNOWN" || data[key] == "INACTIVE") {
                    		$scope.datasources.push({"state": "unknown", "name": key});
                    	} else if(data[key] == "OK") {
                    		$scope.datasources.push({"state": "started", "name": key});
                    	} else if(data[key] == "ERROR") {
                    		$scope.datasources.push({"state": "stopped", "name": key});
                    	}
                    }
                    $scope.acquisitionState = "started";
                }, function() {
                    $scope.acquisitionState = "stopped";
                    $scope.datasources = [];
                });
        	};
        	
        	/**
        	 * Search data source object from data source name.
        	 */
        	$scope.searchDatasource = function(datasource){
        		var datasrc, results;        		
        		datasrc = null;

        		if (datasource == "Module acquisition"){
        			datasrc = {
    					state: $scope.acquisitionState,
	    				name: datasource
    				};
        		}
        		results = $filter('filter')($scope.datasources, {name: datasource}, false);
        		if (results.length > 0){
        			datasrc = results[0];
        		}
        		return datasrc;
        	}
        	
        	/**
        	 * Return CSS class of data source.
        	 */
        	$scope.getDatasourceCssClass = function (datasource){
        		var data = $scope.searchDatasource(datasource);
        		if (data && data != null){

        			switch (data.state) {
    				case 'started':
    					return 'stateStarted';
    				case 'stopped':
    					return 'stateStopped';
    				default:
    					return 'stateUnknown';
    				}
        		}
        		return;
        	}
        	
        	/**
        	 * Get acquisition statistics
        	 */
        	$scope.getStats = function() {
                var options = {};
                $scope.stats = [];
                if($scope.filtersActive) {
                    options['startDate'] = $scope.startDate;
                    options['endDate'] = $scope.endDate;
                }

                acquisitionAPI.getDashboardStats(options, function(data) {
                	$scope.stats = data;
                }, function(data) {
                    $scope.stats = undefined;
                });
        	};
            
        	/**
        	 * enable/disable filter
        	 */
            $scope.setFilterEnabled = function(isFilterActive) {
            	$scope.filtersActive = isFilterActive;
            	$scope.refresh();
            }

            /*
             * Init the context
             */
            $scope.init = function() {
            	$scope.acquisitionState = "unknown";
            	$scope.datasources = [];
                $scope.stats = [];
                $scope.filtersActive = false;
                $scope.startDate = "";
                $scope.endDate = "";
            };

            $scope.init();
            $scope.getStats();
            $scope.getDatasource();
            promise = $scope.startAutoRefresh();
            $scope.$emit('showAcquisition');
            
            $scope.$on('$destroy',function(){
                if(promise) {
                    $interval.cancel(promise); 
                }  
            });
        }
    };
})();
