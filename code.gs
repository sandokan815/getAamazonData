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
function columnToLetter(column) {
  var temp, letter = '';
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter + 1;
}

function setSheetHeader(spreadsheet, data) {
  var activeSheet = spreadsheet.getSheetByName('product');
  for (var i = 1; i <= data.length; i++) {
    var letter = columnToLetter(i);
    activeSheet.getRange(letter).setValue(data[i-1])
  }

}
function main() {
  var spreadsheet = SpreadsheetApp.openById('1yrzjTw71_LpwWheHKtUE1ql9UVm4WOxBxxjTdku5mQo');
  var headerList = getSheetFormat(spreadsheet);
  setSheetHeader(spreadsheet, headerList);

}