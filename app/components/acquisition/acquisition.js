(function() {

    'use strict';

    angular.module('administration').controller('AcquisitionController', ['$scope', '$timeout', '$interval', 'administrationServices', 'acquisitionAPI', 'CONFIG', 'ngDialog', acquisitionController]);

    function acquisitionController($scope, $timeout, $interval, administrationServices, acquisitionAPI, CONFIG, ngDialog) {
    	
    	$scope.warningDisplay = false;
    	
        if (administrationServices.isUserAnAdministrator()) {

        	var promise;
        	
        	/**
        	 * Change priority/status popup
        	 */
            $scope.changeProducts = function(productList) {
            	if(productList.length == 0) {
            		return;
            	}
            	$scope.productsToUpdate = productList;
                 ngDialog.open({ 
                     template: 'app/components/acquisition/changeProducts.html',
                     scope: $scope,
                    className: 'ngdialog-theme-plain',
                    closeByDocument: false
                 });
            };
            
            /**
             * Update products
             */
            $scope.updateProducts = function(newPriority, newStatus) {
            	var options = {
            			datasourceName : $scope.selectedDatasource,
            			products : $scope.productsToUpdate,
            			priority : newPriority,
            			status : newStatus};
                acquisitionAPI.updateProducts(options, function(data) {
                	$scope.loadProducts(data);
                }, function(data) {
                    alert(data);
                });
            }

        	/**
        	 * Refresh data
        	 */
        	$scope.refresh = function() {
                if($scope.selectedDatasource) {
                	$scope.tempData = [];
                	var data = $scope.getSelectedData();
                	for(var key in data) {
                		$scope.tempData.push(data[key].identifier);
                	}
                    $scope.rowSelect(false);
                    $scope.getAcquisitionData();
                }
        	};
        	
        	/**
        	 * Launch auto refresh (return promise)
        	 */
        	$scope.startAutoRefresh = function() {
        		// convert timer from minute to millisecond
            	return $interval(function() {$scope.refresh();}, CONFIG.autoRefreshTimer * 60000);
        	};
        	

            /**
             * Change Datasource and load new datasource data
             */
            $scope.$watch('selectedDatasource', function(newValue, oldValue) {
                $scope.refresh();
        	});

        	/**
        	 * Get datasources state
        	 */
        	$scope.getDatasource = function() {
                acquisitionAPI.getDatasource(function(data) {
                	$scope.datasources = [];
                    for (var key in data) {
                    	if(data[key] == "OK" || data[key] == "ERROR") {
                    		$scope.datasources.push(key);
                    	}
                    }
            		$scope.selectedDatasource = $scope.datasources[0];
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
            	$scope.warningDisplay = acquisitionAPI.getDatasourceData($scope.selectedDatasource, function(data) {
                  $scope.warningDisplay = false;  
                	$scope.loadProducts(data);
                }, function() {
                   $scope.warningDisplay = true;
                });
            };
            
            /**
             * Load products
             */
            $scope.loadProducts = function(products) {          	
                $scope.rowSelect(false);
                $scope.data = [];
            	for(var key in products) {
            		var row = products[key];
            		row.index = parseInt(key);
            		$scope.data.push(row);
            	}
                if($scope.filtersActive){
                	$scope.dataFiltered = $scope.data.filter($scope.filter);
                } else {
                    $scope.dataFiltered = $scope.data;
                }
                $timeout(function(){
                    $scope.reselectProducts();
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
            };
            
            /**
             * Reselect row according to previous selection
             */
            $scope.reselectProducts = function() {
            	for(var i=0; i < $scope.tempData.length; i++) {
            		for(var j=0; j < $scope.displayedData.length; j++) {
            			if($scope.displayedData[j].identifier == $scope.tempData[i]) {
            				$scope.displayedData[j].selected = true;
            				break;
            			}
            		}
            	}
            	$scope.refreshRow();
            };
            
            /**
             * Return all selected products
             */
            $scope.getSelectedData = function() {
            	var selectedData = [];
                for(var j = 0; j<$scope.displayedData.length; j++){
                	if($scope.displayedData[j]['selected']) {
                		selectedData.push($scope.displayedData[j]);
                	}
                }
                return selectedData;
            };
            
            /**
             * Return all filtered products
             */
            $scope.getFilteredData = function() {
            	if($scope.filtersActive) {
            		return $scope.dataFiltered;
            	} else {
            		return [];
            	}
            };
            
            /**
             * Sort Data 
             */
            $scope.sortData = function(order) {
            	$scope.sortOrder = !$scope.sortOrder;
            	$scope.orderBy = order;
                $scope.rowSelect(false);
            };
            
            $scope.toggleFiltre = function() {
            	$scope.displayFiltres = !$scope.displayFiltres;
            };
            
            $scope.applyFilters = function() {
            	$scope.filters['status'] = $scope.status;
            	$scope.filters['platform'] = $scope.platform;
            	$scope.filters['productType'] = $scope.productType;
            	$scope.filters['minPriority'] = $scope.minPriority;
            	$scope.filters['maxPriority'] = $scope.maxPriority;
            	
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
            	if($scope.filters['status'] != "All" && elem.productStatus != $scope.filters['status']) {
            		return false;
            	}
            	if($scope.filters['platform'] != "All" && elem.missionIdentifier != $scope.filters['platform']) {
            		return false;
            	}
            	if($scope.filters['productType'] != "All" && elem.productType != $scope.filters['productType']) {
            		return false;
            	}
            	if($scope.filters['minPriority'] !== "" && elem.priority < $scope.filters['minPriority']) {
            		return false;
            	}
            	if($scope.filters['maxPriority'] !== "" && elem.priority > $scope.filters['maxPriority']) {
            		return false;
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
            	$scope.availableStatus = CONFIG.productStatus.slice();
                $scope.availableStatus.splice(0,0,"");
                $scope.filterStatus = CONFIG.productStatus.slice();
                $scope.filterStatus.splice(0,0,"All");
                $scope.filterType = CONFIG.productType.slice();
                $scope.filterType.splice(0,0,"All");
                $scope.filterPlatform = CONFIG.productPlatform.slice();
                $scope.filterPlatform.splice(0,0,"All");
                
                $scope.currentPage = 1;
                $scope.maxPage = 1;
                $scope.startIndex = 0;
                $scope.offset = CONFIG.offset;
                $scope.sortOrder = false;
                $scope.orderBy = "index";
                $scope.status = "All";
                $scope.platform = "All";
                $scope.productType = "All";
                $scope.minPriority = "";
                $scope.maxPriority = "";
                $scope.startDate;
                $scope.endDate;
                $scope.filters = {};
                
                $scope.data = [];
                $scope.dataFiltered = [];
                $scope.displayedData = [];
                $scope.tempData = [];
            	$scope.allRowSelected = false;
            	$scope.numSelectedRow = 0;
            	$scope.productsToUpdate = [];
            };

            $scope.init();
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
