(function() {

    'use strict';
    
    angular.module('administration').controller('AcquisitionDashboardController', ['$scope', 'administrationServices', 'acquisitionAPI', acquisitionDashboardController]);

    function acquisitionDashboardController($scope, administrationServices, acquisitionAPI) {

        if (administrationServices.isUserAnAdministrator()) {
        	
        	
        	$scope.getStats = function() {
                var options = {};
                
                options['startDate'] = $scope.startDate;
                options['endDate'] = $scope.endDate;

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
                $scope.startDate;
                $scope.endDate;
            };

            $scope.init();
            $scope.getStats();
            $scope.$emit('showAcquisition');
        }
    };
})();
