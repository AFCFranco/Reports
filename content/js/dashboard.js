/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.33430498875656, "KoPercent": 1.6656950112434414};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5485107241309756, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9067576348278102, 500, 1500, "Rag. 00 landing.-2 GET ashy-forest-01cfa521e.1.azurestaticapps.net/assets/index-DOllB97G.js"], "isController": false}, {"data": [0.0, 500, 1500, "Rag. 00 landing."], "isController": true}, {"data": [0.9658869395711501, 500, 1500, "Rag. 00 landing.-4 GET ashy-forest-01cfa521e.1.azurestaticapps.net/circle.png"], "isController": false}, {"data": [0.9226770630279402, 500, 1500, "Rag. 00 landing.-3 GET ashy-forest-01cfa521e.1.azurestaticapps.net/ps-logo-placeholder.png"], "isController": false}, {"data": [0.0, 500, 1500, "Rag. 01 AskMe."], "isController": true}, {"data": [0.4954892435808466, 500, 1500, "Rag. 01 AskMe.-0 OPTIONS ps-backend-app.kindcliff-c9d13748.eastus.azurecontainerapps.io/ask"], "isController": false}, {"data": [0.8562176165803109, 500, 1500, "Rag. 00 landing.-0 GET ashy-forest-01cfa521e.1.azurestaticapps.net/"], "isController": false}, {"data": [0.22009569377990432, 500, 1500, "Rag. 00 landing.-5 GET ashy-forest-01cfa521e.1.azurestaticapps.net/pet-v2.gif"], "isController": false}, {"data": [0.9733593242365172, 500, 1500, "Rag. 00 landing.-1 GET ashy-forest-01cfa521e.1.azurestaticapps.net/assets/index-TuOol6EZ.css"], "isController": false}, {"data": [0.0, 500, 1500, "Rag. 01 AskMe.-1 POST ps-backend-app.kindcliff-c9d13748.eastus.azurecontainerapps.io/ask"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 12007, 200, 1.6656950112434414, 5537.5020404764045, 0, 220720, 272.0, 8989.800000000003, 38071.80000000001, 106732.28000000001, 16.868312803452618, 12051.414802549898, 8.385442697065079], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Rag. 00 landing.-2 GET ashy-forest-01cfa521e.1.azurestaticapps.net/assets/index-DOllB97G.js", 1539, 32, 2.079272254710851, 403.43989603638715, 0, 11968, 215.0, 504.0, 1301.0, 4421.199999999993, 2.570526632259358, 151.46726431880626, 1.123344552767617], "isController": false}, {"data": ["Rag. 00 landing.", 1463, 40, 2.734107997265892, 11010.611073137386, 0, 208338, 2558.0, 29639.000000000007, 56890.19999999999, 89427.47999999984, 2.128232170782267, 12461.479877350257, 6.170232775393679], "isController": true}, {"data": ["Rag. 00 landing.-4 GET ashy-forest-01cfa521e.1.azurestaticapps.net/circle.png", 1539, 32, 2.079272254710851, 139.10461338531508, 0, 12786, 98.0, 156.0, 231.0, 1141.3999999999887, 2.570573860988577, 28.00565234731894, 1.2929761292819932], "isController": false}, {"data": ["Rag. 00 landing.-3 GET ashy-forest-01cfa521e.1.azurestaticapps.net/ps-logo-placeholder.png", 1539, 32, 2.079272254710851, 261.45484080571805, 0, 10076, 105.0, 394.0, 855.0, 3615.7999999999906, 2.5705523931692458, 126.75257299255978, 1.3322950750704856], "isController": false}, {"data": ["Rag. 01 AskMe.", 1403, 0, 0.0, 33608.23806129721, 2114, 300955, 9465.0, 103271.20000000001, 128460.19999999997, 194470.08000000013, 1.9901273795001275, 3.4336773073349596, 2.1533800160997476], "isController": true}, {"data": ["Rag. 01 AskMe.-0 OPTIONS ps-backend-app.kindcliff-c9d13748.eastus.azurecontainerapps.io/ask", 1441, 0, 0.0, 14287.562109646076, 258, 220720, 1058.0, 52934.59999999999, 73518.79999999992, 140879.51999999993, 2.0547554541565662, 0.8427707917439042, 1.109648209129474], "isController": false}, {"data": ["Rag. 00 landing.-0 GET ashy-forest-01cfa521e.1.azurestaticapps.net/", 1544, 39, 2.5259067357512954, 1311.9170984455952, 0, 21050, 299.0, 1194.5, 15286.75, 15397.1, 2.541279330050299, 1.8699922657834185, 1.2022590089710123], "isController": false}, {"data": ["Rag. 00 landing.-5 GET ashy-forest-01cfa521e.1.azurestaticapps.net/pet-v2.gif", 1463, 33, 2.255639097744361, 8762.278195488712, 0, 207495, 1592.0, 25162.000000000007, 53018.19999999983, 85255.11999999994, 2.133486551597417, 12230.282892781455, 1.077301678170189], "isController": false}, {"data": ["Rag. 00 landing.-1 GET ashy-forest-01cfa521e.1.azurestaticapps.net/assets/index-TuOol6EZ.css", 1539, 32, 2.079272254710851, 121.97725795971404, 0, 3024, 99.0, 148.0, 236.0, 494.599999999999, 2.571273908336341, 7.828297008241777, 1.1974350879688107], "isController": false}, {"data": ["Rag. 01 AskMe.-1 POST ps-backend-app.kindcliff-c9d13748.eastus.azurecontainerapps.io/ask", 1403, 0, 0.0, 21119.400570206722, 1783, 211796, 5052.0, 68238.20000000001, 109573.79999999999, 166755.4000000001, 1.9912458982889194, 2.6188851994581204, 1.079239720264014], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (ashy-forest-01cfa521e.1.azurestaticapps.net)", 1, 0.5, 0.008328475056217206], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, 0.5, 0.008328475056217206], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: ashy-forest-01cfa521e.1.azurestaticapps.net", 191, 95.5, 1.5907387357374865], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ashy-forest-01cfa521e.1.azurestaticapps.net:443 [ashy-forest-01cfa521e.1.azurestaticapps.net/20.75.109.112] failed: Connection timed out: connect", 2, 1.0, 0.016656950112434413], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ashy-forest-01cfa521e.1.azurestaticapps.net:443 [ashy-forest-01cfa521e.1.azurestaticapps.net/20.62.72.11] failed: Connection timed out: connect", 5, 2.5, 0.04164237528108603], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 12007, 200, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: ashy-forest-01cfa521e.1.azurestaticapps.net", 191, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ashy-forest-01cfa521e.1.azurestaticapps.net:443 [ashy-forest-01cfa521e.1.azurestaticapps.net/20.62.72.11] failed: Connection timed out: connect", 5, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ashy-forest-01cfa521e.1.azurestaticapps.net:443 [ashy-forest-01cfa521e.1.azurestaticapps.net/20.75.109.112] failed: Connection timed out: connect", 2, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (ashy-forest-01cfa521e.1.azurestaticapps.net)", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Rag. 00 landing.-2 GET ashy-forest-01cfa521e.1.azurestaticapps.net/assets/index-DOllB97G.js", 1539, 32, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: ashy-forest-01cfa521e.1.azurestaticapps.net", 32, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Rag. 00 landing.-4 GET ashy-forest-01cfa521e.1.azurestaticapps.net/circle.png", 1539, 32, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: ashy-forest-01cfa521e.1.azurestaticapps.net", 32, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Rag. 00 landing.-3 GET ashy-forest-01cfa521e.1.azurestaticapps.net/ps-logo-placeholder.png", 1539, 32, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: ashy-forest-01cfa521e.1.azurestaticapps.net", 32, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Rag. 00 landing.-0 GET ashy-forest-01cfa521e.1.azurestaticapps.net/", 1544, 39, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: ashy-forest-01cfa521e.1.azurestaticapps.net", 31, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ashy-forest-01cfa521e.1.azurestaticapps.net:443 [ashy-forest-01cfa521e.1.azurestaticapps.net/20.62.72.11] failed: Connection timed out: connect", 5, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ashy-forest-01cfa521e.1.azurestaticapps.net:443 [ashy-forest-01cfa521e.1.azurestaticapps.net/20.75.109.112] failed: Connection timed out: connect", 2, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (ashy-forest-01cfa521e.1.azurestaticapps.net)", 1, "", ""], "isController": false}, {"data": ["Rag. 00 landing.-5 GET ashy-forest-01cfa521e.1.azurestaticapps.net/pet-v2.gif", 1463, 33, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: ashy-forest-01cfa521e.1.azurestaticapps.net", 32, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Rag. 00 landing.-1 GET ashy-forest-01cfa521e.1.azurestaticapps.net/assets/index-TuOol6EZ.css", 1539, 32, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: ashy-forest-01cfa521e.1.azurestaticapps.net", 32, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
