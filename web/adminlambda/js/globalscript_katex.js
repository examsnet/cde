
$(window).on("paste", function(e) { 
    const clipboardData = e?.originalEvent?.clipboardData;
    if (clipboardData) {
        //clipboardText = clipboardData.getData('text/plain');
        clipboardTextData = clipboardData.getData('Text');
        //clipboardHtml = clipboardData.getData('text/html');
    } 

    setTimeout(function() {
        $(e.target).closest('div').find('.getclonetestdetails').trigger('click');
    }, 200); // Delay of 200 milliseconds
});

function windowLevelKeyDown(event) {
    if (event.defaultPrevented) {
        return;
    }

    if (event.code !== 'KeyQ') {
        return;
    }

    // Only Alt+Q should trigger question paste; plain Q must type normally.
    if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
    }

    if (typeof pasteQuestionAndAnswers !== 'function') {
        return;
    }

    event.preventDefault();
    pasteQuestionAndAnswers();
} 
 

window.addEventListener('keydown', windowLevelKeyDown);

function handleCtrlKey(e, element) {
    
    switch (e.code) {
        case 'Space': // TAB KEY LOGIC
            e.preventDefault();
            let start = element.selectionStart;
            let end = element.selectionEnd;
            let val = element.value;
            let selected = val.substring(start, end);
            let re = /^/gm;
            let count = selected.match(re).length;
            let replacementchars = '&nbsp;&nbsp;';
            element.value = val.substring(0, start) + selected.replace(re, replacementchars) + val.substring(end);
            element.selectionStart = start + replacementchars.length;
            element.selectionEnd = start + replacementchars.length;
            break;
        case 'ArrowLeft':
            e.preventDefault();
            addsymbols(element, '←');
            break;
        case 'ArrowUp':
            e.preventDefault();
            appendsymbols(element, '↖{', '}');
            break;
        case 'ArrowRight':
            e.preventDefault();
            addsymbols(element, '→');
            break;
        case 'ArrowDown':
            e.preventDefault();
            appendsymbols(element, '↙{', '}');
            break;
        case 'Digit1':
            e.preventDefault();
            addsymbols(element, ' <br> ');
            break;
        case 'Digit2':
            e.preventDefault();
            appendsymbols(element, '<div class="parahead">', '</div>');
            break;
        case 'Digit3':
            e.preventDefault();
            appendsymbols(element, '<span class="highlight">', '</span>');
            break;
        case 'Digit4':
            e.preventDefault();
            appendsymbols(element, ' $', '$ ');
            break;
        case 'Digit5':
            e.preventDefault();
            addsymbols(element, '÷');
            break;
        case 'Digit6':
            e.preventDefault();
            appendsymbols(element, '^{', '}');
            break;
        case 'Digit8':
            e.preventDefault();
            addsymbols(element, '×');
            break;
        case 'Digit9':
            e.preventDefault();
            appendsymbols(element, '(', ')');
            break;
        case 'KeyB':
            e.preventDefault();
            appendsymbols(element, '<b>', '</b>');
            break;
        case 'KeyD':
            e.preventDefault();
            addsymbols(element, '𝜕');
            break;
        case 'KeyE':
            e.preventDefault();
            addsymbols(element, '&emsp;');
            break;
        case 'KeyI':
            e.preventDefault();
            appendsymbols(element, '<i>', '</i>');
            break;
        case 'KeyJ':
            e.preventDefault();
            appendsymbols(element, '<pre>', '</pre>');
            break;
        case 'KeyK':
            e.preventDefault();
            replaceNewLineWithBr(element);
            break;
        case 'KeyL':
            e.preventDefault();
            convertSelectedTextWithNewLineToList(element, e);
            break;
        case 'KeyM':
            e.preventDefault();
            appendsymbols(element, '<strong>', '</strong>');
            break;
        case 'KeyR':
            e.preventDefault();
            addsymbols(element, '⇒');
            break;
        case 'KeyS':
            e.preventDefault();
            $($(e.currentTarget).closest('#question').find('.savequestion')[0]).trigger('click');
            break;
        case 'KeyT':
            e.preventDefault();
            $('#latexToJQMath').trigger('click');
            break;
        case 'KeyU':
            e.preventDefault();
            appendsymbols(element, '<u>', '</u>');
            break;
        case 'KeyW':
            e.preventDefault();
            addsymbols(element, 'ω');
            break;
        case 'Semicolon':
            e.preventDefault();
            replaceSpaceWithEMSP(element);
            break;
        case 'Slash':
            e.preventDefault();
            appendComments(element, '/*', '*/');
            break;
        case 'Backquote':
            e.preventDefault();
            appendsymbols(element, '\\text "', '"');
            break;
        case 'BracketLeft':
            e.preventDefault();
            appendsymbols(element, '{', '}');
            break;
        case 'Backslash':
            e.preventDefault();
            appendsymbols(element, '<div class="hscrollenable">', '</div>');
            break;
        case 'Numpad8':
            e.preventDefault();
            appendsymbols(element, '<sup>', '</sup>');
            break;
        case 'Numpad2':
            e.preventDefault();
            appendsymbols(element, '<sub>', '</sub>');
            break;
        case 'Numpad1':
            e.preventDefault();
            addsymbols(element, '\\;\\;\\;⋅⋅⋅⋅⋅⋅⋅(i)');
            break;
        case 'Numpad3':
            e.preventDefault();
            addsymbols(element, '\\;\\;\\;⋅⋅⋅⋅⋅⋅⋅(iii)');
            break;
        case 'Minus':
            e.preventDefault();
            appendsymbols(element, '_{', '}');
            break;
        default:
            return true;
    }
}

function handleAltKey(e, element) {
    switch (e.code) {
        case 'Digit0':
            e.preventDefault();
            addsymbols(element, '°');
            break;
        case 'Digit6':
            e.preventDefault();
            addsymbols(element, '⋁');
            break;
        case 'KeyA':
            e.preventDefault();
            addsymbols(element, 'α');
            break;
        case 'KeyB':
            e.preventDefault();
            addsymbols(element, 'β');
            break;
        case 'KeyC':
            e.preventDefault();
            appendsymbols(element, '<code>', '</code>');
            break;
        case 'KeyD':
            e.preventDefault();
            addsymbols(element, 'δ');
            break;
        case 'KeyE':
            e.preventDefault();
            addsymbols(element, 'ε');
            break;
        case 'KeyG':
            e.preventDefault();
            addsymbols(element, 'γ');
            break;
        case 'KeyH':
            e.preventDefault();
            addsymbols(element, 'ℏ');
            break;
        case 'KeyI':
            e.preventDefault();
            addsymbols(element, '∫');
            break;
        case 'KeyL':
            e.preventDefault();
            addsymbols(element, 'λ');
            break;
        case 'KeyM':
            e.preventDefault();
            addsymbols(element, 'µ');
            break;
        case 'KeyN':
            e.preventDefault();
            addsymbols(element, '∩');
            break;
        case 'KeyO':
            e.preventDefault();
            addsymbols(element, 'ϕ');
            break;
        case 'KeyP':
            e.preventDefault();
            addsymbols(element, 'π');
            break;
        
        case 'KeyR':
            e.preventDefault();
            addsymbols(element, '₹');
            break;
        case 'KeyS':
            e.preventDefault();
            addsymbols(element, 'σ');
            break;
        case 'KeyT':
            e.preventDefault();
            addsymbols(element, 'θ');
            break;
        case 'KeyU':
            e.preventDefault();
            addsymbols(element, 'υ');
            break;
        case 'KeyV':
            e.preventDefault();
            addsymbols(element, '√');
            break;
        case 'KeyW':
            e.preventDefault();
            addsymbols(element, 'ω');
            break;
        case 'KeyZ':
            return true;
        case 'Semicolon':
            e.preventDefault();
            addsymbols(element, '∴');
            break;
        case 'Equal':
            e.preventDefault();
            addsymbols(element, '≠');
            break;
        case 'Comma':
            e.preventDefault();
            addsymbols(element, '≤');
            break;
        case 'Period':
            e.preventDefault();
            addsymbols(element, '≥');
            break;
        case 'Backquote':
            e.preventDefault();
            appendsymbols(element, '<div class="floatright">', '</div>');
            break;
        case 'Backslash':
            e.preventDefault();
            addsymbols(element, '∥');
            break;
        default:
            return true;
    }
}

function handleAltShiftKey(e, element) {
    switch (e.code) {
        case 'Digit6':
            e.preventDefault();
            addsymbols(element, '⋀');
            break;
        case 'KeyD':
            e.preventDefault();
            addsymbols(element, 'Δ');
            break;
        case 'KeyE':
            e.preventDefault();
            addsymbols(element, '∊');
            break;
        case 'KeyG':
            e.preventDefault();
            addsymbols(element, 'Γ');
            break;
        case 'KeyI':
            e.preventDefault();
            addsymbols(element, '∞');
            break;
        case 'KeyM':
            e.preventDefault();
            addsymbols(element, 'Ø');
            break;
        case 'KeyO':
            e.preventDefault();
            addsymbols(element, 'Φ');
            break;
        case 'KeyP':
            e.preventDefault();
            addsymbols(element, '∏');
            break;
        case 'KeyS':
            e.preventDefault();
            addsymbols(element, 'Σ');
            break;
        case 'KeyT':
            e.preventDefault();
            addsymbols(element, 'Θ');
            break;
        case 'KeyU':
            e.preventDefault();
            addsymbols(element, '∪');
            break;
        case 'KeyV':
            e.preventDefault();
            addsymbols(element, 'ϑ');
            break;
        case 'KeyW':
            e.preventDefault();
            addsymbols(element, 'Ω');
            break;
        case 'Period':
            e.preventDefault();
            addsymbols(element, '⋅');
            break;
        case 'Equal':
            e.preventDefault();
            addsymbols(element, '±');
            break;
        case 'Comma':
            e.preventDefault();
            addsymbols(element, '∠');
            break;
        default:
            return true;
    }
}

function handleCtrlAltKey(e, element) {
    if (e.code === 'KeyW') {
        e.preventDefault();
        appendAnchorTag(element);
    } else {
        return true;
    }
}
  

function keyHandler(e) { 
     
    if (e.ctrlKey && e.altKey) {
        return handleCtrlAltKey(e, this);
    } else if (e.ctrlKey) {
        return handleCtrlKey(e, this);
    } else if (e.altKey && e.shiftKey) {
        return handleAltShiftKey(e, this);
    } else if (e.altKey) {
        return handleAltKey(e, this);
    } else {
        return true;
    }
}

$(document).on('keydown', 'input[type=text], textarea', function(e) {
    //e.preventDefault();
    //e.stopPropagation();
    keyHandler(e);
}); 



function scrollToEle(ele) {
    if (ele && $(ele).offset()) {
        var pos = $(ele).offset().top;
        $('html, body').animate({
            scrollTop: pos
        }, 100);
    }

}

function getselectedText(){
    var text = ''; 
    if (window.getSelection) {
        text = window.getSelection();

    } else if (document.getSelection) {
        text = document.getSelection();

    } else if (document.selection) {
        text = document.selection.createRange().text;
    } 
    return text.toString();
}
function replaceSelectedText(replacementText) {
    if (document.queryCommandSupported('insertText')) {
        document.execCommand('insertText', false, replacementText);
    } else {
        var selection = window.getSelection();
        if (selection.rangeCount > 0) {
            var range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(replacementText));
        }
    }
}


function appendsymbols(ele, s1, s2) { 
    replaceSelectedText(s1+getselectedText()+s2);
}


function addsymbols(ele, symbol) {
    replaceSelectedText(symbol); 
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function replaceBRwithNewLineAndBR(str) { 
    str = str.replace(/<br>/g, "\n <br>");
    var matches = str.match(/\$\$[\s\S]+?\$\$|\$(?!\$)[^$\n]+?\$(?!\$)/g);
    if (matches && matches.length > 0) {
        matches.forEach(function(match) {
            str = str.replace(match, function () {
                return '\n' + match + '\n';
            });
        });
    }
    str = str.replace(/\n+/g, '\n');
    return str;
}


function getFormulaText(text) {   
    text = String(text || '').replace(/\r\n|\r/g, '\n');
    const mathPattern = /\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\\\([\s\S]+?\\\)|\\\[[\s\S]+?\\\]/g;

    if (typeof katex === 'undefined' || !mathPattern.test(text)) {
        return text.replace(/\n/g, '<br>');
    }
    mathPattern.lastIndex = 0;

    let result = '';
    let lastIndex = 0;
    let match;

    while ((match = mathPattern.exec(text)) !== null) {
        result += text.slice(lastIndex, match.index).replace(/\n/g, '<br>');

        const fullMatch = match[0];
        const displayMath = fullMatch.startsWith('$$') ? fullMatch.slice(2, -2) : null;
        const inlineMath = fullMatch.startsWith('$') && !fullMatch.startsWith('$$') ? fullMatch.slice(1, -1) : null;
        const inlineParenMath = fullMatch.startsWith('\\(') ? fullMatch.slice(2, -2) : null;
        const displayBracketMath = fullMatch.startsWith('\\[') ? fullMatch.slice(2, -2) : null;
        const latex = (displayMath || inlineMath || inlineParenMath || displayBracketMath || '').trim();
        const displayMode = Boolean(displayMath || displayBracketMath);

        if (!latex) {
            result += fullMatch;
        } else {
            try {
                result += katex.renderToString(latex, {
                    throwOnError: false,
                    trust: false,
                    strict: "warn",
                    output: "htmlAndMathml",
                    displayMode
                });
            } catch (error) {
                result += fullMatch;
            }
        }

        lastIndex = match.index + fullMatch.length;
    }

    result += text.slice(lastIndex).replace(/\n/g, '<br>');
    return result;
}

function syncPreviewSpan($scope) {
    const $previewSpan = $scope.closest('.previewspan');
    const sourceValue = $previewSpan.find('.previewsrc').val() || '';
    const renderedValue = getFormulaText(sourceValue);

    $previewSpan.find('.valuetextbox').val(sourceValue);
    $previewSpan.find('.previewdest').html(renderedValue);
}

function renderKatexQuestionBlock($question) {
    const $questionLabel = $question.find('#questiontextlbl').first();
    if ($questionLabel.length > 0) {
        const source = $question.find('#questionText').val() || '';
        const rendered = getFormulaText(source);
        $questionLabel.html(rendered);
        $question.find('#quespreview').html(rendered);
    }

    const $solutionLabel = $question.find('#solutionlbl').first();
    if ($solutionLabel.length > 0) {
        const source = $question.find('#solutionText').val() || '';
        const rendered = getFormulaText(source);
        $solutionLabel.html(rendered);
        $question.find('#solutionpreview').html(rendered);
    }

    $question.find('#answerslist > li').each(function () {
        const $answer = $(this);
        const $answerLabel = $answer.find('#anstextlbl').first();
        if ($answerLabel.length === 0) {
            return;
        }

        const source = $answer.find('#ansvaltextbox').first().val() || '';
        const rendered = getFormulaText(source);
        $answerLabel.html(rendered);
        $answer.find('#anspreview').first().html(rendered);
    });
}

function renderKatexQuestionPage() {
    $('#questionsList > li').each(function () {
        renderKatexQuestionBlock($(this));
    });
}


function downloadJsonAsFile(filename, json) {
    const jsonStr = JSON.stringify(json);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);

    a.click();

    URL.revokeObjectURL(url);
    document.body.removeChild(a);
}


$(function () {
  renderKatexQuestionPage();

  $(document).on('click', '.gptgeneratesolution', function (event) {
    stopscroll(event);
    getMCQSolution(event);
  });

  $(document).on('click', '.gptfixsolution', function (event) {
    stopscroll(event);
    fixMCQSolution(event);
  }); 

  $(document).on('click', '.splitoptionsbynewline', function (event) {
    stopscroll(event);
    paste4OptionsAlone(event);
  }); 

  $(document).on('click', '.makeanchor', function (event) {
    stopscroll(event);
    replaceSelectedText("<a href='javascript:void(0)' class='openinbrowser' ahref='" + getselectedText() + "'>" + getselectedText() + "</a>");
  });

  $(document).on('click', '.makeitalic', function (event) {
    stopscroll(event);
    replaceSelectedText("<i>" + getselectedText() + "</i>");
  });

  $(document).on('click', '.makestrong', function (event) {
    stopscroll(event);
    replaceSelectedText("<strong>" + getselectedText() + "</strong>");
  });

  $(document).on('click', '.makebold', function (event) {
    stopscroll(event);
    replaceSelectedText("<b>" + getselectedText() + "</b>");
  });

  $(document).on('click', '.makeunderline', function (event) {
    stopscroll(event);
    replaceSelectedText("<u>" + getselectedText() + "</u>");
  });


  $(document).on('click', '.makefloatright', function (event) {
    stopscroll(event);
    replaceSelectedText('<div class="floatright">' + getselectedText() + '</div>');
  });


  $(document).on('click', '.makeunorderedlist', function (event) {
    stopscroll(event);
    replaceSelectedText('<ul>' + getselectedText() + '</ul>');
  });

  $(document).on('click', '.makeorderedlist', function (event) {
    stopscroll(event);
    replaceSelectedText('<ol>' + getselectedText() + '</ol>');
  });

  $(document).on('click', '.makelist', function (event) {
    stopscroll(event);
    replaceSelectedText('<li>' + getselectedText() + '</li>');
  });

  $(document).on('click', '.makeunorderedlist1', function (event) {
    stopscroll(event);
    replaceSelectedText(textToList(getselectedText()));
  });

  $(document).on('click', '.previewaction', function (event) {
    syncPreviewSpan($(this));
    const $preview = $(this).closest('.previewspan').find('.previewdest');
    $preview.toggleClass('hidelem');
    $preview.css('display', $preview.hasClass('hidelem') ? 'none' : 'block');
  });


  $(document).on('click', '.formathtmlBR', function (event) {
    let value = $(this).closest('.previewspan').find('.previewsrc').val();
    let formattedHtml = replaceBRwithNewLineAndBR(value);
    let lines = formattedHtml.split('\n').length;
    const $previewSpan = $(this).closest('.previewspan');
    $previewSpan.find('.previewsrc').val(formattedHtml); 
    if (lines > 4) {
      if (lines > 25) { lines = 25 }
      $previewSpan.find('.previewsrc').attr('rows', lines);
    } 
    syncPreviewSpan($(this));
  });
  $(document).on('click', '.formathtml', function (event) { 
    let value = $(this).closest('.previewspan').find('.previewsrc').val(); 
    const formattedHtml = html_beautify(value, {
        indent_size: 4,
        space_in_empty_paren: true
    }); 
    let lines = formattedHtml.split('\n').length;
    const $previewSpan = $(this).closest('.previewspan');
    $previewSpan.find('.previewsrc').val(formattedHtml); 
    if (lines > 4) {
      if (lines > 25) { lines = 25 }
      $previewSpan.find('.previewsrc').attr('rows', lines);
    } 
    syncPreviewSpan($(this));
  });


  $(document).on('input', '.previewsrc', function (event) {
    syncPreviewSpan($(this));
    const $preview = $(this).closest('.previewspan').find('.previewdest');
    if (!$preview.hasClass('hidelem')) {
      $preview.css('display', 'block');
    }
  });


  $(document).on('click', '.copyimagetag', function (event) {
    stopscroll(event);
    copyImageTag(this, event)
  });


  
  $(document).on('click', '#scrolltop', function (event) {
    stopscroll(event);
    scrollTo(0, 0);
  });


  $(document).on('click', '#scrollbottom', function (event) {
    stopscroll(event);
    setTimeout(function () { window.scrollTo(0, document.body.scrollHeight); }, 1)
  });

 

});


function textToList(text) {
    // Split the text by period followed by a space or newline, to break it into sentences
    const sentences = text.split(/[\.\n]\s*/).filter(sentence => sentence.trim().length > 0);
    
    // Create an unordered list element
    const ul = document.createElement('ul');
    
    // Iterate through each sentence and create a list item
    sentences.forEach(sentence => {
        const li = document.createElement('li');
        li.innerHTML = sentence.trim();  // Add each sentence as HTML content
        ul.appendChild(li);
    });
    
    return ul.outerHTML;  // Return the constructed unordered list as a string
}


async function getMCQSolution(event) {
    const $container = $(event.currentTarget).closest('#question');
    const payloadData = await getGptQuestionPayload($container);

    if (!payloadData.question || payloadData.options.length === 0) {
        showGptQuestionError($container, 'Question or answers are missing');
        return;
    }

    await requestAndApplyGptSolution({
        event,
        url: '/data/getgptQuestionSolution',
        payloadData,
        loadingText: 'GPT Solution running...'
    });
}

async function fixMCQSolution(event) {
    const $container = $(event.currentTarget).closest('#question');
    const payloadData = await getGptQuestionPayload($container);
    payloadData.solution = getCurrentQuestionSolution($container);

    if (!payloadData.question || !payloadData.solution) {
        showGptQuestionError($container, 'Question or existing solution is missing');
        return;
    }

    await requestAndApplyGptSolution({
        event,
        url: '/data/fixgptQuestionSolution',
        payloadData,
        loadingText: 'GPT Fix Solution running...'
    });
}

async function getGptQuestionPayload($container) {
    const paragraphContext = getGptQuestionParagraphContext($container);
    const payload = {
        question: $container.find('#questionText').val() || '',
        questionHtml: $container.find('#questiontextlbl').html() || '',
        section: ($container.find('[id="section"]').first().text() || '').trim(),
        paragraphContext,
        options: $container.find('#ansvaltextbox').map(function () {
            return $(this).val() || $(this).text();
        }).get().filter(answer => answer && answer.trim().length > 0),
        optionsHtml: $container.find('#answerslist #anstextlbl').map(function () {
            return $(this).html() || $(this).text() || '';
        }).get(),
        examContext: ($('#testdetails').text() || '').trim(),
        paperTitle: ($('#testdetails').text() || '').trim(),
        subjectKey: $('#testdetails').attr('subject_key'),
    };

    const spriteImages = await extractQuestionSpriteImages($container);
    if (spriteImages.length > 0) {
        payload.questionImageSources = spriteImages;
        payload.questionImageDataUrls = spriteImages.map(item => item.dataUrl);
        payload.questionImageDataUrl = spriteImages[0].dataUrl;
        payload.questionHasSpriteImages = true;
        showSpriteExtractionBadge($container, spriteImages.length);
    } else {
        payload.questionHasSpriteImages = false;
        payload.questionImageSources = [];
        payload.questionImageDataUrls = [];
        payload.questionImageDataUrl = '';
        clearSpriteExtractionBadge($container);
    }

    if (payload.questionHasSpriteImages && payload.questionImageDataUrls.length === 0) {
        try {
            const fallbackImage = await captureQuestionSpriteScreenshot($container);
            if (fallbackImage) {
                payload.questionImageDataUrls = [fallbackImage];
                payload.questionImageDataUrl = fallbackImage;
                payload.questionImageSources = [{ label: 'fallback', sourceType: 'fallback', dataUrl: fallbackImage }];
            }
        } catch (error) {
            console.warn('Sprite image capture fallback failed. Continuing with text only.', error);
        }
    }

    return payload;
}

function showSpriteExtractionBadge($container, count) {
    const $actions = $container.find('.qactions').first();
    if ($actions.length === 0) {
        return;
    }

    clearSpriteExtractionBadge($container);

    const $badge = $('<span/>', {
        class: 'badge bg-info text-dark ms-2 gpt-sprite-extraction-badge',
        text: `Sprite tiles: ${count}`
    });

    const $target = $actions.find('.clbl, .flbl, .ftxt').first();
    if ($target.length > 0) {
        $target.append($badge);
    } else {
        $actions.append($badge);
    }

    window.setTimeout(() => clearSpriteExtractionBadge($container), 5000);
}

function clearSpriteExtractionBadge($container) {
    $container.find('.gpt-sprite-extraction-badge').remove();
}

function parseCssPx(value, fallback = 0) {
    if (typeof value !== 'string') {
        return fallback;
    }
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function parseSpriteBackgroundUrl(backgroundImage) {
    if (!backgroundImage || backgroundImage === 'none') {
        return '';
    }

    const match = backgroundImage.match(/url\(["']?(.*?)["']?\)/i);
    return match ? match[1] : '';
}

function parseBackgroundPosition(styleValue) {
    const parts = String(styleValue || '0px 0px').split(/\s+/).filter(Boolean);
    const x = parseCssPx(parts[0], 0);
    const y = parseCssPx(parts[1] || parts[0], 0);
    return { x, y };
}

function parseBackgroundSize(styleValue, fallbackWidth, fallbackHeight, boxWidth, boxHeight) {
    if (!styleValue || styleValue === 'auto') {
        return { width: fallbackWidth, height: fallbackHeight };
    }

    const parts = String(styleValue).split(/\s+/).filter(Boolean);
    const width = parseCssSizeValue(parts[0], fallbackWidth, boxWidth);
    const height = parseCssSizeValue(parts[1] || parts[0], fallbackHeight, boxHeight);
    return { width, height };
}

function parseCssSizeValue(value, fallback, relativeTo) {
    if (typeof value !== 'string') {
        return fallback;
    }

    if (value.endsWith('%')) {
        const parsed = Number.parseFloat(value);
        return Number.isFinite(parsed) ? ((relativeTo || 0) * parsed / 100) : fallback;
    }

    return parseCssPx(value, fallback);
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
    });
}

async function spriteElementToDataUrl(spriteEl) {
    const afterStyle = window.getComputedStyle(spriteEl, '::after');
    const imageUrl = parseSpriteBackgroundUrl(afterStyle.backgroundImage);
    if (!imageUrl) {
        return '';
    }

    // Prefer capturing the rendered sprite itself so we preserve the exact
    // browser output instead of reconstructing the sprite-sheet math.
    if (window.html2canvas) {
        const captureRoot = document.createElement('div');
        captureRoot.className = 'gpt-sprite-element-capture-root';
        captureRoot.style.position = 'fixed';
        captureRoot.style.left = '-10000px';
        captureRoot.style.top = '0';
        captureRoot.style.display = 'inline-block';
        captureRoot.style.overflow = 'hidden';
        captureRoot.style.width = afterStyle.width || '1px';
        captureRoot.style.height = afterStyle.height || '1px';
        captureRoot.style.background = 'transparent';
        captureRoot.style.pointerEvents = 'none';
        captureRoot.style.zIndex = '-1';

        const renderedSprite = document.createElement('div');
        renderedSprite.style.display = 'inline-block';
        renderedSprite.style.width = afterStyle.width || '1px';
        renderedSprite.style.height = afterStyle.height || '1px';
        renderedSprite.style.backgroundImage = afterStyle.backgroundImage;
        renderedSprite.style.backgroundPosition = afterStyle.backgroundPosition;
        renderedSprite.style.backgroundSize = afterStyle.backgroundSize;
        renderedSprite.style.backgroundRepeat = 'no-repeat';
        renderedSprite.style.filter = afterStyle.filter || 'none';
        renderedSprite.style.boxSizing = 'border-box';
        renderedSprite.style.overflow = 'hidden';
        captureRoot.appendChild(renderedSprite);
        document.body.appendChild(captureRoot);

        try {
            const canvas = await window.html2canvas(captureRoot, {
                backgroundColor: null,
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
                onclone: (clonedDoc) => {
                    clonedDoc.querySelectorAll('link[rel="stylesheet"]').forEach(link => link.remove());
                }
            });
            const dataUrl = canvas.toDataURL('image/png');
            if (dataUrl && dataUrl.length > 100) {
                window.__gptSpriteCaptureMethod = 'html2canvas';
                return dataUrl;
            }
        } catch (error) {
            console.warn('Rendered sprite capture failed, falling back to sprite-sheet crop.', error);
        } finally {
            captureRoot.remove();
        }
    }

    const rect = spriteEl.getBoundingClientRect();
    const targetWidth = Math.max(1, Math.round(rect.width || parseCssPx(afterStyle.width, 0)));
    const targetHeight = Math.max(1, Math.round(rect.height || parseCssPx(afterStyle.height, 0)));
    const image = await loadImage(imageUrl);

    const backgroundSize = parseBackgroundSize(afterStyle.backgroundSize, image.naturalWidth, image.naturalHeight, targetWidth, targetHeight);
    const bgPos = parseBackgroundPosition(afterStyle.backgroundPosition || `${afterStyle.backgroundPositionX} ${afterStyle.backgroundPositionY}`);
    const scaleX = backgroundSize.width ? image.naturalWidth / backgroundSize.width : 1;
    const scaleY = backgroundSize.height ? image.naturalHeight / backgroundSize.height : 1;

    const sourceWidth = Math.max(1, Math.round(targetWidth * scaleX));
    const sourceHeight = Math.max(1, Math.round(targetHeight * scaleY));
    const sourceX = Math.max(0, Math.round((image.naturalWidth - sourceWidth) * (bgPos.x / 100)));
    const sourceY = Math.max(0, Math.round((image.naturalHeight - sourceHeight) * (bgPos.y / 100)));

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);
    window.__gptSpriteCaptureMethod = 'fallback-crop';
    return canvas.toDataURL('image/png');
}

function getSpriteSourceLabel(spriteEl) {
    const $sprite = $(spriteEl);
    const questionText = $sprite.closest('#questiontextlbl').length > 0;
    if (questionText) {
        return 'question';
    }

    const $answerItem = $sprite.closest('li#answer');
    if ($answerItem.length > 0) {
        const answerIndex = $answerItem.parent().find('li#answer').index($answerItem);
        return `option-${answerIndex + 1}`;
    }

    return 'unknown';
}

async function extractQuestionSpriteImages($container) {
    const spriteElements = $container.find('.sprite').toArray();
    if (spriteElements.length === 0) {
        return [];
    }

    const images = [];
    const seen = new Set();

    for (const spriteEl of spriteElements) {
        try {
            const sourceLabel = getSpriteSourceLabel(spriteEl);
            if (sourceLabel === 'unknown') {
                continue;
            }

            const style = window.getComputedStyle(spriteEl, '::after');
            const key = [
                sourceLabel,
                sourceLabel === 'option-1' || sourceLabel.startsWith('option-')
                    ? String($(spriteEl).closest('li#answer').index())
                    : '',
                parseSpriteBackgroundUrl(style.backgroundImage),
                style.backgroundPosition,
                style.backgroundSize,
                style.width,
                style.height
            ].join('|');

            if (seen.has(key)) {
                continue;
            }
            seen.add(key);

            const dataUrl = await spriteElementToDataUrl(spriteEl);
            if (dataUrl) {
                const answerIndex = $(spriteEl).closest('li#answer').length > 0
                    ? $(spriteEl).closest('li#answer').parent().find('li#answer').index($(spriteEl).closest('li#answer')) + 1
                    : 0;
                images.push({
                    label: sourceLabel === 'question' ? 'question' : (sourceLabel.startsWith('option-') ? `option-${answerIndex}` : sourceLabel),
                    sourceClass: String(spriteEl.className || '').replace(/\s+/g, ' ').trim(),
                    dataUrl
                });
            }
        } catch (error) {
            console.warn('Failed to extract sprite tile, skipping.', error);
        }
    }

    return images;
}

async function captureQuestionSpriteScreenshot($container) {
    const captureRoot = document.createElement('div');
    captureRoot.className = 'gpt-sprite-capture-root';
    captureRoot.style.position = 'fixed';
    captureRoot.style.left = '-10000px';
    captureRoot.style.top = '0';
    captureRoot.style.width = `${Math.max($container.outerWidth() || 800, 800)}px`;
    captureRoot.style.background = '#ffffff';
    captureRoot.style.padding = '16px';
    captureRoot.style.pointerEvents = 'none';
    captureRoot.style.zIndex = '-1';

    const $clone = $container.clone(false, false);
    $clone.find('.ftxt, .previewspan, .hidelem, #alertplaceholder').remove();
    $clone.find('.qactions').remove();
    $clone.find('.editquestion, .deletequestion, .clonelinkedquestion, .updatelinkedquestion, .savequestion').remove();
    captureRoot.appendChild($clone.get(0));
    document.body.appendChild(captureRoot);

    try {
        if (!window.html2canvas) {
            return '';
        }

        const canvas = await window.html2canvas(captureRoot, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false
        });
        return canvas.toDataURL('image/png');
    } finally {
        captureRoot.remove();
    }
}

function getGptQuestionParagraphContext($container) {
    const hasParaValue = ($container.find('#haspara:checked').val() || '').toString().toLowerCase();
    const hasParaFromLabel = /Has Para\s*:\s*true/i.test($container.find('.qactions').text() || '');

    if (hasParaValue !== 'true' && !hasParaFromLabel) {
        return '';
    }

    const $paragraphQuestion = $container.prevAll('li#question').filter(function () {
        return $(this).find('#questionType:checked').val() === 'P';
    }).first();

    if ($paragraphQuestion.length === 0) {
        return '';
    }

    return $paragraphQuestion.find('#questionText').val() || '';
}

function getCurrentQuestionSolution($container) {
    return $container.find('#solutionText').val() || '';
}

function isGptQuestionAutoSaveEnabled() {
    return $('#gptAutoSaveQuestion').is(':checked');
}

async function requestAndApplyGptSolution({ event, url, payloadData, loadingText }) {
    const $button = $(event.currentTarget);
    const $container = $button.closest('#question');
    setGptQuestionButtonLoading($button, true, loadingText);

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: payloadData })
        });

        const data = await res.json();

        if (data.status === 'success' && data.solution) {
            applyGptSolutionToQuestion($container, data.solution);
            showGptQuestionProviderFeedback($container, data);
            if (isGptQuestionAutoSaveEnabled()) {
                $container.find('.savequestion:first').trigger('click');
                bootstrap_alert.success($container.find('#alertplaceholder'), 'GPT solution updated and save triggered');
            } else {
                bootstrap_alert.success($container.find('#alertplaceholder'), 'GPT solution updated. Please verify and save manually.');
            }
        } else {
            showGptQuestionError($container, data.msg || 'Error fetching solution');
        }

    } catch (err) {
        console.error('Error calling GPT solution API:', err);
        showGptQuestionError($container, err.message || 'Error calling GPT solution API');
    } finally {
        setGptQuestionButtonLoading($button, false);
    }
}

function applyGptSolutionToQuestion($container, solution) {
    solution = normalizeGptSolutionToLatex(solution);
    const $hiddenInput = $container.find('#solutionText');
    $hiddenInput.val(solution);

    const $visibleTextarea = $hiddenInput.closest('.input-group').find('textarea.previewsrc');
    $visibleTextarea.val(solution).trigger('input').trigger('change');

    $container.find('#solutionpreview').html(getFormulaText(solution));
    $container.find('#solutionlbl').html(getFormulaText(solution));
}

function showGptQuestionProviderFeedback($container, data) {
    const providerLabel = data.provider === 'lmstudio' ? 'LM Studio Local' : (data.provider === 'ollama' ? 'Ollama Local' : 'OpenAI');
    const modelLabel = data.model || 'unknown model';
    const message = `Solution generated using ${providerLabel} / ${modelLabel}`;

    console.log('[GPT Solution]', {
        provider: providerLabel,
        model: modelLabel,
        maxTokens: data.maxtokens,
        solutionLength: data.solution ? data.solution.length : 0
    });

    bootstrap_alert.success($container.find('#alertplaceholder'), message);
}

function normalizeGptSolutionToLatex(solution) {
    const normalizedSolution = normalizeGptLatexSyntax(
        normalizeGptLatexDelimiters(stripGptSolutionHtml(solution))
    );

    return normalizeGptMarkdownFormatting(normalizedSolution);
}

function stripGptSolutionHtml(solution) {
    solution = String(solution || '')
        .replace(/<(b|strong)>\s*([\s\S]*?)\s*<\/\1>/gi, '**$2**')
        .replace(/<(i|em)>\s*([\s\S]*?)\s*<\/\1>/gi, '_$2_');

    const text = $('<div>').html(solution)
        .find('br').replaceWith('\n').end()
        .find('p,div,li').append('\n').end()
        .text()
        .trim();

    return text
        .replace(/\r\n|\r/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]+\n/g, '\n')
        .trim();
}

function normalizeGptLatexDelimiters(solution) {
    return solution
        .replace(/\\\(([\s\S]*?)\\\)/g, '$$$1$$')
        .replace(/\\\[([\s\S]*?)\\\]/g, '$$$1$$')
        .replace(/\$\$/g, '$');
}

function normalizeGptLatexSyntax(solution) {
    return solution
        .replace(/\\boxed\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, '$1')
        .replace(/\\(?:tfrac|dfrac)\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '\\frac{$1}{$2}')
        .replace(/\\(?:tfrac|dfrac)\s*([A-Za-z0-9])\s*([A-Za-z0-9])/g, '\\frac{$1}{$2}')
        .replace(/\\Longrightarrow|\\Rightarrow|\\implies/g, '⇒')
        .replace(/\\therefore/g, '∴')
        .replace(/\\because/g, '∵');
}

function normalizeGptMarkdownFormatting(solution) {
    solution = solution
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/\*\*([^*\n][\s\S]*?[^*\n])\*\*/g, '<b>$1</b>')
        .replace(/__([^_\n][\s\S]*?[^_\n])__/g, '<b>$1</b>');

    return convertGptBulletLinesToHtml(solution);
}

function convertGptBulletLinesToHtml(solution) {
    const lines = solution.split(/\n/);
    const output = [];
    let bulletItems = [];

    function flushBullets() {
        if (bulletItems.length === 0) {
            return;
        }
        output.push('<ul>' + bulletItems.map(item => '<li>' + item + '</li>').join('') + '</ul>');
        bulletItems = [];
    }

    lines.forEach(line => {
        const headingMatch = line.match(/^\s{0,3}#{1,6}\s+(.+)$/);
        if (headingMatch) {
            flushBullets();
            output.push('<b>' + headingMatch[1].trim() + '</b>');
            return;
        }

        if (/^\s*-{3,}\s*$/.test(line)) {
            flushBullets();
            output.push('<hr>');
            return;
        }

        const match = line.match(/^\s*[-*]\s+(.+)$/);
        if (match) {
            bulletItems.push(match[1].trim());
            return;
        }

        if (bulletItems.length > 0 && /^\s{2,}\S/.test(line)) {
            bulletItems[bulletItems.length - 1] += '<br>' + line.trim();
            return;
        }

        flushBullets();
        if (line.trim().length > 0) {
            output.push(line.trim());
        }
    });

    flushBullets();
    return output.join('<br>');
}

function setGptQuestionButtonLoading($button, isLoading, title) {
    if (isLoading) {
        $button.data('original-html', $button.html());
        $button.data('original-title', $button.attr('title'));
        $button.prop('disabled', true).addClass('disabled');
        $button.html('<i class="fa-solid fa-spinner fa-spin-pulse"></i> GPT...');
        if (title) {
            $button.attr('title', title);
        }
        return;
    }

    if ($button.data('original-html')) {
        $button.html($button.data('original-html'));
    }
    if ($button.data('original-title')) {
        $button.attr('title', $button.data('original-title'));
    }
    $button.prop('disabled', false).removeClass('disabled');
}

function showGptQuestionError($container, message) {
    console.error(message);
    bootstrap_alert.error($container.find('#alertplaceholder'), message);
}
