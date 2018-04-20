function metricsTable(){
    var decimalPlaces = 3;

    function chart(d, i){
        var container = d3.select(this);
        var table = container.append("table")
            .attr("class", "metrics");
        var tableHeader = table.append("thead");
        var tableBody = table.append("tbody");

        var headerData = ["accuracy", "precision", "recall", "f1_score"];
        var tableData = headerData.map(key => d.value[key]);

        tableHeader.append("tr")
            .selectAll("th")
            .data(headerData)
            .enter()
            .append("th")
            .text(d => d);

        tableBody.append("tr")
            .selectAll("td")
            .data(tableData)
            .enter()
            .append("td")
            .text(d => d === null ? "" : d.toFixed(decimalPlaces));
    }
    return chart
}
function binaryConfMat(){
    var width = 150,
        height = 150;

    function chart(selection){
        selection.append("table")
          .attr("class", "binary-confusion-matrix")
          .selectAll("tr")
          .data(function(d){return d.matrix;})
          .enter()
          .append("tr")
          .selectAll("td")
          .data(function(d){return d;})
          .enter()
          .append("td")
          .text(function(d){return d;});
    }

    chart.width = function(value){
    if (!arguments.length) return width;
    width = value;
    return chart;
    };

    chart.height = function(value){
    if (!arguments.length) return height;
    height = value;
    return chart;
    };
    return chart;
}

var reportJSONURL = '/api/reports/' + reportId

var renderMatrix = Matrix();
var renderTable = metricsTable();

function cellLevelReport(error, report){
    var binaryMetrics = d3.entries(report.report.binary_metrics);

    var container = d3.select("#report-stats")
        .attr('class', 'cell-level');
    var reportTable = d3.select("#report-stats")
        .append("table");
    var tableHeader = reportTable.append("thead");
    var tableBody = reportTable.append("tbody");
    var columns = ['classifier', 'accuracy', 'precision', 'recall', 'f1_score', 'confusion matrix'];

    tableHeader.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(d => d)
    var rows = tableBody.selectAll("tr")
        .data(binaryMetrics)
        .enter()
        .append("tr");

    d3.selectAll("td.first-row")
        .data(binaryMetrics)
        .text(function(d){return d.key});

    rows.selectAll("td")
        .data(function(d){
            var rowData = [d.key];
            var metricsColumns = columns.slice(1, -1);
            rowData = rowData.concat(metricsColumns.map(col => d.value[col]));
            console.log(rowData);
            return rowData;})
        .enter()
        .append("td")
        .text(function(d){
            if (d === null){
                return "N/A"}
            else if (typeof(d) === 'string'){
                return d}
            else {
                return d.toFixed(3)}});

    rows.append("td")
        .attr("class", "confusion-matrix");

    d3.selectAll("td.confusion-matrix")
        .each(renderMatrix);
}

d3.queue()
    .defer(d3.json, reportJSONURL)
    .await(cellLevelReport);
