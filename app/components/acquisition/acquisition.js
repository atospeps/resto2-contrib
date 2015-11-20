(function() {

    'use strict';

    angular.module('administration').controller('AcquisitionController', ['$scope', 'administrationServices', 'acquisitionAPI', 'CONFIG', 'ngDialog', acquisitionController]);

    function acquisitionController($scope, administrationServices, acquisitionAPI, CONFIG, ngDialog) {
    	
        if (administrationServices.isUserAnAdministrator()) {
        	
        	/**
        	 * Change priority/status popup
        	 */
            $scope.changePriority = function(){
                 ngDialog.open({ 
                     template: 'app/components/acquisition/changePriority.html',
                     scope: $scope,
                    className: 'ngdialog-theme-plain',
                    closeByDocument: false
                 });
            };

        	/**
        	 * Refresh data
        	 */
        	$scope.refresh = function() {
        		$scope.getDatasource();
        	};

        	/**
        	 * Get datasources state
        	 */
        	$scope.getDatasource = function() {
                acquisitionAPI.getDatasource(function(data) {
                	$scope.datasources = [];
                    for (var key in data) {
                    	if(data[key]) {
                    		$scope.datasources.push(key);
                    		$scope.selectedDatasource = key;
                    	}
                    }
                    if($scope.selectedDatasource) {
                        $scope.getAcquisitionData();
                    }
                }, function() {
                    $scope.datasources = [];
                });
        	};
        	
            /**
             * Get acquisition data
             */
            $scope.getAcquisitionData = function() {
                var options = {};
                
                options['startIndex'] = $scope.startIndex;
                options['offset'] = $scope.offset;
                options['sortOrder'] = $scope.sortOrder;
                options['orderBy'] = $scope.orderBy;
                options['filter'] = $scope.filtersActive;
                options['status'] = $scope.status;
                options['minPriority'] = $scope.minPriority;
                options['maxPriority'] = $scope.maxPriority;
                options['startDate'] = $scope.startDate;
                options['endDate'] = $scope.endDate;

                acquisitionAPI.getDatasourceData($scope.selectedDatasource, function(data) {
                    $scope.data = data;
                }, function(data) {
                    alert(data);
                });
            };
            
            $scope.rowSelect = function() {
                for(var j = 0; j<$scope.data.length; j++) {
                	$scope.data[j]['selected'] = $scope.allRowSelected;
                }
            };
            
            $scope.checkNumSelectedRow = function() {
            	var num = 0;
                for(var j = 0; j<$scope.data.length; j++){
                	if($scope.data[j]['selected']) {
                		num++;
                	}
                }
                return num;
            };
            
            $scope.isAllRowsSelected = function() {
                for(var j = 0; j<$scope.data.length; j++){
                	if(!$scope.data[j]['selected']) {
                		return false;
                	}
                }
                return true;
            };

            $scope.$watch('data', function(newValue, oldValue) {
            	$scope.numSelectedRow = $scope.checkNumSelectedRow();
            	$scope.allRowSelected = $scope.isAllRowsSelected();
            }, true);
            
            $scope.toggleFiltre = function() {
            	$scope.displayFiltres = !$scope.displayFiltres;
            };
            
            $scope.applyFilters = function() {
            	$scope.displayFiltres = false;
            	$scope.filtersActive = true;
            	// Update data
            	$scope.getAcquisitionData();
            };
            
            $scope.removeFilters = function() {
            	$scope.filtersActive = false;
            	// Update data
            	$scope.getAcquisitionData();
            };

            /*
             * Init the context
             */
            $scope.init = function() {
            	$scope.displayFiltres = false;
            	$scope.filtersActive = false;
            	$scope.datasources = [];
            	$scope.selectedDatasource = "";
                $scope.availableStatus = [
                              {id: '1', name: 'All'},
                              {id: '2', name: 'New'},
                              {id: '3', name: 'Download TODO'},
                              {id: '4', name: 'Download in progress'},
                              {id: '5', name: 'Download error'},
                              {id: '6', name: 'Download done'},
                              {id: '7', name: 'Archive TODO'},
                              {id: '8', name: 'Archive error'},
                              {id: '9', name: 'Catalog TODO'},
                              {id: '10', name: 'Catalog error'},
                              {id: '11', name: 'Catalog done'},
                              {id: '12', name: 'Duplicated'}];
                
                $scope.currentPage = 1;
                $scope.maxPage = 1;
                $scope.startIndex = 0;
                $scope.offset = CONFIG.offset;
                $scope.sortOrder = 'DESC';
                $scope.orderBy = null;
                $scope.status = "All";
                $scope.minPriority;
                $scope.maxPriority;
                $scope.startDate;
                $scope.endDate;
                
                $scope.data = [];
            	$scope.allRowSelected = false;
            	$scope.numSelectedRow = 0;
            };

            $scope.init();
            $scope.getDatasource();
            $scope.$emit('showAcquisition');
        }
    };
})();
