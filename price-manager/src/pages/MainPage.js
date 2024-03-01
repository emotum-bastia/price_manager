import React, { useState, useEffect } from 'react';
import SessionBox from '../components/SessionBox';
import orderBySiteList from '../functions/orderBySiteList';
import orderByConsommationList from '../functions/orderByConsommationList';

const FileViewer = () => {
  const [fileContent, setFileContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const [sessionDiv, setSessionDiv] = useState([]);

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        var buffer = event.target.result.split('\n');
        buffer.shift();
        var final = [];
        buffer.forEach(element => {
            var splited = element.split(',');
            var computePrice = Number(splited[16]).toFixed(2) * 0.55;
            var difference = Number(splited[19]).toFixed(2) - computePrice;

            final.push({
                site: splited[1].replace("\"", "").replace("\"", ""),
                date:splited[12].replace("\"", "").replace("\"", ""),
                consommation: Number(splited[16]),
                price: Number(splited[19]),
                computePrice: computePrice,
                difference: difference
            });
        });
        setFileContent(final);
        var sessionBufferDiv = [];

        final.forEach(
          element =>
          sessionBufferDiv.push(<SessionBox
            site={element.site}
            date={element.date}
            consommation={element.consommation}
            price={element.price}
            computePrice={element.computePrice.toFixed(2)}
            difference={element.difference.toFixed(2)} 
          />)
        );
        setSessionDiv(sessionBufferDiv);
      };

      reader.readAsText(selectedFile);
    }
  }, [selectedFile]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const orderBySite = () => {
    var bufferNewList = orderBySiteList(fileContent);
    var sessionBufferDiv = [];

    bufferNewList.forEach(
      element =>
      sessionBufferDiv.push(<SessionBox
        site={element.site}
        date={element.date}
        consommation={element.consommation}
        price={element.price}
        computePrice={element.computePrice.toFixed(2)}
        difference={element.difference.toFixed(2)} 
      />));
    setSessionDiv(sessionBufferDiv);
  };

  const orderByConsommation = () => {
    console.log("CONSOMMATION");
    var bufferNewList = orderByConsommationList(fileContent);
    var sessionBufferDiv = [];

    bufferNewList.forEach(
      element =>
      sessionBufferDiv.push(<SessionBox
        site={element.site}
        date={element.date}
        consommation={element.consommation}
        price={element.price}
        computePrice={element.computePrice.toFixed(2)}
        difference={element.difference.toFixed(2)} 
      />));
    setSessionDiv(sessionBufferDiv);
    console.log("END");
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />

      <table className="header_table" style={styles.header_table}>
        <tr>
          <td width="40%" className="btn" style={styles.btn} onClick={orderBySite}>site</td>
          <td width="16%">date</td>
          <td width="12%" className="btn" style={styles.btn} onClick={orderByConsommation}>consommation en kWh</td>
          <td width="10%">prix en €</td>
          <td width="10%">prix théorique en €</td>
          <td width="10%">différence en €</td>
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
  }
}
export default FileViewer;