$(function () {
  $(document).on("click", ".deleteallquestions", function (event) {
    stopscroll(event);
    var qlist = $("#textrangeforedit").val().split("-");
    if (qlist.length == 2) {
      let data = {
        testid: testdata.testid,
        chapterid: testdata.chapterid,
        subject_key: testdata.subject_key,
        start: qlist[0],
        end: qlist[1]
      }
      bootbox.confirm(
        "Are you sure want to delete All Questions?",
        function (result) {
          if (result) {
            ajaxRequest(
              "/tests/deleteallquestions",
              "POST",
              data,
              function callback(res) {
                console.log(res);
                alert(res.toString());
                window.location.reload(true);
              },
              questionsavefail
            );
          }
        }
      );
    }
  });


  $(document).on('click', '.downloadfornewmobile', function (event) {
    stopscroll(event);
    downloadGitHubmobilefile(this, event);
  });

  $(document).on('click', '.downloadfornewmobile_examsnetapp', function (event) {
    stopscroll(event);
    downloadGitHubmobilefileExamsnetApp(this, event);
  });

  $(document).on('click', '.getclonetestdetails', function (event) {
    stopscroll(event);
    getclonetestdetails(this, event);
  });

  $(document).on('click', '.copy-collection-details', function (event) {
    stopscroll(event);
    copyCollectionDetailsForQuestionPage();
  });

  $(document).on('click', '.printquestionspage', function (event) {
    stopscroll(event);
    openPrintableQuestionsPopup();
  });


  $(document).on('click', '.publishQuestionsToS3', function (event) {
    stopscroll(event);
    publishQuestionsDataToS3(this, event);
  });

  $(document).on('click', '.updatelinkedquestion', function (event) {
    stopscroll(event);
    updatelinedquestion(this, event);
  });


  $(document).on('click', '.clonelinkedquestion', function (event) {
    stopscroll(event);
    moveQuestionPopup(this, event);

  });

  $(document).on('click', '.editquestionsbyrange', function (event) {
    stopscroll(event);
    editquestionsbyseqrange();

  });

  $(document).on('click', '.sortquestionseq', function (event) {
    stopscroll(event);
    updateQuestionNoSeqence();

  });

  $(document).on('click', '.jeequestionpatterncheck', function (event) {
    stopscroll(event);
    validateJeeQuestionPattern();
  });

  $(document).on('click', '.updatelinkedquestions', function (event) {
    stopscroll(event);
    updatelinkedquestions();

  });



  $(document).on('click', '.updateparabyrange', function (event) {
    stopscroll(event);
    updateParagraphsAttrRange();
  });

  $(document).on('click', '.zeroseqbyrange', function (event) {
    stopscroll(event);
    zeroQuestionNumberBySeqRange();
  });

  $(document).on('click', '.validateQuestions', function (event) {
    stopscroll(event);
    validateMissingQuestions(this, event);
  });

  $(document).on('click', '.validateMissingAnswers', function (event) {
    stopscroll(event);
    validateMissingAnswers(this, event);
  });



  $(document).on('click', '.validateImages', function (event) {
    stopscroll(event);
    validateMissingImages(this, event);
  });


  $(document).on('change', '.answer-type', function (event) {
    console.log(`Selected value for ${event.target.name}:`, event.target.value);

    const $question = $(this).closest("#question");
    const $answersList = $question.find('#answerslist #anschoice');

    if (event.target.value === "C" || event.target.value === "R") {
      if ($answersList.length > 0) {
        const type = event.target.value === "C" ? "checkbox" : "radio";
        $answersList.attr("type", type);
      }
    }


  });


  $(document).on('change', '.anschoice', function (event) {
    console.log('Answer choic changed.')
    const selectedValues = Array.from(document.querySelectorAll(`input[name="${event.target.name}"]:checked`)).map(checkedBox => checkedBox.value);
    $(this).closest('#question').find('#correctanswers').html(selectedValues.toString());

    if ($(this).is(':checked')) {
      $(this).closest('#answer').find("#lanslblchoice").prop({ "checked": true });
    } else {
      $(this).closest('#answer').find("#lanslblchoice").prop({ "checked": false });
    }
  });


  $(document).on('change', '.tanschoice', function (event) {
    console.log(`Selected value for ${event.target.name}:`, event.target.value);
    let values = selectedTRAnswers(this);
    $(this).closest('#question').find('#correctanswers').html(values.toString());
    if ($(this).is(':checked')) {
      $(this).closest('#transchoice').find("#ltranslblchoice").prop({ "checked": true });
    } else {
      $(this).closest('#transchoice').find("#ltranslblchoice").prop({ "checked": false });
    }
  });

  $(document).on('change', '.questionType', function (event) {
    console.log(`Selected value for ${event.target.name}:`, event.target.value);
    if (event.target.value === "P") {
      $(this).closest("#question").find('.add1answerchoice').hide();
      $(this).closest("#question").find('#answerslist').hide();
      $(this).closest("#question").find('#answerspanel').hide();
      $(this).closest("#question").find('#solutionpanel').hide();


    } else {
      $(this).closest("#question").find('.add1answerchoice').show();
      $(this).closest("#question").find('#answerslist').show();
      $(this).closest("#question").find('#answerspanel').show();
      $(this).closest("#question").find('#solutionpanel').show();
    }


  });



  $(document).on('click', function (event) {
    console.log("Click event fired.")
    var target = $(event.target);
    workingquestion = target.closest('li#question');
  });

  //Temporary logic to use for clone question..
  document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === 'd') {
      event.preventDefault(); // Prevent the default action
      // Check if the event target is a textarea or input field
      if (event.target.tagName === 'TEXTAREA' || (event.target.tagName === 'INPUT' && event.target.type === 'text')) {

      } else {
        if (workingquestion) {
          $(workingquestion).find(".clonelinkedquestion").trigger('click');
        }
      }
    }
  });

  $(document).on('input', '.decimalinput', function (event) {
    let value = $(this).val();

    // Regex to allow optional negative sign and up to 4 decimal places
    const regex = /^-?\d*(\.\d{0,4})?$/;

    if (!regex.test(value)) {
      // Attempt to clean the value
      value = value
        .replace(/[^0-9.-]/g, '')          // Remove all but digits, dot, minus
        .replace(/(?!^)-/g, '')            // Remove minus signs not at the start
        .replace(/\.{2,}/g, '.')           // Collapse multiple dots
        .replace(/^(-?)\./, '$10.');       // Handle ".5" to "0.5" or "-.5" to "-0.5"

      // Limit to 4 decimal places
      const parts = value.split('.');
      if (parts.length === 2) {
        parts[1] = parts[1].slice(0, 4);
        value = parts[0] + '.' + parts[1];
      }

      $(this).val(value);
    }
  });



  $(document).on('input', '.decimalinput_oldd', function (event) {
    let value = $(this).val();
    // Regular expression to allow only decimal numbers with up to four decimal places
    const regex = /^\d*(\.\d{0,4})?$/;

    // Check if the value matches the regex
    if (!regex.test(value)) {
      // If the input is invalid, remove invalid characters
      $(this).val(value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace(/^\.|\.$/g, ''));
    }
  });


  $(document).on('click', '.addyearnumbertoquestion', function (event) {
    stopscroll(event);
    addyearnumbertoquestion(event, this);
  });

  $(document).on('click', '.findandreplaceinquestion', function (event) {
    stopscroll(event);
    findandreplaceinquestion(event, this);
  });

  $(document).on('click', '.bulkanswerimport', function (event) {
    stopscroll(event);
    openBulkAnswerImportDialog();
  });

  $(document).on('click', '.bulkclonelinkedquestions', function (event) {
    stopscroll(event);
    openBulkCloneLinkedQuestionsDialog();
  });

  $(document).on('click', '.bulkchapternamesupdate', function (event) {
    stopscroll(event);
    openBulkChapterNamesUpdateDialog();
  });

  $(document).on('click', '.editquestion', function (event) {
    stopscroll(event);
    showQuestionActions(this);
  });

  $(document).on('click', '.canceleditquestion', function (event) {
    stopscroll(event);
    hideQuestionActions(this);
  });




  $(document).on('click', '.deletequestion', function (event) {
    stopscroll(event);

    let mid = $(this).closest('#question').attr("mid");
    let question = $(this).closest('#question');
    if (mid && mid.length > 0) {

      bootbox.confirm("Are you sure want to delete Answer?", function (result) {
        if (result) {

          let collection = $('#testdetails').attr('collection');
          let data = {
            collection: collection,
            _id: mid
          }
          ajaxRequest('/tests/deletequestion', 'POST', data, function callback(res) {
            if (data._id && data._id.length > 0) {
              $(question).remove();
            }
          }, questionsavefail);

        }
      });
    } else {
      $(this).closest('#question').remove();
    }
  });

  $(document).on('click', '.addnewquestion', function (event) {
    console.log("Add New Question..")
    stopscroll(event);
    let prevseq = $('#questionsList>li:last-child').find('#questionseqlbl').html();
    if (prevseq) {
      prevseq = Number(prevseq) + 1;
    } else {
      prevseq = 1;
    }
    let qseq = $('#questionsList > li').length;
    let tpl = $('#tpl_question').clone();

    tpl.find('#question').attr('qid', qseq);
    tpl.find('#question').attr('seq', qseq);

    let seq = questionIdGenerator();
    tpl.find('#question').attr('questid', seq);
    $(tpl).find('#questionseqlbl').html(prevseq);
    $(tpl).find('#questionseqText').attr("value", prevseq);
    tpl.find('#questionType').attr('name', 'questionType' + seq);
    tpl.find('#answerType').attr('name', 'answerType' + seq);
    tpl.find('#haspara').attr('name', 'haspara' + seq);

    $('#questionsList').append(tpl.html());
    //scrollToElement($("#question[questid='" + (seq - 1) + "']"));
    window.scrollTo(0, document.body.scrollHeight);
  });


  $(document).on('click', '.savequestion', function (event) {
    stopscroll(event);
    saveQuestion(this, event);
  });


  $(document).on('click', '.deleteanswer', function (event) {
    stopscroll(event);
    deleteAnswer(this, event);
  });

  $(document).on('click', '.add4answerchoice', function (event) {
    stopscroll(event);
    add4answerchoices(this, event);
  });

  $(document).on('click', '.add1answerchoice', function (event) {
    stopscroll(event);
    add1answerchoice(this, event);
  });



  $(document).on('change', '#clonechpaterlist', function (event) {
    stopscroll(event);
    changeclonetestlist(this, event);
  });

  $(document).on('change', '.clonetestlist', function (event) {
    stopscroll(event);
    //changeclonetestquery(this, event);
    setquerykeys(this, event);
  });

  $(document).on('input', '.clonequestionquery', function (event) {
    stopscroll(event);
    //setquerykeys(this, event); 
  });

});

function add4answerchoices(ele, vent) {
  let radioType = $(ele).closest('#question').find('#answerType:checked').val();
  let qid = $(ele).closest('#question').attr('questid');
  if (radioType && radioType.length > 0) {
    for (let i = 0; i < 4; i++) {
      let answers = $(ele).closest('#question').find('#answerslist');
      let seq = answers.find('li').length;
      if (radioType == "C") {
        $(answers).append(adjustSeqForNewAnswers($('#tpl_answer_c').clone(), seq, qid));
      } else if (radioType == "R") {
        $(answers).append(adjustSeqForNewAnswers($('#tpl_answer_r').clone(), seq, qid));
      }
    }
  } else {
    bootbox.alert("Please Select Answer Type Radio:", function (result) { });
    return false;
  }
}

function add1answerchoice(ele, vent) {

  let radioType = $(ele).closest('#question').find('#answerType:checked').val();
  let answers = $(ele).closest('#question').find('#answerslist');
  let seq = answers.find('li').length;
  let qid = $(ele).closest('#question').attr('questid');

  if (radioType && radioType.length > 0) {
    if (radioType == "TX") {
      $(answers).append(adjustSeqForNewAnswers($('#tpl_answer_x').clone(), seq, qid));
    } else if (radioType == "C") {
      $(answers).append(adjustSeqForNewAnswers($('#tpl_answer_c').clone(), seq, qid));
    } else if (radioType == "R") {
      $(answers).append(adjustSeqForNewAnswers($('#tpl_answer_r').clone(), seq, qid));
    } else if (radioType == "TR") {
      bootbox.prompt({
        title: "Enter Numer of Rows!",
        inputType: 'number',
        size: "small",
        value: "3",
        callback: function (result) {
          if (result) {
            let temp = $('#tpl_answer_tr_title').find('#answer').clone();
            temp = $(temp)[0];
            for (let rw = 0; rw < result; rw++) {
              $(temp).append($('#tpl_answer_tr').clone().html());
            }
            $(answers).append(adjustSeqForTableRowAnswers(temp, seq, qid));
          }
        }
      });
    }
  } else {
    bootbox.alert("Please Select Answer Type Radio:", function (result) { });
    return false;
  }

}





function adjustSeqForTableRowAnswers(tpl_ele, seq, qid) {
  $(tpl_ele).attr('aseq', seq);
  $(tpl_ele).find("#transchoice").each(function (id, val) {
    $(val).find('#tanschoice').attr('name', 'tanschoice' + qid + seq);
    $(val).find('#tanschoice').attr('value', id);
  });
  return tpl_ele;
}


function add4answerchoice(ele, vent) {
  console.log("Add One answer choice")
}

function deleteAnswer(ele, vent) {
  let answers = $(ele).closest('#answerslist');
  if (ele) {
    bootbox.confirm("Are you sure want to delete Answer?", function (result) {
      if (result) {
        $(ele).closest('#answer').remove();
        $(answers).find('li').each(function (seq, val) {
          val.setAttribute('aseq', seq);
          $(val).find('#anschoice').val(seq);
        });
      }
    });
  }
}

function questionIdGenerator() {
  let value = 0;
  $('#questionsList > li').each(function () {
    const questid = Number($(this).attr('questid'));
    if (questid > value) {
      value = questid;
    }
  });
  return ++value;
}


function hideQuestionActions(that) {


  let clbls = $(that).closest('#question').find('.clbl');
  let ctxts = $(that).closest('#question').find('.ctxt');
  let flbls = $(that).closest('#question').find('.flbl');
  let ftxts = $(that).closest('#question').find('.ftxt');

  clbls.each(function () {
    $(this).toggleClass('clbl ctxt');
  });
  ctxts.each(function () {
    $(this).toggleClass('ctxt clbl');
  });
  flbls.each(function () {
    $(this).toggleClass('flbl ftxt');
  });

  ftxts.each(function () {
    $(this).toggleClass('ftxt flbl');
  });

  $(that).closest('#question').toggleClass('custom-bg-tbuddy custom-bg-tbuddy-highlight')

}



function showQuestionActions(that) {
  //First Read then adjust..  to avoid over riding. 
  let clbls = $(that).closest('#question').find('.clbl');
  let ctxts = $(that).closest('#question').find('.ctxt');
  let flbls = $(that).closest('#question').find('.flbl');
  let ftxts = $(that).closest('#question').find('.ftxt');

  clbls.each(function () {
    $(this).toggleClass('clbl ctxt');
  });
  ctxts.each(function () {
    $(this).toggleClass('ctxt clbl');
  });
  flbls.each(function () {
    $(this).toggleClass('flbl ftxt');
  });

  ftxts.each(function () {
    $(this).toggleClass('ftxt flbl');
  });

  $(that).closest('#question').toggleClass('custom-bg-tbuddy custom-bg-tbuddy-highlight');
  $(that).closest('#question').find('.previewspan').each((i, ele) => {
    $(ele).find('.previewsrc').val($(ele).find('.valuetextbox').val());
  })

}



function copyImageTag(ele, eve) {
  stopscroll(eve);
  let imageTag = '';
  var qtype = $(ele).closest('#question').find("#questionType:checked").val();
  if (qtype && qtype.length > 0) { } else { qtype = "Q" }
  if ($(ele).closest('div#solutionpanel').length > 0) {
    qtype = 'sol';
  }
  qtype = qtype.toLowerCase();
  if (imageprefix && imageprefix.length > 0) {
    let imgname = imageprefix + '_' + qtype + '_' + $(ele).closest('#question').find('#questionseqText').val();
    imgname = imgname.replaceAll(/\./g, '_');
    
    // Resolve base CDN URL using the cdnroot key, matching CSSHEAD helper mapping dynamically
    let cdnKey = (typeof cdnroot !== 'undefined' && cdnroot) ? cdnroot : 'CDN1';
    let baseCDN = (typeof cdnRootPaths !== 'undefined' && cdnRootPaths && cdnRootPaths[cdnKey]) ? cdnRootPaths[cdnKey] : 'https://examsnet.github.io/cdn/img/';
    
    // Build folder path from the CSS file path (imagepath) if available and valid, otherwise fall back to imageprefix parsing
    let cssFile = (typeof imagepath !== 'undefined' && imagepath && imagepath !== 'temp') ? imagepath.split(',')[0].trim() : '';
    let folderPath = '';
    if (cssFile && cssFile.toLowerCase().endsWith('.css')) {
      let folderName = cssFile.replace(/\.css$/i, '');
      folderPath = baseCDN + folderName + '/';
    } else {
      let parts = imageprefix.split('_');
      let year = parts[parts.length - 1];
      if (/^\d{4}$/.test(year)) {
        let rest = parts.slice(0, parts.length - 1).join('/');
        folderPath = baseCDN + rest + '/' + year + '/';
      } else {
        folderPath = baseCDN + parts.join('/') + '/';
      }
    }
    
    imageTag = '<div class="hscrollenable"><img src="' + folderPath + imgname + '.png" /></div>';
  } else {
    // Fallback if no prefix is set
    let defaultCDN = (typeof cdnRootPaths !== 'undefined' && cdnRootPaths && cdnRootPaths['CDN1']) ? cdnRootPaths['CDN1'] : 'https://examsnet.github.io/cdn/img/';
    imageTag = '<div class="hscrollenable"><img src="' + defaultCDN + '<<imgname>>.png" /></div>';
  }
  console.log(imageTag);
  copyToClipboard(imageTag);
}


function saveQuestion(ele, eve) {
  console.log("save Question triggered...");
  const data = {
    collection: $('#testdetails').attr('collection'),
    question: getQuestionData($(ele).closest('#question'))
  };

  const saveurl = '/tests/saveQuestion';
  const { answertype, questiontype } = data.question;
  const hasAnswers = $(ele).closest('#question').find('#answerslist>li').length > 0;

  if ((questiontype === "P") ||
    (questiontype === "Q" &&
      (["TX", "TR", "R", "C", "NC"].includes(answertype)) &&
      (["TX", "TR", "R", "C"].includes(answertype) ? hasAnswers : true))) {

    ajaxRequest(saveurl, 'POST', data, function callback(res) {
      if (data._id && data._id.length > 0) {

      } else {
        if (res?.['_id']?.length > 0) {
          $(ele.closest('#question')).attr('mid', res._id);
        }
      }
      questionsavesuccess(res, ele);

    }, questionsavefail);

  } else {
    alert('Add Answer Choices or Select Paragraph type or "No Choice" type');
  }

}
function preprocessQuestionToTex(question) {
  if (!question || typeof question !== 'string') {
    return '';
  }
  return String(question).trim();
}

function getQuestionPreviewData(parentelement, optype) {
  const questionKatexSource = sanitizequestion($(parentelement).find('#questionText').val());
  let questiondata = {
    _id: $(parentelement).attr('mid'),
    subject_key: $('#testdetails').attr('subject_key'),
    chapterid: $('#testdetails').attr('chapterid'),
    testid: $('#testdetails').attr('testid'),
    questionid: $(parentelement).attr('questid'),
    question: $(parentelement).find('#questiontextlbl').html(),
    question_katex: questionKatexSource,
    section: $(parentelement).find('#section').html().trim(),
    answertype: $(parentelement).find('#answerType:checked').val(),
    isverified: $(parentelement).find('#isverified:checked').val(),
    questiontype: $(parentelement).find('#questionType:checked').val(),

    yttime: $(parentelement).find('#yttime').html(),
    playlistid: $(parentelement).find('#playlistid').html(),
    yturl: $(parentelement).find('#yturl').html()
  }
  // Convert to LaTeX - read from raw input field #questionText
  questiondata.questiontex = preprocessQuestionToTex(questionKatexSource);
  questiondata.questionseq = $(parentelement).find('#questionseqText').val();
  if (questiondata.questiontype !== "P") {
    const isChecked = document.getElementById('canpublishsols').checked;
    if (isChecked) {
      const solutionKatexSource = sanitizequestion($(parentelement).find('#solutionText').val());
      questiondata.solution = $(parentelement).find('#solutionlbl').html();
      questiondata.solution_katex = solutionKatexSource;
      // Convert solution to LaTeX - read from raw input field #solutionText
      questiondata.solutiontex = preprocessQuestionToTex(solutionKatexSource);
    } else {
      questiondata.solution = '';
      questiondata.solution_katex = '';
      questiondata.solutiontex = '';
    }

    questiondata.haspara = $(parentelement).find('#haspara:checked').val();
    questiondata.questiontype = $(parentelement).find('#questionType:checked').val();


    questiondata.quesmarks = $(parentelement).find('#quesmarks').html(),
      questiondata.quesnegmarks = $(parentelement).find('#quesnegmarks').html(),

      questiondata.answers = []
    if (questiondata.answertype !== "TR") {
      const rname = $(parentelement).find('#anschoice').attr('name');
      if (questiondata.answertype === "TX") {
        let textanswer = $(parentelement).find('#anstextlbl').html();
        // Convert to LaTeX - read from raw input field #ansvaltextbox
        let textanswerRaw = $(parentelement).find('#ansvaltextbox').val();
        questiondata.answers.push({
          text: textanswer,
          text_katex: sanitizequestion(textanswerRaw),
          textex: preprocessQuestionToTex(textanswerRaw),
          seq: 0
        });
        questiondata.correct = [textanswer];
      } else {
        questiondata.correct = selectedAnswers(rname);
        $(parentelement).find('#answerslist>li').each(function (id, val) {
          const answerText = sanitizequestion($(val).find('#anstextlbl').html());
          // Convert to LaTeX - read from raw input field #ansvaltextbox
          const answerTextRaw = $(val).find('#ansvaltextbox').val();
          questiondata.answers.push({
            text: answerText,
            text_katex: sanitizequestion(answerTextRaw),
            textex: preprocessQuestionToTex(answerTextRaw),
            seq: val.getAttribute('aseq')
          });
        });
      }
    } else if (questiondata.answertype == "TR") {
      questiondata.correct = []
      const tqid = $(parentelement).attr('questid');
      $(parentelement).find('#answerslist>li').each(function (id, val) {
        const qn = val.getAttribute('aseq');
        const selectedVal = $(val).find(`input[name=tanschoice${tqid}${qn}]:checked`).val();
        if (selectedVal && selectedVal.length > 0) {
          questiondata.correct.push(`${qn}~${selectedVal}`);
        }
        const choices = [];
        $(val).find('div#transchoice').each(function (idx, valu) {
          const choiceText = sanitizequestion($(valu).find('#anstextlbl').html());
          // Convert to LaTeX - read from raw input field #ansvaltextbox
          const choiceTextRaw = $(valu).find('#ansvaltextbox').val();
          choices.push({
            "text": choiceText,
            "text_katex": sanitizequestion(choiceTextRaw),
            "textex": preprocessQuestionToTex(choiceTextRaw),
            "seq": idx
          });
        });
        questiondata.answers.push({ "fieldname": $(val).find('#ansfield').val(), "choices": choices });
      });
    }
  }
  if (optype == 'download' && questiondata.correct && questiondata.correct.length > 0) {
    questiondata.correct = questiondata.correct.toString()
  }
  return questiondata;
}


function getQuestionData(parentelement) {
  let questiondata = {
    _id: $(parentelement).attr('mid'),
    subject_key: $('#testdetails').attr('subject_key'),
    chapterid: $('#testdetails').attr('chapterid'),
    testid: $('#testdetails').attr('testid'),
    questionid: $(parentelement).attr('questid'),
    question_katex: sanitizequestion($(parentelement).find('#questionText').val()),
    answertype: $(parentelement).find('#answerType:checked').val(),
    isverified: $(parentelement).find('#isverified:checked').val(),
    questiontype: $(parentelement).find('#questionType:checked').val(),
    questionseq: $(parentelement).find('#questionseqText').val(),
    //yttime : $(parentelement).find('#yttime').html(),
    //playlistid : $(parentelement).find('#playlistid').html(),
    //yturl : $(parentelement).find('#yturl').html()  

  }

  if (questiondata.questiontype !== "P") {
    questiondata.solution_katex = sanitizequestion($(parentelement).find('#solutionText').val()),
      questiondata.haspara = $(parentelement).find('#haspara:checked').val(),
      questiondata.questiontype = $(parentelement).find('#questionType:checked').val(),


      questiondata.quesmarks = $(parentelement).find('#quesmarks').html(),
      questiondata.quesnegmarks = $(parentelement).find('#quesnegmarks').html(),

      questiondata.answers = []
    if (questiondata.answertype !== "TR") {
      const rname = $(parentelement).find('#anschoice').attr('name');
      if (questiondata.answertype === "TX") {
        let textanswer = $(parentelement).find('#ansvaltextbox').val();
        questiondata.answers.push({ text_katex: sanitizequestion(textanswer), seq: 0 })
        questiondata.correct = [textanswer];
      } else {
        questiondata.correct = selectedAnswers(rname);
        $(parentelement).find('#answerslist>li').each(function (id, val) {
          questiondata.answers.push({
            text_katex: sanitizequestion($(val).find('#ansvaltextbox').val()),
            seq: val.getAttribute('aseq')
          });
        });
      }
    } else if (questiondata.answertype == "TR") {
      questiondata.correct = []
      const tqid = $(parentelement).attr('questid');
      $(parentelement).find('#answerslist>li').each(function (id, val) {
        const qn = val.getAttribute('aseq');
        const selectedVal = $(val).find(`input[name=tanschoice${tqid}${qn}]:checked`).val();
        if (selectedVal && selectedVal.length > 0) {
          questiondata.correct.push(`${qn}~${selectedVal}`);
        }
        const choices = [];
        $(val).find('div#transchoice').each(function (idx, valu) {
          choices.push({ "text_katex": sanitizequestion($(valu).find('#ansvaltextbox').val()), "seq": idx });
        });
        questiondata.answers.push({ "fieldname": $(val).find('#ansfield').val(), "choices": choices });
      });
    }
  }
  return questiondata;
}




function questionsavesuccess(res, ele) {
  console.log("Question save success called..")
  if (res?.['_id']) {
    bootstrap_alert.success($(ele.closest('#question')).find('#alertplaceholder'), "Question Saved Successfully");
  } else if (res?.error) {
    bootstrap_alert.error($(ele.closest('#question')).find('#alertplaceholder'), "Question Save Error");
  } else if (res?.success) {
    bootstrap_alert.error($(ele.closest('#question')).find('#alertplaceholder'), "Question Save Error, Session Expired Please Login Again");
  }


  let tele = $(ele).closest('#question');

  $(tele).find('#questiontextlbl').html($(tele).find('#quespreview').html());
  $(tele).find('#questionseqlbl').html($(tele).find('#questionseqText').val());
  $(tele).find('#solutionlbl').html($(tele).find('#solutionpreview').html());
  $(tele).find('#answerslist li').each(
    function (id, val) {
      $(val).find('#anstextlbl').html($(val).find('#anspreview').html());
      if ($(val).find('#anschoice:checked').length > 0) {
        $(val).find('#anslblchoice').attr({ "checked": true }).prop({ "checked": true });
      }
    }
  );

  hideQuestionActions(ele)
}




function questionsavefail(result) {
  console.log(result);
}


function sanitizequestion(input) {

  let ele = $('<div>' + input + '</div>')
  if ($(ele).children().length > 0) {
    $(ele).children().each(function (i, v) {
      if ($(v).is("p")) {
        $(v).append('<br />').contents().unwrap();
      }
    })
  }


  let output = ele.html().replace(/ /g, ' ');
  output = decodeHtmlEntities(output);
  output = output.trim();

  return output;
}

function decodeHtmlEntities(value) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = String(value || '');
  return textarea.value;
}


function selectedAnswers(elename) {
  let options = [];
  $("[name=" + elename + "]:checked").each(
    function (id, val) {
      options.push(val.value);
    }
  );
  return options;
}






function selectedTRAnswers(ele) {
  let qid = $(ele).closest('#question').attr('questid');

  let options = [];
  $(ele).closest('#answerslist').find('li').each(function (id, val) {
    let qn = val.getAttribute('aseq');
    if ($(val).find('input[name=tanschoice' + qid + qn + ']:checked').val() && $(val).find('input[name=tanschoice' + qid + qn + ']:checked').val().length > 0) {

      options.push(qn + '~' + $(val).find('input[name=tanschoice' + qid + qn + ']:checked').val());

    }
  });


  return options;
}

let clipboardText = '';
let clipboardTextData = '';
let clipboardHtml = '';



$(document).on('click', '.pastenewquestion', function (event) {
  stopscroll(event);
  pasteQuestionAndAnswers();
});
 



function processQuestion(text) {
  const mathBlocks = [];
  let placeholderId = 0;

  // Step 1: Extract all math expressions ($...$ or $$...$$)
  text = text.replace(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g, match => {
    const placeholder = `__MATH_EXPR_${placeholderId}__`;
    mathBlocks.push({ placeholder, content: match });
    placeholderId++;
    return placeholder;
  });

  // Step 2: Safe regex replacements (only outside math)

  // Replace line breaks after ':' or '.'
  text = text.replace(/([:.])[\r\n]+/g, '$1 <br> ');

  // Replace newline ONLY if it splits lowercase words (likely broken sentence)
  text = text.replace(/([a-z])\n([a-z])/g, '$1 $2');

  // Step 3: Restore math expressions
  for (const { placeholder, content } of mathBlocks) {
    text = text.replace(placeholder, content);
  }

  return text;
}







function splitByTopLevelDoubleBackslash(input) {
  const result = [];
  let current = '';
  let braceLevel = 0;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (char === '{') {
      braceLevel++;
    } else if (char === '}') {
      braceLevel = Math.max(0, braceLevel - 1);
    }

    // Detect top-level \\
    if (char === '\\' && input[i + 1] === '\\' && braceLevel === 0) {
      result.push(current.trim());
      current = '';
      i++; // Skip next backslash
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    result.push(current.trim());
  }

  return result;
}

function normalizeAlignedOptionsWithMatrices(input) {
  const match = input.match(/\\begin\{aligned\}([\s\S]*?)\\end\{aligned\}/);
  if (!match) return [];

  const inner = match[1];
  const parts = splitByTopLevelDoubleBackslash(inner);

  return parts
    .map(line => {
      line = line.trim();
      if (line.startsWith('&')) line = line.slice(1).trim();
      return `$${line}$`;
    })
    .filter(opt => opt.length > 0);
}

function normalizeOptions(input) {
  const hasDoubleNewlines = /\n{2,}/.test(input);
  const rawOptions = hasDoubleNewlines ? input.split(/\n{2,}/) : input.split(/\n/);

  return rawOptions
    .map(opt => opt.trim())
    .filter(opt => opt.length > 0)
    .map(opt => {
      if (opt.startsWith('$$') && opt.endsWith('$$')) {
        return opt;
      } else if (opt.startsWith('$') && opt.endsWith('$')) {
        return opt;
      } else {
        return opt; // plain text
      }
    });
}

function getNormalizedOptions(input) {
  input = input.trim();

  // Check for full aligned block inside $$...$$ or $...$
  const alignedBlockMatch = input.match(/\$+\s*\\begin\{aligned\}[\s\S]*?\\end\{aligned\}\s*\$+/);
  if (alignedBlockMatch) {
    return normalizeAlignedOptionsWithMatrices(alignedBlockMatch[0]);
  }

  // Otherwise, treat as normal input (text, single math block per option, etc.)
  return normalizeOptions(input);
}








function paste4OptionsAlone(event) {
  if (clipboardTextData) {
    var options = getNormalizedOptions(clipboardTextData);

    if (options.length > 0) {
      console.log("Pasting options:", options);

      var questionElement = $(event.target).closest('#question');
      var answersList = questionElement.find('#answerslist');
      var qid = questionElement.attr('questid');
      var seq = answersList.find('li').length;

      options.forEach((option, index) => {
        option = String(option || '');

        var answerNode = $('#tpl_answer_r').clone();
        answerNode.find('#ansvaltextarea').text(option);
        answerNode.find('#ansvaltextbox').attr("value", option);
        answerNode.find('#anschoice').attr('name', 'anschoice' + qid + seq);
        answerNode.find('#anschoice').attr('value', seq);
        answerNode.find('#ansvaltextbox').closest(".input-group").prepend(`<span class='input-group-text'>${index + 1}</span>`);
        answersList.append(adjustSeqForNewAnswers(answerNode, seq, qid));
        seq++;
      }
      );
      // Clear the clipboard data after pasting
      clipboardTextData = '';
      console.log("Pasting completed.");

      $('li[questid="' + qid + '"]').find('.previewaction').click();
      $('li[questid="' + qid + '"]').find('textarea').trigger('input');

    }
  }

}

function pasteQuestionAndAnswers() {
  const radioid = getSelectedRadioIdNumber();
  let splits = answerChoicesSplit[radioid];

  if (clipboardTextData) {
    let temp = clipboardTextData.replace(/\t/g, '&emsp;');
    for (const split of splits) {
      temp = temp.replace(split, "↫").trim();
    }
    let clipanswers = temp.split("↫");

    let prevseq = $('#questionsList>li:last-child').find('#questionseqlbl').html();
    let prevquestype = $('#questionsList>li:last-child').find('#questionType:checked').val();

    if (prevseq) {
      if (prevquestype === "Q") {
        if ((prevseq % 1) != 0) { //Check if number is decimal or not in case CBSE or ICSE
          prevseq = Number(prevseq) + 0.1;
          prevseq = Math.round((prevseq + Number.EPSILON) * 100) / 100
        } else {
          prevseq = Number(prevseq) + 1;
        }

      } else if (prevquestype === "P") {
        prevseq = Number(prevseq); // Ensure prevseq remains a number
      }
    } else {
      prevseq = 1; // Initialize prevseq to 1 if it's undefined or null
    }

    let tpl = $('#tpl_question').clone();
    $(tpl).find('#question').attr('seq', $('#questionsList > li').length);
    let qid = questionIdGenerator();
    $(tpl).find('#question').attr('questid', qid);
    $(tpl).find('#questionseqlbl').html(prevseq);
    $(tpl).find('#questionseqText').attr("value", prevseq);
    let tempquestion = clipanswers[0];
    //tempquestion = tempquestion.replace(/([:|.]([\r\n|\r|\n]))/g, '$1 <br> ');
    //tempquestion = tempquestion.replace(/(\w)([\r\n|\r|\n])(\w)/g, '$1 $3');

    //tempquestion = tempquestion.replace(/([:.])[\r\n]+/g, '$1 <br> ');
    //tempquestion = tempquestion.replace(/(\w)([\r\n|\r|\n])(\w)/g, '$1 $3');
    tempquestion = processQuestion(tempquestion)

    tempquestion = String(tempquestion || '');
    $(tpl).find('#questionTextArea').text(tempquestion);
    $(tpl).find('#questionText').attr("value", tempquestion);
    if (prevquestype === "P") {
      // $(tpl).find("input[name='haspara'][value='true']").prop('checked', true).trigger('change');
      // $('input[name="haspara'+qid+'"][value="true"]').prop('checked', true).trigger('click');
    }

    tpl.find('#questionType').attr('name', 'questionType' + qid);
    tpl.find('#answerType').attr('name', 'answerType' + qid);
    tpl.find('#haspara').attr('name', 'haspara' + qid);

    let answers = $(tpl).find('#answerslist');

    if (clipanswers.length > 0) {
      for (let i = 1; i < clipanswers.length; i++) {
        let tnode = $('#tpl_answer_r').clone();
        let answer_text = clipanswers[i];

        // Replace characters followed by newlines with <br>
        answer_text = answer_text.replace(/([:|.]([\r\n|\r|\n]))/g, '$1 <br> ');
        // Ensure proper spacing around words separated by newlines
        answer_text = answer_text.replace(/(\w)([\r\n|\r|\n])(\w)/g, '$1 $3');

        answer_text = String(answer_text || '');

        // Remove leading <br> tags if present
        if (answer_text && answer_text.trim().startsWith('<br>')) {
          answer_text = answer_text.replace(/^<br>/, ''); // Replace <br> at the beginning
        }

        if (answer_text && answer_text.trim().endsWith('<br>')) {
          answer_text = answer_text.replace(/<br>$/, ''); // Replace <br> at the end
        }

        // Set text content and attribute value for answer inputs
        $(tnode).find('#ansvaltextarea').text(answer_text);
        $(tnode).find('#ansvaltextbox').attr("value", answer_text);

        // Prepend sequence label to the input group
        $(tnode).find('#ansvaltextbox').closest(".input-group").prepend(`<span class='input-group-text'>${splits[i - 1]}</span>`);

        // Append adjusted sequence for new answers
        $(answers).append(adjustSeqForNewAnswers(tnode, i - 1, qid));
      }
    }

    $('#questionsList').append(tpl.html());
    clipboardTextData = '';

    $('li[questid="' + qid + '"]').find('.previewaction').click();
    $('li[questid="' + qid + '"]').find('textarea').trigger('input');
    if (prevquestype === "P") {
      $('input[name="haspara' + qid + '"][value="true"]').prop('checked', true).trigger('click');
    }
    window.scrollTo(0, document.body.scrollHeight);
  }
}

function adjustSeqForNewAnswers(tpl_ele, seq, qid) {
  $(tpl_ele).find('#answer').attr('aseq', seq);
  $(tpl_ele).find('#answer').find('#anschoice').val(seq);
  $(tpl_ele).find('#answer').find('#anslblchoice').val(seq);
  $(tpl_ele).find('#answer').find('#anschoice').attr('name', 'anschoice' + qid);
  $(tpl_ele).find('#answer').find('#lanslblchoice').attr('name', 'lanslblchoice' + qid);
  return $(tpl_ele).html();
}



function getSelectedRadioIdNumber() {
  const selectedRadio = document.querySelector('input[name="questiontyperadio"]:checked');
  if (selectedRadio) {
    const id = selectedRadio.id;
    const regex = /\d+$/;
    const match = regex.exec(id);
    return match ? match[0] : '';
  }
  return '';
}

let answerChoicesSplit = [
  ["(a)", "(b)", "(c)", "(d)", "(e)", "(f)", "(g)", "(h)"],
  ["a)", "b)", "c)", "d)", "e)", "f)", "g)", "h)", "i)"],
  ["a.", "b.", "c.", "d.", "e.", "f.", "g.", "h.", "i."],

  ["(A)", "(B)", "(C)", "(D)", "(E)", "(F)", "(G)", "(H)"],
  ["A)", "B)", "C)", "D)", "E)", "F)", "G)", "H)", "I)"],
  ["A.", "B.", "C.", "D.", "E.", "F.", "G.", "H.", "I."],

  ["(1)", "(2)", "(3)", "(4)", "(5)", "(6)", "(7)", "(8)"],
  ["1)", "2)", "3)", "4)", "5)", "6)", "7)", "8)", "9)"],
  ["1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9."],

  ["A ", "B ", "C ", "D ", "E ", "F ", "G ", "H "]
]

function validateMissingAnswers(ele, vent) {
  stopscroll(vent);


  let questdata = [];
  let firstMissingQuestionSeq = null;
  $('#questionsList>li').each(function (idx, pele) {
    questdata.push(getQuestionPreviewData($(pele), "s3"))
  });
  var answerMissingQuestions = [];
  questdata.forEach(question => {
    // Check if the questiontype is "Q" and if the correct property is empty or not
    if (question.questiontype === "Q" && (!question.correct || question.correct.length === 0)) {
      console.log(question.questionseq)
      if (firstMissingQuestionSeq === null) {
        firstMissingQuestionSeq = question.questionseq;
      }
      answerMissingQuestions.push({ "seq": question.questionseq, "id": question._id, "subject_key": question.subject_key });
      //alert(`Correct Answer is empty for QuestionSeq: ${question.questionseq}`);
    }
  });
  var urlslist = '';
  answerMissingQuestions.forEach(q => {
    urlslist += "\n" + q.seq + ">> " + "http://localhost:3005/tests/openparentquestion/" + q.subject_key + "/" + q.id + "\n";
  }
  );
  console.log(urlslist);

  if (answerMissingQuestions.length > 0) {
    bootstrap_alert.error($('.sticky-header').find('#alertplaceholder'), "Missing answers in questions: " + answerMissingQuestions.map(q => q.seq).join(", "));
    scrollToElement($("#question[queseq='" + firstMissingQuestionSeq + "']"));
  } else {
    bootstrap_alert.success($('.sticky-header').find('#alertplaceholder'), "No Missing Answers found");
  }

  //return $('.testtitle').text().trim()+"==>> "+answerMissingQuestions.toString();
  return urlslist;


}

function validateJeeQuestionPattern() {
  const expectedQuestionCount = 75;
  const sectionSize = 25;
  const radioQuestionsPerSection = 20;
  const rows = [];
  const seenBySeq = {};
  const violations = [];

  $('#questionsList>li#question').each(function (idx, ele) {
    const $question = $(ele);
    const questionType = ($question.find("#questionType:checked").val() || '').trim();

    if (questionType !== 'Q') {
      return;
    }

    const seqText = ($question.find("#questionseqText").val() || $question.attr('queseq') || '').trim();
    const seq = Number(seqText);
    const answerType = ($question.find("#answerType:checked").val() || '').trim();
    const row = {
      ele,
      seq,
      seqText,
      answerType
    };

    rows.push(row);

    if (Number.isInteger(seq) && seq >= 1 && seq <= expectedQuestionCount) {
      seenBySeq[seq] = seenBySeq[seq] || [];
      seenBySeq[seq].push(row);
    }
  });

  if (rows.length !== expectedQuestionCount) {
    violations.push({
      message: `Expected ${expectedQuestionCount} questions, found ${rows.length}.`
    });
  }

  rows.forEach(row => {
    if (!Number.isInteger(row.seq)) {
      violations.push({
        ele: row.ele,
        message: `Question sequence "${row.seqText || 'empty'}" is not a valid whole number.`
      });
      return;
    }

    if (row.seq < 1 || row.seq > expectedQuestionCount) {
      violations.push({
        ele: row.ele,
        message: `Q${row.seq} is outside the expected 1-${expectedQuestionCount} range.`
      });
    }
  });

  Object.keys(seenBySeq).forEach(seq => {
    if (seenBySeq[seq].length > 1) {
      violations.push({
        ele: seenBySeq[seq][0].ele,
        message: `Q${seq} is duplicated ${seenBySeq[seq].length} times.`
      });
    }
  });

  for (let seq = 1; seq <= expectedQuestionCount; seq++) {
    if (!seenBySeq[seq]) {
      violations.push({
        message: `Q${seq} is missing.`
      });
    }
  }

  rows
    .filter(row => Number.isInteger(row.seq) && row.seq >= 1 && row.seq <= expectedQuestionCount)
    .forEach(row => {
      const sectionNo = Math.floor((row.seq - 1) / sectionSize) + 1;
      const sectionPosition = ((row.seq - 1) % sectionSize) + 1;
      const expectedAnswerType = sectionPosition <= radioQuestionsPerSection ? 'R' : 'TX';

      if (row.answerType !== expectedAnswerType) {
        violations.push({
          ele: row.ele,
          message: `Q${row.seq} (section ${sectionNo}, position ${sectionPosition}) expected ${expectedAnswerType}, found ${row.answerType || 'empty'}.`
        });
      }
    });

  showJeeQuestionPatternResult(violations);
}

function showJeeQuestionPatternResult(violations) {
  if (violations.length === 0) {
    showJeeQuestionPatternPopup('JEE Check', 'All good. 75 questions match the JEE answer type pattern.');
    return;
  }

  const firstQuestionViolation = violations.find(violation => violation.ele);
  if (firstQuestionViolation) {
    scrollToElement($(firstQuestionViolation.ele));
    $(firstQuestionViolation.ele).css('box-shadow', '0 0 0 3px #f95303');
    setTimeout(function () {
      $(firstQuestionViolation.ele).css('box-shadow', '');
    }, 5000);
  }

  const visibleViolations = violations.slice(0, 120);
  const violationList = visibleViolations
    .map(violation => `<li>${escapeJeeCheckHtml(violation.message)}</li>`)
    .join('');
  const hiddenCount = violations.length - visibleViolations.length;
  const moreMessage = hiddenCount > 0 ? `<p><strong>${hiddenCount} more issue(s) not shown.</strong></p>` : '';

  showJeeQuestionPatternPopup(
    `JEE Check - ${violations.length} issue(s)`,
    `<div style="max-height:60vh;overflow:auto;"><ol>${violationList}</ol>${moreMessage}</div>`
  );
}

function showJeeQuestionPatternPopup(title, message) {
  if (typeof bootbox !== 'undefined' && bootbox.alert) {
    bootbox.alert({
      title,
      message
    });
  } else {
    alert($('<div>').html(message).text() || message);
  }
}

function escapeJeeCheckHtml(value) {
  return String(value).replace(/[&<>"']/g, function (char) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char];
  });
}

function validateMissingQuestions(ele, vent) {
  stopscroll(vent);

  let qnos = [];
  let last = 0;

  $('#questionsList #question').each(function (i, v) {
    let qtype = $(v).find("#questionType:checked").val();
    if (qtype === "Q") {
      let seq = Number($(v).find("#questionseqText").val());
      qnos.push(seq);
      if (seq > last) {
        last = seq;
      }
    }
  });

  let missing = [];
  for (let i = 1; i <= last; i++) {
    if (!qnos.includes(i)) {
      missing.push(i);
    }
  }
  if (missing.length > 0) {
    bootstrap_alert.error($('.sticky-header').find('#alertplaceholder'), "Duplicate Question Numbers After: " + missing.toString());
    scrollToElement($("#question[queseq='" + missing[0] + "']"));
  } else {
    bootstrap_alert.success($('.sticky-header').find('#alertplaceholder'), "No Duplicate Questions found");
  }
  //document.title = missing.length > 0 ? missing.toString() : 'None';
}


function isMissingSprite(v) {
  const rect = v.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(v);
  const pseudoStyle = window.getComputedStyle(v, '::after');
  const computedWidth = parseFloat(computedStyle.width) || 0;
  const computedHeight = parseFloat(computedStyle.height) || 0;
  const pseudoWidth = parseFloat(pseudoStyle.width) || 0;
  const pseudoHeight = parseFloat(pseudoStyle.height) || 0;
  const pseudoContent = pseudoStyle.content || '';
  const pseudoBackgroundImage = pseudoStyle.backgroundImage || '';

  if (pseudoContent === 'none' || pseudoContent === 'normal' || pseudoBackgroundImage === 'none') {
    return true;
  }

  return rect.width === 0 && computedWidth === 0 && pseudoWidth === 0 && pseudoHeight === 0 && computedHeight === 0;
}

function validateMissingImages(ele, vent) {
  console.log("Validate Missing Images Called")
  stopscroll(vent);
  var missingimagelist = '';
  var misClassNames = '';
  misClassNamesNoQuotes = [];
  var missedImagLocation = {}
  $('.clbl .hscrollenable .sprite').each((i, v) => {
    if (isMissingSprite(v)) {
      missedImagLocation = $(v).closest("#question").find("#questionseqlbl")[0];
      missingimagelist += $(v).closest("#question").find("#questionseqlbl").html() + ", ";
      misClassNames += "\"" + v.className.replace(/sprite/, '').trim() + "\",\n";
      misClassNamesNoQuotes.push(v.className.replace(/sprite/, '').trim());
    }
  })
  //alert(missingimagelist);
  if (misClassNamesNoQuotes.length > 0) {
    document.title = misClassNamesNoQuotes.toString();
  }

  if (misClassNames && misClassNames.length > 0) {
    console.log(misClassNames);
    bootstrap_alert.error($('.sticky-header').find('#alertplaceholder'), "Missing Images : " + misClassNames);
    missedImagLocation.scrollIntoView();
  } else {
    bootstrap_alert.success($('.sticky-header').find('#alertplaceholder'), "No Missing Images found");
    misClassNames = 'None Missing.'
  }
  //return $('.testtitle').text().trim()+"=>  "+misClassNamesNoQuotes.toString();
  return misClassNamesNoQuotes.toString(); // This is for Selenium Don't Change
}



function zeroQuestionNumberBySeqRange() {




  var qlist = $('#textrangeforedit').val().split('-');

  if (qlist.length >= 2) {

    var r = confirm("Are you sure want to continue?");
    if (!r) { return false; }
    var sequence = 0
    if (qlist.length > 2) {
      sequence = Number(qlist[2]);
    }

    var start = Number(qlist[0]);
    var end = Number(qlist[1]);
    for (var i = start; i <= end; i++) {
      var qseq = i;
      $('li[queseq="' + qseq + '"] .editquestion').trigger('click');
      $('li[queseq="' + qseq + '"] #questionseqText').val(sequence);
      //$('li[queseq="' + qseq + '"] .savequestion').trigger('click');
      $($('li[queseq="' + qseq + '"] .savequestion')[0]).trigger('click');
      if ($('li[queseq="' + qseq + '"] .savequestion').length == 3) {
        $($('li[queseq="' + qseq + '"] .savequestion')[1]).trigger('click');
      }
    }
    bootstrap_alert.success($('.sticky-header').find('#alertplaceholder'), "Zero Seq Operation Completed..");
  } else {
    bootstrap_alert.error($('.sticky-header').find('#alertplaceholder'), "Missing Question Seq Range: ");
  }

}

function updateParagraphsAttrRange() {

  var qlist = $('#textrangeforedit').val().split('-');
  if (qlist.length == 2) {
    var start = Number(qlist[0]);
    var end = Number(qlist[1]);
    for (i = start; i <= end; i++) {
      var qseq = i;
      console.log("forloop " + i);

      if ($('li[queseq="' + qseq + '"] #haspara[value="true"]')) {
        $('li[queseq="' + qseq + '"] .editquestion').trigger('click');
        $('li[queseq="' + qseq + '"] #haspara[value="true"]').attr({ "checked": true }).prop({ "checked": true });

        $($('li[queseq="' + qseq + '"] .savequestion')[0]).trigger('click');
        if ($('li[queseq="' + qseq + '"] .savequestion').length == 3) {
          $($('li[queseq="' + qseq + '"] .savequestion')[1]).trigger('click');
        }

      }
    }
    bootstrap_alert.success($('.sticky-header').find('#alertplaceholder'), "Update para Operation Completed..");
  } else {
    bootstrap_alert.error($('.sticky-header').find('#alertplaceholder'), "Missing Question Seq Range: ");
  }
}

function editquestionsbyseqrange() {
  console.log("Edit Question Seq")
  var qlist = $('#textrangeforedit').val().split('-');
  if (qlist.length == 2) {
    var start = Number(qlist[0]);
    var end = Number(qlist[1]);
    for (var i = start; i <= end; i++) {
      var qseq = i;
      $('li[queseq="' + qseq + '"] .editquestion').trigger('click');
    }
  } else {
    bootstrap_alert.error($('.sticky-header').find('#alertplaceholder'), "Missing Question Seq Range: ");
  }

}

function updatelinkedquestions() {
  var r = confirm("Are you sure want to continue??");
  if (!r) { return false; }
  $('#questionsList #question').each(
    function (i, v) {
      //$(v).find(".editquestion").trigger('click');
      $(v).find(".updatelinkedquestion").trigger('click');
      //$($(v).find(".savequestion")[0]).trigger('click');

    });
}

function updateQuestionNoSeqence() {
  var r = confirm("Are you sure want to continue??");
  if (!r) { return false; }

  var pqtype = "Q";
  var seq = 1;
  var qid = 1;
  $('#questionsList #question').each(
    function (i, v) {
      var qtype = $(v).find("#questionType:checked").val();
      if (qtype == "Q" && pqtype == "P") {
        $(v).find(".editquestion").trigger('click');
        $(v).find("#questionseqText").val(seq);
        //$(v).find("#questionid").val(qid); 
        $(v).attr("questid", qid);
        seq++
        qid++
        pqtype = "Q";
        $($(v).find(".savequestion")[0]).trigger('click');
      } else if (qtype == "Q" && pqtype == "Q") {
        $(v).find(".editquestion").trigger('click');
        $(v).find("#questionseqText").val(seq);
        //$(v).find("#questionid").val(qid); 
        $(v).attr("questid", qid);
        pqtype = "Q";
        seq++;
        qid++;
        $($(v).find(".savequestion")[0]).trigger('click');
      } else if (qtype == "P") {
        $(v).find(".editquestion").trigger('click');
        $(v).find("#questionseqText").val(seq);
        //$(v).find("#questionid").val(qid); 
        $(v).attr("questid", qid);
        pqtype = "P";
        qid++;
        $($(v).find(".savequestion")[0]).trigger('click');
      }
    });
}


function scrollToElement(ele) {
  if (ele && $(ele).offset()) {
    let pos = $(ele).offset().top;
    $('html, body').scrollTop(pos);
  }
}



function moveQuestionPopup(ele, eve) {

  eve.preventDefault();
  eve.stopPropagation();
  var content = $("#moveQuestion").html();
  var data = {};
  data.subject_key = $('#testdetails').attr('subject_key');
  data.mid = $(ele).closest('#question').attr('mid');
  var queseq = $(ele).closest('#question').find('#questionseqlbl').html()
  bootbox.dialog({
    title: "<span class='h5 text-danger'>Choose Details for Question : " + queseq + " </span>",
    message: content,
    buttons: {
      success: {
        label: "Clone",
        className: "btn-success",
        callback: function () {
          var temp = $(this).find('.clonequestionquery').val();
          if (temp && temp.length > 0) {
            if (temp.split('~').length == 4) {
              data.newsubjectkey = temp.split('~')[0];
              data.newchapterid = temp.split('~')[1];
              data.newtestid = temp.split('~')[2];
              data.newquestionseq = temp.split('~')[3];
              if (data.subject_key == data.newsubjectkey) {
                alert('Can not copy on same subject');
              } else {
                ajaxRequest("/tests/clonelinkedquestion",
                  "POST",
                  {
                    "data": data
                  },
                  function (res) {
                    console.log(res);
                    if (res && res.success) {
                      bootstrap_alert.success($(ele.closest('#question')).find('#alertplaceholder'), res.message);
                    } else {
                      bootstrap_alert.error($(ele.closest('#question')).find('#alertplaceholder'), res.message);
                    }
                  },
                  function (failed) {
                    console.log(failed);
                  }
                );
              }
            }
          }
        }
      }
    }
  }).on('shown.bs.modal', function (e) {
    if (globals.prevclonedetails) {
      $(this).find('.clonequestionquery').val(globals.prevclonedetails);
      $(this).find('#querytext').html(globals.prevclonedetailstext);
    } else {
      $(this).find('#clonechpaterlist').trigger('change');
    }
  });
}



async function getclonetestdetails(id, vent) {
  let query = $(id).closest('.bootbox-body').find('.clonequestionquery').val();
  let queryvals = query.split("~");
  let chapterid = queryvals[1];
  let testid = queryvals[2];
  $(id).closest('.bootbox-body').find('#clonechpaterlist').val(chapterid).trigger('change');
  await wait(500);
  $(id).closest('.bootbox-body').find('.clonetestlist').val(testid).trigger('change');

}

function copyCollectionDetailsForQuestionPage() {
  const chapterid = $('#testdetails').attr('chapterid');
  const testid = $('#testdetails').attr('testid');
  const subjectKey = $('#testdetails').attr('subject_key');
  const collection = $('#testdetails').attr('collection');
  copyToClipboard(`${chapterid}~${testid}~${subjectKey}~${collection}`);
  bootstrap_alert.success($('.sticky-header').find('#alertplaceholder'), "Collection details copied");
}

function changeclonetestlist(id, vent) {
  var id = id;
  var subject_key = $(id).attr('linkedkey');
  var chapterid = $(id).val();
  ajaxRequest(`/tests/getlinkedtests/${subject_key}/${chapterid}`, 'GET', {},
    function (copyTestList) {
      var out = '';
      copyTestList.forEach(function (element) {
        out += '<option value="' + element.testid + '">' + element.test_seq + ". " + element.test_name + " (" + element.testid + ")" + '</option>';
      });
      $(id).closest('.bootbox-body').find('.clonetestlist').html(out);
      $(id).closest('.bootbox-body').find('.clonetestlist').trigger('change');
    }, function (failed) {
      console.log(failed);
    })

}

function changeclonetestquery(id, vent) {
  $(id).closest('.bootbox-body').find('.clonequestionquery').trigger('input');
}

function setquerykeys(id, vent) {
  console.log("In put fired..")
  let qno = "0";
  let skey = $(id).closest('.bootbox-body').find('#clonechpaterlist').attr("linkedkey");
  let chapterid = $(id).closest('.bootbox-body').find('#clonechpaterlist').val();
  let testid = $(id).closest('.bootbox-body').find('.clonetestlist').val();
  let query = skey + "~" + chapterid + "~" + testid + "~" + qno;
  let qtitle = $(id).closest('.bootbox-body').find('.clonetestlist').find('option:selected').text();
  $(id).closest('.bootbox-body').find('.clonequestionquery').val(query)
  $(id).closest('.bootbox-body').find('#querytext').html(qtitle);
  globals.prevclonedetails = query;
  globals.prevclonedetailstext = qtitle;

}

function updatelinedquestion(ele, vent) {
  let data = {
    collection: $('#testdetails').attr('collection'),
    mid: $(ele).closest('#question').attr('mid'),
    linkedsubject: $('#testdetails').attr('linkedsubject')
  }
  ajaxRequest("/tests/updateQuestionToLinkedSubject", "POST", data, function (success) {
    console.log(success)
    bootstrap_alert.success($(ele.closest('#question')).find('#alertplaceholder'), "Linked Question Update success.");
  }, function (failed) {
    bootstrap_alert.error($(ele.closest('#question')).find('#alertplaceholder'), "Linked Question update failed.");
  })
}





function publishQuestionsDataToS3(that, event) {
  $(that).find('.fa-spinner').show();
  let data = {};
  data.is_katex = true;
  data.subject_key = testdata.subject_key;
  data.chapterid = testdata.chapterid;
  data.collname = $('#testdetails').attr('collection');
  data.testid = testdata.testid;
  data.categorykey = $('#testdetails').attr('categorykey');
  data.link = testdata.link;
  if (data.link && data.link.length > 0) { }
  else {
    alert('Filename/link missing');
    return;
  }
  let questdata = [];
  $('#questionsList>li').each(function (idx, pele) {
    questdata.push(getQuestionPreviewData($(pele), "s3"))
  });
  data.questdata = questdata;
  ajaxRequest("/data/publishQuestionsToS3", 'POST', data,
    function (result) {
      console.log(result);
      $(that).find('.fa-spinner').hide();
      bootstrap_alert.success($('.sticky-header').find('#alertplaceholder'), "Question Publish to S3 success.");
    },
    function (result) {
      console.log(result);
      $(that).find('.fa-spinner').hide();
      bootstrap_alert.error($('.sticky-header').find('#alertplaceholder'), "Question Publish to S3 Failed.");
    }
  );
}


function downloadmobilefile(that, event) {
  $(that).find('.fa-spinner').show();
  let data = {};
  data.is_katex = true;
  data.subject_key = testdata.subject_key;
  data.chapterid = testdata.chapterid;
  data.collname = $('#testdetails').attr('collection');
  data.testid = testdata.testid;
  data.categorykey = $('#testdetails').attr('categorykey');
  data.is_cdn_https = testdata.is_cdn_https;
  data.cdn_root_key = testdata.cdn_root_key || 'CDN1';
  data.questionImagesCdn = testdata.test_image;
  data.questionImages = (testdata.test_image) ? testdata.test_image.substring(testdata.test_image.lastIndexOf('/') + 1, testdata.test_image.length) : ''
  if (testdata.test_file_name && testdata.test_file_name.length > 0) { } else {
    $(that).find('.fa-spinner').hide();
    alert('filename missing');
    return;
  }

  data.questions = [];
  data.totalquestions = 0;
  $('#questionsList>li').each(function (idx, pele) {
    let questiontype = $(pele).find('#questionType:checked').val();
    if (questiontype !== 'P') { data.totalquestions++ }
    data.questions.push(getQuestionPreviewData($(pele), "download"))
  });
  let filename = testdata.test_file_name;
  //data.correct = data.correct.toString();
  var body = {}
  body.data = data;
  body.filename = filename;
  if (window.location.hostname.indexOf("localhost") > -1) {
    ajaxRequest("/admin/downloadmobiledata", "POST", body, function (result) {
      console.log(result);
      $(that).find('.fa-spinner').hide();
      bootstrap_alert.success($('.sticky-header').find('#alertplaceholder'), "Question Download for Mobile success.");
    }, function (result) {
      console.log(result);
      $(that).find('.fa-spinner').hide();
      bootstrap_alert.error($('.sticky-header').find('#alertplaceholder'), "Question Download for Mobile failed.");
    });
  } else {
    downloadJsonAsFile(filename, data);
    $(that).find('.fa-spinner').hide();
    bootstrap_alert.success($('.sticky-header').find('#alertplaceholder'), "Question Download for Mobile success.");
  }
}



function downloadGitHubmobilefile(that, event) {
  $(that).find('.fa-spinner').show();
  let data = {};
  data.is_katex = true;
  data.subject_key = testdata.subject_key;

  data.chapterid = testdata.chapterid;
  data.collname = $('#testdetails').attr('collection');
  data.testid = testdata.testid;
  data.categorykey = $('#testdetails').attr('categorykey');
  data.is_cdn_https = testdata.is_cdn_https;
  data.cdn_root_key = testdata.cdn_root_key || 'CDN1';
  data.questionImagesCdn = testdata.test_image;
  data.questionImages = (testdata.test_image) ? testdata.test_image.substring(testdata.test_image.lastIndexOf('/') + 1, testdata.test_image.length) : ''
  if (testdata.mobile_file_name && testdata.mobile_file_name.length > 0) { } else {
    $(that).find('.fa-spinner').hide();
    alert('filename missing');
    return;
  }

  data.questions = [];
  data.totalquestions = 0;
  $('#questionsList>li').each(function (idx, pele) {
    let questiontype = $(pele).find('#questionType:checked').val();
    if (questiontype !== 'P') { data.totalquestions++ }
    data.questions.push(getQuestionPreviewData($(pele), ""))
  });

  let filename = '';
  if (testdata.test_lang && (testdata.test_lang !== "en")) {
    filename = testdata.mobile_file_name + "_" + testdata.test_lang;
  } else {
    filename = testdata.mobile_file_name;
  }
  //data.correct = data.correct.toString();
  var body = {}
  body.data = data;
  body.filename = filename;
  body.gitcodepath = gitcodepath;

  if (window.location.hostname.indexOf("localhost") > -1) {
    ajaxRequest("/admin/downloadgitmobiledata", "POST", body, function (result) {
      console.log(result);
      $(that).find('.fa-spinner').hide();
      bootstrap_alert.success($('.sticky-header').find('#alertplaceholder'), "Question Download for Mobile success.");
    }, function (result) {
      console.log(result);
      $(that).find('.fa-spinner').hide();
      bootstrap_alert.error($('.sticky-header').find('#alertplaceholder'), "Question Download for Mobile failed.");
    });
  } else {
    downloadJsonAsFile(filename, data);
    $(that).find('.fa-spinner').hide();
    bootstrap_alert.success($('.sticky-header').find('#alertplaceholder'), "Question Download for Mobile success.");
  }
}




function downloadGitHubmobilefileExamsnetApp(that, event) {
  $(that).find('.fa-spinner').show();
  let data = {};
  data.is_katex = true;
  data.subject_key = testdata.subject_key;
  data.chapterid = testdata.chapterid;
  data.collname = $('#testdetails').attr('collection');
  data.testid = testdata.testid;
  data.categorykey = $('#testdetails').attr('categorykey');
  data.is_cdn_https = testdata.is_cdn_https;
  data.cdn_root_key = testdata.cdn_root_key || 'CDN1';
  data.questionImagesCdn = testdata.test_image;
  data.questionImages = (testdata.test_image) ? testdata.test_image.substring(testdata.test_image.lastIndexOf('/') + 1, testdata.test_image.length) : ''
  if (testdata.mobile_file_name && testdata.mobile_file_name.length > 0) { } else {
    $(that).find('.fa-spinner').hide();
    alert('filename missing');
    return;
  }

  data.questions = [];
  data.totalquestions = 0;
  $('#questionsList>li').each(function (idx, pele) {
    let questiontype = $(pele).find('#questionType:checked').val();
    if (questiontype !== 'P') { data.totalquestions++ }
    data.questions.push(getQuestionPreviewData($(pele), ""))
  });

  let filename = '';
  if (testdata.test_lang && (testdata.test_lang !== "en")) {
    filename = testdata.mobile_file_name + "_" + testdata.test_lang;
  } else {
    filename = testdata.mobile_file_name;
  }

  var body = {}
  body.data = data;
  body.filename = filename;
  body.gitcodepath = gitcodepath;

  if (window.location.hostname.indexOf("localhost") > -1) {
    ajaxRequest("/admin/downloadgitmobiledata_examsnetapp", "POST", body, function (result) {
      console.log(result);
      $(that).find('.fa-spinner').hide();
      bootstrap_alert.success($('.sticky-header').find('#alertplaceholder'), "Question Download for Mobile success.");
    }, function (result) {
      console.log(result);
      $(that).find('.fa-spinner').hide();
      bootstrap_alert.error($('.sticky-header').find('#alertplaceholder'), "Question Download for Mobile failed.");
    });
  } else {
    downloadJsonAsFile(filename, data);
    $(that).find('.fa-spinner').hide();
    bootstrap_alert.success($('.sticky-header').find('#alertplaceholder'), "Question Download for Mobile success.");
  }
}

function addyearnumbertoquestion(event, that) {
  let yeartext = $('#textrangeforedit').val();

  if (yeartext && yeartext.length > 0) {
    let r = confirm("Are you sure want to continue??");
    if (!r) {
      return false;
    }

    $('#questionsList #question').each(function (i, v) {
      let qtype = $(v).find("#questionType:checked").val();
      if (qtype == "Q") {
        $(v).find(".editquestion").trigger('click');
        let textarea = $(v).find('#questionText').siblings('.previewsrc');

        if (textarea.length > 0) {
          let text = textarea.val();
          if (text) {
            text = text.trim();
            // Regex to check if div with class floatright already exists
            const divRegex = /<div\s+class=["']floatright["']>(.*?)<\/div>/;

            if (divRegex.test(text)) {
              // Update existing div content
              text = text.replace(divRegex, '<div class="floatright">' + yeartext + '</div>');
            } else {
              // Append new div
              text = text + '<div class="floatright">' + yeartext + '</div>';
            }
            textarea.val(text);
            textarea.trigger('input');
          }
        } else {
          console.warn("Textarea not found for question index: " + i);
        }

        // Trigger save
        let saveBtn = $(v).find(".savequestion");
        if (saveBtn.length > 0) {
          $(saveBtn[0]).trigger('click');
        }
      }
    });

  } else {
    alert('Enter a Year in [Apr 2024] format');
  }
}


function findandreplaceinquestion(event, that) {
  bootbox.dialog({
    title: 'Find and Replace in Question Only',
    message: `
        <form>
            <div class="form-group">
                <label for="findText">Find Text</label>
                <input type="text" class="form-control" id="findText" placeholder="Enter text to find">
            </div>
            <div class="form-group">
                <label for="replaceText">Replace Text</label>
                <input type="text" class="form-control" id="replaceText" placeholder="Enter replacement text">
            </div>
        </form>
    `,
    buttons: {
      cancel: {
        label: 'Cancel',
        className: 'btn btn-sm btn-outline-info',
        callback: function () {
          console.log('Cancel clicked');
        }
      },
      confirm: {
        label: 'Submit',
        className: 'btn btn-outline-danger btn-sm',
        callback: function () {
          let findText = $('#findText').val();
          let replaceText = $('#replaceText').val();
          findandreplaceoperation(findText, replaceText);
        }
      }
    }
  });
}


function findandreplaceoperation(findText, replaceText) {
  let r = confirm("Are you sure you want to continue?");
  if (!r) {
    return false;
  }

  $('#questionsList #question').each(function (i, v) {
    // Trigger click on edit question
    $(v).find(".editquestion").trigger('click');

    // Find in question text
    let qtextarea = $(v).find('#questionText').siblings('.previewsrc');
    let qtext = qtextarea.val();
    let qupdatedtext = qtext.replace(new RegExp(findText, 'g'), replaceText);
    qtextarea.val(qupdatedtext);
    qtextarea.trigger('input');

    // Find in solution text
    let stextarea = $(v).find('#solutionText').siblings('.previewsrc');
    let stext = stextarea.val();
    let supdatedtext = stext.replace(new RegExp(findText, 'g'), replaceText);
    stextarea.val(supdatedtext);
    stextarea.trigger('input');

    // Find in answer choices
    let anstextareas = $(v).find('#ansvaltextbox.valuetextbox').siblings('.previewsrc');

    // Iterate over each anstextarea element
    anstextareas.each(function () {
      let anstextarea = $(this);
      if (typeof anstextarea.val === 'function') {
        let anstext = anstextarea.val();
        let ansupdatedtext = anstext.replace(new RegExp(findText, 'g'), replaceText);
        anstextarea.val(ansupdatedtext);
        anstextarea.trigger('input');
      }
    });

    // Save the modified question
    $(v).find(".savequestion:first").trigger('click');
  });
}


function openBulkAnswerImportDialog() {
  bootbox.dialog({
    title: 'Paste Answers',
    size: 'large',
    message: `
      <div class="mb-2 text-muted small">
        Paste one answer per line using <code>1-A</code> format, or paste a markdown answer table and click <code>Convert Table</code>.
      </div>
      <div class="form-check mb-2">
        <input class="form-check-input" type="checkbox" id="bulkOverwriteExistingAnswers">
        <label class="form-check-label" for="bulkOverwriteExistingAnswers">Overwrite questions that already have answers</label>
      </div>
      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" id="bulkAutoSaveAnswers" checked>
        <label class="form-check-label" for="bulkAutoSaveAnswers">Save questions automatically after applying answers</label>
      </div>
      <textarea class="form-control" id="bulkAnswerInput" rows="14" placeholder="1-A&#10;2-C&#10;3-B"></textarea>
      <div id="bulkAnswerImportStatus" class="small mt-3 text-muted"></div>
    `,
    buttons: {
      cancel: {
        label: 'Cancel',
        className: 'btn btn-sm btn-outline-secondary'
      },
      convert: {
        label: 'Convert Table',
        className: 'btn btn-sm btn-outline-primary',
        callback: function () {
          const rawInput = $('#bulkAnswerInput').val();
          const converted = convertMarkdownTableToAnswerLines(rawInput);
          if (!converted) {
            $('#bulkAnswerImportStatus').html('<span class="text-danger">No question-answer pairs found in the markdown table.</span>');
            return false;
          }
          $('#bulkAnswerInput').val(converted);
          const parsed = parseBulkAnswerInput(converted);
          renderBulkAnswerPreview(parsed);
          return false;
        }
      },
      preview: {
        label: 'Preview',
        className: 'btn btn-sm btn-outline-info',
        callback: function () {
          const rawInput = $('#bulkAnswerInput').val();
          const parsed = parseBulkAnswerInput(rawInput);
          renderBulkAnswerPreview(parsed);
          return false;
        }
      },
      apply: {
        label: 'Apply',
        className: 'btn btn-sm btn-outline-success',
        callback: function () {
          const rawInput = $('#bulkAnswerInput').val();
          const parsed = parseBulkAnswerInput(rawInput);

          if (parsed.errors.length > 0) {
            renderBulkAnswerPreview(parsed);
            return false;
          }

          applyBulkAnswers(parsed.answerMap, {
            overwriteExisting: $('#bulkOverwriteExistingAnswers').is(':checked'),
            autoSave: $('#bulkAutoSaveAnswers').is(':checked')
          }, parsed.rawAnswerMap);
        }
      }
    }
  });
}

function openBulkCloneLinkedQuestionsDialog() {
  const sourceDetails = {
    collection: $('#testdetails').attr('collection'),
    chapterid: $('#testdetails').attr('chapterid'),
    testid: $('#testdetails').attr('testid'),
    linkedsubject: $('#testdetails').attr('linkedsubject'),
    subject_key: $('#testdetails').attr('subject_key')
  };

  const sampleMapping = `{
  "units-and-measurement": [2, 1],
  "motion-in-a-straight-line": [2, 2],
  "motion-in-a-plane": [2, 11]
}`;

  bootbox.dialog({
    title: 'Bulk Clone Linked Questions',
    size: 'large',
    message: `
      <div class="mb-2 text-muted small">
        Paste a JSON object that maps each chapter name to <code>[chapterid, testid]</code>.
        Chapter names must match exactly.
      </div>
      <div class="mb-2 small">
        <div><span class="text-warning">Source:</span> <code>${sourceDetails.collection || ''} / ${sourceDetails.chapterid || ''} / ${sourceDetails.testid || ''}</code></div>
        <div><span class="text-warning">Linked subject:</span> <code>${sourceDetails.linkedsubject || ''}</code></div>
      </div>
      <textarea class="form-control font-monospace" id="bulkCloneMappingInput" rows="14"></textarea>
      <div class="small mt-2 text-muted">
        Example:
        <pre class="mb-0 mt-1">${sampleMapping}</pre>
      </div>
      <div id="bulkCloneImportStatus" class="small mt-3 text-muted"></div>
    `,
    buttons: {
      cancel: {
        label: 'Cancel',
        className: 'btn btn-sm btn-outline-secondary'
      },
      clone: {
        label: 'Clone All',
        className: 'btn btn-sm btn-success',
        callback: function () {
          const rawInput = $('#bulkCloneMappingInput').val();
          let mapping = null;

          if (!rawInput || !rawInput.trim()) {
            $('#bulkCloneImportStatus').html('<span class="text-danger">Please paste the JSON mapping first.</span>');
            return false;
          }

          try {
            mapping = JSON.parse(rawInput);
          } catch (error) {
            $('#bulkCloneImportStatus').html('<span class="text-danger">Invalid JSON: ' + error.message + '</span>');
            return false;
          }

          if (!mapping || typeof mapping !== 'object' || Array.isArray(mapping)) {
            $('#bulkCloneImportStatus').html('<span class="text-danger">The pasted value must be a JSON object.</span>');
            return false;
          }

          if (!sourceDetails.collection || !sourceDetails.chapterid || !sourceDetails.testid || !sourceDetails.linkedsubject) {
            $('#bulkCloneImportStatus').html('<span class="text-danger">Missing source page details or linked subject.</span>');
            return false;
          }

          if (sourceDetails.subject_key === sourceDetails.linkedsubject) {
            $('#bulkCloneImportStatus').html('<span class="text-danger">Source and destination subjects cannot be the same.</span>');
            return false;
          }

          $('#bulkCloneImportStatus').html('<span class="text-info">Cloning questions, please wait...</span>');

          ajaxRequest(
            '/tests/bulkclonelinkedquestions',
            'POST',
            {
              data: {
                collection: sourceDetails.collection,
                chapterid: sourceDetails.chapterid,
                testid: sourceDetails.testid,
                linkedsubject: sourceDetails.linkedsubject,
                subject_key: sourceDetails.subject_key,
                mapping: mapping
              }
            },
            function (res) {
              console.log(res);
              const summary = res && res.summary ? res.summary : {};
              const issues = Array.isArray(res?.issues)
                ? res.issues
                : (Array.isArray(res?.results) ? res.results.filter(item => item && item.status && item.status !== 'cloned') : []);
              const parts = [];

              if (summary.clonedCount != null) {
                parts.push(`${summary.clonedCount} cloned`);
              }
              if (summary.issueCount != null) {
                parts.push(`${summary.issueCount} issues`);
              }

              const message = parts.length > 0 ? parts.join(', ') : (res && res.message ? res.message : 'Bulk clone completed');
              if (issues.length > 0) {
                console.log('Bulk clone issues:', issues);
                if (console.table) {
                  console.table(issues);
                }
                const issueHtml = issues.map((item, index) => {
                  const title = item.chaptername ? `${item.chaptername}` : `Question ${index + 1}`;
                  const detail = item.reason || item.status || 'Unknown issue';
                  return `<li><strong>${title}</strong>: ${detail}</li>`;
                }).join('');
                $('#bulkCloneImportStatus').html(`
                  <div class="text-warning mb-2">${message}</div>
                  <div class="border rounded bg-light p-2" style="max-height: 220px; overflow: auto;">
                    <div class="fw-bold mb-1">Issues found:</div>
                    <ul class="mb-0">${issueHtml}</ul>
                  </div>
                `);
              }

              if (summary.failedCount && summary.failedCount > 0) {
                bootstrap_alert.error($('.sticky-header').find('#alertplaceholder'), message);
              } else if (issues.length > 0) {
                bootstrap_alert.warning($('.sticky-header').find('#alertplaceholder'), message);
              } else {
                bootstrap_alert.success($('.sticky-header').find('#alertplaceholder'), message);
              }
            },
            function (failed) {
              console.log(failed);
              bootstrap_alert.error($('.sticky-header').find('#alertplaceholder'), 'Bulk clone failed');
            }
          );

          return false;
        }
      }
    }
  }).on('shown.bs.modal', function () {
    $(this).find('#bulkCloneMappingInput').val(sampleMapping);
  });
}

function escapePrintHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderPrintableMathHtml(value) {
  return String(value || '').replace(/\r\n|\r|\n/g, '<br>');
}

function getPrintableQuestionBody($question) {
  const currentValue = $question.find('#questiontextlbl').html()
    || $question.find('#questionText').val()
    || '';
  return renderPrintableMathHtml(currentValue);
}

function getPrintableSolutionBody($question) {
  const currentValue = $question.find('#solutionlbl').html()
    || $question.find('#solutionpreview').html()
    || $question.find('#solutionText').val()
    || '';
  return renderPrintableMathHtml(currentValue);
}

function getPrintableAnswerType($question) {
  return ($question.find('#answerType:checked').val() || '').trim();
}

function getPrintableCorrectValues($question) {
  return $question.find('.anschoice:checked').map(function () {
    return String($(this).val() || '').trim();
  }).get();
}

function buildPrintableChoiceList($question) {
  const correctValues = new Set(getPrintableCorrectValues($question));
  const items = [];
  $question.find('#answerslist > li#answer').each(function (index) {
    const $answer = $(this);
    const rawValue = $answer.find('#anstextlbl').first().html()
      || $answer.find('#anspreview').first().html()
      || $answer.find('#ansvaltextbox').first().val()
      || '';
    if (!String(rawValue).trim()) {
      return;
    }

    const choiceValue = String($answer.find('.anschoice').first().val() || index);
    const choiceLabel = String.fromCharCode(65 + index);
    const correctClass = correctValues.has(choiceValue) ? ' correct' : '';
    items.push(`
      <li class="print-option${correctClass}">
        <span class="print-option-label">${choiceLabel}.</span>
        <span class="print-option-body">${renderPrintableMathHtml(rawValue)}</span>
      </li>
    `);
  });

  if (!items.length) {
    return '';
  }

  return `
    <div class="print-options-block">
      <div class="print-section-title">Options</div>
      <ol class="print-options-list">
        ${items.join('')}
      </ol>
    </div>
  `;
}

function buildPrintableTextAnswer($question) {
  const value = $question.find('#anstextlbl').first().html()
    || $question.find('#anspreview').first().html()
    || $question.find('#ansvaltextbox.tboxanschoice').first().val()
    || '';
  if (!String(value).trim()) {
    return '';
  }

  return `
    <div class="print-options-block">
      <div class="print-section-title">Answer</div>
      <div class="print-text-answer">${renderPrintableMathHtml(value)}</div>
    </div>
  `;
}

function buildPrintableTableRadio($question) {
  const groups = [];
  $question.find('#answerslist > li#answer').each(function () {
    const $group = $(this);
    const fieldName = $group.find('#ansfield').val() || '';
    const groupChoices = [];
    $group.find('#transchoice').each(function (index) {
      const $choice = $(this);
      const value = $choice.find('#anstextlbl').first().html()
        || $choice.find('#anspreview').first().html()
        || $choice.find('#ansvaltextbox').first().val()
        || '';
      if (!String(value).trim()) {
        return;
      }
      const checked = $choice.find('#tanschoice').is(':checked') ? ' correct' : '';
      groupChoices.push(`
        <li class="print-option${checked}">
          <span class="print-option-label">${String.fromCharCode(65 + index)}.</span>
          <span class="print-option-body">${renderPrintableMathHtml(value)}</span>
        </li>
      `);
    });

    if (groupChoices.length) {
      groups.push(`
        <div class="print-table-group">
          <div class="print-table-group-title">${escapePrintHtml(fieldName || 'Field')}</div>
          <ol class="print-options-list">
            ${groupChoices.join('')}
          </ol>
        </div>
      `);
    }
  });

  if (!groups.length) {
    return '';
  }

  return `
    <div class="print-options-block">
      <div class="print-section-title">Options</div>
      ${groups.join('')}
    </div>
  `;
}

function buildPrintableOptions($question) {
  const answerType = getPrintableAnswerType($question);
  if (answerType === 'TX') {
    return buildPrintableTextAnswer($question);
  }
  if (answerType === 'TR') {
    return buildPrintableTableRadio($question);
  }
  if (answerType === 'R' || answerType === 'C') {
    return buildPrintableChoiceList($question);
  }
  return '';
}

function buildPrintableQuestionCard($question) {
  const seq = ($question.find('#questionseqText').val()
    || $question.find('#questionseqlbl').text()
    || $question.attr('queseq')
    || '').trim();
  const questionType = ($question.find('#questionType:checked').val() || 'Q').trim();
  const solutionHtml = questionType === 'P' ? '' : buildPrintableSolutionBody($question);
  const optionsHtml = questionType === 'P' ? '' : buildPrintableOptions($question);

  return `
    <article class="print-question-card">
      <div class="print-question-heading">Q${escapePrintHtml(seq || '?')}</div>
      <div class="print-question-body">${getPrintableQuestionBody($question)}</div>
      ${optionsHtml}
      ${solutionHtml ? `
        <div class="print-solution-block">
          <div class="print-section-title">Solution</div>
          <div class="print-solution-body">${solutionHtml}</div>
        </div>
      ` : ''}
    </article>
  `;
}

function buildPrintableQuestionsMarkup() {
  const cards = [];
  $('#questionsList > li#question').each(function () {
    cards.push(buildPrintableQuestionCard($(this)));
  });

  const title = ($('#testdetails').text() || 'Questions').trim();
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${escapePrintHtml(title)} - Print</title>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700&family=Merriweather:wght@700&display=swap">
      <link rel="stylesheet" href="/css/styles.css">
      <link rel="stylesheet" href="/css/math.css">
      <style>
        body {
          margin: 0;
          padding: 24px;
          color: #172033;
          background: #eef3f8;
          font-family: "Noto Sans", sans-serif;
        }
        .print-shell {
          max-width: 920px;
          margin: 0 auto;
          background: #ffffff;
          border: 1px solid #d5deea;
          box-shadow: 0 16px 44px rgba(16, 34, 68, 0.10);
        }
        .print-header {
          padding: 28px 34px 18px;
          border-bottom: 2px solid #d7e0eb;
          background: linear-gradient(180deg, #f8fbff 0%, #eef5fb 100%);
        }
        .print-title {
          margin: 0;
          font-family: "Merriweather", serif;
          font-size: 24px;
          line-height: 1.35;
          color: #0f2942;
        }
        .print-subtitle {
          margin-top: 8px;
          font-size: 13px;
          color: #5f7288;
        }
        .print-content {
          padding: 28px 34px 36px;
        }
        .print-question-card {
          border: 1px solid #d9e2ec;
          border-radius: 12px;
          padding: 18px 20px 20px;
          margin-bottom: 18px;
          page-break-inside: avoid;
          break-inside: avoid;
          background: #fff;
        }
        .print-question-heading {
          font-weight: 700;
          font-size: 18px;
          color: #0f2942;
          margin-bottom: 10px;
        }
        .print-question-body,
        .print-solution-body,
        .print-text-answer,
        .print-option-body {
          line-height: 1.7;
          font-size: 15px;
        }
        .print-section-title {
          margin-top: 14px;
          margin-bottom: 8px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #5f7288;
        }
        .print-options-list {
          margin: 0;
          padding-left: 0;
          list-style: none;
        }
        .print-option {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 10px;
        }
        .print-option-label {
          min-width: 24px;
          font-weight: 700;
          color: #23415f;
        }
        .print-option.correct .print-option-label,
        .print-option.correct .print-option-body {
          color: #0b7a43;
          font-weight: 700;
        }
        .print-table-group {
          margin-bottom: 14px;
        }
        .print-table-group-title {
          font-weight: 700;
          margin-bottom: 6px;
          color: #23415f;
        }
        .print-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin: 0 auto 16px;
          max-width: 920px;
        }
        .print-actions button {
          border: 1px solid #19324d;
          background: #19324d;
          color: #fff;
          border-radius: 8px;
          padding: 10px 16px;
          font: inherit;
          cursor: pointer;
        }
        .print-actions button:last-child {
          background: #fff;
          color: #19324d;
        }
        @media print {
          body {
            background: #fff;
            padding: 0;
          }
          .print-actions {
            display: none !important;
          }
          .print-shell {
            max-width: none;
            border: 0;
            box-shadow: none;
          }
          .print-header,
          .print-content {
            padding-left: 18px;
            padding-right: 18px;
          }
          .print-question-card {
            border-color: #cfd8e3;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-actions">
        <button type="button" onclick="window.print()">Print</button>
        <button type="button" onclick="window.close()">Close</button>
      </div>
      <div class="print-shell">
        <header class="print-header">
          <h1 class="print-title">${escapePrintHtml(title)}</h1>
          <div class="print-subtitle">Questions, options, and solutions only</div>
        </header>
        <main class="print-content">
          ${cards.join('')}
        </main>
      </div>
    </body>
    </html>
  `;
}

function openPrintableQuestionsPopup() {
  const popup = window.open('', 'questions-print-view', 'width=1200,height=900,scrollbars=yes,resizable=yes');
  if (!popup) {
    alert('Popup blocked. Please allow popups for this page and try again.');
    return;
  }

  popup.document.open();
  popup.document.write(buildPrintableQuestionsMarkup());
  popup.document.close();
  popup.focus();
}

function openBulkChapterNamesUpdateDialog() {
  const sourceDetails = {
    collection: $('#testdetails').attr('collection'),
    chapterid: $('#testdetails').attr('chapterid'),
    testid: $('#testdetails').attr('testid')
  };
  const questionCount = $('#questionsList > li#question').length;

  bootbox.dialog({
    title: 'Bulk Update Chapter Names',
    size: 'large',
    message: `
      <div class="mb-2 text-muted small">
        Paste one chapter name per line in current question order. Numbering like <code>1- atoms</code> is allowed.
        Chapter names are stored exactly as pasted after removing the optional line number.
      </div>
      <div class="mb-2 small">
        <div><span class="text-warning">Source:</span> <code>${sourceDetails.collection || ''} / ${sourceDetails.chapterid || ''} / ${sourceDetails.testid || ''}</code></div>
        <div><span class="text-warning">Questions on page:</span> <code>${questionCount}</code></div>
      </div>
      <textarea class="form-control font-monospace" id="bulkChapterNamesInput" rows="14"
        placeholder="1-atoms&#10;2-electromagnetism&#10;3-waves"></textarea>
      <div class="small mt-2 text-muted">
        Example format shown in the input placeholder. Chapter names are trimmed before updating.
      </div>
      <div id="bulkChapterNamesStatus" class="small mt-3 text-muted"></div>
    `,
    buttons: {
      cancel: {
        label: 'Cancel',
        className: 'btn btn-sm btn-outline-secondary'
      },
      update: {
        label: 'Update Names',
        className: 'btn btn-sm btn-primary',
        callback: function () {
          const rawInput = $('#bulkChapterNamesInput').val();

          if (!rawInput || !rawInput.trim()) {
            $('#bulkChapterNamesStatus').html('<span class="text-danger">Please paste the chapter names first.</span>');
            return false;
          }

          if (!sourceDetails.collection || !sourceDetails.chapterid || !sourceDetails.testid) {
            $('#bulkChapterNamesStatus').html('<span class="text-danger">Missing source page details.</span>');
            return false;
          }

          $('#bulkChapterNamesStatus').html('<span class="text-info">Updating chapter names, please wait...</span>');

          ajaxRequest(
            '/tests/bulkupdatechapternames',
            'POST',
            {
              data: {
                collection: sourceDetails.collection,
                chapterid: sourceDetails.chapterid,
                testid: sourceDetails.testid,
                namesText: rawInput
              }
            },
            function (res) {
              console.log('Bulk chapter name update response:', res);
              const summary = res && res.summary ? res.summary : {};
              const issues = Array.isArray(res?.issues) ? res.issues : [];
              const parts = [];

              if (summary.updatedCount != null) {
                parts.push(`${summary.updatedCount} updated`);
              }
              if (summary.issueCount != null) {
                parts.push(`${summary.issueCount} issues`);
              }

              const message = parts.length > 0 ? parts.join(', ') : (res && res.message ? res.message : 'Bulk chapter update completed');

              if (issues.length > 0) {
                console.log('Bulk chapter name issues:', issues);
                if (console.table) {
                  console.table(issues);
                }
                const issueHtml = issues.map((item, index) => {
                  const title = item.questionseq != null ? `Question ${item.questionseq}` : `Row ${index + 1}`;
                  const detail = item.reason || item.status || 'Unknown issue';
                  const current = item.currentChaptername ? `Current: ${item.currentChaptername}` : '';
                  const next = item.newChaptername ? `New: ${item.newChaptername}` : '';
                  return `<li><strong>${title}</strong>: ${detail}${current ? ` (${current}${next ? `, ${next}` : ''})` : ''}</li>`;
                }).join('');
                $('#bulkChapterNamesStatus').html(`
                  <div class="text-warning mb-2">${message}</div>
                  <div class="border rounded bg-light p-2" style="max-height: 240px; overflow: auto;">
                    <div class="fw-bold mb-1">Issues found:</div>
                    <ul class="mb-0">${issueHtml}</ul>
                  </div>
                `);
              } else {
                $('#bulkChapterNamesStatus').html(`<span class="text-success">${message}</span>`);
              }

              if (summary.issueCount && summary.issueCount > 0) {
                bootstrap_alert.warning($('.sticky-header').find('#alertplaceholder'), message);
              } else {
                bootstrap_alert.success($('.sticky-header').find('#alertplaceholder'), message);
              }
            },
            function (failed) {
              console.log(failed);
              bootstrap_alert.error($('.sticky-header').find('#alertplaceholder'), 'Bulk chapter name update failed');
            }
          );

          return false;
        }
      }
    }
  });
}

function normalizeImportedAnswerValue(value) {
  if (value === undefined || value === null) {
    return '';
  }

  return String(value)
    .trim()
    .toUpperCase()
    .replace(/^[^A-Z0-9]+/, '')
    .replace(/[^A-Z0-9]+$/g, '');
}

function isMarkdownSeparatorRow(cells) {
  return cells.length > 0 && cells.every(cell => /^:?-{3,}:?$/.test(cell));
}

function normalizeImportedQuestionNumber(value) {
  return String(value || '')
    .trim()
    .replace(/[.)]+$/g, '')
    .replace(/^[^\d]+/g, '')
    .trim();
}

function extractAnswerEntriesFromMarkdownTable(rawInput) {
  const entries = [];
  const lines = String(rawInput || '')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.includes('|'));

  lines.forEach(line => {
    const cells = line
      .split('|')
      .map(cell => cell.trim())
      .filter(cell => cell.length > 0);

    if (cells.length === 0 || isMarkdownSeparatorRow(cells)) {
      return;
    }

    for (let index = 0; index < cells.length - 1; index += 2) {
      const questionNumber = normalizeImportedQuestionNumber(cells[index]);
      const answerValue = normalizeImportedAnswerValue(cells[index + 1]);

      if (!/^\d+$/.test(questionNumber) || !/^[A-Z0-9]+$/.test(answerValue)) {
        continue;
      }

      entries.push({
        questionNumber,
        answerValue
      });
    }
  });

  return entries;
}

function sortAnswerEntries(entries) {
  return [...entries].sort((left, right) => Number(left.questionNumber) - Number(right.questionNumber));
}

function convertMarkdownTableToAnswerLines(rawInput) {
  return sortAnswerEntries(extractAnswerEntriesFromMarkdownTable(rawInput))
    .map(entry => `${entry.questionNumber}-${entry.answerValue}`)
    .join('\n');
}

function parseBulkAnswerInput(rawInput) {
  const answerMap = {};
  const rawAnswerMap = {};
  const errors = [];
  const lines = (rawInput || '')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  lines.forEach((line, index) => {
    const match = line.match(/^(\d+)\s*(?:[~:|\-.]|->|\s)\s*(.+)$/);
    if (!match) {
      errors.push(`Line ${index + 1}: "${line}"`);
      return;
    }

    const questionSeq = match[1].trim();
    const rawAnswerValue = match[2].trim().replace(/^\((.*)\)$/, '$1').trim();
    const parsedChoices = normalizeBulkAnswerChoices(rawAnswerValue);

    if (parsedChoices.length > 0) {
      answerMap[questionSeq] = parsedChoices;
    }
    rawAnswerMap[questionSeq] = rawAnswerValue;
  });

  return { answerMap, rawAnswerMap, errors, totalLines: lines.length };
}

function normalizeBulkAnswerChoices(rawChoiceValue) {
  const tokens = String(rawChoiceValue || '')
    .replace(/[()]/g, ' ')
    .split(/[,\s/]+/)
    .map(token => token.trim().toUpperCase())
    .filter(Boolean);

  if (tokens.length === 0) {
    return [];
  }

  const numericTokens = tokens.filter(token => /^\d+$/.test(token));
  const shouldConvertOneBasedNumbers = numericTokens.length > 0 &&
    numericTokens.length === tokens.length &&
    !numericTokens.includes('0');

  return tokens.map(token => {
    if (/^[A-Z]$/.test(token)) {
      return String(token.charCodeAt(0) - 65);
    }

    if (/^\d+$/.test(token)) {
      const num = Number(token);
      return String(shouldConvertOneBasedNumbers ? num - 1 : num);
    }

    return '';
  }).filter(token => token !== '');
}

function renderBulkAnswerPreview(parsed) {
  const totalMapped = Object.keys(parsed.rawAnswerMap || parsed.answerMap).length;
  let message = `Parsed ${totalMapped} question mappings.`;

  if (parsed.errors.length > 0) {
    message += `<br><span class="text-danger">Fix these lines first:</span><br>${parsed.errors.join('<br>')}`;
  } else {
    const sample = Object.entries(parsed.rawAnswerMap || {})
      .slice(0, 8)
      .map(([qseq, value]) => `${qseq} → ${value}`)
      .join('<br>');
    if (sample) {
      message += `<br>${sample}`;
    }
  }

  $('#bulkAnswerImportStatus').html(message);
}

function questionHasExistingCorrectAnswer(question) {
  const text = $(question).find('#correctanswers').text().trim();
  return text.length > 0;
}

function applyBulkAnswers(answerMap, options = {}, rawAnswerMap = {}) {
  const settings = {
    overwriteExisting: false,
    autoSave: true,
    ...options
  };

  let applied = 0;
  let skipped = 0;
  let failed = 0;

  $('#questionsList .question').each(function (_, question) {
    const checkedType = question.querySelector('input.questionType:checked');
    if (checkedType && checkedType.value === 'P') {
      return;
    }

    const seq = question.getAttribute('queseq');
    const mappedAnswers = answerMap[seq];
    const rawAnswerValue = rawAnswerMap[seq];
    if (!mappedAnswers && !rawAnswerValue) {
      return;
    }

    if (!settings.overwriteExisting && questionHasExistingCorrectAnswer(question)) {
      skipped++;
      return;
    }

    let answerType = $(question).find('#answerType:checked').val();
    if (mappedAnswers && mappedAnswers.length > 1 && answerType === 'R') {
      const checkboxType = $(question).find('#answerType[value="C"]');
      if (checkboxType.length > 0) {
        checkboxType.prop('checked', true).trigger('change');
        answerType = 'C';
      }
    }

    if (answerType === 'TX') {
      const textAnswer = String(rawAnswerValue || '').trim();
      if (!textAnswer) {
        failed++;
        console.warn(`Bulk import skipped empty TX answer for question ${seq}`);
        return;
      }

      const editBtn = question.querySelector('.editquestion');
      if (editBtn && $(question).find('.ftxt:visible').length === 0) {
        editBtn.click();
      }

      const $question = $(question);
      $question.find('.previewsrc.decimalinput').first().val(textAnswer).trigger('input');
      $question.find('#ansvaltextbox.tboxanschoice').val(textAnswer).trigger('input');
      $question.find('#anstextlbl').first().text(textAnswer);
      $question.find('#anspreview').first().text(textAnswer);
      $question.find('#correctanswers').text(textAnswer);

      if (settings.autoSave) {
        $question.find('.savequestion:first').trigger('click');
      }

      applied++;
      return;
    }

    if (!['R', 'C'].includes(answerType)) {
      failed++;
      console.warn(`Bulk import skipped unsupported answer type ${answerType} for question ${seq}`);
      return;
    }

    const editBtn = question.querySelector('.editquestion');
    if (editBtn && $(question).find('.ftxt:visible').length === 0) {
      editBtn.click();
    }

    $(question).find('.anschoice').prop('checked', false).trigger('change');

    let appliedForQuestion = 0;
    mappedAnswers.forEach(answerIndex => {
      const input = question.querySelector(`.anschoice[value="${answerIndex}"]`);
      if (input) {
        input.checked = true;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        appliedForQuestion++;
      }
    });

    if (appliedForQuestion === 0) {
      failed++;
      console.warn(`Bulk import could not match any option for question ${seq}`);
      return;
    }

    if (settings.autoSave) {
      $(question).find('.savequestion:first').trigger('click');
    }

    applied++;
  });

  const summary = `Applied: ${applied}, skipped: ${skipped}, failed: ${failed}`;
  if ($('#bulkAnswerImportStatus').length > 0) {
    $('#bulkAnswerImportStatus').html(summary);
  }
  console.log(summary);
}

window.bulkSetAnswers = function (rawInput, options = {}) {
  const parsed = parseBulkAnswerInput(rawInput);
  if (parsed.errors.length > 0) {
    console.error('Bulk answer import errors:', parsed.errors);
    return { success: false, errors: parsed.errors };
  }
  applyBulkAnswers(parsed.answerMap, options, parsed.rawAnswerMap);
  return { success: true, total: Object.keys(parsed.rawAnswerMap).length };
}
