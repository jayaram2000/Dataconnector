 //@OnlyCurrentDoc
function onOpen() {

var ui = SpreadsheetApp.getUi();
  ui.createMenu('Shopify Data')
     .addItem('Data Connector','showSidebar')
      .addToUi();
}

function  showSidebar()
{
 var widget = HtmlService.createHtmlOutputFromFile("sidebar.html");
  widget.setTitle("Data Connetor to shopify");
  SpreadsheetApp.getUi().showSidebar(widget);

}
//change variable names to match those in code
function connectToShopifyData(param) {
   SpreadsheetApp.getActive().toast("Fetching details from shopify.");
 
    //change draft_orders to orders
   
  var last=0;
  var data;
  let APIkey =param[0];// 
  let password =param[1];// 
  let storeName=param[2]; //
  //To fetch all orders 
    while(true)
   {
      let url = "https://"+storeName+".myshopify.com/admin/api/2020-10/draft_orders.json?query=&limit=250&since_id="+last+"";
     
     
      let response = UrlFetchApp.fetch(url, {
        method: "GET",
     
        contentType: "application/json",
        headers: {
            "Authorization": "Basic " + Utilities.base64Encode(APIkey + ":" + password)
        }
      });
      let json = response.getContentText();
      Logger.log(json);
      tmp_data=JSON.parse(json)
          if (typeof data === 'undefined') {
            data=json;
          }
          else
          {
            data=JSON.stringify(JSON.parse(data).concat(JSON.parse(json)));
          }

  
    last+=Object.keys(tmp_data.draft_orders).length-1;
    if(Object.keys(tmp_data.draft_orders).length<250)
      break;
   }
   


    
     
   
  var data1=JSON.parse(data);
 
  
    saveData(data1,param);
   

}

function saveData(data,fields)
{
  
  
   var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var output=[]
  //change draft_orders to orders
  
  var totalorders = Object.keys(data.draft_orders).length;
   sheet.getRange(1,1,totalorders+500,10).clearContent();
   var tmp1=[];
   for(var k=3;k<fields.length;k++)
   {
     tmp1.push(fields[k]);
   }
   sheet.appendRow(tmp1);
   var st;
   for ( var i = 0; i < totalorders; i++)
    {
      
      let tmp=[];
      var st=data.draft_orders[i];

      for( var j=3;j<fields.length;j++)
      {
       tmp.push(st[fields[j]]);
      }
       
      
      //changes to be made
      // SpreadsheetApp.getActive().toast(tmp);
    // sheet.appendRow([data["draft_orders"][i]["name"],data["draft_orders"][i]["total_price"]]);
     sheet.appendRow(tmp);
    }

   


}
