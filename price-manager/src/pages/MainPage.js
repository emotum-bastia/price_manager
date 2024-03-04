import React, { useState, useEffect } from 'react';
import SessionBox from '../components/SessionBox';
import orderBySiteList from '../functions/orderBySiteList';
import orderByConsommationList from '../functions/orderByConsommationList';
import orderByPriceList from '../functions/orderByPrice';
import orderByDifferenceList from '../functions/orderByDifferenceList';
import orderByDateList from '../functions/orderByDateList';
import logo from "./../assets/logo_e.png"
import Popup from "reactjs-popup";

function compareString(first, second)
{
  first = first.toLowerCase();
  second = second.toLowerCase();

  return (first < second) ? -1 : (first > second) ? 1 : 0;
}

const FileViewer = () => {
  const [fileContent, setFileContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const [listSite,  setListSite] = useState([]);

  const [sessionDiv, setSessionDiv] = useState([]);
  const [listSiteBtn, setListSiteBtn] = useState([]);
  var rotation = false;

  const setListDiv = (bufferNewList) => {
    var sessionBufferDiv = [];

    bufferNewList.forEach(
      function (element) {
        if (!element.difference || !element.computePrice) return;
        var place = listSite.find(function (cursor) { return cursor.name == element.site});
        console.log("place 1->" + JSON.stringify(place));
        if (place) { 
          if (place.hide) return;
        }
        sessionBufferDiv.push(<SessionBox
          site={element.site}
          date={element.date}
          consommation={element.consommation}
          price={element.price}
          computePrice={element.computePrice.toFixed(2)}
          difference={element.difference.toFixed(2)} 
        />)
    });
      
    setSessionDiv(sessionBufferDiv);
  }

  

  useEffect(() => {

    async function  changeHideSite (range, listGot) {
      console.log("changement + range " + range);
      var bufferSiteList = [];
      for (var i = 0; i < listGot.length; i++) {
      console.log("i: " + i);
      bufferSiteList.push({
          name: listGot[i].name,
          hide: i != range ? listGot[i].hide : !listGot[i].hide
        });
      }
      bufferSiteList.sort(function(first, second) {
        return compareString(first.name, second.name);
      });
      console.log("buffer list ->\n\n" + JSON.stringify(bufferSiteList));
      setListSite(bufferSiteList);
  
      var bufferListBtn = [];
      var range = 0;
      bufferSiteList.forEach(function () {
        var i = range;
        bufferListBtn.push(
          <div class="check_list" style={styles.check_list}>
            <input
              type="checkbox"
              id={bufferSiteList[range].name}
              names={bufferSiteList[range].name}
              checked={!bufferSiteList[range].hide}
              onClick={() => changeHideSite(i, bufferSiteList)}
            />
            <label for={bufferSiteList[range].name}>{bufferSiteList[range].name}</label>
          </div>);
          range++;
      });
      setListSiteBtn(bufferListBtn);
  
      var sessionBufferDiv = [];
      var bufferNewList = fileContent;
      fileContent.forEach(
        function (element) {
          if (!element.difference || !element.computePrice) return;
          var place = bufferSiteList.find(function (cursor) { return cursor.name == element.site});
          console.log("place->" + JSON.stringify(place));
          if (!place) return;
          if (place.hide) return;
          sessionBufferDiv.push(<SessionBox
            site={element.site}
            date={element.date}
            consommation={element.consommation}
            price={element.price}
            computePrice={element.computePrice.toFixed(2)}
            difference={element.difference.toFixed(2)} 
          />)
      });
        
      setSessionDiv(sessionBufferDiv);
    }


    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        var buffer = event.target.result.split('\n');
        buffer.shift();
        var final = [];
        buffer.forEach(element => {
            if (!element) return;
            var splited = element.split(',');
            if (!splited[1] || !splited[12] || !splited[19] || !splited) return;

            var computePrice = Number(splited[16]).toFixed(2) * 0.55;
            var difference = Number(splited[19]).toFixed(2) - computePrice;

            final.push({
                site: splited[1].replace("\"", "").replace("\"", ""),
                date:splited[12].replace("\"", "").replace("\"", ""),
                timestamp: Date.parse(splited[12].replace("\"", "").replace("\"", "")),
                consommation: Number(splited[16]),
                price: Number(splited[19]),
                computePrice: computePrice,
                difference: difference
            });
        });
        setFileContent(final);
        var sessionBufferDiv = [];
        var bufferSiteList = [];
        final.forEach(element => {
          if (bufferSiteList.findIndex((cursor) => cursor.name == element.site) < 0)
            bufferSiteList.push({name: element.site, hide: false});
        });
        bufferSiteList.sort(function(first, second) {
          return compareString(first.name, second.name);
        });
        setListSite(bufferSiteList);

        var bufferListBtn = [];
        var range = 0;
        bufferSiteList.forEach(function () {
          var i = range;
          bufferListBtn.push(
            <div class="check_list" style={styles.check_list}>
              <input
                type="checkbox"
                id={bufferSiteList[range].name}
                names={bufferSiteList[range].name}
                checked={!bufferSiteList[range].hide}
                onClick={() => changeHideSite(i, bufferSiteList)}
              />
              <label for={bufferSiteList[range].name}>{bufferSiteList[range].name}</label>
            </div>);
            range++;
            console.log(range);
        });
        setListSiteBtn(bufferListBtn);
        setListDiv(final);
      };

      reader.readAsText(selectedFile);
    }

  }, [selectedFile]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const orderBySite = () => {
    var bufferNewList = orderBySiteList(fileContent, listSite);
    setListDiv(bufferNewList);
  };

  const orderBySiteRevert = () => {
    var bufferNewList = orderBySiteList(fileContent, listSite);
    bufferNewList.reverse();
    setListDiv(bufferNewList);
  };

  const orderByConsommation = () => {
    var bufferNewList = orderByConsommationList(fileContent);
    setListDiv(bufferNewList);
  };
  const orderByConsommationRevert = () => {
    var bufferNewList = orderByConsommationList(fileContent);
    bufferNewList.reverse();
    setListDiv(bufferNewList);
  };

  const orderByPrice = () => {
    var bufferNewList = orderByPriceList(fileContent);
    setListDiv(bufferNewList);
  }

  const orderByPriceRevert = () => {
    var bufferNewList = orderByPriceList(fileContent);
    bufferNewList.reverse();
    setListDiv(bufferNewList);
  }

  const orderByDifference = () => {
    var bufferNewList = orderByDifferenceList(fileContent);
    setListDiv(bufferNewList);
  }

  const orderByDifferenceRevert = () => {
    var bufferNewList = orderByDifferenceList(fileContent);
    bufferNewList.reverse();
    setListDiv(bufferNewList);
  }

  const orderByDate = () => {
    var bufferNewList = orderByDateList(fileContent);
    setListDiv(bufferNewList);
  }

  const orderByDateRevert = () => {
    var bufferNewList = orderByDateList(fileContent);
    bufferNewList.reverse();
    setListDiv(bufferNewList);
  }

  return (
    <div>
      <img src={logo} alt='logo_e_emotum' className={'App-logo ' + (rotation ? 'App-logo-rotation' : '')} style={{
        margin: "20px", backgroundColor: "white", borderRadius: "50%"
      }}/>
      <input type="file" onChange={handleFileChange} />

      <table className="header_table" style={styles.header_table}>
        <tr>
          <td width="40%">
            site
            <button className="btn" style={styles.btn} onClick={orderBySite}>˄</button>
            <button className="btn" style={styles.btn} onClick={orderBySiteRevert}>˅</button>
            <Popup trigger={<button> choisir site</button>} arrow={false} position="bottom">
              <div className='popup' style={styles.popup}>
                {listSiteBtn}
              </div>
            </Popup>
          </td>
          <td width="16%">
            date
            <button className="btn" style={styles.btn} onClick={orderByDate}>˄</button>
            <button className="btn" style={styles.btn} onClick={orderByDateRevert}>˅</button>
          </td>
          <td width="12%">
            consommation en kWh
            <button className="btn" style={styles.btn} onClick={orderByConsommation}>˄</button>
            <button className="btn" style={styles.btn} onClick={orderByConsommationRevert}>˅</button>
          </td>
          <td width="10%">
            prix en €
            <button className="btn" style={styles.btn} onClick={orderByPrice}>˄</button>
            <button className="btn" style={styles.btn} onClick={orderByPriceRevert}>˅</button>
          </td>
          <td width="10%">prix théorique en €</td>
          <td width="10%">
            différence en €
            <button className="btn" style={styles.btn} onClick={orderByDifference}>˄</button>
            <button className="btn" style={styles.btn} onClick={orderByDifferenceRevert}>˅</button>
          </td>
          <td width="2%"></td>
        </tr>
      </table>

      {sessionDiv}
    </div>
  );
};


const styles = {
  header_table: {
    width: "77vw",
    padding: "0.25rem 1rem 0.25rem 1rem",
    margin: "1rem",
    backgroundColor: "#a1a1a1",
    textAlign: "center"
  },
  popup: {
    backgroundColor: "#00000070",
    height: "50vh",
    width: "25vw",
    padding: "1rem",
    overflowY: "scroll"
  },
  check_list: {
    backgroundColor: "white",
    padding: "0.5rem",
    margin: "0.25rem"
  }
}
export default FileViewer;