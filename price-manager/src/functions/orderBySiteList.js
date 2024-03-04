import React from "react";

function orderBySiteList(fileContent, bufferListSite) {
    var bufferSessionList = [];
    bufferListSite.forEach( function (element) {
        fileContent.forEach(session => {
            if (session.site == element.name) {
                bufferSessionList.push(session);
            }
        });
    });
    return bufferSessionList;
}

export default orderBySiteList;