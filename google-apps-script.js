// Google Apps Script code to be deployed as a web app

function doGet(e) {
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName('Products'); // Sheet for products
    if (!sheet) {
      sheet = doc.insertSheet('Products');
      sheet.appendRow(['id', 'name', 'unit', 'price', 'image']);
      sheet.appendRow(['SP001', 'Sản phẩm A', 'Cái', 100000, 'https://via.placeholder.com/50']);
      sheet.appendRow(['SP002', 'Sản phẩm B', 'Hộp', 250000, 'https://via.placeholder.com/50']);
      sheet.appendRow(['SP003', 'Sản phẩm C', 'Chiếc', 50000, 'https://via.placeholder.com/50']);
    }
    
    var data = sheet.getDataRange().getValues();
    var headers = data.shift();
    var products = data.map(function(row) {
      var product = {};
      headers.forEach(function(header, index) {
        product[header] = row[index];
      });
      return product;
    });

    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success', 'data': products }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName('Orders'); // Make sure you have a sheet named 'Orders'
    if (!sheet) {
      sheet = doc.insertSheet('Orders');
      // Set header row if the sheet is newly created
      sheet.appendRow(['Timestamp', 'Họ và tên', 'Email', 'Số điện thoại', 'Xã/phường', 'Quận/huyện', 'Tỉnh/TP', 'Địa chỉ chi tiết', 'Ghi chú', 'Sản phẩm', 'Tổng trước VAT', 'Chiết khấu (%)', 'Chiết khấu (VND)', 'VAT (%)', 'Tổng sau VAT']);
    }

    var data = JSON.parse(e.postData.contents);

    // Flatten the cart items into a string
    var cartItemsString = data.cart.map(function(item) {
      return item.name + ' (x' + item.quantity + ')';
    }).join(', ');

    var newRow = [
      new Date(),
      data['ho-ten'],
      data['email'],
      data['so-dien-thoai'],
      data['xa-phuong'],
      data['quan-huyen'],
      data['tinh-tp'],
      data['dia-chi-chi-tiet'],
      data['ghi-chu'],
      cartItemsString,
      data.subtotal,
      data.discountPercentage,
      data.discountAmount,
      data.vatPercentage,
      data.total
    ];

    sheet.appendRow(newRow);

    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}