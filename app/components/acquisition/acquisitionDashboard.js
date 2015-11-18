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
            	$scope.scihubState = "started";
            	$scope.colhubState = "stopped";
                $scope.stats;
                $scope.startDate = "";
                $scope.endDate = "";
            };

            $scope.init();
            $scope.getStats();
            $scope.$emit('showAcquisition');
        }
    };
})();
