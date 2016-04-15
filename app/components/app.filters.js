(function() {

	'use strict';

	angular.module('administration').filter('start', function() {
		return function(input, start) {
			var start = parseInt(start, 10);
			if (input) {
				return input.slice(start);
			}
			return [];
		};
	})
	/*
	 * Filter which representing bytes in a human-friendly format. Bytes
	 * convertion is truncated (Not fixed).
	 */
	.filter(
			'bytes',
			function() {
				return function(bytes, precision) {
					// Not available or
					if (isNaN(parseFloat(bytes)) || !isFinite(bytes))
						return 'n/a';

					var units = {
						1 : 'Ko',
						2 : 'Mo',
						3 : 'Go',
						4 : 'To'
					}, measure, floor, precision, fixed;
					// bytes to terra-octets
					if (bytes >= 1099511627776) {
						measure = 4;
					}
					// bytes to giga-octets
					else if (bytes >= 1073741824 && bytes < 1099511627776) {
						measure = 3;
					}
					// bytes to mega-octets
					else if (bytes >= 1048576 && bytes < 1073741824) {
						measure = 2;
					}
					// bytes to kilo-octets
					else if (bytes < 1048576) {
						measure = 1;
					}

					fixed = Math.pow(10, isNaN(precision) ? 2 : precision);
					return (Math.floor(+(bytes / Math.pow(1024, measure))
							* fixed) / fixed)
							+ ' ' + units[measure];
				}
			});
})();