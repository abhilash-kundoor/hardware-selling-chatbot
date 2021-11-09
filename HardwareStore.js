const Order = require("./Order");

let aReturn = [];

const OrderState = Object.freeze({
    WELCOMING:   Symbol("welcoming"),
    PRODUCT:   Symbol("product"),
    QUANTITY:   Symbol("quantity"),
    EXTRAS:  Symbol("extras"),
    RECEIPT:    Symbol("receipt")
});

function validateInput(input, keywords){
    for (var word of keywords){
        if (input.toLowerCase() == word.toLowerCase()){
            return true;
        }}
    aReturn = [];    
    aReturn.push("Sorry wrong option !!");
    var message = "";
    message += `Please select ${keywords.join(" / ")}`;
    aReturn.push(message);
}

module.exports = class LockDownEssentials extends Order{
    constructor(sNumber, sUrl){
        super(sNumber, sUrl);
        this.stateCur = OrderState.WELCOMING;
        this.sInitialInput = "";
        this.sProduct = "";
        this.sItemName = "";
        this.sPrice = 0;
        this.sProductTotalPrice = 0;
        this.sTotalPrice = 0;
        this.sTaxAmount = 0;
        this.sProductList = "";
        this.sQuantity = 0;
        this.sSpecies = "";
        this.sFood = "";
        this.sLitter = "";
        this.sExtras = ""
    }
    handleInput(sInput){
        aReturn = [];
        switch(this.stateCur){
            case OrderState.WELCOMING:
                this.sInitialInput = sInput;
                this.stateCur = OrderState.PRODUCT;
                if(this.sInitialInput.toLowerCase() != "start" && this.sTotalPrice == 0){
                aReturn.push("Welcome to Abhilash's Hardware Store.");
                aReturn.push("Please type in 'Start' to begin");
                }
                if(sInput.toLowerCase() == "start" || this.sTotalPrice != 0){
                  this.stateCur = OrderState.PRODUCT;
                  aReturn.push(`For a list of what we sell tap:`);
                  aReturn.push(`${this.sUrl}/products/${this.sNumber}/`);
                  aReturn.push(`Please type in the selection number of the product you want to buy`);
                  aReturn.push(`1. Wheelbarrow
			                    2. Leaf Blower
                                3. Rake
                                4. Snow Shovel
                                5. Furnace Filter
                                6. Broom
                                7. Dustbin`);
                  break;
                }
                else{
                    this.stateCur = OrderState.WELCOMING;
                }
            break;
            case OrderState.PRODUCT:
                this.sProduct = sInput;
                if (validateInput(this.sProduct, ["1", "2", "3", "4", "5", "6", "7", "8"]))
                {
                    switch(this.sProduct){
                        case "1":
                            this.sItemName = "Wheelbarrow";
                            this.sPrice = 386.99;
                        break;
                        case "2":
                            this.sItemName = "Leaf Blower";
                            this.sPrice = 63.99;
                        break;
                        case "3":
                            this.sItemName = "Rake";
                            this.sPrice = 45.99;
                        break;
                        case "4":
                            this.sItemName = "Snow Shovel";
                            this.sPrice = 42.99;
                        break;
                        case "5":
                            this.sItemName = "Furnace Filter";
                            this.sPrice = 89.99;
                        break;
                        case "6":
                            this.sItemName = "Broom";
                            this.sPrice = 25.99;
                        break;
                        case "7":
                            this.sItemName = "Dustbin";
                            this.sPrice = 19.99;
                        break;
                        case "8":
                            this.stateCur = OrderState.EXTRAS;
                            aReturn.push(`Would you like to buy any of the following items ?
                                          if not, select 5 to generate receipt`);
                            aReturn.push(`1. Simoniz Car Cloth
                                          2. Geeky Head Lamp
                                          3. Ear Bud
                                          4. Kettle Descaler
                                          5. PAYMENT`
                                        );
                        break;
                    }
                    if (this.sProduct != "8"){
                        this.stateCur = OrderState.QUANTITY;
                        aReturn.push(`How many ${this.sItemName}s would you like to buy?`);
                    }
                }
            break;
            case OrderState.QUANTITY:
                this.sQuantity = sInput;
                if (validateInput(this.sProduct, ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]))
                {
                    this.sProductTotalPrice = this.sPrice * this.sQuantity;
                    this.sTotalPrice += this.sProductTotalPrice;
                    this.sProductList += `${this.sItemName} ($${this.sPrice}) * ${this.sQuantity} = $${this.sProductTotalPrice.toFixed(2)}\n`
                    this.stateCur = OrderState.REORDER;
                    aReturn.push(`Select product to continue purchasing`);
                    aReturn.push(`Press 8 for checkout`);
                    aReturn.push(`1. Wheelbarrow
                                  2. Leaf Blower
                                  3. Rake
                                  4. Snow Shovel
                                  5. Furnace Filter
                                  6. Broom
                                  7. Dustbin
                                  8. CHECKOUT`);
                    this.stateCur = OrderState.PRODUCT;
                }
            break;
            case OrderState.EXTRAS:
                this.sExtras = sInput;
                if (validateInput(this.sExtras, ["1", "2", "3", "4", "5"]))
                {
                    switch(this.sExtras){
                        case "1":
                            this.sItemName = "Simoniz Car Cloth";
                            this.sPrice = 23.99;
                        break;
                        case "2":
                            this.sItemName = "Geeky Head Lamp";
                            this.sPrice = 21.99;
                        break;
                        case "3":
                            this.sItemName = "Ear Bud";
                            this.sPrice = 12.99;
                        break;
                        case "4":
                            this.sItemName = "Kettle Descale";
                            this.sPrice = 10.99;
                        break;
                    }
                    if (this.sExtras != "5"){
                        this.sTotalPrice += this.sPrice;
                        this.sProductList += `${this.sItemName} ($${this.sPrice}) * 1 = $${this.sPrice.toFixed(2)}\n`
                    }
                    this.stateCur = OrderState.RECEIPT;
                    this.sTaxAmount = this.sTotalPrice * 0.13;
                    this.sTotalPrice += this.sTaxAmount;
                    aReturn.push(`Receipt:\n ${this.sProductList}\n
                                  Tax @ 13% = $${this.sTaxAmount.toFixed(2)}\n
                                  Total = $${this.sTotalPrice.toFixed(2)}`);
                    aReturn.push(`Payable amount is $${this.sTotalPrice.toFixed(2)}`);
                    aReturn.push(`We will text you from 519-222-2222 when your order is ready or if we have questions.`)
                    this.isDone(true);
                }
                break;
        }
        return aReturn;
    }
    renderForm(){
      // your client id should be kept private
      return(`
      <html>
   <head>
      <meta content="text/html; charset=UTF-8" http-equiv="content-type">
      <style type="text/css">ol{margin:0;padding:0}table td,table th{padding:0}.c3{border-right-style:solid;padding:5pt 5pt 5pt 5pt;border-bottom-color:#000000;border-top-width:1pt;border-right-width:1pt;border-left-color:#000000;vertical-align:top;border-right-color:#000000;border-left-width:1pt;border-top-style:solid;border-left-style:solid;border-bottom-width:1pt;width:151.4pt;border-top-color:#000000;border-bottom-style:solid}.c5{border-right-style:solid;padding:5pt 5pt 5pt 5pt;border-bottom-color:#000000;border-top-width:1pt;border-right-width:1pt;border-left-color:#000000;vertical-align:top;border-right-color:#000000;border-left-width:1pt;border-top-style:solid;border-left-style:solid;border-bottom-width:1pt;width:78pt;border-top-color:#000000;border-bottom-style:solid}.c1{border-right-style:solid;padding:5pt 5pt 5pt 5pt;border-bottom-color:#000000;border-top-width:1pt;border-right-width:1pt;border-left-color:#000000;vertical-align:top;border-right-color:#000000;border-left-width:1pt;border-top-style:solid;border-left-style:solid;border-bottom-width:1pt;width:222pt;border-top-color:#000000;border-bottom-style:solid}.c18{color:#000000;font-weight:400;text-decoration:none;vertical-align:baseline;font-size:26pt;font-family:"Arial";font-style:normal}.c0{color:#000000;font-weight:700;text-decoration:none;vertical-align:baseline;font-size:14pt;font-family:"Arial";font-style:normal}.c16{padding-top:18pt;padding-bottom:6pt;line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}.c11{padding-top:0pt;padding-bottom:3pt;line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}.c10{color:#000000;font-weight:400;text-decoration:none;vertical-align:baseline;font-size:11pt;font-family:"Arial";font-style:normal}.c13{color:#000000;font-weight:400;text-decoration:none;vertical-align:baseline;font-size:15pt;font-family:"Arial";font-style:normal}.c8{color:#000000;font-weight:400;text-decoration:none;vertical-align:baseline;font-size:14pt;font-family:"Arial";font-style:normal}.c4{color:#000000;font-weight:700;text-decoration:none;vertical-align:baseline;font-size:19pt;font-family:"Arial";font-style:normal}.c15{padding-top:0pt;padding-bottom:0pt;line-height:1.15;orphans:2;widows:2;text-align:left;height:11pt}.c17{border-spacing:0;border-collapse:collapse;margin-right:auto}.c6{padding-top:0pt;padding-bottom:0pt;line-height:1.0;text-align:left}.c9{background-color:#ffffff;max-width:451.4pt;padding:72pt 72pt 72pt 72pt}.c2{height:22.4pt}.c7{height:23.9pt}.c12{font-weight:700}.c14{height:0pt}.title{padding-top:0pt;color:#000000;font-size:26pt;padding-bottom:3pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}.subtitle{padding-top:0pt;color:#666666;font-size:15pt;padding-bottom:16pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}li{color:#000000;font-size:11pt;font-family:"Arial"}p{margin:0;color:#000000;font-size:11pt;font-family:"Arial"}h1{padding-top:20pt;color:#000000;font-size:20pt;padding-bottom:6pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}h2{padding-top:18pt;color:#000000;font-size:16pt;padding-bottom:6pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}h3{padding-top:16pt;color:#434343;font-size:14pt;padding-bottom:4pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}h4{padding-top:14pt;color:#666666;font-size:12pt;padding-bottom:4pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}h5{padding-top:12pt;color:#666666;font-size:11pt;padding-bottom:4pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}h6{padding-top:12pt;color:#666666;font-size:11pt;padding-bottom:4pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;font-style:italic;orphans:2;widows:2;text-align:left}</style>
   </head>
   <body class="c9">
      <p class="c11 title" id="h.4712wntzhdlv"><span class="c12">For Curbside pickup:</span></p>
      <h2 class="c16" id="h.24bg4p86w53l"><span class="c4">Text &ldquo;Hi&rdquo; or &ldquo;Hello&rdquo; to 519-111-1111</span></h2>
      <p class="c15"><span class="c10"></span></p>
      <a id="t.232dc669fa83cf316cc054882fcd8f6d54c87e08"></a><a id="t.0"></a>
      <table class="c17">
         <tbody>
            <tr class="c7">
               <td class="c5" colspan="1" rowspan="1">
                  <p class="c6"><span class="c0">Selection</span></p>
               </td>
               <td class="c1" colspan="1" rowspan="1">
                  <p class="c6"><span class="c0">Products</span></p>
               </td>
               <td class="c3" colspan="1" rowspan="1">
                  <p class="c6"><span class="c0">Price</span></p>
               </td>
            </tr>
            <tr class="c14">
               <td class="c5" colspan="1" rowspan="1">
                  <p class="c6"><span class="c8">1</span></p>
               </td>
               <td class="c1" colspan="1" rowspan="1">
                  <p class="c6"><span class="c8">Wheelbarrows</span></p>
               </td>
               <td class="c3" colspan="1" rowspan="1">
                  <p class="c6"><span class="c8">$ 386.99</span></p>
               </td>
            </tr>
            <tr class="c14">
               <td class="c5" colspan="1" rowspan="1">
                  <p class="c6"><span class="c8">2</span></p>
               </td>
               <td class="c1" colspan="1" rowspan="1">
                  <p class="c6"><span class="c8">Leaf Blowers</span></p>
               </td>
               <td class="c3" colspan="1" rowspan="1">
                  <p class="c6"><span class="c8">$ 63.99</span></p>
               </td>
            </tr>
            <tr class="c7">
               <td class="c5" colspan="1" rowspan="1">
                  <p class="c6"><span class="c8">3</span></p>
               </td>
               <td class="c1" colspan="1" rowspan="1">
                  <p class="c6"><span class="c8">Rakes</span></p>
               </td>
               <td class="c3" colspan="1" rowspan="1">
                  <p class="c6"><span class="c8">$ 45.99</span></p>
               </td>
            </tr>
            <tr class="c7">
               <td class="c5" colspan="1" rowspan="1">
                  <p class="c6"><span class="c8">4</span></p>
               </td>
               <td class="c1" colspan="1" rowspan="1">
                  <p class="c6"><span class="c8">Snow Shovels</span></p>
               </td>
               <td class="c3" colspan="1" rowspan="1">
                  <p class="c6"><span class="c8">$ 42.99</span></p>
               </td>
            </tr>
            <tr class="c14">
               <td class="c5" colspan="1" rowspan="1">
                  <p class="c6"><span class="c8">5</span></p>
               </td>
               <td class="c1" colspan="1" rowspan="1">
                  <p class="c6"><span class="c8">Furnace Filters</span></p>
               </td>
               <td class="c3" colspan="1" rowspan="1">
                  <p class="c6"><span class="c8">$ 89.99</span></p>
               </td>
            </tr>
            <tr class="c14">
               <td class="c5" colspan="1" rowspan="1">
                  <p class="c6"><span class="c8">6</span></p>
               </td>
               <td class="c1" colspan="1" rowspan="1">
                  <p class="c6"><span class="c8">Brooms</span></p>
               </td>
               <td class="c3" colspan="1" rowspan="1">
                  <p class="c6"><span class="c8">$ 25.99</span></p>
               </td>
            </tr>
            <tr class="c2">
               <td class="c5" colspan="1" rowspan="1">
                  <p class="c6"><span class="c8">7</span></p>
               </td>
               <td class="c1" colspan="1" rowspan="1">
                  <p class="c6"><span class="c8">Dustbins</span></p>
               </td>
               <td class="c3" colspan="1" rowspan="1">
                  <p class="c6"><span class="c8">$ 19.99</span></p>
               </td>
            </tr>
         </tbody>
      </table>
      <p class="c15"><span class="c13"></span></p>
   </body>
</html>`);
    }
}
