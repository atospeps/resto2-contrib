(function() {

    'use strict';
    
    angular.module('administration').controller('AcquisitionDashboardController', ['$scope', '$interval', 'administrationServices', 'acquisitionAPI', 'CONFIG', acquisitionDashboardController]);

    function acquisitionDashboardController($scope, $interval, administrationServices, acquisitionAPI, CONFIG) {

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
                        $scope.datasources.push({"state":data[key] ? "started" : "stopped", "name": key});
                    }
                    $scope.acquisitionState = "started";
                }, function() {
                    $scope.acquisitionState = "stopped";
                    $scope.datasources = [];
                });
        	};
        	
        	/**
        	 * Get acquisition statistics
        	 */
        	$scope.getStats = function() {
                var options = {};
                
                if($scope.startDate !== "" && $scope.endDate !== "") {
                    options['startDate'] = $scope.startDate.toISOString();
                    options['endDate'] = $scope.endDate.toISOString();
                }

                acquisitionAPI.getDashboardStats(options, function(data) {
                	$scope.stats = data;
                }, function(data) {
                    alert(data);
                });
        	};

            /*
             * Init the context
             */
            $scope.init = function() {
            	$scope.acquisitionState = "unknown";
            	$scope.datasources = [];
                $scope.stats;
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
