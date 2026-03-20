$(function () {
  $(document).on("click", ".edittopic", function (event) {
    stopscroll(event);
    showTopicActions(this);
    $(this).closest("#topic").find("#subtopiclist").sortable("enable");
  });

  $(document).on("click", ".canceledittopic", function (event) {
    stopscroll(event);
    hideTopicActions(this);
    $(this).closest("#topic").find("#subtopiclist").sortable("disable");
  });

  $(".subtopiclist").sortable({
    placeholder: "ui-state-highlight",
    disabled: true, // Initially disabled
  });

  $(document).on("click", ".addtopic", function (event) {
    stopscroll(event);
    let tpl = $("#tpl_topic").clone().show();
    let seq = $("#topicList > li").length + 1;
    $(tpl).find("#topicseq").html(seq);
    //$(tpl).find('.topicseqText').val(seq);
    $(tpl).find("#topicseqText").attr("value", seq);
    $("#topicList").append(tpl.html());
  });

  $(document).on("click", ".addsubtopic", function (event) {
    stopscroll(event);
    let tpl = $("#tpl_subtopic").clone();
    $(this).closest("#topic").find("#subtopiclist").append(tpl.html());
  });

  $(document).on("click", ".deletetopic", function (event) {
    stopscroll(event);
    let mid = $(this).closest("#topic").attr("mid");
    let topic = $(this).closest("#topic");
    if (mid && mid.length > 0) {
      bootbox.confirm("Are you sure want to delete Topic?", function (result) {
        if (result) {
          let data = {
            subject_key: globals.notesdata.subject_key,
            _id: mid,
          };
          ajaxRequest(
            "/notes/deletetopic",
            "POST",
            data,
            function callback(res) {
              if (data._id && data._id.length > 0) {
                $(topic).remove();
              }
            },
            function (res) {
              console.log(res);
            }
          );
        }
      });
    } else {
      $(this).closest("#topic").remove();
    }
  });

  $(document).on("click", ".savetopic", function (event) {
    stopscroll(event);
    console.log("Save Topic Called..");
    saveTopicsData(this, event);
  });

  $(document).on("click", ".deletesubtopic", function (event) {
    stopscroll(event);
    let that = this;
    bootbox.confirm("Are you sure want to delete Answer?", function (result) {
      if (result) {
        $(that).closest("#subtopic").remove();
      }
    });
  });

  $(document).on("click", ".validateImages", function (event) {
    stopscroll(event);
    validateNotesMissingImages(this, event);
  });

  $(document).on("click", ".sorttopicnumbers", function (event) {
    stopscroll(event);
    sorttopicseqnumbers();
  });

  $(document).on("click", ".downloadnotesformobile", function (event) {
    stopscroll(event);
    downloadnotesformobile(this);
  });

  $(document).on("click", ".downloadnotesfornewmobile", function (event) {
    stopscroll(event);
    downloadnotesfornewmobile(this);
  });

  $(document).on("click", ".downloadnotesfornewmobile_examsnetapp", function (event) {
    stopscroll(event);
    downloadnotesfornewmobile_examsnetapp(this);
  });

  $(document).on("click", ".publishnotestos3", function (event) {
    stopscroll(event);
    publishnotestos3(this);
  });
});

function sorttopicseqnumbers() {
  let r = confirm("Are you sure want to continue??");
  if (!r) {
    return false;
  }

  let seq = 1;
  let tid = 1;
  $("#topicList #topic").each(function (i, v) {
    $(v).find(".edittopic").trigger("click");
    $(v).find("#topicseqText").val(seq);
    $(v).attr("topicid", tid);
    seq++;
    tid++;
    $($(v).find(".savetopic")[0]).trigger("click");
  });
}

function hideTopicActions(that) {
  let clbls = $(that).closest("#topic").find(".clbl");
  let ctxts = $(that).closest("#topic").find(".ctxt");
  let flbls = $(that).closest("#topic").find(".flbl");
  let ftxts = $(that).closest("#topic").find(".ftxt");

  clbls.each(function () {
    $(this).toggleClass("clbl ctxt");
  });
  ctxts.each(function () {
    $(this).toggleClass("ctxt clbl");
  });
  flbls.each(function () {
    $(this).toggleClass("flbl ftxt");
  });

  ftxts.each(function () {
    $(this).toggleClass("ftxt flbl");
  });

  $(that)
    .closest("#topic")
    .toggleClass("custom-bg-tbuddy custom-bg-tbuddy-highlight");
}

function showTopicActions(that) {
  //First Read then adjust..  to avoid over riding.
  let clbls = $(that).closest("#topic").find(".clbl");
  let ctxts = $(that).closest("#topic").find(".ctxt");
  let flbls = $(that).closest("#topic").find(".flbl");
  let ftxts = $(that).closest("#topic").find(".ftxt");

  clbls.each(function () {
    $(this).toggleClass("clbl ctxt");
  });
  ctxts.each(function () {
    $(this).toggleClass("ctxt clbl");
  });
  flbls.each(function () {
    $(this).toggleClass("flbl ftxt");
  });

  ftxts.each(function () {
    $(this).toggleClass("ftxt flbl");
  });

  $(that)
    .closest("#topic")
    .toggleClass("custom-bg-tbuddy custom-bg-tbuddy-highlight");
  $(that)
    .closest("#topic")
    .find(".previewspan")
    .each((i, ele) => {
      $(ele).find(".previewsrc").val($(ele).find(".valuetextbox").val());
    });
}

function saveTopicsData(that, vent) {
  let topicdata = {};
  topicdata.subject_key = globals.notesdata.subject_key;
  topicdata.chapterid = globals.notesdata.chapterid;
  topicdata.testid = globals.notesdata.testid;

  let pele = $(that).closest("#topic");
  if ($(pele).attr("mid") && $(pele).attr("mid").length > 0) {
    topicdata._id = $(pele).attr("mid");
  }
  topicdata.topicseq = $(pele).find("#topicseqText").val();
  if ($(pele).attr("topicid")) {
    topicdata.topicid = $(pele).attr("topicid");
  } else {
    topicdata.topicid = topicIdGenerator();
  }
  topicdata.topictitle = $(pele).find("#topictitleText").val();
  topicdata.topiccontent = [];
  $(pele)
    .find("#subtopiclist>li")
    .each(function (idx, val) {
      let ldata = {};
      ldata.text = $(val).find("#subtopictext").val()
        ? $(val).find("#subtopictext").val()
        : "";
      ldata.textseq = idx;
      topicdata.topiccontent.push(ldata);
    });

  ajaxRequest(
    "/notes/savetopics",
    "POST",
    {
      data: topicdata,
    },
    function (res) {
      saveNotesSuccess(res, that);
    },
    saveNotesFailure
  );
}

function saveNotesSuccess(res, ele) {
  console.log("Topic save success called..");
  if (res?.["_id"]) {
    $(ele).closest("#topic").attr("mid", res?.["_id"]);
    bootstrap_alert.success(
      $(ele.closest("#topic")).find("#alertplaceholder"),
      "Topic Saved Successfully"
    );
  } else if (res?.error) {
    bootstrap_alert.error(
      $(ele.closest("#topic")).find("#alertplaceholder"),
      "Topic Save Error"
    );
  } else if (res?.success) {
    bootstrap_alert.error(
      $(ele.closest("#topic")).find("#alertplaceholder"),
      "Topic Save Error, Session Expired Please Login Again"
    );
  }
  let tele = $(ele).closest("#topic");

  $(tele).find("#topictitle").html($(tele).find("#topictitleText").val());
  $(tele).find("#topicseq").html($(tele).find("#topicseqText").val());

  $(tele)
    .find("#subtopiclist li")
    .each(function (id, val) {
      $(val).find("#subtopiclbl").html($(val).find("#subtopicpreview").html());
    });

  hideTopicActions(ele);
}

function saveNotesFailure() {}

function topicIdGenerator() {
  let value = 0;
  $("#topicList > li").each(function () {
    const topicid = Number($(this).attr("topicid"));
    if (topicid > value) {
      value = topicid;
    }
  });
  return ++value;
}

function validateNotesMissingImages(ele, vent) {
  console.log("Validate Missign images event called");
  let missingimagelist = "";
  let misClassNames = "";
  let misClassNamesNoQuotes = [];
  let missedImagLocation = {};
  $(".clbl .hscrollenable .sprite").each((i, v) => {
    if ($(v).height() == 0) {
      missedImagLocation = $(v).closest("#topic").find("#topicseq")[0];
      missingimagelist +=
        $(v).closest("#topic").find("#topicseq").html() + ", ";
      misClassNames += '"' + v.className.replace(/sprite/, "").trim() + '",\n';
      misClassNamesNoQuotes.push(v.className.replace(/sprite/, "").trim());
    }
  });
  if (misClassNamesNoQuotes.length > 0) {
    document.title = misClassNamesNoQuotes.toString();
  }

  if (misClassNames && misClassNames.length > 0) {
    console.log(misClassNames);
    bootstrap_alert.error(
      $(".sticky-header").find("#alertplaceholder"),
      "Missing Images : " + misClassNames
    );
    missedImagLocation.scrollIntoView();
  } else {
    bootstrap_alert.success(
      $(".sticky-header").find("#alertplaceholder"),
      "No Missing Images found"
    );
    misClassNames = "None Missing.";
  }

  return misClassNames;
}

function downloadnotesformobile(that) {
  $(that).find(".fa-spinner").show();

  let data = {};

  data.cdnimage = test_image;

  data.topics = [];

  $(".topicslist .topic").each(function (i, v) {
    var topic = {};
    let title = $(v).find("#topictitle").html();

    topic.title = title;
    topic.subtopics = [];

    let subtopics = $(v).find(".subtopiclist .subtopic");

    $(subtopics).each(function (j, k) {
      topic.subtopics.push({ text: $(k).find("#subtopiclbl").html() });
    });

    data.topics.push(topic);
  });

  if (testdata.mobile_file_name && testdata.mobile_file_name.length > 0) {
  } else {
    alert("filename missing");
    return;
  }

  console.log(data);
  downloadJsonAsFile(testdata.mobile_file_name, data);
}

function downloadnotesfornewmobile(that) {
  $(that).find(".fa-spinner").show();

  let data = {};


  data.subject_key = testdata.subject_key;
  data.chapterid = testdata.chapterid;
  data.collname = $('#testdetails').attr('collection');
  data.testid = testdata.testid;
  data.categorykey = $('#testdetails').attr('categorykey');
  data.is_cdn_https = testdata.is_cdn_https;
  data.questionImagesCdn = testdata.test_image;
  
  data.questionImages = (testdata.test_image) ? testdata.test_image.substring(testdata.test_image.lastIndexOf('/') + 1, testdata.test_image.length) : ''

  //data.cdnimage = test_image;

  data.topics = [];

  $(".topicslist .topic").each(function (i, v) {
    var topic = {};
    let title = $(v).find("#topictitle").html();

    topic.title = title;
    topic.subtopics = [];

    let subtopics = $(v).find(".subtopiclist .subtopic");

    $(subtopics).each(function (j, k) {
      topic.subtopics.push({ text: $(k).find("#subtopiclbl").html() });
    });

    data.topics.push(topic);
  });
   
  if (testdata.mobile_file_name && testdata.mobile_file_name.length > 0) {
    
  } else {
    alert("filename missing");
    return;
  }
  let filename = testdata.mobile_file_name; 
  console.log(data);
  //data.correct = data.correct.toString();
  var body = {};
  body.data = data;
  body.data.datatype = 'notes';
  body.filename = filename;
  body.gitcodepath = gitcodepath;
  if (window.location.hostname.indexOf("localhost") > -1) {
    ajaxRequest(
      "/admin/downloadgitmobiledata",
      "POST",
      body,
      function (result) {
        console.log(result);
      },
      function (result) {
        console.log(result);
      }
    );
  } else {
    downloadJsonAsFile(filename, data);
  }
}

function downloadnotesfornewmobile_examsnetapp(that) {
  $(that).find(".fa-spinner").show();

  let data = {};
  data.subject_key = testdata.subject_key;
  data.chapterid = testdata.chapterid;
  data.collname = $('#testdetails').attr('collection');
  data.testid = testdata.testid;
  data.categorykey = $('#testdetails').attr('categorykey');
  data.is_cdn_https = testdata.is_cdn_https;
  data.questionImagesCdn = testdata.test_image;
  data.questionImages = (testdata.test_image) ? testdata.test_image.substring(testdata.test_image.lastIndexOf('/') + 1, testdata.test_image.length) : ''
  data.topics = [];

  $(".topicslist .topic").each(function (i, v) {
    var topic = {};
    let title = $(v).find("#topictitle").html();
    topic.title = title;
    topic.subtopics = [];

    let subtopics = $(v).find(".subtopiclist .subtopic");
    $(subtopics).each(function (j, k) {
      topic.subtopics.push({ text: $(k).find("#subtopiclbl").html() });
    });
    data.topics.push(topic);
  });

  if (!(testdata.mobile_file_name && testdata.mobile_file_name.length > 0)) {
    alert("filename missing");
    return;
  }

  let filename = testdata.mobile_file_name;
  var body = {};
  body.data = data;
  body.data.datatype = 'notes';
  body.filename = filename;
  body.gitcodepath = gitcodepath;

  if (window.location.hostname.indexOf("localhost") > -1) {
    ajaxRequest(
      "/admin/downloadgitmobiledata_examsnetapp",
      "POST",
      body,
      function (result) {
        console.log(result);
      },
      function (result) {
        console.log(result);
      }
    );
  } else {
    downloadJsonAsFile(filename, data);
  }
}

function publishnotestos3(that) {
  $(that).find(".fa-spinner").show();

  let data = {};
  data.subject_key = testdata.subject_key;
  data.chapterid = testdata.chapterid;
  data.collname = $('#testdetails').attr('collection');
  data.testid = testdata.testid;
  data.categorykey = $('#testdetails').attr('categorykey');
  data.link = (testdata.link && testdata.link.length > 0) ? testdata.link : testdata.mobile_file_name;
  data.topics = [];

  $(".topicslist .topic").each(function (i, v) {
    var topic = {};
    let title = $(v).find("#topictitle").html();
    topic.title = title;
    topic.subtopics = [];

    let subtopics = $(v).find(".subtopiclist .subtopic");
    $(subtopics).each(function (j, k) {
      topic.subtopics.push({ text: $(k).find("#subtopiclbl").html() });
    });
    data.topics.push(topic);
  });

  if (!(data.link && data.link.length > 0)) {
    alert("Filename/link missing");
    return;
  }

  ajaxRequest(
    "/data/publishQuestionsToS3",
    "POST",
    data,
    function (result) {
      $(that).find(".fa-spinner").hide();
      bootstrap_alert.success(
        $(".sticky-header").find("#alertplaceholder"),
        "Notes Publish to S3 success."
      );
    },
    function (result) {
      $(that).find(".fa-spinner").hide();
      bootstrap_alert.error(
        $(".sticky-header").find("#alertplaceholder"),
        "Notes Publish to S3 failed."
      );
    }
  );
}



function copyImageTag(ele, eve) {
  stopscroll(eve);
  let imageTag = ''; 
  if (imageprefix && imageprefix.length > 0) {
    let imgname = imageprefix + '_' + $(ele).closest('#topic').find('#topicseqText').val();
    //qseq = qtype+"_"+qseq; 
    imgname = imgname.replaceAll(/\./g, '_');
    imageTag = '<div class="hscrollenable"><span class="sprite ' + imgname + '"></span></div>';
  } else {
    imageTag = '<div class="hscrollenable"><span class="sprite <<imgname>>"></span></div>';
  }
  console.log(imageTag);
  copyToClipboard(imageTag);
}
