(function() {

    'use strict';

    angular.module('administration').directive('piChart', piChart);

    function piChart($parse) {
    	 var piChartDirective = {
    	         restrict: 'E',
    	         replace: false,
    	         scope: {data: '=chartData'},
    	         link: function (scope, element, attrs) {

    	        	 var chart = d3.select(element[0]);
		             var width = 320;
		             var height = 320;
		             var radius = Math.min(width, height) / 2;
		             var color = d3.scale.category20b();
	
		             var svg = chart
		               .append('svg')
		               .attr('width', width)
		               .attr('height', height)
		               .append('g')
		               .attr('transform', 'translate(' + (width / 2) + 
		                 ',' + (height / 2) + ')');
	
		             var arc = d3.svg.arc()
		               .outerRadius(radius)
		               .innerRadius(0);
		             
		             console.log(arc);
		             var pie = d3.layout.pie()
		               .value(function(d) { return d.count; })
		               .sort(null);
		             
		             var g = svg.selectAll('.arc')
		               .data(pie(scope.data))
		               .enter().append("g").attr("class", "arc");
	               
		             g.append('path')
		               .attr('d', arc)
		               .style('fill', function(d) { return d.data.color; });
		             
		             g.append('text') 
		               .attr("transform", function(d) {return "translate(" + [arc.centroid(d)[0]*1.3, arc.centroid(d)[1]*1.3] + ")";})
		               .attr("dy", ".35em")
		               .style("text-anchor", "middle")
		               .style("font-weight", "bold")
		               .style("font-size", "24px")
		               .text(function(d) {return Math.round(d.data.count * 100 / d.data.total) + "%";});
    	         }
    	 	};
    	 
    	 return piChartDirective;
    };
})();