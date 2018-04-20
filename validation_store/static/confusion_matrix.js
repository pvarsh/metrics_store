function formatNumber (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

function Matrix(){

    var width = 80,
        height = 80,
        rotateYLabels = false,
        startColor = "#ffffff",
        endColor = "#e67e22",
        margin = {top: 10, right: 50, bottom: 20, left: 100};

    function chart(d, i){

        var labelsData = d.value.conf_mat.labels,
            matrix = d.value.conf_mat.matrix;
        var maxValue = d3.max(matrix, function(layer) { return d3.max(layer, function(d) { return d; }); });
        var minValue = d3.min(matrix, function(layer) { return d3.min(layer, function(d) { return d; }); });

        var numrows = matrix.length;
        var numcols = matrix[0].length;

        var selection = d3.select(this);

        var svg = selection.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var background = svg.append("rect")
            .style("stroke", "black")
            .style("stroke-width", "2px")
            .attr("width", width)
            .attr("height", height);

        var x = d3.scaleBand()
            .domain(d3.range(numcols))
            .range([0, width]);

        var y = d3.scaleBand()
            .domain(d3.range(numrows))
            .range([0, height]);

        var colorMap = d3.scaleLinear()
            .domain([minValue,maxValue])
            .range([startColor, endColor]);

        var row = svg.selectAll(".row")
            .data(matrix)
            .enter().append("g")
            .attr("class", "row")
            .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; });

        var cell = row.selectAll(".cell")
            .data(function(d) { return d; })
                .enter().append("g")
            .attr("class", "cell")
            .attr("transform", function(d, i) { return "translate(" + x(i) + ", 0)"; });

        cell.append('rect')
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("stroke-width", 0);

        cell.append("text")
            .attr("dy", ".32em")
            .attr("x", x.bandwidth() / 2)
            .attr("y", y.bandwidth() / 2)
            .attr("text-anchor", "middle")
            .style("fill", function(d, i) { return d >= maxValue/2 ? 'white' : 'black'; })
            .text(function(d, i) {return formatNumber(d); });

        row.selectAll(".cell")
            .data(function(d, i) { return matrix[i]; })
            .style("fill", colorMap);

        var labels = svg.append('g')
            .attr('class', "labels");

        var columnLabels = labels.selectAll(".column-label")
            .data(labelsData)
            .enter().append("g")
            .attr("class", "column-label")
            .attr("transform", function(d, i) { return "translate(" + x(i) + "," + height + ")"; });

        columnLabels.append("line")
            .style("stroke", "black")
            .style("stroke-width", "1px")
            .attr("x1", x.bandwidth() / 2)
            .attr("x2", x.bandwidth() / 2)
            .attr("y1", 0)
            .attr("y2", 5);

        if (rotateYLabels) {
    	    columnLabels.append("text")
	            .attr("x", 30)
	            .attr("y", y.bandwidth() / 2)
	            .attr("transform", "rotate(-60)")
	            .attr("dy", ".6em")
	            .attr("dx", "-3.0em")
	            .attr("text-anchor", "end")
	            .text(function(d, i) { return d; });
	        }
	    else {
            columnLabels.append("text")
                .attr("x", 20)
                .attr("y", y.bandwidth() / 4)
                .attr("text-anchor", "middle")
                .text(function(d, i) { return d; });
	    }


        var rowLabels = labels.selectAll(".row-label")
            .data(labelsData)
          .enter().append("g")
            .attr("class", "row-label")
            .attr("transform", function(d, i) { return "translate(" + 0 + "," + y(i) + ")"; });

        rowLabels.append("line")
            .style("stroke", "black")
            .style("stroke-width", "1px")
            .attr("x1", 0)
            .attr("x2", -5)
            .attr("y1", y.bandwidth() / 2)
            .attr("y2", y.bandwidth() / 2);

        rowLabels.append("text")
            .attr("x", -8)
            .attr("y", y.bandwidth() / 2)
            .attr("dy", ".32em")
            .attr("text-anchor", "end")
            .text(function(d, i) { return d; });

    }
    chart.width = function(value){
        if (!arguments.length) return width;
        width = value;
        return chart;
    }

    chart.height = function(value){
        if (!arguments.length) return height;
        height = value;
        return chart;
    }

    chart.rotateYLabels = function(value){
        if (!arguments.length) return rotateYLabels;
        rotateYLabels = value;
        return chart;
    }

    chart.margin = function(value){
        if (!arguments.length) return margin;
        margin = value;
        return chart;
    }
    return chart;
}
