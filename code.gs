function getSheetFormat(spreadsheet) {
  var headerInfo = spreadsheet.getSheetByName('**List of Product Objects**').getRange('A1:B').getValues();
  var headerList = [];
  for (var i = 0; i < headerInfo.length; i++) {
    if (headerInfo[i][0] == 'Include') {
      var header = headerInfo[i][1].split(":")[0];
      headerList.push(header.substring(1, header.length - 1))
    }
  }
  return headerList;
}
function getAsinList(spreadsheet) {
  var asinInfo = spreadsheet.getSheetByName('Test ASINs').getRange('A1:A').getValues();
  var asinList = [];
  for (var i = 0; i < asinInfo.length; i++) {
    if (asinInfo[i][0]) {
      asinList.push(asinInfo[i][0])
    }
  }
  return asinList;
}
function columnToLetter(column) {
  var temp, letter = '';
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}

function setSheetHeader(spreadsheet, data) {
  var activeSheet = spreadsheet.getSheetByName('product');
  for (var i = 1; i <= data.length; i++) {
    var letter = columnToLetter(i);
    activeSheet.getRange(letter + 1).setValue(data[i - 1])
  }
}

function setProductData(spreadsheet, asinList, headerList) {
  var activeSheet = spreadsheet.getSheetByName('Product');
  var productList = [];
  var keepaUrl = "https://api.keepa.com/product?key=elfq45sechggata6p2i61acisjg9h5dtprjn8rkhifbinbiin5bgrcidm7jud4ao&domain=1&asin=";
  // get data from keepa api by asin & domain
  for (var i = 0; i < asinList.length; i++) {
    var response = UrlFetchApp.fetch(keepaUrl + asinList[i]).getContentText();

    var data = JSON.parse(response);

//    Logger.log(data.products[0])
    productList.push(data.products[0]);
  }

  // set data into "Product" sheet
  for (var i = 0; i < productList.length; i++) {
    for (var j = 0; j < headerList.length; j++) {
      var letter = columnToLetter(j + 1);
      activeSheet.getRange(letter + (i + 2)).setValue(productList[i][headerList[j]]);
    }
  }
}
function main() {
  // get spreadsheet
  var spreadsheet = SpreadsheetApp.openById('1yrzjTw71_LpwWheHKtUE1ql9UVm4WOxBxxjTdku5mQo');

  // get header list from "**List of Product Objects**" sheet
  var headerList = getSheetFormat(spreadsheet);
  // set header in "Product" sheet
  setSheetHeader(spreadsheet, headerList);

  // get asin list from "Test ASINs" sheet
  var asinList = getAsinList(spreadsheet);
  // set data in "Product" sheet
  setProductData(spreadsheet, asinList, headerList)
}