import React from "react";

function orderBySiteList(fileContent) {
    var bufferSiteList = [];
    var bufferListOrdered  = [];

    fileContent.forEach(element => {
        if (bufferSiteList.findIndex((cursor) => cursor == element.site) < 0)
            bufferSiteList.push(element.site);
    });
    console.log(JSON.stringify(bufferSiteList));
    bufferSiteList.forEach(element => {
        fileContent.forEach(session => {
            if (session.site == element)
                bufferListOrdered.push(session);
        });
    });
    console.log(JSON.stringify(bufferListOrdered))
    return bufferListOrdered;
}

export default orderBySiteList;