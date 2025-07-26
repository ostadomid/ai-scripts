(function () {
  function getConfig() {
    var configFile = File(Folder.myDocuments + "//config.txt");
    configFile.encoding = "UTF-8";
    configFile.open("r");
    var config = { poems: "", date: "" };
    config.poems = configFile.readln();
    config.date = configFile.readln();
    config.tarhimPoems = configFile.readln();

    configFile.close();
    return config;
  }

  function centerAInB(a, b) {
    a.translate(b.position[0] - a.position[0], b.position[1] - a.position[1]);
    var deltaX = (b.width - a.width) / 2;
    var deltaY = (b.height - a.height) / 2;

    a.translate(deltaX, -deltaY);
  }

  function insertPoem(where, poemCode) {
    var config = getConfig();
    var poemsFile = File(config.tarhimPoems);
    if (poemsFile.exists) {
      const poems = app.open(poemsFile);
      $.sleep(1000);
      const poem = poems.pageItems.getByName(poemCode);
      if (poem) {
        const item = poem.duplicate(where, ElementPlacement.PLACEATBEGINNING);
        var poemPlaceholder = where.pageItems.getByName("poem");
        if(!poemPlaceholder){
            alert("درون لایه تمپلیت باید ایتم poem وجود داشته باشد")
            return
        }
        centerAInB(item,poemPlaceholder);
        poemPlaceholder.hidden = true;
        
      }
      poems.close();
      return poemCode;
    }
  }

  function handler(poemCode) {
    var template = app.activeDocument.layers.getByName("Template");

    if (!template) {
      alert("لایه تمپلیت پیدا نشد");
      return;
    }
    return function () {
      insertPoem(template, poemCode);
      w.close();
    };
  }

  var w = new Window("dialog", "شعر اعلامیه ترحیم");

  var p = w.add("panel", undefined, "کد اشعار");
  var g = p.add("group");
  var btn1200 = g.add("button", undefined, "کد 1200");
  var btn1100 = g.add("button", undefined, "کد 1100");
  var btn1000 = g.add("button", undefined, "کد 1000");

  g = p.add("group");
  var btn1500 = g.add("button", undefined, "کد 1500");
  var btn1400 = g.add("button", undefined, "کد 1400");
  var btn1300 = g.add("button", undefined, "کد 1300");

  btn1000.onClick = handler(1000);
  btn1100.onClick = handler(1100);
  btn1200.onClick = handler(1200);
  btn1300.onClick = handler(1300);
  btn1400.onClick = handler(1400);
  btn1500.onClick = handler(1500);

  w.show();
})();
