(function() {

    'use strict';

    angular.module('administration').filter('start', function() {
    	  return function(input, start) {
    	    var start = parseInt(start, 10);
    	    if(input) {
    	    	return input.slice(start);
    	    }
    	    return [];
    	  };
    	});
})();