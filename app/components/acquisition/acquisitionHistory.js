(function() {

    'use strict';

    angular.module('administration').controller('AcquisitionHistoryController', ['$scope', '$interval', 'administrationServices', 'acquisitionAPI', 'CONFIG', 'ngDialog', acquisitionHistoryController]);

    function acquisitionHistoryController($scope, $interval, administrationServices, acquisitionAPI, CONFIG, ngDialog) {
    	
        if (administrationServices.isUserAnAdministrator()) {

        	var promise;
        	
        	/**
        	 * Display product info
        	 */
            $scope.displayProduct = function(product) {
            	if(!product) {
            		return;
            	}
            	$scope.displayedProduct = product;
                ngDialog.open({ 
                     template: 'app/components/acquisition/productDetail.html',
                     scope: $scope,
                    className: 'ngdialog-theme-plain productDialog'
                });
            };

        	/**
        	 * Refresh data
        	 */
        	$scope.refresh = function() {
        		$scope.getHistory();
        	};
        	
        	/**
        	 * Launch auto refresh (return promise)
        	 */
        	$scope.startAutoRefresh = function() {
        		// convert timer from minute to millisecond
            	return $interval(function() {$scope.refresh();}, CONFIG.autoRefreshTimer * 60000);
        	};
        	
            /**
             * Get history
             */
            $scope.getHistory = function() {
                var options = {};
                
                options['startIndex'] = $scope.startIndex;
                options['offset'] = $scope.offset;
                options['sortOrder'] = $scope.sortOrder;
                options['orderBy'] = $scope.orderBy;
                options['filter'] = $scope.filtersActive;
                options['status'] = $scope.status;
                options['startDate'] = $scope.startDate;
                options['endDate'] = $scope.endDate;
                options['title'] = $scope.title;

                acquisitionAPI.getHistory(options, function(data) {
                    $scope.history = data.results;
                    $scope.maxPage = Math.ceil(data.nbResults / $scope.offset);
                }, function(data) {
                    alert(data);
                });
            };
            
            /**
             * Sort history 
             */
            $scope.sortHistory = function(order) {
            	if($scope.sortOrder === "DESC") {
            		$scope.sortOrder = "ASC";
            	} else {
            		$scope.sortOrder = "DESC";
            	}
            	$scope.orderBy = order;
            	
            	// Update data
            	$scope.getHistory();
            }
            
            /**
             * Change page
             */
            $scope.changePage = function(num) {
            	if(num == $scope.currentPage) {
            		return;
            	}
                $scope.currentPage = num;
                $scope.startIndex = $scope.offset * ($scope.currentPage - 1);
            	$scope.getHistory();
            };
            
            /**
             * Return num page to display for paging
             */
            $scope.pagesButtonRange = function() {
            	var range = [];
            	var minPage = ($scope.currentPage - 2) > 1 ? $scope.currentPage - 2 : 1;
            	var maxPage = ($scope.currentPage + 2) < $scope.maxPage ? $scope.currentPage + 2 : $scope.maxPage;
            	for(var i = minPage; i <= maxPage; i++) {
            		range.push(i);
            	}
            	return range;
            };
            
            $scope.toggleFiltre = function() {
            	$scope.displayFiltres = !$scope.displayFiltres;
             }
            
            $scope.applyFilters = function() {
            	$scope.displayFiltres = false;
            	$scope.filtersActive = true;
            	// Update data
            	$scope.getHistory();
            }
            
            $scope.removeFilters = function() {
            	$scope.filtersActive = false;
            	// Update data
            	$scope.getHistory();
            }

            /*
             * Init the context
             */
            $scope.init = function() {
            	$scope.displayFiltres = false;
            	$scope.filtersActive = false;
                $scope.availableStatus = CONFIG.productStatus.slice();
                $scope.availableStatus.splice(0,0,"All");
                
                $scope.currentPage = 1;
                $scope.maxPage = 1;
                $scope.startIndex = 0;
                $scope.offset = CONFIG.offset;
                $scope.sortOrder = 'DESC';
                $scope.orderBy = null;
                $scope.status = "All";
                $scope.startDate;
                $scope.endDate;
                $scope.title;
                $scope.displayedProduct;
                
                $scope.history = [];
            };

            $scope.init();
            $scope.getHistory();
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
