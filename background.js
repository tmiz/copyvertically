
function enable(info, tab) {
    chrome.tabs.sendMessage(tab.id, {greeting: "enable"}, function(response) {
        console.log(response.farewell);
    });
}

var copyTextToClipboard = function(txt){
        var copyArea = $("<textarea/>");
        copyArea.text(txt);
        $("body").append(copyArea);
        copyArea.select();
        document.execCommand("copy");
        copyArea.remove();
}

function doCopy(info, tab) {
    copyTextToClipboard(localStorage['copyValue']);
}

var parent = chrome.contextMenus.create({
    "title": "Copy vertically on table"
});

var child1 = chrome.contextMenus.create({
    "title": "Enable",
    "parentId": parent,
    "onclick": enable
});

var child2 = chrome.contextMenus.create({
    "title": "Copy Values",
    "parentId": parent,
    "onclick": doCopy
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getLocalStorage") {
        localStorage['copyValue'] = request.key;
        sendResponse({});
    }
    else
      sendResponse({});
});
