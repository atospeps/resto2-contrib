(function() {

    'use strict';
    
    angular.module('administration').controller('AcquisitionDashboardController', ['$scope', 'administrationServices', 'acquisitionAPI', acquisitionDashboardController]);

    function acquisitionDashboardController($scope, administrationServices, acquisitionAPI) {

        if (administrationServices.isUserAnAdministrator()) {

        	/**
        	 * Refresh data
        	 */
        	$scope.refresh = function() {
        		$scope.getStats();
                $scope.getDatasource();
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
                    console.log($scope.datasources);
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
            	$scope.acquisitionState = "started";
            	$scope.datasources = [];
            	$scope.scihubState = "started";
            	$scope.colhubState = "stopped";
                $scope.stats;
                $scope.startDate = "";
                $scope.endDate = "";
            };

            $scope.init();
            $scope.getStats();
            $scope.getDatasource();
            $scope.$emit('showAcquisition');
        }
    };
})();
