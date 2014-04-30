(function () {
    function setAllCells(table, func, etc) {
        for (var i = 0; i < table.rows.length; i++) {
            var cells = table.rows[i].cells;
            for (var k = 0; k < cells.length; k++) {
                var cell = cells[k];
                func(cell, k, i, etc);
            }
        }
    }

    function setCellPosition(table) {
        setAllCells(table, function (cell, k, i, etc) {
            cell.x = k;
            cell.y = i;
        }, 0);
    }

    function changeColorVertical(table, nk) {
        setAllCells(table, function (cell, k, i, nk) {
            if (k == nk) {
                cell.style.backgroundColor = 'gray';
            } else {
                cell.style.backgroundColor = '';
            }
        }, nk);
    }

    function copyColumnValues(table, nk) {
        var lastValue = "";
        setAllCells(table, function (cell, k, i, nk) {
            if (k == nk) {
                lastValue += cell.innerText;
                lastValue += "\n";
            } 
        }, nk);
        
        return lastValue;
    }

    function attachHighlighting(table) {
        setAllCells(table, function (cell, k, i, nk) {
            cell.onclick = function () {
                var tables = document.getElementsByTagName("table");
				var strValue = "";
                for (var i = 0; i < tables.length; i++) {
                    changeColorVertical(tables[i], -1);
                    tables[i].selectedColumnNo = -1;
                }

                var table = this.parentElement.parentNode;
                if (table.localName == "tbody" ) {
                    table = table.parentNode;
                }
                changeColorVertical(table, this.x);
                strValue = copyColumnValues(table, this.x);
                
                chrome.runtime.sendMessage({method: "getLocalStorage", key: strValue}, function(response) {
                    console.log(response.data);
                });
            }
        }, 0);
    }

    function changeTableFunction() {
        var tables = document.getElementsByTagName("table");
        for (var i = 0; i < tables.length; i++) {
            attachHighlighting(tables[i]);
        }
    }

    function copyValuesFromTable() {
        var tables = document.getElementsByTagName("table");
        for (var i = 0; i < tables.length; i++) {
            table = tables[i];
            if (table.selectedColumnNo != -1) {
                return copyColumnValues(table, table.selectedColumnNo);
            }
        }
    }

    // initialize
    var tables = document.getElementsByTagName("table");
    for (var i = 0; i < tables.length; i++) {
        tables[i].selectedColumnNo = -1;
        setCellPosition(tables[i]);
    }

    // handle event
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.greeting == "enable") {
                changeTableFunction();
                sendResponse({});
            } else if (request.greeting == "copy") {
                sendResponse({}); 
            } else {
                sendResponse({}); 
            }
        }
    );

})();