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

    function findParentTable(element) {
        if (element.localName == "table") {
            return element;
        } else {
            if (element.parentNode) {
                return findParentTable(element.parentNode);
            } else {
                return null;
            }
        }
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
                var table = findParentTable(this);
                setCellPosition(table);
                changeColorVertical(table, this.x);
                var strValue = copyColumnValues(table, this.x);
                
                chrome.runtime.sendMessage({method: "setLocalStorage", key: strValue}, function(response) {
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
