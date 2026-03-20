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

  $(document).on('click', '.downloadformobile', function (event) {
    stopscroll(event);
    downloadmobilefile(this, event);
  });

  $(document).on('click', '.getclonetestdetails', function (event) {
    stopscroll(event);
    getclonetestdetails(this, event);
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
    //qseq = qtype+"_"+qseq; 
    imgname = imgname.replaceAll(/\./g, '_');
    imageTag = '<div class="hscrollenable"><span class="sprite ' + imgname + '"></span></div>';
  } else {
    imageTag = '<div class="hscrollenable"><span class="sprite <<imgname>>"></span></div>';
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
function preprocessJqmathToTex(question) {
  if (!question || typeof question !== 'string') {
    return '';
  }

  // Method 1: If jqmath_to_latex is available, use the comprehensive converter
  if (typeof jqmath_to_latex === 'function') {
    return jqmath_to_latex(question);
  }

  // Method 2: Fallback - extract from <fmath> elements if DOM is available
  if (typeof document !== 'undefined') {
    // Create a temporary container to parse the HTML
    const container = document.createElement('div');
    container.innerHTML = question;

    // Find all fmath elements and convert them to LaTeX
    container.querySelectorAll("fmath").forEach(node => {
      let tex = node.getAttribute("alttext");
      if (!tex) return;

      // ---------- NORMALIZATION RULES ----------

      // 1. Fix primes: S^{'} → S'
      tex = tex.replace(/\^\{\s*'\s*\}/g, "'");

      // 2. Remove spacing commands like \;
      tex = tex.replace(/\\;/g, " ");

      // 3. Normalize dot operator
      tex = tex.replace(/⋅/g, "\\cdot");

      // 4. Normalize min / max
      tex = tex.replace(/\\min\s*\(/g, "\\min\\left(");
      tex = tex.replace(/\\max\s*\(/g, "\\max\\left(");
      tex = tex.replace(/\)(?!\s*\\right)/g, "\\right)");

      // 5. Normalize multiple spaces
      tex = tex.replace(/\s+/g, " ").trim();

      const isInline = node.classList.contains("fm-inline");
      const latex = isInline ? `$${tex}$` : `$$${tex}$$`;

      node.replaceWith(document.createTextNode(latex));
    });

    // Strip remaining HTML
    let output = container.textContent;
    output = output.replace(/\s+/g, " ").trim();

    return output;
  }

  // Method 3: Last resort - return as is
  return question;
}

function getQuestionPreviewData(parentelement, optype) {
  let questiondata = {
    _id: $(parentelement).attr('mid'),
    subject_key: $('#testdetails').attr('subject_key'),
    chapterid: $('#testdetails').attr('chapterid'),
    testid: $('#testdetails').attr('testid'),
    questionid: $(parentelement).attr('questid'),
    question: $(parentelement).find('#questiontextlbl').html(),
    section: $(parentelement).find('#section').html().trim(),
    answertype: $(parentelement).find('#answerType:checked').val(),
    isverified: $(parentelement).find('#isverified:checked').val(),
    questiontype: $(parentelement).find('#questionType:checked').val(),

    yttime: $(parentelement).find('#yttime').html(),
    playlistid: $(parentelement).find('#playlistid').html(),
    yturl: $(parentelement).find('#yturl').html()
  }
  // Convert to LaTeX - read from raw input field #questionText
  questiondata.questiontex = preprocessJqmathToTex($(parentelement).find('#questionText').val());
  questiondata.questionseq = $(parentelement).find('#questionseqText').val();
  if (questiondata.questiontype !== "P") {
    const isChecked = document.getElementById('canpublishsols').checked;
    if (isChecked) {
      questiondata.solution = $(parentelement).find('#solutionlbl').html();
      // Convert solution to LaTeX - read from raw input field #solutionText
      questiondata.solutiontex = preprocessJqmathToTex($(parentelement).find('#solutionText').val());
    } else {
      questiondata.solution = '';
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
          textex: preprocessJqmathToTex(textanswerRaw),
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
            textex: preprocessJqmathToTex(answerTextRaw),
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
            "textex": preprocessJqmathToTex(choiceTextRaw),
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
    question: sanitizequestion($(parentelement).find('#questionText').val()),
    answertype: $(parentelement).find('#answerType:checked').val(),
    isverified: $(parentelement).find('#isverified:checked').val(),
    questiontype: $(parentelement).find('#questionType:checked').val(),
    questionseq: $(parentelement).find('#questionseqText').val(),
    //yttime : $(parentelement).find('#yttime').html(),
    //playlistid : $(parentelement).find('#playlistid').html(),
    //yturl : $(parentelement).find('#yturl').html()  

  }

  if (questiondata.questiontype !== "P") {
    questiondata.solution = $(parentelement).find('#solutionText').val(),
      questiondata.haspara = $(parentelement).find('#haspara:checked').val(),
      questiondata.questiontype = $(parentelement).find('#questionType:checked').val(),


      questiondata.quesmarks = $(parentelement).find('#quesmarks').html(),
      questiondata.quesnegmarks = $(parentelement).find('#quesnegmarks').html(),

      questiondata.answers = []
    if (questiondata.answertype !== "TR") {
      const rname = $(parentelement).find('#anschoice').attr('name');
      if (questiondata.answertype === "TX") {
        let textanswer = $(parentelement).find('#ansvaltextbox').val();
        questiondata.answers.push({ text: textanswer, seq: 0 })
        questiondata.correct = [textanswer];
      } else {
        questiondata.correct = selectedAnswers(rname);
        $(parentelement).find('#answerslist>li').each(function (id, val) {
          questiondata.answers.push({
            text: sanitizequestion($(val).find('#ansvaltextbox').val()),
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
          choices.push({ "text": sanitizequestion($(valu).find('#ansvaltextbox').val()), "seq": idx });
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
  output = output.trim();

  return output;
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
        option = latex_to_js(option); // Convert LaTeX to JS format

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

    tempquestion = latex_to_js(tempquestion);
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

        // Apply LaTeX conversion if enabled
        answer_text = latex_to_js(answer_text);

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
  $('#questionsList>li').each(function (idx, pele) {
    questdata.push(getQuestionPreviewData($(pele), "s3"))
  });
  var answerMissingQuestions = [];
  questdata.forEach(question => {
    // Check if the questiontype is "Q" and if the correct property is empty or not
    if (question.questiontype === "Q" && (!question.correct || question.correct.length === 0)) {
      console.log(question.questionseq)
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
  //return $('.testtitle').text().trim()+"==>> "+answerMissingQuestions.toString();
  return urlslist;


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


function validateMissingImages(ele, vent) {
  console.log("Validate Missing Images Called")
  stopscroll(vent);
  var missingimagelist = '';
  var misClassNames = '';
  misClassNamesNoQuotes = [];
  var missedImagLocation = {}
  $('.clbl .hscrollenable .sprite').each((i, v) => {
    if ($(v).height() == 0) {
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
  data.subject_key = testdata.subject_key;
  data.chapterid = testdata.chapterid;
  data.collname = $('#testdetails').attr('collection');
  data.testid = testdata.testid;
  data.categorykey = $('#testdetails').attr('categorykey');
  data.is_cdn_https = testdata.is_cdn_https;
  data.questionImagesCdn = testdata.test_image;
  data.questionImages = (testdata.test_image) ? testdata.test_image.substring(testdata.test_image.lastIndexOf('/') + 1, testdata.test_image.length) : ''
  if (testdata.test_file_name && testdata.test_file_name.length > 0) { } else {
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
      console.log(result)
    }, function (result) {
      console.log(result)
    });
  } else {
    downloadJsonAsFile(filename, data);
  }
  $(that).find('.fa-spinner').hide();
}



function downloadGitHubmobilefile(that, event) {
  $(that).find('.fa-spinner').show();
  let data = {};
  data.subject_key = testdata.subject_key;

  data.chapterid = testdata.chapterid;
  data.collname = $('#testdetails').attr('collection');
  data.testid = testdata.testid;
  data.categorykey = $('#testdetails').attr('categorykey');
  data.is_cdn_https = testdata.is_cdn_https;
  data.questionImagesCdn = testdata.test_image;
  data.questionImages = (testdata.test_image) ? testdata.test_image.substring(testdata.test_image.lastIndexOf('/') + 1, testdata.test_image.length) : ''
  if (testdata.mobile_file_name && testdata.mobile_file_name.length > 0) { } else {
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
      console.log(result)
    }, function (result) {
      console.log(result)
    });
  } else {
    downloadJsonAsFile(filename, data);
  }
  $(that).find('.fa-spinner').hide();
}




function downloadGitHubmobilefileExamsnetApp(that, event) {
  $(that).find('.fa-spinner').show();
  let data = {};
  data.subject_key = testdata.subject_key;
  data.chapterid = testdata.chapterid;
  data.collname = $('#testdetails').attr('collection');
  data.testid = testdata.testid;
  data.categorykey = $('#testdetails').attr('categorykey');
  data.is_cdn_https = testdata.is_cdn_https;
  data.questionImagesCdn = testdata.test_image;
  data.questionImages = (testdata.test_image) ? testdata.test_image.substring(testdata.test_image.lastIndexOf('/') + 1, testdata.test_image.length) : ''
  if (testdata.mobile_file_name && testdata.mobile_file_name.length > 0) { } else {
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
      console.log(result)
    }, function (result) {
      console.log(result)
    });
  } else {
    downloadJsonAsFile(filename, data);
  }
  $(that).find('.fa-spinner').hide();
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


function bulkSetAnswers(answerString) {
  // Convert the answer string to a map: { seq: answerIndex }
  const answerMap = {};
  answerString.split(',').forEach(pair => {
    const [qNoRaw, ansRaw] = pair.split('~');
    answerMap[qNoRaw.trim()] = ansRaw.trim();
  });

  // Get all questions from DOM in order
  const allQuestions = document.querySelectorAll('.question');

  allQuestions.forEach(question => {
    // Skip paragraph questions
    const checkedType = question.querySelector('input.questionType:checked');
    if (checkedType && checkedType.value === 'P') {
      console.log(`⚠️ Skipping paragraph question with seq ${question.getAttribute('queseq')}`);
      return;
    }

    const seq = question.getAttribute('queseq');
    const answerIndex = answerMap[seq];

    if (answerIndex === undefined) {
      console.warn(`❌ No answer found for question seq ${seq}`);
      return;
    }

    // Click Edit
    const editBtn = question.querySelector('.editquestion');
    if (editBtn) editBtn.click();

    // Set the radio
    const radio = question.querySelector(`.anschoice[value="${answerIndex}"]`);
    if (!radio) {
      console.warn(`❌ Option ${answerIndex} not found for question seq ${seq}`);
      return;
    }

    radio.checked = true;
    radio.dispatchEvent(new Event('change', { bubbles: true }));

    // Click all save buttons inside this question
    const saveButtons = question.querySelectorAll('.savequestion');
    saveButtons.forEach(btn => btn.click());

    console.log(`✅ Question seq ${seq} set to option ${answerIndex}`);
  });
}
493609222
