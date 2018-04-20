var reportJSONURL = '/api/reports/' + reportId;

var renderMatrix = Matrix()
    .width(600)
    .height(600)
    .rotateYLabels(true)
    .margin({top: 10, right: 50, bottom: 100, left: 100});

function columnLevelReport(error, report){
    var confusionMatrix = [{value: {conf_mat: report.report.conf_mat}}]

    var reportContainer = d3.select("#report-stats");
    var confMatContainer = reportContainer
        .attr('class', 'column-level')
        .append("div")
        .attr("class", "confusion-matrix");

    confMatContainer.selectAll("p").data(confusionMatrix)
        .enter()
        .append("p")
        .each(renderMatrix);

    var missesColumnNames = ['column_id', 'column_name', 'confidence', 'predicted_label', 'true_label'];
    var missesTable = reportContainer
        .append("table")
        .attr("class", "column-misses");

    var missesHeaderRow = missesTable
        .append("thead")
        .append("tr");

    missesHeaderRow
        .selectAll("th")
        .data(missesColumnNames)
        .enter()
        .append("th")
        .text(d => d);

    var missesTableBody = missesTable
        .append("tbody")
        .selectAll("tr")
        .data(report.report.misses)
        .enter()
        .append("tr")
        .selectAll("td")
        .data(function(d){console.log(d3.entries(d)); return d3.entries(d)})
        .enter()
        .append("td")
        .text(function(d){
            var cellValue = d.value;
            if (typeof(cellValue) === 'number' && cellValue < 1) return cellValue.toFixed(3);
            else return cellValue;
        })
}


d3.queue()
    .defer(d3.json, reportJSONURL)
    .await(columnLevelReport);
