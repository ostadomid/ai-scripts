function getConfig() {
  var configFile = File(Folder.myDocuments + "//config.txt");
  configFile.encoding = "UTF-8";
  configFile.open("r");
  var config = { poems: "", date: "" };
  config.poems = configFile.readln();
  config.date = configFile.readln();
  configFile.close();
  return config;
}

function insertPoem(where) {
  var config = getConfig();
  var poemsFile = File(config.poems);
  if (poemsFile.exists) {
    const poems = app.open(poemsFile);
    $.sleep(1000);
    const poemCode = prompt("Poem Code:", "100");
    const poem = poems.pageItems.getByName(poemCode);
    if (poem) {
      const item = poem.duplicate(where, ElementPlacement.PLACEATBEGINNING);
    }
    poems.close();
    return poemCode;
  }
}

function centerAInB(a, b) {
  a.translate(b.position[0] - a.position[0], b.position[1] - a.position[1]);
  var deltaX = (b.width - a.width) / 2;
  var deltaY = (b.height - a.height) / 2;

  a.translate(deltaX, -deltaY);
}

function resetDate(dateDocument) {
  var layers = [
    "وسط - روز",
    "راست - روز",
    "راست - ساعت",
    "آدرسها",
    "وسط - ماه",
  ];

  for (var i = 0; i < layers.length; i++) {
    var pageItems = dateDocument.layers.getByName(layers[i]).pageItems;
    for (var j = 0; j < pageItems.length; j++) {
      pageItems[j].hidden = true;
    }
  }
}
function duplicateDateAsGroup(From, To) {
  var tempLayer = From.layers.add();
  tempLayer.name = "TEMP_LAYER_DATE";

  // Create the group in the temporary layer
  var dateGroup = tempLayer.groupItems.add();
  dateGroup.name = "date";

  // Loop through all layers and their pageItems
  for (var i = 0; i < From.layers.length; i++) {
    var layer = From.layers[i];

    // Skip the temporary layer
    if (layer.name === "TEMP_LAYER_DATE") continue;

    for (var j = 0; j < layer.pageItems.length; j++) {
      var item = layer.pageItems[j];

      // Only include visible and unlocked items
      if (item.hidden === false && item.locked === false) {
        // Duplicate into the date group
        try {
          item.duplicate(dateGroup, ElementPlacement.PLACEATEND);
        } catch (e) {
          $.writeln("Could not duplicate: " + item.name + " - " + e);
        }
      }
    }
  }

  // Duplicate the date group to target doc
  var copiedGroup = dateGroup.duplicate(To, ElementPlacement.PLACEATBEGINNING);

  tempLayer.remove();
}

(function () {
  var DAYS = [
    "شنبه",
    "یکشنبه",
    "دو شنبه",
    "سه شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه",
  ];
  var MONTHS = ["شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
  var DAYS_NUMBER = [];
  for (var i = 1; i < 32; i++) {
    DAYS_NUMBER.push(i);
  }

  var HOURS = [
    "5",
    "5.5",
    "6",
    "6.5",
    "7",
    "7.5",
    "8",
    "17",
    "17.5",
    "18",
    "18.5",
    "19",
    "19.5",
    "20",
  ];

  var PLACES = [
    "خالی",
    "آلب ارسلاان",
    "آقاجون",
    "اشرافی - بلند",
    "اشرافی - کوتاه",
    "الماس",
    "امیر",
    "بعثت",
    "بهاران",
    "بهشت",
    "پارس",
    "پایتخت",
    "تشریفات - بلند",
    "تشریفات - کوتاه",
    "خورشید",
    "خوشه",
    "رازی",
    "ستاره ساحل - کوتاه",
    "ستاره ساحل - بلند",
    "ستاره شب",
    "فجر",
    "فرشتگان",
    "فردوسی",
    "فرهنگیان 2",
    "فرهنگیان 3",
    "فردوسی - عشق آباد",
    "فیروزه",
    "فیروزه گشت",
    "قصر طلایی",
    "قو",
    "میکائیل",
    "نور",
    "نگین طلایی",
    "هتل امیران",
    "وصال",
    "ولیعصر",
  ];

  const content = app.activeDocument.layers.getByName("Content");
  const template = app.activeDocument.layers.getByName("Template");

  var groups = [];
  var hasPhone = false;
  var contentFirstnames;
  var contentLastnames;
  var contentPhone;

  for (var i = 0; i < content.pageItems.length; i++) {
    // We do a filter and keep only GroupItems without name. So poem-xxx layer is left out
    if (content.pageItems[i].name === "") {
      groups.push(content.pageItems[i]);
    }
  }

  for (var i = 0; i < groups.length; i++) {
    var scale = 60;
    if (i === groups.length - 1 || i === groups.length - 2) {
      scale = 100;
      if (!contentFirstnames) {
        contentFirstnames = groups[i];
      } else {
        contentLastnames = groups[i];
      }
    } else if (i === groups.length - 5) {
      scale = 65;
      hasPhone = true;
      contentPhone = groups[i];
    }
    groups[i].resize(scale, scale);
  }

  // TODO: Show a dialog asking user for auto algining firstNames, lastNames & phone

  //Check If Conten has required Items
  if (!contentFirstnames || !contentLastnames) {
    alert("باید اطلاعات عروس و داماد در لایه کانتنت موجود باشد");
    return;
  }

  var template = app.activeDocument.layers.getByName("Template");
  if (template) {
    const firstNames = template.pageItems.getByName("firstNames");
    const lastNames = template.pageItems.getByName("lastNames");
    const phone = template.pageItems.getByName("phone");
    const rsvp = template.pageItems.getByName("rsvp");

    if (firstNames) {
      // contentFirstnames.translate(
      //   firstNames.position[0] - contentFirstnames.position[0],
      //   firstNames.position[1] - contentFirstnames.position[1]
      // );
      // var deltaX = (firstNames.width - contentFirstnames.width)/2
      // var deltaY = (firstNames.height - contentFirstnames.height)/2

      // contentFirstnames.translate(deltaX, -deltaY)
      centerAInB(contentFirstnames, firstNames);
      firstNames.hidden = true;
    }
    if (lastNames) {
      //  contentLastnames.translate(
      //   lastNames.position[0] - contentLastnames.position[0],
      //   lastNames.position[1] - contentLastnames.position[1]
      // );
      // var deltaX = (lastNames.width - contentLastnames.width)/2
      // var deltaY = (lastNames.height - contentLastnames.height)/2

      // contentLastnames.translate(deltaX, -deltaY)
      centerAInB(contentLastnames, lastNames);
      lastNames.hidden = true;
    }
    if (hasPhone) {
      // contentPhone.top = phone.top + phone.height / 2 - contentPhone.height / 2;
      // contentPhone.left = phone.left + phone.width / 2 - contentPhone.width / 2;
      centerAInB(contentPhone, phone);

      phone.hidden = true;
    } else {
      phone.hidden = true;
      rsvp.hidden = true;
    }
  }

  // Insert Poem
  const poemCode = insertPoem(content);
  const contentPoem = content.pageItems.getByName(poemCode);
  const poem = template.pageItems.getByName("poem");
  // contentPoem.top = templatePoem.top;
  // contentPoem.left =
  //   templatePoem.left + templatePoem.width / 2 - contentPoem.width / 2;
  centerAInB(contentPoem, poem);
  poem.hidden = true;

  // Insert Minimal Date

  var w = new Window("dialog", "Wedding Date");
  var p = w.add("panel", undefined);
  var g = p.add("group");

  var place = g.add("dropdownlist", undefined, PLACES);
  place.selection = PLACES[0];
  g.add("statictext", undefined, "مکان");

  var hour = g.add("dropdownlist", undefined, HOURS);
  hour.selection = HOURS[0];
  g.add("statictext", undefined, "ساعت");

  var month = g.add("dropdownlist", undefined, MONTHS);
  month.selection = MONTHS[0];
  g.add("statictext", undefined, "ماه");

  var dayNumber = g.add("dropdownlist", undefined, DAYS_NUMBER);
  dayNumber.selection = 0;
  g.add("statictext", undefined, "چندم");

  var day = g.add("dropdownlist", undefined, DAYS);
  day.selection = DAYS[0];
  g.add("statictext", undefined, "روز");

  var btn = p.add("button", undefined, "ایجاد");

  btn.onClick = function () {
    var currentDocument = app.activeDocument;
    var content = currentDocument.layers.getByName("Content");
    var template = currentDocument.layers.getByName("Template");

    var dateDocumentSrc = new File(getConfig().date);
    if (dateDocumentSrc.exists) {
      var dateDocument = app.open(dateDocumentSrc);
      dateDocument.layers
        .getByName("وسط - روز")
        .pageItems.getByName(String(dayNumber.selection)).hidden = false;
      dateDocument.layers
        .getByName("راست - روز")
        .pageItems.getByName(String(day.selection)).hidden = false;
      dateDocument.layers
        .getByName("راست - ساعت")
        .pageItems.getByName(String(hour.selection)).hidden = false;
      dateDocument.layers
        .getByName("آدرسها")
        .pageItems.getByName(String(place.selection)).hidden = false;
      dateDocument.layers
        .getByName("وسط - ماه")
        .pageItems.getByName(String(month.selection)).hidden = false;
    }
    duplicateDateAsGroup(dateDocument, currentDocument);
    resetDate(dateDocument);

    app.activeDocument = currentDocument;
    var contentDate = content.pageItems.getByName("date");
    var date = template.pageItems.getByName("date");
    // contentDate.top = templateDate.top;
    // contentDate.left =
    //   templateDate.left + templateDate.width / 2 - contentDate.width / 2;
    centerAInB(contentDate, date);
    date.hidden = true;

    w.close(0);
  };

  w.show();
})();
