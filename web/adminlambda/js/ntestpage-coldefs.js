 

var note_defaultColsTestPage = [
    { headerName: 'Sq', field: 'test_seq', width: 60, pinned: 'left', cellClass: 'ag-cell-no-wrap', editable: false }, 
    { headerName: 'Test Name', field: 'test_name',  cellClass: 'ag-cell-no-wrap', editable: false, cellRenderer: linkRenderer, cellEditor: 'agTextCellEditor', filter: 'agTextColumnFilter' , flex:4 },
]
var note_endDefaultCols = [
    { headerName: 'Tut', field: 'tutorials', cellRenderer: tutorialRender, width: 50, hide:false, pinned: 'right' },
]

var note_adminColsTestPage = [
    
    { headerName: 'Published', field: 'published', cellEditor: 'agSelectCellEditor', cellEditorParams: decisionParams, valueFormatter: decisionFormatter, editable: false, width: 100 },
    { headerName: 'Language', field: 'test_lang', cellEditor: 'agSelectCellEditor', cellEditorParams: languageParams, valueFormatter: languageFormatter, editable: false, flex:1 },

    { headerName: 'CSS Path', field: 'test_image', cellClass: 'ag-cell-no-wrap', editable: false, flex:1 },

    { headerName: 'Youtubeid', field: 'youtubeids', cellClass: 'ag-cell-no-wrap', editable: false, cellRenderer: placeHolder, valueParser: validateYoutubeIds, flex:1 },
    { headerName: 'Playlist', field: 'playlistid', cellClass: 'ag-cell-no-wrap', editable: false, cellRenderer: placeHolder,valueParser: validateYoutubePlayListIds, flex:1 },
    { headerName: 'Section Data', field: 'sectiondata', cellClass: 'ag-cell-no-wrap', editable: false, cellRenderer: placeHolder,valueParser: validateSections, flex:1 },
    { headerName: 'Marks', field: 'marksdata', cellClass: 'ag-cell-no-wrap', editable: false, cellRenderer: placeHolder,valueParser: validateMarks, flex:1 },

    { headerName: 'Img prefix', field: 'imageprefix', cellClass: 'ag-cell-no-wrap', editable: false, cellRenderer: placeHolder, flex:1 },
    { headerName: 'Linked Subject', field: 'linkedsubject', cellClass: 'ag-cell-no-wrap', editable: false, cellRenderer: placeHolder, flex:1 },

    { headerName: 'CDN', field: 'is_cdn_https', editable: false, cellEditor: 'agSelectCellEditor', width: 100, cellEditorParams: decisionParams, valueFormatter: decisionFormatter, flex:1 },
     
    { headerName: 'Link', field: 'link', hide: true, cellClass: 'ag-cell-no-wrap'},
    { headerName: 'Test Title', field: 'test_file_title', hide: true, cellClass: 'ag-cell-no-wrap' },
    { headerName: 'File Name', field: 'test_file_name', hide: true, cellClass: 'ag-cell-no-wrap' },
    { headerName: 'Mobile File Name', field: 'mobile_file_name', editable: false, cellClass: 'ag-cell-no-wrap' }, 
    { headerName: 'HTML Title', field: 't_title', hide: true, cellClass: 'ag-cell-no-wrap' },
    { headerName: 'Data', field: 'data-actions', cellRenderer: dataactions, pinned: 'right', hide:true, width:230},
    { headerName: 'Actions', field: 'extra-actions', cellRenderer: extraactions, pinned: 'right', hide:true, flex:1 },
    { headerName: 'Selenium', field: 'selenium-actions', cellRenderer: seliniumactions, pinned: 'right', hide:true, flex:1 },

    { headerName: 'Del', field: 'delete-action', cellRenderer: deleteRender, width: 50, hide:true, pinned: 'right' },
]


var gridApi = {}
var editedRows = {};

function linkRenderer(params) {
    // Renders the cell as a clickable link
    //return `<a href="/notes/getquestionbytestid/${params.data._id}" class="text-primary">${params.value}</a>`;
     // Check if the cell is in edit mode
      

     if (globals.editing) {
         // Render the text without a link
         return `<span>${params.value}</span>`;
     } else {
         // Render the cell as a clickable link
         return `<a href="/notes/getnotesbytestid/${params.data._id}" class="text-primary">${params.value}</a>`;
     }
}

function clearCellValuesChangeForColumn(columnField) {
    gridApi.forEachNode((node) => {
        node.data[columnField] = '';
    });
    gridApi.refreshCells({ force: true })
}

function triggerCellValueChangedForColumn(columnField) {
    // Iterate through all rows in the grid
    gridApi.forEachNode(function(node) {
        var data = node.data;
        var value = data[columnField];
        
        // Construct the params object for onCellValueChanged
        var params = {
            column: columnApi.getColumnState().find(col => col.colId === columnField),
            node: node,
            data: data,
            newValue: value,
            oldValue: value,
            api: gridApi,
            columnApi: columnApi
        };

        // Call the onCellValueChanged function directly
        onCellValueChanged(params);
    });

    console.log(editedRows); // Output the editedRows object
}

 

function onAgGridReady(params) {
    gridApi = params.api;
    columnApi = params.columnApi.api;
    //columnApi.autoSizeColumns(["test_name"])
}

function getAgGridRowId(params) {
    return params.data._id || params.data.testid;
}
var note_testGridOptions = {
    cellSelection: true,
    onCellValueChanged: onCellValueChanged,
    getRowId: getAgGridRowId,
    onGridReady: onAgGridReady,
    defaultColDef: {
      minWidth: 60,
      resizable: true,
      editable: true

    }
  }


function onCellValueChanged(params) {
    
    
    var column = params.column;
    if (column && (column.colId === 'test_name' || column.colId === 'test_lang')) {
        var rowNode = params.node;
        var newValue = params.newValue;
        var input = {};
        if (column.colId === 'test_name') {
          input = { test_lang: rowNode.data.test_lang, test_name: newValue, chapterid: rowNode.data.chapterid }
        } else if (column.colId === 'test_lang') {
          input = { test_lang: newValue, test_name: rowNode.data.test_name, chapterid: rowNode.data.chapterid }
        }

        var link = generateAnchorLink(input, globals.screen);
        var htmltitle = generateHTMLTitle(input, globals.screen);
        var testTitle = generateTitle(input, globals.screen);
        var fileName = generateFileName(input.test_name, input.test_lang);

        // Update the corresponding cells
        rowNode.setDataValue('link', link);
        rowNode.setDataValue('test_file_name', fileName);
        rowNode.setDataValue('test_file_title', testTitle);
        rowNode.setDataValue('t_title', htmltitle);
    } 
    if(params.data._id){
        editedRows[params.data._id] = params.data;
    }else if(params.data.testid){
        editedRows[params.data.testid] = params.data;
    } 
    
}


function placeHolder(params) {
    if (params.colDef.field == 'youtubeids') {
        return params.value ? params.value : '<span class="light-color">YTid~1~25, YTid~26~50</span>';
    } else if (params.colDef.field == 'playlistid') {
        return params.value ? params.value : '<span class="light-color">Playid~1~25, Playid~26~50</span>';
    } else if (params.colDef.field == 'sectiondata') {
        return params.value ? params.value : '<span class="light-color">Section Title~1~25, Section Title~26~50</span>';
    } else if (params.colDef.field == 'marksdata') {
        return params.value ? params.value : '<span class="light-color">PMarks~NMarks~1~25, PMarks~NMarks~26~50</span>';
    } else if (params.colDef.field == 'imageprefix') {
        return params.value ? params.value : '<span class="light-color">Image Prefix!</span>';
    } else if (params.colDef.field == 'linkedsubject') {
        return params.value ? params.value : '<span class="light-color">Linked Subject Key!</span>';
    } else {
        return params.value ? params.value : '<span class="light-color">Enter Value !</span>';
    }

}


function validateYoutubeIds(params) {
    return parseYouTubeIds(params.newValue, params.oldValue);
} 

function validateYoutubePlayListIds(params) {
    return parsePlaylistIds(params.newValue, params.oldValue);
} 
function validateMarks(params){
    return parseMarks(params.newValue, params.oldValue);
}
function validateSections(params){
    return parseSectionHeadings(params.newValue, params.oldValue);
}
 

function dataactions(params){
    const container = document.createElement('div'); 
    let buttonHtml = `` 
    buttonHtml+=`
    <a href="#" class="btn btn-sm btn-outline-warning texturepackimages" id="texturepackimages" title="Texture Packer Images to Github Folder from Google Drive" data-id="${params.data._id}">
          <i class="fas fa-yin-yang"></i> <i class="fa-solid fa-spinner  fa-spin-pulse" style="display: none;"></i>
    </a>`;  

    buttonHtml+=`
    <a href="#" class="btn btn-sm btn-outline-black  copytospritepath" id="copytospritepath" title="Texture Packer Images to Github Folder from Google Drive" data-id="${params.data._id}">
         <i class="fas fa-file-import"></i> <i class="fa-solid fa-spinner  fa-spin-pulse" style="display: none;"></i>
    </a>`;

    buttonHtml+=`
        <a href="#" class="btn btn-sm btn-outline-info move-ques-to-test-by-range" id="move-ques-to-test-by-range" title="Move Questions to New test by range" data-id="${params.data._id}">
            <i class="fa-solid fa-person-walking"></i>
            </a>`;  
    buttonHtml += `
      <a href='#' class="btn btn-sm btn-outline-primary move-all-ques-new-chapter" id="move-all-ques-new-chapter" title="Move All Questions to New Chapter" data-id="${params.data._id}">
      <i class="fa-solid fa-car-side"></i>
      </a>`;
    buttonHtml += `
      <a href='#' class="btn btn-sm btn-outline-danger copy-questions-to-new-collection" id="copy-questions-to-new-collection" title="Move All Questions to New Collection" data-id="${params.data._id}">
        <i class="fa-solid fa-plane"></i>
      </a>`;
    buttonHtml+=`
        <a href="#" class="btn btn-sm btn-outline-info copy-collection-details" id="copy-collection-details" title="Copy Collection details New Collection~New subject_key~New ChapterId~New TestId" data-id="${params.data._id}">
             <i class="fa-regular fa-clone"></i>
        </a>`;  
   
       
    container.innerHTML = buttonHtml;
    if(container.querySelector('.move-ques-to-test-by-range')){
        container.querySelector('.move-ques-to-test-by-range').addEventListener('click', (event) => handleButtonClick(event, params));  
    }
    if(container.querySelector('.move-all-ques-new-chapter')){
        container.querySelector('.move-all-ques-new-chapter').addEventListener('click', (event) => handleButtonClick(event, params));  
    }
    if( container.querySelector('.copy-questions-to-new-collection')){
        container.querySelector('.copy-questions-to-new-collection').addEventListener('click', (event) => handleButtonClick(event, params)); 
    }
    if(container.querySelector('.copy-collection-details')){
        container.querySelector('.copy-collection-details').addEventListener('click', (event) => handleButtonClick(event, params));  
    }
    if(container.querySelector('.texturepackimages')){
        container.querySelector('.texturepackimages').addEventListener('click', (event) => handleButtonClick(event, params));  
    } 

    if(container.querySelector('.copytospritepath')){
        container.querySelector('.copytospritepath').addEventListener('click', (event) => handleButtonClick(event, params));  
    }

    
    return container;
}

function seliniumactions(params){
    const container = document.createElement('div'); 
    let buttonHtml = ``
    if (params.data._id) {
        buttonHtml+=`
        <a href="#" class="btn btn-sm btn-outline-warning selinium-notes-download" id="selinium-notes-download" data-id="${params.data._id}" title="Total Questions in test">
            <i class="fa-solid fa-download"></i><i class="fa-solid fa-spinner  fa-spin-pulse" style="display: none;"></i>
        </a>`; 
    }
     
     
    container.innerHTML = buttonHtml;
    if(container.querySelector('.selinium-notes-download')){
        container.querySelector('.selinium-notes-download').addEventListener('click', (event) => handleButtonClick(event, params));  
    }
     

    return container;
}

function extraactions(params) {  
    const container = document.createElement('div'); 
    let buttonHtml = `<span class='total-recs'></span>`
    if (params.data._id) {
        buttonHtml+=`
        <a href="#" class="btn btn-sm btn-outline-warning calc-total-recs" id="calculate" data-id="${params.data._id}" title="Total Questions in test">
            <i class="fas fa-calculator"></i>
            </a>`; 
    }
     
    if (params.data.youtubeids && params.data._id) {
      buttonHtml += `
      <a href="#" class="btn btn-sm btn-outline-danger youtube-button" id="youtubeids" data-id="${params.data._id}" title="Update Youtube Ids">
          <i class="fab fa-youtube"></i>
      </a>`;
    }
    if (params.data.playlistid && params.data._id) {
      buttonHtml += `
      <a href="#" class="btn btn-sm btn-outline-danger playlist-button" id="playlistids" data-id="${params.data._id}" title="Update Playlist Ids">
          <i class="fas fa-ellipsis-v"></i>
      </a>`;
    }
    if (params.data.sectiondata && params.data._id) {
      buttonHtml += `
      <a href="#" class="btn btn-sm btn-outline-danger sections-button" id="sectiondata" data-id="${params.data._id}" title="Update Sections Data">
          <i class="fa-solid fa-section"></i>
      </a>`;
    }
    if (params.data.marksdata && params.data._id) {
      buttonHtml += `
      <a href="#" class="btn btn-sm btn-outline-danger marks-button" id="marksdata" data-id="${params.data._id}" skey="${params.data.subject_key}" chapterid="${params.data.chapterid}" testid="${params.data.testid}" title="Update marks for Questions">
          <i class="fa-solid fa-marker"></i>
      </a>`;
    }
    container.innerHTML = buttonHtml;
    if(container.querySelector('.calc-total-recs')){
        container.querySelector('.calc-total-recs').addEventListener('click', (event) => handleButtonClick(event, params));  
    }
    if( container.querySelector('.youtube-button')){
        container.querySelector('.youtube-button').addEventListener('click', (event) => handleButtonClick(event, params)); 
    }
    if(container.querySelector('.playlist-button')){
        container.querySelector('.playlist-button').addEventListener('click', (event) => handleButtonClick(event, params));
    }
    if(container.querySelector('.sections-button')){
        container.querySelector('.sections-button').addEventListener('click', (event) => handleButtonClick(event, params));  
    }
    if(container.querySelector('.marks-button')){
        container.querySelector('.marks-button').addEventListener('click', (event) => handleButtonClick(event, params)); 
    } 

    return container;
  }


function deleteRender(params) {
    const container = document.createElement('div'); 
    container.innerHTML = ` 
        <a href="#" class="deleteAgTableRow btn btn-sm btn-outline-danger" id='delete'>
          <i class="fa-solid fa-trash-can"></i>
        </a>
         
    `; 
    if(container.querySelector('.deleteAgTableRow')){
        container.querySelector('.deleteAgTableRow').addEventListener('click', (event) => handleButtonClick(event, params));  
    }
    return container;
}



function tutorialRender(params) {
    const container = document.createElement('div'); 
    container.innerHTML = ` 
        <a href="/notes/opencanvas/${params.data._id}" target="_blank" class="tutorialAgGrid btn btn-sm btn-outline-success" id='tutorial'>
         <i class="fa-solid fa-chalkboard-user"></i>
        </a>
         
    `;  
    return container;
}




function handleButtonClick(event, params) {
    const id = event?.currentTarget?.id;
    if (!id) return;

    const actionHandlers = {
        delete: () => deleteSubjectRowData(event, params),
        calculate: () => handleCalculate(event, params),
        youtubeids: () => handleSave(event, params, 'youtubeids', parseYouTubeIds),
        playlistids: () => handleSave(event, params, 'playlistid', parsePlaylistIds),
        sectiondata: () => handleSave(event, params, 'sectiondata', parseSectionHeadings),
        marksdata: () => handleSave(event, params, 'marksdata', parseMarks),
        'move-ques-to-test-by-range': () => moveQuestionsToAnotherTest(params),
        'move-all-ques-new-chapter': () => moveQuestionsToAnotherChapter(params),
        'copy-questions-to-new-collection': () => copyQuestionsToNewCollection(params),
        'copy-collection-details': () => copyCollectionDetails(params),
        'texturepackimages': () => texturepackimages(event, params),
        'copytospritepath': () => copytospritepath(event, params),
        'selinium-notes-download': () => seleniumNotesDownload(event, params)
        
    };

    const handler = actionHandlers[event.currentTarget.id];
    if (handler) handler();
}

function seleniumNotesDownload(event, params){
    console.log("Yet to implement")
}


function copytospritepath(event, params) {
    let spinner = $(event.currentTarget).find('.fa-spinner');
    $(spinner).show();
    if (params.data.test_image && params.data.test_image.length > 0) {
        bootbox.confirm('Are you sure you want Texture Pack Images?', async function (result) {
            if (result) { 
                bootbox.prompt('Enter the source Path ! ', async function (source) {
                    if (source) { 
                       
                        source  = source.replace(/\\/g, '\\\\');
                        source = source+"\\\\";
                        console.log(source);
                        ajaxRequest("/data/copytospritepath", 'POST', {imgpath:params.data.test_image, sourcepath: source} ,
                            function(result){
                                alert(result)
                                $(spinner).removeClass('fa-spin-pulse');
                            }, 
                            function(result){
                                alert(result.message)
                                $(spinner).hide();
                            }); 
                    }
                });
            }else{
                $(spinner).hide();
            }
        });
    } else {
        bootbox.alert('Image Path Missing Please check');
        $(spinner).hide();
    }

}
function texturepackimages(event, params){
    let spinner = $(event.currentTarget).find('.fa-spinner');
    $(spinner).show();
    if(params.data.test_image && params.data.test_image.length > 0){
        bootbox.confirm('Are you sure you want Texture Pack Images?', async function (result) {
            if (result) { 
                ajaxRequest("/data/texturepackimages", 'POST', {imgpath:params.data.test_image} ,
                    function(result){
                        alert(result.message)
                        $(spinner).removeClass('fa-spin-pulse');
                    }, 
                    function(result){
                        alert(result.message)
                        $(spinner).hide();
                    }); 
            }else{
                $(spinner).hide();
            }
        });
    }else{
            bootbox.alert('Image Path Missing Please check');
            $(spinner).hide();
    }
    
}

function copyCollectionDetails(params){ 
    //copyToClipboard(globals.subjdetails.subject_key+'~'+globals.subjdetails.collectionname+'~'+params.data.chapterid+'~'+params.data.testid)
    if(globals.screen == 'chaptertests'){
        copyToClipboard(params?.data?.chapterid+'~'+params?.data?.testid+'~'+globals?.subject_key+'~'+globals?.collection)
    }else{
        copyToClipboard(params?.data?.chapterid+'~'+params?.data?.testid+'~'+globals?.subjdetails?.subject_key+'~'+globals?.subjdetails?.collectionname)
    }
    
}

function handleCalculate(event, params) {
    const data = gridApi.getRowNode(params.data._id).data;
    const button = event.currentTarget;

    ajaxRequest("/notes/getCountOfRecords", 'POST', data,
        result => {
            console.log(event);
            const totalRecsSpan = button.closest('div').querySelector('.total-recs');
            if (totalRecsSpan) {
                totalRecsSpan.textContent = `${result}`;
            }
            console.log(result);
        },
        result => {
            console.log(result);
        }
    );
}

function handleSave(event, params, field, parseFunction) {
    const data = gridApi.getRowNode(params.data._id).data;
    const correct = parseFunction(data[field], "");

    if (correct && correct.length > 0) {
        saveTestFieldsByRange(data, field);
    }
}

function moveQuestionsToAnotherTest(params) {
    const data = gridApi.getRowNode(params.data._id).data;
    movequestionstoanothertest(data.testid);
}

function moveQuestionsToAnotherChapter(params) {
    const data = gridApi.getRowNode(params.data._id).data;
    movequestionstoanotherchapter(data.testid,data.chapterid);
}

function copyQuestionsToNewCollection(params) {
    const data = gridApi.getRowNode(params.data._id).data;
    moveColtoCol(data.testid, data.chapterid);
}




function deleteSubjectRowData(vent, params){ 
    if(params?.data?._id){
        bootbox.confirm('Are you sure you want to delete this row?', async function (result) {
            if (result) { 
                const response = await fetch('/notes/deletetest', {  method: 'POST', headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify({ id: params.data._id })
                }); 
                const result = await response.json(); 
                if (response.ok) { 
                    const rowNode = gridApi.getRowNode(params.data._id); 
                    gridApi.applyTransaction({ remove: [rowNode.data] }); 
                } else {
                    bootstrap_alert.error($('#alertplaceholder'),  "Error in deletion .. "+ result);
                } 
                
            }
        });
    }else{
        if(params?.data?._id){ 
            delete editedRows[params.data._id];
        }else if(params?.data?.testid){ 
            delete editedRows[params.data.testid];
        } 
        
        const rowNode = gridApi.getRowNode(params.data.testid); 
        gridApi.applyTransaction({ remove: [rowNode.data] }); 
    }
}








$(function () {

    

    $(document).on('click', '.ordersequenceasc', function(event){
        const rowData = [];
        gridApi.forEachNode((node, index) => {
            node.data.test_seq = index + 1; // Update sequence based on row index
            rowData.push(node.data);
        });  
        gridApi.refreshCells({ force: true }); 
        triggerCellValueChangedForColumn("test_seq");
    });


    $(document).on('click', '.triggerrowdatachange',function(event){
        stopscroll(event);
        triggerCellValueChangedForColumn("test_name");
        clearCellValuesChangeForColumn("mobile_file_name");
    });


    $(document).on('click', '.copy-subject-details',function(event){
        stopscroll(event);
        copyToClipboard(globals.subjdetails.subject_key +"~"+globals.subjdetails.collectionname); 
    });
    

    $(document).on('click', '.seleniumActions', function (event) {
        stopscroll(event);
        var visibility = columnApi.getColumn("selenium-actions").visible
        columnApi.setColumnVisible("selenium-actions", !visibility);
         
    });

    $(document).on('click', '.dataActions', function (event) {
        stopscroll(event);
        var visibility = columnApi.getColumn("data-actions").visible
        columnApi.setColumnVisible("data-actions", !visibility);
         
    });

    $(document).on('click', '.extraActions', function (event) {
        stopscroll(event);
        var visibility = columnApi.getColumn("extra-actions").visible
        columnApi.setColumnVisible("extra-actions", !visibility);
         
    });

    $(document).on('click', '.editAGTable', function (event) {
        stopscroll(event);
        showFields();
        makeColumnsEditable(); 
        globals.editing = true;
        columnApi.setColumnVisible("delete-action", true);
    });
    var table_expanded = false
    $(document).on('click', '.expandAGTable', function (event) {
        stopscroll(event);
        if (table_expanded) {
            
            gridApi.setGridOption("domLayout", "normal");
            columnApi.setColumnVisible("link", false);
            columnApi.setColumnVisible("test_file_title", false);
            columnApi.setColumnVisible("mobile_file_name", false);
            columnApi.setColumnVisible("t_title", false);
            table_expanded = false;
           
             
        } else {
            columnApi.setColumnVisible("link", true);
            columnApi.setColumnVisible("test_file_title", true);
            columnApi.setColumnVisible("mobile_file_name", true);
            columnApi.setColumnVisible("t_title", true);
            table_expanded = true;

            
        }
    });


    $(document).on('click', '.cancelEditAGTable', function (event) {
        stopscroll(event);
        hideFields()
        globals.editing = false;
        columnApi.getColumns().forEach((col) => {
            if (col.colDef.editable != undefined) {
                col.colDef.editable = false;
            }
        });
        columnApi.setColumnVisible("delete-action", false);
    });

    $(document).on('click', '.saveAGTableAllRows', function (event) {
        stopscroll(event);
        saveAllTestRows();
        globals.editing = false;
    });

    $(document).on('click', '.addAGTableRow', function (event) {
       
        const newRow = {
            _id: generateTempId(),
            test_seq: generateDefaultSeq(),
            testid: generateUniqueTestId(),
            test_name: '',
            subject_key: globals.subjdetails.subject_key,
            subjectid: globals.subjdetails.subjectid,
            chapterid: globals.subjdetails.chapterid,
            published: decisionOptions[0],
            test_lang: languageOptions[1],
            test_image: '',
            yoututbeids: '',
            playlistid: '',
            sectiondata: '',
            marksdata: '',
            imageprefix: '',
            is_cdn_https: decisionOptions[0],
            link: '',
            test_file_title: '',
            test_file_name: '',
            t_title: '',
            actionrole: userRoleOptions[0] // Default to first role
        };  
        gridApi.applyTransaction({ add: [newRow] });
         
    });

    $(document).on('click', '.updateTableSeqIndex', function (event) {
        stopscroll(event);
         
    });
});


function saveAllTestRows() {    
    let rowsToSave = Object.values(editedRows); 
    for(row in rowsToSave){

        if(rowsToSave[row].test_file_name && rowsToSave[row].test_file_name.length > 0){}else{
            rowsToSave[row].test_file_name = generateFileName(rowsToSave[row].test_name, rowsToSave[row].test_lang)
        }
        //rowsToSave[row].published = true;
        
        if(rowsToSave[row].test_lang && rowsToSave[row].test_lang.length > 0){}else{
            rowsToSave[row].test_lang = "en"
        } 
    }
    rowsToSave = updateMobileFileNames(rowsToSave);

    let input = {
        data : rowsToSave
    } 
    let tempIds = {}

    rowsToSave.forEach((value, index)=>{
        if(value._id.startsWith("temp_")){
            tempIds[value.testid] = value._id;
            delete value._id;
        }
    })

    if(rowsToSave && rowsToSave.length > 0){
    ajaxRequest('/notes/savetests', 'POST', input,
        function (result) {
            if(result && result.length > 0 && result[0]){ 
                if(globals.screen == 'testPage'){                      
                    Object.keys(tempIds).forEach((key,id)=>{
                        console.log("Test");
                        const rowNode = gridApi.getRowNode(tempIds[key]);
                        const resultid = getMongoIDUsingTestId(key, result);
                        rowNode.setData({ ...rowNode.data, _id: resultid });
                    });
                    
                }
                editedRows = {}; //important 
                bootstrap_alert.success($('#alertplaceholder'),  result.length + " Records Saved successfully");
            }else{
                bootstrap_alert.error($('#alertplaceholder'),  result);
            }
        },
        function (result) {
            bootstrap_alert.error($('#alertplaceholder'),  result);
            
        }
    );
    }else{
        bootstrap_alert.error($('#alertplaceholder'),  "0 rows found ");
    }

} 


function updateMobileFileNames(jsonArray) {
    // Step 1: Group objects by t_title
    const groups = jsonArray.reduce((acc, obj) => {
        if (!acc[obj.t_title]) {
            acc[obj.t_title] = [];
        }
        acc[obj.t_title].push(obj);
        return acc;
    }, {});

    // Step 2: Iterate over each group and update mobile_file_name
    for (const group of Object.values(groups)) {
        // Find the object with test_lang == "en"
        const enObject = group.find(obj => obj.test_lang === "en");
        if (enObject) {
            const enId = enObject._id; // Get the _id of the English object
            // Update mobile_file_name for all objects in the group where mobile_file_name is empty
            group.forEach(obj => {
                if (!obj.mobile_file_name) { // Check if mobile_file_name is empty
                    obj.mobile_file_name = enId;
                }
            });
        }
    }

    return jsonArray; // Return the modified array
}

function getMongoIDUsingTestId(testid, result){
    for (const value of result) {
        if (value.testid == testid) {
            return value._id;
        }
    }
    return '';
}



function getRowNodeByTestId(testid) {
    let foundNode = null;
    gridApi.forEachNode(node => {
        if (node.data.testid === testid) {
            foundNode = node;
        }
    });
    return foundNode;
}


function generateDefaultSeq(){
    let allIds = [];
    gridApi.forEachNode(node => {
        if (node.data.test_seq !== undefined) {
        allIds.push(node.data.test_seq);
    }
    });
    let maxId = allIds.length > 0 ? Math.max(...allIds) : 0;
   return maxId + 1; 
}

function generateUniqueTestId(){ 
    let allIds = [];
    gridApi.forEachNode(node => {
        if (node.data.testid !== undefined) {
        allIds.push(node.data.testid);
    }
    });
    let maxId = allIds.length > 0 ? Math.max(...allIds) : 0;
   return maxId + 1; 
    
}
 
