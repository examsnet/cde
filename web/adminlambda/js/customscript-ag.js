var SCREENLIST = {
  CATEGORIES: 'CATEGORIES',
  SUBJECTS: 'SUBJECTS',
  TESTS: 'TESTS',
  CHAPTERTESTS: 'CHAPTERTESTS',
  CATEGORYKEYS: 'CATEGORYKEYS',
  SUBJECTKEYS: 'SUBJECTKEYS',
  USERS: 'USERS',
  USERPROFILES: 'USERPROFILES',
  ACTIONS: 'ACTIONS',
  NOTECHAPTERS: 'NOTECHAPTERS',
}
function generateTempId() {
  return "temp_" + Math.random().toString(36).substring(2, 11);
}

function custOnAgGridReady(params) {
  console.log("On Grid Ready fired..")
  gridApi = params.api;
  columnApi = params.columnApi.api;   
}

function cellDataChanged(params) {
  console.log("Cell Data values changed..")
 }

 function makeColumnsNotEditable() {
  gridOptions.columnDefs.forEach(colDef => {
      if (colDef.editable === true) {
          colDef.editable = false;
      }
  });
  gridApi.setColumnDefs(gridOptions.columnDefs);
}
function makeColumnsEditable() {
  gridOptions.columnDefs.forEach(colDef => {
      if (colDef.editable === false) {
          colDef.editable = true;
      }
  });
  gridApi.setColumnDefs(gridOptions.columnDefs);
}

function hideFields() {
  $('.ctools .clbl').each(function (id, val) {
    $(val).show();
  });
  $('.ctools .ctxt').each(function (id, val) {
    $(val).hide();
  });
}
function showFields() {
  $('.ctools .clbl').each(function (id, val) {
    $(val).hide();
  });
  $('.ctools .ctxt').each(function (id, val) {
    $(val).show();
  });
}

$(document).on('click', '.editAgTable', function (event) {
  stopscroll(event);
  showFields();
  makeColumnsEditable();  
  columnApi.setColumnsVisible(["common-actions"], true);
});

$(document).on('click', '.cancelEditAgTable', function (event) {
  stopscroll(event);
  hideFields();
  makeColumnsNotEditable();
  /*
  columnApi.getColumns().forEach((col) => {
    if (col.colDef.editable != undefined) {
      col.colDef.editable = false;
    }
  });
  */
  columnApi.setColumnsVisible(["common-actions"], false);
});

function commonActionsRender(params) {
  const container = document.createElement('div');
  let buttonHtml = ` 
     <button class="btn btn-sm btn-outline-success ag-save-row-btn" id="ag-save-row-btn" data-id="${params.data._id}">
          <i class="fa-solid fa-floppy-disk"></i>
     </button> 
     <button class="btn btn-sm btn-outline-danger ag-delete-row-btn" id="ag-delete-row-btn"  data-id="${params.data._id}">
         <i class="fa-solid fa-trash"></i>
     </button>`;
  container.innerHTML = buttonHtml;
  if (container.querySelector('.ag-save-row-btn')) {
    container.querySelector('.ag-save-row-btn').addEventListener('click', (event) => handleButtonClickCust(event, params));
  }
  if (container.querySelector('.ag-delete-row-btn')) {
    container.querySelector('.ag-delete-row-btn').addEventListener('click', (event) => handleButtonClickCust(event, params));
  }
  return container;
}

function handleButtonClickCust(vent, params) {
  if (vent?.currentTarget?.id === 'ag-delete-row-btn') {
      deleteRecord(vent, params);
  } else if (vent?.currentTarget?.id === 'ag-save-row-btn') {
      insertOrUpdateRecord(vent, params);
      console.log(params.data.collectionname + '-' +params.data.subject_key); 
  }
} 

function insertOrUpdateRecord(vent, params) {
  let url = '';
  let input = { data: { ...params.data } }
  //TODO:remove Hard coded values below
  if(input.data.published){

  }else{
    input.data.published = true;
  }
  
  switch (currentScreen) {
    case SCREENLIST.SUBJECTKEYS:
      url = '/admin/savecodedval'
      input.cdeflag = true;
      input.id = parentCategoryId;
      break;

    case SCREENLIST.CATEGORYKEYS:
      url = '/admin/savecodedval'
      input.onlyrow = true;
      if (input.data._id.startsWith("temp_")) {
        let tempcname = params.data._id;
        input.data.vals = [];
        input.data.vals.push({ "codekey": tempcname });
      }
      break;

    case  SCREENLIST.USERS:
      url = "/users/updateuserdata";
      break; 

    case  SCREENLIST.ACTIONS:
      if (input.data._id.startsWith("temp_")) {
        url = "/admin/actiondata/insert";
      }else{
        url = "/admin/actiondata/update";
      }
      break; 
    case  SCREENLIST.SUBJECTS:
      url = "/tests/updatesubjectrow";
      input.data.category_key = category_key;
      
      break; 
    case  SCREENLIST.CHAPTERS: 
      input.id = subjectid;
      url = "/tests/updatechapters";  
    break;
    case  SCREENLIST.NOTECHAPTERS: 
      input.id = subjectid;
      url = "/notes/updatechapters";  
    break;
    default:
      break;
  }
  let updateflag = true;
  if (input.data._id.startsWith("temp_")) {
    delete input.data._id;
    updateflag = false;
  }
  const rowNode = gridApi.getRowNode(params.data._id);

  ajaxRequest(
    url, "POST", input,
    function (result) { 
      if (updateflag) {
        bootstrap_alert.success($('#alertplaceholder'), "1 Record Updated successfully");
      } else { 
        rowNode.setData({ ...rowNode.data, _id: result._id });
        bootstrap_alert.success($('#alertplaceholder'), "1 Record Inserted successfully");
      }
    },
    function (result) {
      console.log(result)
      bootstrap_alert.error($('#alertplaceholder'), result.responseText);
    }
  );


}
function deleteRecord(vent, params) {
  let input = {}
  let url = '';
  switch (currentScreen) {
    case SCREENLIST.SUBJECTKEYS:
      url = '/admin/deletefullcodedval';
      input.id = params.data._id;
      input.cdeflag = true;
      input.sid = parentCategoryId;
      break;
    case SCREENLIST.CATEGORYKEYS:
      url = '/admin/deletefullcodedval';
      input.id = params.data._id;
      break;
    case  SCREENLIST.USERS: 
      url = "/users/deleteuserbyid";
      input.id = params.data._id;
      break;
    case  SCREENLIST.ACTIONS: 
        url = "/admin/actiondata/delete"; 
        input.id = params.data._id;
      break;
    case  SCREENLIST.SUBJECTS: 
        url = "/tests/deletesubject"; 
        input.id = params.data._id;
      break;
    case  SCREENLIST.CHAPTERS: 
      input.sid = subjectid;
      input.id = params.data._id;
      url = "/tests/deletechapter";
    break;
    default:
      break;
  }


  const rowNode = gridApi.getRowNode(params.data._id);
  bootbox.confirm('Are you sure you want to delete this row?', async function (result) {
    if (result) { 
      ajaxRequest(
        url, "POST", input,
        function (result) {
          gridApi.applyTransaction({ remove: [rowNode.data] });
          bootstrap_alert.success($('#alertplaceholder'), "Record deleted successfully");
        },
        function (result) {
          bootstrap_alert.error($('#alertplaceholder'), result);
          console.log(result);
        }
      );
    }
  });
}














bootstrap_alert = function () { };
bootstrap_alert.success = function (placeholder, message) {
  $(placeholder).html(
    '<div class="alert alert-success alert-dismissible fade show" role="alert">' +
    message +
    '  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
  );
};

bootstrap_alert.info = function (placeholder, message) {
  $(placeholder).html(
    '<div class="alert alert-primary alert-dismissible fade show" role="alert">' +
    message +
    '  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
  );
};

bootstrap_alert.warning = function (placeholder, message) {
  $(placeholder).html(
    '<div class="alert alert-warning alert-dismissible fade show" role="alert">' +
    message +
    '  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
  );
};

bootstrap_alert.error = function (placeholder, message) {
  $(placeholder).html(
    '<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
    message +
    '  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
  );
};



function parseYouTubeIds(input, oldValue) {
  const youtubeIdPattern = /^[a-zA-Z0-9_-]{11}$/;
  const partPattern = /^([a-zA-Z0-9_-]{11})~(\d+)~(\d+)$/;
  if(input.length === 0){
    return "";
  }
  // Split by comma and validate each part
  const parts = input.split(',').map(part => part.trim());
  for (let part of parts) {
    if (!partPattern.test(part)) {
      alert(`Invalid format: "${part}". Each entry should be in the format: YouTubeID~start~end`);
      return oldValue;
    }

    const [_, youtubeId, start, end] = part.match(partPattern);

    if (!youtubeIdPattern.test(youtubeId)) {
      alert(`Invalid YouTube ID: "${youtubeId}". It should be 11 characters long and contain only alphanumeric characters, underscores, or hyphens.`);
      return oldValue;
    }

    if (parseInt(start) <= 0 || parseInt(end) <= 0 || parseInt(start) > parseInt(end)) {
      alert(`Invalid start or end numbers in: "${part}". Start and end should be positive integers, and start should be less than or equal to end.`);
      return oldValue;
    }
  }

  // If all parts are valid, return the new value
  return input;
}

function parsePlaylistIds(input, oldValue) {
  const playlistIdPattern = /^[a-zA-Z0-9_-]+$/;
  const partPattern = /^([a-zA-Z0-9_-]+)~(\d+)~(\d+)$/;
  if(input.length === 0){
    return "";
  }
  // Split by comma and validate each part
  const parts = input.split(',').map(part => part.trim());
  for (let part of parts) {
    if (!partPattern.test(part)) {
      alert(`Invalid format: "${part}". Each entry should be in the format: PlaylistID~start~end`);
      return oldValue;
    }

    const [_, playlistId, start, end] = part.match(partPattern);

    if (!playlistIdPattern.test(playlistId)) {
      alert(`Invalid Playlist ID: "${playlistId}". It should contain only alphanumeric characters, underscores, or hyphens.`);
      return oldValue;
    }

    if (parseInt(start) <= 0 || parseInt(end) <= 0 || parseInt(start) > parseInt(end)) {
      alert(`Invalid start or end numbers in: "${part}". Start and end should be positive integers, and start should be less than or equal to end.`);
      return oldValue;
    }
  }

  // If all parts are valid, return the new value
  return input;
}
















function parseSectionHeadings(input, oldValue) {
  const partPattern = /^(.*?)~(\d+)~(\d+)$/;
  if(input.length === 0){
    return "";
  }
  // Split by comma and validate each part
  const parts = input.split(",").map((part) => part.trim());

  for (let part of parts) {
    if (!partPattern.test(part)) {
      alert(
        `Invalid format: "${part}". Each entry should be in the format: Section Heading~start~end`
      );
      return oldValue;
    }

    const [_, heading, start, end] = part.match(partPattern);

    if (
      parseInt(start) <= 0 ||
      parseInt(end) <= 0 ||
      parseInt(start) > parseInt(end)
    ) {
      alert(
        `Invalid start or end numbers in: "${part}". Start and end should be positive integers, and start should be less than or equal to end.`
      );
      return oldValue;
    }
  }

  // If all parts are valid, return the new value
  return input;
}

function parseMarks(input, oldValue) {
  // Updated pattern to allow decimal marks
  const partPattern = /^(-?\d+(\.\d+)?)~(-?\d+(\.\d+)?)~(\d+)~(\d+)$/;

  if (input.length === 0) {
    return "";
  }

  // Split by comma and validate each part
  const parts = input.split(",").map((part) => part.trim());

  for (let part of parts) {
    if (!partPattern.test(part)) {
      alert(
        `Invalid format: "${part}". Each entry should be in the format: Marks~Marks~start~end, where Marks can be a positive or negative integer or decimal.`
      );
      return oldValue;
    }

    const [_, marks1, , marks2, , start, end] = part.match(partPattern);

    if (
      parseInt(start) <= 0 ||
      parseInt(end) <= 0 ||
      parseInt(start) > parseInt(end)
    ) {
      alert(
        `Invalid start or end numbers in: "${part}". Start and end should be positive integers, and start should be less than or equal to end.`
      );
      return oldValue;
    }
  }

  // If all parts are valid, return the new value
  return input;
}


function saveTestFieldsByRange(data, fieldname) {
  var input = {};
  input.pattern = data[fieldname];
  input.query = {
    subject_key: data.subject_key,
    chapterid: data.chapterid,
    testid: data.testid,
    questiontype: "Q",
  };

  var url = "/tests/updatePropertyInRange";
  if (fieldname == "marksdata") {
    url = "/tests/updateScoreByRange";
  } else if (fieldname == "youtubeids") {
    input.fieldname = "yturl";
  } else if (fieldname == "sectiondata") {
    input.fieldname = "section";
  } else if (fieldname == "playlistid") {
    input.fieldname = "playlistid";
  }

  ajaxRequest(
    url,
    "POST",
    input,
    function (result) {
      if (result) {
        let totalMatchedCount = 0;
        let totalModifiedCount = 0;

        // Iterate through the result array and aggregate the counts
        result.forEach((item) => {
          totalMatchedCount += item.matchedCount;
          totalModifiedCount += item.modifiedCount;
        });
        bootstrap_alert.success(
          $("#alertplaceholder"),
          "Matched =" +
          totalMatchedCount +
          " and Modified=" +
          totalModifiedCount +
          ""
        );
      }
    },
    function (result) {
      if (result) {
        bootstrap_alert.error($("#alertplaceholder"), "Failed.." + result);
      }
    }
  );
}


