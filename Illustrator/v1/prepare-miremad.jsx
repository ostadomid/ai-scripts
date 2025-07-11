(function () {
  var DAYS = [
    "شنبه",
    "یکشنبه",
    "دوشنبه",
    "سه شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه",
  ];
  var DAYS_NUMBER=[]
  for(var i=1;i<32;i++) {
    DAYS_NUMBER.push(i);
  }

  const content = app.activeDocument.layers.getByName("Content");
  const template = app.activeDocument.layers.getByName("Template");

  // var groups = [];
  // var hasPhone = false;
  // var contentFirstnames;
  // var contentLastnames;
  // var contentPhone;

  // for (var i = 0; i < content.pageItems.length; i++) {
  //   // We do a filter and keep only GroupItems without name. So poem-xxx layer is left out
  //   if (content.pageItems[i].name === "") {
  //     groups.push(content.pageItems[i]);
  //   }
  // }

  // for (var i = 0; i < groups.length; i++) {
  //   var scale = 60;
  //   if (i === groups.length - 1 || i === groups.length - 2) {
  //     scale = 100;
  //     if (!contentFirstnames) {
  //       contentFirstnames = groups[i];
  //     } else {
  //       contentLastnames = groups[i];
  //     }
  //   } else if (i === groups.length - 5) {
  //     scale = 65;
  //     hasPhone = true;
  //     contentPhone = groups[i];
  //   }
  //   groups[i].resize(scale, scale);
  // }

  // // TODO: Show a dialog asking user for auto algining firstNames, lastNames & phone

  // var template = app.activeDocument.layers.getByName("Template");
  // if (template) {
  //   const firstNames = template.pageItems.getByName("firstNames");
  //   const lastNames = template.pageItems.getByName("lastNames");
  //   const phone = template.pageItems.getByName("phone");
  //   const rsvp = template.pageItems.getByName("rsvp");

  //   if (firstNames) {
  //     contentFirstnames.top = firstNames.top;
  //     contentFirstnames.left =
  //       firstNames.left + firstNames.width / 2 - contentFirstnames.width / 2;
  //     firstNames.hidden = true;
  //   }
  //   if (lastNames) {
  //     contentLastnames.top = lastNames.top;
  //     contentLastnames.left =
  //       lastNames.left + lastNames.width / 2 - contentLastnames.width / 2;
  //       lastNames.hidden = true;
  //     }
  //     if(hasPhone){
  //     contentPhone.top = phone.top;
  //     contentPhone.left =
  //       phone.left + phone.width / 2 - contentPhone.width / 2;

  //     phone.hidden=true;
  //   }else{
  //     phone.hidden=true;
  //     rsvp.hidden=true;
  //   }
  // }
  var w = new Window("dialog", "Wedding Date");
  var p = w.add("panel", undefined);
  var g = p.add("group");
  
  var dayNumber = g.add("dropdownlist", undefined, DAYS_NUMBER);
  dayNumber.selection = 0;
  g.add("statictext", undefined, "چندم");

  var day = g.add("dropdownlist", undefined, DAYS);
  day.selection = DAYS[0];
  g.add("statictext", undefined, "روز");
    



  var btn = p.add("button", undefined, "ایجاد");
  btn.onClick = function () {
    for (var i = 0; i < DAYS.length; i++) {
      template.pageItems.getByName(DAYS[i]).hidden = true;
    }
    
    var dayItem = template.pageItems.getByName(day.selection);
    if (dayItem) {
      dayItem.hidden = false;
    }
    alert(dayNumber.selection)    ;
    w.close(0);
  };

  w.show();
})();
