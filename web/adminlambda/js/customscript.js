var globals = {};


function copyToClipboard(text) {
  if (navigator.clipboard) {
   navigator.clipboard.writeText(text)
     .then(() => {
       console.log("Text copied to clipboard");
     })
     .catch(err => {
       console.error("Failed to copy text: ", err);
       copyToClipboardFallback(text)
     });
 } else {
  copyToClipboardFallback(text)
 } 
}

function copyToClipboardFallback(text){
  // Fallback for older browsers
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  console.log("Text copied to clipboard");
}

function onlynumbers(txb) {
  txb.value = txb.value.replace(/[^\0-9]/gi, "");
  txb.value = txb.value.replace(/\s/g, "");
  if ((txb.value.match(/\./g) || []).length > 1) {
    var pos = txb.value.lastIndexOf(".");
    txb.value = txb.value.substring(0, pos) + txb.value.substring(pos + 1);
  }
}

function onlyIntegers(txb) {
  // Remove any character that is not a digit
  txb.value = txb.value.replace(/[^\d]/g, "");
  // Remove any spaces
  txb.value = txb.value.replace(/\s/g, "");
}

function stopscroll(vent) {
  vent.preventDefault();
  vent.stopPropagation();
}

function ajaxRequest(url, method, data, successCallback, errorCallback) {
  $.ajax({
    url: url,
    method: method,
    data: data,
    success: function (response) {
      if (typeof successCallback === "function") {
        successCallback(response);
      }
    },
    error: function (xhr, status, error) {
      if (typeof errorCallback === "function") {
        errorCallback(xhr, status, error);
      }
    },
  });
}

$(function () {
  $(document).on("input", ".integer", function (event) {
    stopscroll(event);
    onlyIntegers(this);
  });

  $(document).on("input", "#searchinput", function (event) {
    stopscroll(event);
     
    if (this.value && this.value.length > 3) { 
      console.log('more than 3 chars')
        ajaxRequest(
          "/tests/searchTestByTestName/"+this.value,
          "GET",
          {},
          function (results) {             
            $(".searchresults .schildren").remove();
            if(results){
              results.forEach((val, index)=>{
                $(".searchresults").append(`<a href="/tests/getquestionbytestid/${val._id}" target="_blank" class='text-decoration-none text-primary schildren p-1 d-flex justify-content-between align-items-center border-bottom'>${val.test_name} &emsp; <i class="fa-solid fa-chevron-right"></i></a>`)
              })
            }
          },
          function (result) {
            console.log(result);
          }
        );

    }else{
      console.log('less than 3 chars')
      $(".searchresults .schildren").remove();

    }
  });
 

  $(document).on("click", ".searchbutton", function (event) {
    console.log("search clicked");
    stopscroll(event);
    $("#searchinput").toggle();
  });

  $(document).on("click", ".editTable", function (event) {
    stopscroll(event);
    showCustTableTextFields();
    expandInputs();
  });

  $(document).on("click", ".cancelEditTable", function (event) {
    stopscroll(event);
    hideCustTableTextFields();
  });

  $(document).on("click", ".editTableRow", function (event) {
    stopscroll(event);
    editCurrentTableRow(this);
    expandInputs();
  });

  $(document).on("click", ".cancelTableRowEdit", function (event) {
    stopscroll(event);
    cancelEditCurrentTableRow(this);
  });

  $(document).on("click", ".saveTableRow", function (event) {
    stopscroll(event);
    saveTableRow(this);
  });

  $(document).on("click", ".saveTableAllRows", function (event) {
    stopscroll(event);
    saveTableAllRows(this);
  });

  $(document).on("click", ".addRowButton", function (event) {
    stopscroll(event);
    addNewTableRow();
  });

  $(document).on("click", ".deleteTableRow", function (event) {
    stopscroll(event);
    showDeleteConfirmationDialog(
      "Are you sure want to delete Record?",
      deleteTableRecord,
      $(this).closest("tr"),
      event
    );
  });

  $(document).on("click", ".updateTableSeqIndex", function (event) {
    stopscroll(event);
    updateTableSeqIndex();
  });

  $(document).on("click", ".expandTable", function (event) {
    stopscroll(event);
    expandTableClassToggle();
  });

  $(document).on("click", ".openchaptertests", function (event) {
    stopscroll(event);
    openchapterTests(this);
  });

  $(document).on("click", ".updatejsonfilenames", function (event) {
    stopscroll(event);
    updateJSONFileNames();
  });

  $(document).on("click", ".youtubeops", function (event) {
    stopscroll(event);
    var data = {};
    data.tid = $(this).closest("tr").attr("tid");
    data.cid = $(this).closest("tr").attr("cid");
    data.skey = $(this).closest("tr").attr("skey");
    data.youtubeids = $(this).closest("tr").find("#youtubeids").val();
    data.youtubeids = extractYTIds(data.youtubeids);
    data.playlistid = $(this).closest("tr").find("#playlistid").val();
    data.playlistid = extractYTIds(data.playlistid);
    openyoutubeoperations(data);
  });

  $(document).on("click", ".refreshcodedvals", function (event) {
    stopscroll(event);
    var input = {};
    input.type = "subjectkeys";
    ajaxRequest(
      "/admin/refreshdata",
      "POST",
      input,
      function (result) {
        alert(JSON.stringify(result));
      },
      function (result) {
        alert(JSON.stringify(result));
      }
    );
  });
});

function updateJSONFileNames() {
  var start = 1;
  $(`.ctable #test_file_name`).each((id, val) => {
    let testname = $(val).closest("tr").find("#test_name").val();
    let lang = $(val).closest("tr").find("#test_lang  :selected").val();
    var filename = generateFileName(testname, lang);
    $(val).val(filename);
  });
}

function openchapterTests(that) {
  console.log(that);
  $("#chaptertestsform")
    .find('input[type="hidden"][name="subjectkey"]')
    .val($(that).attr("subkey"));
  $("#chaptertestsform")
    .find('input[type="hidden"][name="collname"]')
    .val($(that).attr("collname"));
  $("#chaptertestsform")
    .find('input[type="hidden"][name="categorykey"]')
    .val($(that).attr("category"));
  $("#chaptertestsform").trigger("submit");
}
function toggleDisplayFlex(element) {
  if (element) {
    const currentDisplay = window.getComputedStyle(element).display;

    if (element.tagName.toLowerCase() === "th") {
      if (currentDisplay === "none") {
        element.style.display = "table-cell";
      } else {
        element.style.display = "none";
      }
    } else {
      if (currentDisplay === "none") {
        element.style.display = "table-cell";
      } else {
        element.style.display = "none";
      }
    }
  } else {
    console.error("Element not found.");
  }
}

function expandTableClassToggle() {
  $(".extracolumn").each(function () {
    toggleDisplayFlex(this);
  });
}

function hideCustTableTextFields() {
  $(".ctable .clbl,.rclbl").each(function (id, val) {
    $(val).show();
  });
  $(".ctable .ctxt").each(function (id, val) {
    $(val).hide();
  });

  $(".ctools .clbl").each(function (id, val) {
    $(val).show();
  });
  $(".ctools .ctxt").each(function (id, val) {
    $(val).hide();
  });
}
function showCustTableTextFields() {
  $(".ctable .clbl,.rclbl").each(function (id, val) {
    $(val).hide();
  });
  $(".ctable .ctxt").each(function (id, val) {
    $(val).show();
  });

  $(".ctools .clbl").each(function (id, val) {
    $(val).hide();
  });
  $(".ctools .ctxt").each(function (id, val) {
    $(val).show();
  });
}

function editCurrentTableRow(that) {
  $(".ctools .clbl").each(function (id, val) {
    $(val).hide();
  });
  $(that)
    .closest("tr")
    .find(".clbl,.rclbl")
    .each((i, v) => {
      $(v).hide();
    });
  $(that)
    .closest("tr")
    .find(".ctxt,.rctxt")
    .each((i, v) => {
      $(v).show();
    });
  $(that).closest("tr").addClass("highlight");
}

function cancelEditCurrentTableRow(that) {
  $(that)
    .closest("tr")
    .find(".clbl,.rclbl")
    .each((i, v) => {
      $(v).show();
    });
  $(that)
    .closest("tr")
    .find(".ctxt,.rctxt")
    .each((i, v) => {
      $(v).hide();
    });
  if ($(".rctxt").filter(":visible").length == 0) {
    $(".ctools .clbl").each(function (id, val) {
      $(val).show();
    });
  }
  $(that).closest("tr").removeClass("highlight");
}

function readInputElements(row) {
  const inputs = row.find("input, select, textarea");
  const valuesObj = {};

  inputs.each(function () {
    const id = $(this).attr("id");
    let value;
    if ($(this).is(":checkbox")) {
      value = $(this).prop("checked");
    } else if ($(this).is("select")) {
      value = $(this).val();
    } else {
      value = $(this).val();
    }
    valuesObj[id] = value;
  });

  return valuesObj;
}

function saveTableRow(that) {
  console.log("save Table Row");
  var input = {};
  input.onlyrow = true;
  var screen = $(".ctable").attr("screen");
  var row = $(that).closest("tr");
  var url = "";
  input.data = readInputElements(row);
  if (screen == "subjects") {
    input.id = row.attr("mid");
    url = "/tests/updatesubjectrow";
  } else if (screen == "chapters") {
    input.id = row.attr("smid");
    input.data._id = row.attr("mid");
    url = "/tests/updatechapters";
  } else if (screen == "tests" || screen == "chaptertests") {
    input.id = row.attr("mid");
    input.data.chapterid = row.attr("cid");
    input.data.link = generateAnchorLink(input.data, screen);
    input.data.t_title = generateHTMLTitle(input.data, screen);
    input.data.test_file_title = generateTitle(input.data, screen);
    url = "/tests/savetestsrow";
  } else if (screen == "users") {
    input.id = row.attr("mid");
    url = "/users/updateuserdata";
  } else if (screen == "categorykeyscreen") {
    input.id = row.attr("mid");
    url = "/admin/savecodedval";
  } else if (screen == "subjectkeyscreen") {
    input.cdeflag = true;
    input.id = row.attr("smid");
    input.data._id = row.attr("mid");
    url = "/admin/savecodedval";
  }

  ajaxRequest(
    url,
    "POST",
    input,
    function (result) {
      if (screen == "chapters" || screen == "subjectkeyscreen") {
        saveTableRowSuccess(result, row, input.data._id);
      }
      saveTableRowSuccess(result, row);
    },
    function (result) {
      saveTableRowFailed(result, row);
    }
  );
}

function saveTableRowSuccess(result, row, subdocid) {
  if (subdocid && $(".ctable").attr("screen") == "subjectkeyscreen") {
    result = result.vals.find((val) => val._id == subdocid);
  } else if (subdocid && result) {
    result = result.chapters.find((chapter) => chapter._id == subdocid);
  }
  $(row).find(".cancelTableRowEdit").trigger("click");

  Object.keys(result).forEach((key) => {
    // console.log(`${key}: ${obj[key]}`);
    var label = $(row).find('label[for="' + key + '"]');
    if (label.length > 0) {
      label.text(result[key]);
    }

    var anc = $(row).find('a[for="' + key + '"]');
    if (anc.length > 0) {
      anc.text(result[key]);
    }
  });
}
function saveTableRowFailed(result, row) {
  console.log(result);
  $(row).find(".cancelTableRowEdit").trigger("click");
}

function saveTableAllRows() {
  var table = $(".ctable tbody");
  var url = "";
  var rows = table.find("tr");
  var screen = $(".ctable").attr("screen");
  var input = {};
  input.onlyrow = false;
  var data = [];

  rows.each(function () {
    const valuesObj = readInputElements($(this));
    var uid = $(this).attr("uid");
    var uidattr = $(this).attr("uidattr");
    valuesObj[uidattr] = uid;
    var mid = $(this).attr("mid");
    if (mid && mid.length > 0) {
      valuesObj["_id"] = mid;
    }
    if (screen == "subjects") {
      valuesObj["category_key"] = $(this).attr("category");
    }
    if (screen == "tests" || screen == "chaptertests") {
      valuesObj["chapterid"] = $(this).attr("cid");
      valuesObj["subjectid"] = $(this).attr("sid");
      valuesObj["subject_key"] = $(this).attr("skey");
      valuesObj["link"] = generateAnchorLink(valuesObj, screen);
      valuesObj["t_title"] = generateHTMLTitle(valuesObj, screen); // HTML Title
      valuesObj["test_file_title"] = generateTitle(valuesObj, screen); // HTML Title
    } else if (screen == "categorykeyscreen") {
    }

    data.push(valuesObj);
  });
  input.data = data;

  if (screen == "subjects") {
    url = "/tests/updatesubjectsbulk";
  } else if (screen == "chapters") {
    input.id = $(".ctable").attr("smid");
    url = "/tests/updatechapters";
  } else if (screen == "tests" || screen == "chaptertests") {
    url = "/tests/savetests";
  } else if (screen == "users") {
    url = "/users/updateuserdata";
  } else if (screen == "profiles") {
    input.username = $("#useridselect").val();
    url = "/users/updateUserProfile";
  } else if (screen == "categorykeyscreen") {
    url = "/admin/savecodedval";
  } else if (screen == "subjectkeyscreen") {
    input.id = $(".ctable").attr("smid");
    input.cdeflag = true;
    url = "/admin/savecodedval";
  }

  ajaxRequest(
    url,
    "POST",
    input,
    function (result) {
      //window.location.reload(true);
      console.log(result);
      if (
        screen == "profiles" &&
        typeof window.setProfileStatus === "function"
      ) {
        const recordCount = Array.isArray(data) ? data.length : 0;
        window.setProfileStatus(
          `Saved ${recordCount} entitlement record(s) successfully.`,
          "success"
        );
      }
    },
    function (result) {
      console.log(result);
      if (
        screen == "profiles" &&
        typeof window.setProfileStatus === "function"
      ) {
        window.setProfileStatus("Failed to save entitlement records.", "danger");
      }
    }
  );

  // console.log(data)
}

// Function to add a new row to the table
function addNewTableRow() {
  console.log("addNewTableRow");
  var newRow = $("#templateRow").clone().removeAttr("id").show();
  var uid = getNewRowUId(".ctable");
  newRow.attr("uid", uid);
  $(".ctable").append(newRow);
  newRow.find(".deleteTableRow").on("click", function (event) {
    stopscroll(event);
    $(this).closest("tr").remove();
  });
}

function deleteTableRecord(row) {
  console.log(row);
  var input = {};
  var screen = $(".ctable").attr("screen");
  var url = "";
  input.id = row.attr("mid");
  if (screen == "subjects") {
    url = "/tests/deletesubject";
  } else if (screen == "chapters") {
    input.sid = row.attr("smid");
    url = "/tests/deletechapter";
  } else if (screen == "tests" || screen == "chaptertests") {
    url = "/tests/deletetest";
  } else if (screen == "users") {
    url = "/users/deleteuserbyid";
  } else if (screen == "categorykeyscreen") {
    url = "/admin/deletefullcodedval";
  } else if (screen == "subjectkeyscreen") {
    input.cdeflag = true;
    input.sid = row.attr("smid");
    url = "/admin/deletefullcodedval";
  }
  ajaxRequest(
    url,
    "POST",
    input,
    function (result) {
      $(row).remove();
      if ($(".rctxt").filter(":visible").length == 0) {
        $(".ctools .clbl").each(function (id, val) {
          $(val).show();
        });
      }
    },
    function (result) {
      console.log(result);
    }
  );
}

function showDeleteConfirmationDialog(message, callbackto, row, vent) {
  stopscroll(vent);
  bootbox.confirm({
    title: "Confirm Action",
    message: message,
    buttons: {
      confirm: {
        label: "Yes",
        className: "btn-danger",
      },
      cancel: {
        label: "No",
        className: "btn-success",
      },
    },
    callback: function (result) {
      if (typeof callbackto === "function" && result) {
        callbackto(row);
      }
    },
  });

  $(document).on("shown.bs.modal", function (e) {
    $(".btn-success").trigger("focus");
  });
}

function getNewRowUId(tableName) {
  var table = $(tableName + " tbody");
  var rows = table.find("tr");
  // Extract existing IDs
  var existingIds = rows
    .map(function () {
      return parseInt($(this).attr("uid"));
    })
    .get();
  // Generate unique ID
  var newId = Math.max(...existingIds, 0) + 1;
  return newId;
}

function updateTableSeqIndex() {
  var start = 1;
  $(`.ctable .seq`).each((id, val) => {
    $(val).val(start++);
  });
}

function generateAnchorLink(input, screen) {
  // Convert to lowercase
  let text = input.test_name;
  let lang = input.test_lang;
  let tempAnchor = text.toLowerCase().trim();
  tempAnchor = tempAnchor.replace(/\s+/g, "-");
  tempAnchor = tempAnchor.replace(
    /[\/\!\*\(\)\;\:\@\&\=\+\$\,\%\#\[\]\{\}\\\']/g,
    ""
  );
  tempAnchor = tempAnchor.replace(/(?:\r\n|\r|\n)/g, "");

  let linkprefix = "";
  let linksuffix = "";

  if (screen == "chaptertests") {
    if (input.chapterid && globals.chapters && globals.chapters.length > 0) {
      var result = getChapterProperties(
        globals.chapters,
        input.chapterid,
        "linkprefix",
        "linksuffix"
      );
      if (result) {
        linkprefix = result.linkprefix;
        linksuffix = result.linksuffix;
      }
    }
  } else {
    if (globals && globals.subjdetails) {
      linkprefix = globals.subjdetails.linkprefix;
      linksuffix = globals.subjdetails.linksuffix;
    }
  }

  if (linkprefix && linkprefix.length > 0) {
    tempAnchor = linkprefix + "-" + tempAnchor;
  }
  if (linksuffix && linksuffix.length > 0) {
    tempAnchor = tempAnchor + "-" + linksuffix;
  }

  if (lang && lang.length > 0 && lang != "en") {
    tempAnchor = tempAnchor + "-" + lang;
  }

  return tempAnchor;
}

function generateHTMLTitle(input, screen) {
  let text = input.test_name;

  let htmlprefix = "";
  let htmlsuffix = "";

  var htmltitle = text;
  if (text) {
    if (screen == "chaptertests") {
      if (input.chapterid && globals.chapters && globals.chapters.length > 0) {
        var result = getChapterProperties(
          globals.chapters,
          input.chapterid,
          "htmlprefix",
          "htmlsuffix"
        );
        if (result) {
          htmlprefix = result.htmlprefix;
          htmlsuffix = result.htmlsuffix;
        }
      }
    } else {
      if (globals && globals.subjdetails) {
        htmlprefix = globals.subjdetails.htmlprefix;
        htmlsuffix = globals.subjdetails.htmlsuffix;
      }
    }

    if (htmlprefix && htmlprefix.length > 0) {
      htmltitle = htmlprefix + " " + htmltitle;
    }
    if (htmlsuffix && htmlsuffix.length > 0) {
      htmltitle = htmltitle + " " + htmlsuffix;
    }
  }

  return htmltitle;
}

function generateTitle(input, screen) {
  let text = input.test_name;
  let displayprefix = "";
  let displaysuffix = "";

  var title = text;
  if (text) {
    if (screen == "chaptertests") {
      if (input.chapterid && globals.chapters && globals.chapters.length > 0) {
        var result = getChapterProperties(
          globals.chapters,
          input.chapterid,
          "displayprefix",
          "displaysuffix"
        );
        if (result) {
          displayprefix = result.displayprefix;
          displaysuffix = result.displaysuffix;
        }
      }
    } else {
      if (globals && globals.subjdetails) {
        displayprefix = globals.subjdetails.displayprefix;
        displaysuffix = globals.subjdetails.displaysuffix;
      }
    }
    if (displayprefix && displayprefix.length > 0) {
      title = displayprefix + " " + title;
    }
    if (displaysuffix && displaysuffix.length > 0) {
      title = title + " " + displaysuffix;
    }
  }
  return title;
}

function getChapterProperties(chapters, chapterId, prop1, prop2) {
  // Find the chapter object with the matching chapterId
  const chapter = chapters.find((ch) => ch.chapterid == chapterId);

  // If chapter is found, return an object with the specified properties
  if (chapter) {
    return {
      [prop1]: chapter[prop1],
      [prop2]: chapter[prop2],
    };
  }

  // If no chapter is found, return null or an empty object
  return {};
}

function generateFileName(text, lang) {
  let filename = text.toLowerCase().trim();
  filename = filename.replace(/\s+/g, "_");
  filename = filename.replace(/-/g, "_");
  filename = filename.replace(
    /[\/\!\*\(\)\;\:\@\&\=\+\$\,\%\#\[\]\{\}\\\']/g,
    ""
  );
  filename = filename.replace(/(?:\r\n|\r|\n)/g, "");
  if (lang && lang.length > 0 && lang != "en") {
    filename = filename + "_" + lang;
  }
  filename = filename + ".json";
  return filename;
}

function expandInputs() {
  $(".autoexpand").each(function () {
    var input = $(this);
    var textLength = input.val().length;
    var averageCharWidth = 10; // Average character width in pixels, you can adjust this value

    // Calculate the new width
    var newWidth = textLength * averageCharWidth + 20; // Adding some padding

    // Check if the new width is greater than the current width
    if (newWidth > input.width() || newWidth > 50) {
      // Set the new width
      input.width(newWidth);
    } else {
      input.width(100);
    }
  });
}

function extractYTIds(input) {
  // Split the input string by commas to get each entry
  const entries = input.split(",");

  // Extract the IDs by splitting each entry by '~' and taking the first part
  var ids = entries.map((entry) => entry.split("~")[0].trim() + "~0~0");

  // Join the IDs with a newline character
  return ids.join("\n");
}
function openyoutubeoperations(input = {}) {
  bootbox.dialog({
    title: "Choose Your Action",
    message: `
    <div class="row">
    <div id="ytmodlastatus"></div>
    <div>
       <textarea rows="5" class="form-control ytmodeltextarea" placeholder="U5liABbXXfc~0~0\nU5liABbXXfc~0~0"></textarea>
    </div>
    <div class="d-flex justify-content-around m-3">
    <a href='#' tid="${input.tid}" cid="${input.cid}" skey="${input.skey}" class='btn btn-sm btn-outline-info' id="updateytids">Update YT ID</a>
    <a href='#' tid="${input.tid}" cid="${input.cid}" skey="${input.skey}" class='btn btn-sm btn-outline-info' id="updateplids">Update PL ID</a>
    <a href='#' tid="${input.tid}" cid="${input.cid}" skey="${input.skey}" class='btn btn-sm btn-outline-info' id="updateyttime">Update Time</a>
    </div>
    </div>
    `,
    buttons: {},
    callback: function (result) {
      // This callback will be called regardless of which button is clicked
      // Additional handling can be added here if needed
      console.log("Prompt result:", result);
    },
  });

  $("#updateplids").on("click", function (event) {
    stopscroll(event);
    $("#ytmodlastatus").text("");
    setyotubecommons(this, "playlistid");
  });

  $("#updateytids").on("click", function (event) {
    stopscroll(event);
    $("#ytmodlastatus").text("");
    setyotubecommons(this, "yturl");
  });

  $("#updateyttime").on("click", function (event) {
    stopscroll(event);
    $("#ytmodlastatus").text("");

    var qlist = $(".ytmodeltextarea").val().split(/\r|\n/);
    var input = {};
    input.subject_key = $(this).attr("skey");
    input.testid = $(this).attr("tid");
    input.chapterid = $(this).attr("cid");
    input.updates = [];
    for (var i = 0; i < qlist.length; i++) {
      if (qlist[i] && qlist[i].length > 0) {
        var timestr = qlist[i].split("-");
        if (timestr.length == 2) {
          var yttimeformat = getYtTimeformat(timestr[0]);
          var questno = timestr[1].replace(/[^0-9]/g, "");
          console.log("Time " + yttimeformat + " for  " + questno);
          input.updates.push({
            questionseq: questno,
            yttime: yttimeformat,
          });
        }
      }
    }
    ajaxRequest(
      "/tests/bulkUpdateYttime",
      "POST",
      input,
      function (result) {
        console.log(result);
        if (result && result.status) {
          $("#ytmodlastatus").text(
            "Matched : " +
              result.status.matchedCount +
              "  Modified : " +
              result.status.modifiedCount
          );
        }
      },
      function (result) {
        console.log(result);
      }
    );
  });
}
function setyotubecommons(that, proptoupdate) {
  var input = {};
  input.subject_key = $(that).attr("skey");
  input.testid = $(that).attr("tid");
  input.chapterid = $(that).attr("cid");
  input.fieldtocheck = "questionseq";
  input.proptoupdate = proptoupdate;
  var texts = $(".ytmodeltextarea").val();
  var splits = texts.split("\n");
  for (var i = 0; i < splits.length; i++) {
    let inputString = splits[i];
    let parts = inputString.split("~");
    if (parts.length > 0) {
      input.propvalue = parts[0].trim();
      input.range = parts.slice(1).join("~");
    }
    updateyoutubeids(input);
  }
}
function updateyoutubeids(input) {
  ajaxRequest(
    "/tests/updatePropertyInRange",
    "POST",
    input,
    function (result) {
      console.log(result);
      if (result && result.status) {
        $("#ytmodlastatus").text(
          "Matched : " +
            result.status.matchedCount +
            "  Modified : " +
            result.status.modifiedCount
        );
      }
    },
    function (result) {
      console.log(result);
    }
  );
}

function getYtTimeformat(input) {
  if (input && input.length > 0) {
    var timearr = input.split(":");
    if (timearr.length == 3) {
      return (
        timearr[0].trim() +
        "h" +
        timearr[1].trim() +
        "m" +
        timearr[2].trim() +
        "s"
      );
    } else if (timearr.length == 2) {
      return timearr[0].trim() + "m" + timearr[1].trim() + "s";
    }
  }
  return "";
}

function showAlert(alertId, message) {
  var alertElement = $("#" + alertId + " #alert-msg");
  if (alertElement) {
    var currentTime = new Date().toLocaleTimeString();
    alertElement.innerText = message + " at ( " + currentTime + " )";
    document.getElementById(alertId).style.visibility = "visible";

    // Hide the alert after 5 seconds
    setTimeout(function () {
      // alertElement.style.visibility = 'hidden';
    }, 5000); // 5000 milliseconds = 5 seconds
  }
}
