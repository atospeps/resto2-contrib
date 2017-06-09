(function() {

	'use strict';

	angular.module('administration')
		   .factory('wpsAPI', [wpsAPI]);

	function wpsAPI()
	{
		var api = {
			GetCapabilities : GetCapabilities
		};

		return api;

		function GetCapabilities(options)
		{
			return [
        	    "IMAGE_GEOMETRY_CORRECTION.S2ST|LEVEL1C|S2MSI1C|INS-NOBS",
        	    "IMAGE_GEOMETRY_CORRECTION.S1|LEVEL2|_|_",
        	    "IMAGE_GEOMETRY_CORRECTION.S1|_|_|_",
        	    "GRAY_LEVEL_SIZE_ZONE_MATRIX.S1|LEVEL1|GRD|EW.S1|LEVEL1|GRD|SM.S2|LEVEL1C|S2MSI1C|INS-NOBS",
        	    "GRAY_LEVEL_SIZE_ZONE_MATRIX.S2|LEVEL1C|S2MSI1C|INS-NOBS",
        	    "FLAT_FIELD_CORRECTION.S1|LEVEL2|GRD|SM.S2|LEVEL1C|S2MSI1C|INS-NOBS",
        	    "OPTICAL_GRANULOMETRY.S2|LEVEL1C|S2MSI1C|INS-RAW",
        	    "IMAGE_GEOMETRY_CORRECTION.S2|LEVEL1C|S2MSI1C_|INS-NOBS.S2ST|LEVEL1C|S2MSI1C|INS-NOBS",
        	    "OPTICAL_GRANULOMETRY.S3|LEVEL1|SL_1_RBT___|Earth Observation",
        	    "TEST_TRAITEMENT_TOUS_PRODUITS._|_|_|_"
            ];
		}
	}
})();
