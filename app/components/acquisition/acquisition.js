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
                if($scope.selectedDatasource) {
                    $scope.getAcquisitionData();
                }
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
                acquisitionAPI.getDatasourceData($scope.selectedDatasource, function(data) {
                    $scope.data = data;
                    $scope.dataFiltered = $scope.data;
                }, function(data) {
                    alert(data);
                });
            };

            /**
             * Change page
             */
            $scope.changePage = function(num) {
            	if(num == $scope.currentPage) {
            		return;
            	}
                $scope.currentPage = num;
                $scope.startIndex = $scope.offset * ($scope.currentPage - 1);
                $scope.rowSelect(false);
            };
            
            /**
             * Return num page to display for paging
             */
            $scope.pagesButtonRange = function() {
            	$scope.maxPage = Math.ceil($scope.dataFiltered.length / $scope.offset);
            	$scope.maxPage = $scope.maxPage > 0 ? $scope.maxPage : 1;
            	var range = [];
            	var minPage = ($scope.currentPage - 2) > 1 ? $scope.currentPage - 2 : 1;
            	var maxPage = ($scope.currentPage + 2) < $scope.maxPage ? $scope.currentPage + 2 : $scope.maxPage;
            	for(var i = minPage; i <= maxPage; i++) {
            		range.push(i);
            	}
            	if($scope.currentPage > $scope.maxPage) {
            		$scope.changePage($scope.maxPage);
            	}
            	return range;
            };
            
            /**
             * Unselect rows when offset is updated and control offset value
             */
            $scope.$watch('offset', function(newValue, oldValue) {
            	if(newValue < 1) {
            		$scope.offset = 1;
            	}
            	if(newValue > 1000) {
            		$scope.offset = 1000;
            	}
                $scope.rowSelect(false);
                $scope.startIndex = $scope.offset * ($scope.currentPage - 1);
        	});
            
            $scope.rowSelect = function(selected) {
                for(var j = 0; j<$scope.displayedData.length; j++) {
                	$scope.displayedData[j]['selected'] = selected;
                }
                $scope.refreshRow();
            };
            
            $scope.checkNumSelectedRow = function() {
            	var num = 0;
                for(var j = 0; j<$scope.displayedData.length; j++){
                	if($scope.displayedData[j]['selected']) {
                		num++;
                	}
                }
                return num;
            };
            
            $scope.isAllRowsSelected = function() {
            	if($scope.displayedData.length == 0) {
            		return false;
            	}
                for(var j = 0; j<$scope.displayedData.length; j++){
                	if(!$scope.displayedData[j]['selected']) {
                		return false;
                	}
                }
                return true;
            };

            /**
             * Refresh row selected info.
             */
            $scope.refreshRow = function() {
            	$scope.numSelectedRow = $scope.checkNumSelectedRow();
            	$scope.allRowSelected = $scope.isAllRowsSelected();
            }
            
            /**
             * Sort Data 
             */
            $scope.sortData = function(order) {
            	$scope.sortOrder = !$scope.sortOrder;
            	$scope.orderBy = order;
                $scope.rowSelect(false);
            }
            
            $scope.toggleFiltre = function() {
            	$scope.displayFiltres = !$scope.displayFiltres;
            };
            
            $scope.applyFilters = function() {
            	$scope.displayFiltres = false;
            	$scope.filtersActive = true;
            	$scope.dataFiltered = $scope.data.filter($scope.filter);
            };
            
            $scope.removeFilters = function() {
            	$scope.filtersActive = false;
                $scope.dataFiltered = $scope.data;
            };
            
            /**
             * Filter
             */
            $scope.filter = function(elem) {
            	// Accept all data if filters disabled.
            	if(!$scope.filtersActive) {
            		return true;
            	}
            	
            	// Check all
            	if($scope.status != "All" && elem.productStatus != $scope.status) {
            		return false;
            	}
            	if($scope.platform != "All" && elem.missionIdentifier != $scope.platform) {
            		return false;
            	}
            	if($scope.productType != "All" && elem.productType != $scope.productType) {
            		return false;
            	}
            	if($scope.minPriority !== "" && $scope.maxPriority !== "") {
            		return (elem.priority >= $scope.minPriority && elem.priority <= $scope.maxPriority);
            	}
            	return true;
            };

            /*
             * Init the context
             */
            $scope.init = function() {
            	$scope.displayFiltres = false;
            	$scope.filtersActive = false;
            	$scope.datasources = [];
            	$scope.selectedDatasource = "";
                $scope.availableStatus = CONFIG.productStatus;
                $scope.availableType = CONFIG.productType;
                $scope.availablePlatform = CONFIG.productPlatform;
                
                $scope.currentPage = 1;
                $scope.maxPage = 1;
                $scope.startIndex = 0;
                $scope.offset = CONFIG.offset;
                $scope.sortOrder = true;
                $scope.orderBy = null;
                $scope.status = "All";
                $scope.platform = "All";
                $scope.productType = "All";
                $scope.minPriority = "";
                $scope.maxPriority = "";
                $scope.startDate;
                $scope.endDate;
                
                $scope.data = [];
                $scope.dataFiltered = [];
                $scope.displayedData = [];
            	$scope.allRowSelected = false;
            	$scope.numSelectedRow = 0;
            };

            $scope.init();
            $scope.getDatasource();
            $scope.$emit('showAcquisition');
        }
    };
})();
