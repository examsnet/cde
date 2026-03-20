let currentQuestionSeq = 1;
let paramap = {};
let curpara = '';
let totalQuestions = 0;
let visiblepara = 0;



$(document).ready(function () {

    $(document).on("input", "#color-picker", function (event) { 
        sketchpad.color = event.target.value;
    });
    $(document).on("click", ".tparabutton", function (event) {
        showOrHidePara($(this).attr('paraid'));
    });
    
    $(document).on("input", "#pensize", function (event) {
        sketchpad.penSize = parseFloat(event.target.value);
    });

    $(document).on("click", "#sketcheraser", function (event) {
        sketchpad.clear(); sketchpad.strokes = [];
    });

    $(document).on("click", "#defaultcolor", function (event) {
        sketchpad.color = '#007bff';
    });

    $(document).on("change", "#pagination", function (event) {
        onChangePagination(this, event)
    });

    $(document).on("click", "#toggleSketchPad", function (event) {
        toggleSketchPad()
    });
    $(document).on("click", "#asketch", function (event) {
        toggleSketchPad()
    });

    $(document).on("click", "#undosketchpad", function (event) {
        sketchpad.undo();
    });
    $(document).on("click", "#redosketchpad", function (event) {
        sketchpad.redo();
    });

    $(document).on("click", "#showprevquestion", function (event) {
        showprevquestion();
    });
    $(document).on("click", "#shownextquestion", function (event) {
        shownextquestion();
    });


    $(document).on("click", "#toggleImageCanvas", function (event) {
        toggleImage_canvas()
    });
    $(document).on("click", "#addExplainText", function (event) {
        addExplainText();
    });
    $(document).on("click", "#editExplainText", function (event) {
        editExplainText();
    });
    $(document).on("click", "#toggleTheme", function (event) {
        toggleTheme_canvas()
    });
    $(document).on("input", "#explain-font-size", function (event) {
        updateSelectedExplainStyle({ fontSize: parseInt(event.target.value, 10) });
    });
    $(document).on("input", "#explain-text-color", function (event) {
        updateSelectedExplainStyle({ color: event.target.value });
    });
    $(document).on("input", "#explain-bg-color", function (event) {
        updateSelectedExplainStyle({ backgroundColor: hexToRgba(event.target.value, 0.55) });
    });


    function toggleTheme_canvas() {
        $('body').toggleClass("dark-theme");
        if ($("body").hasClass("dark-theme")) {
            sketchpad.color = '#E9B9B9';
        } else {
            sketchpad.color = '#E00000';
        }
    }
    if(globals.screen == 'canvas'){
        let storedtheme = window.localStorage.getItem('examsnettheme');
        if (storedtheme === "dark-theme") {
            
            $('body').addClass("dark-theme");
            sketchpad.color = '#E9B9B9';
        } else {
            toggleTheme_canvas();
        }
    }else{
        toggleTheme_canvas();
    }

    $('body').show();
    var t = toggleSketchPad(); 

});


function showOrHideParaForQuestion(qno) {
    console.log(qno)
    let results = 0;
    let toSearch = "'" + qno + "'";
    Object.entries(paramap).forEach(([key, value]) => {
        if (value.indexOf(toSearch) != -1) {
            results = key;
        }
    });

    if (visiblepara > 0) {
        document.getElementById('p-question-' + visiblepara).style.display = 'none';
    }

    if (results != 0) {
        document.getElementById('p-question-' + results).style.display = 'block';
        visiblepara = results;
    }

}



function shownextquestion(vent) {
    if (vent) {
        vent.preventDefault();
        vent.stopPropagation();
    }
    let lastQuestionNum = Number($('ul#questionsList>li:last-child #questionseqlbl').html());
    if (currentQuestionSeq < lastQuestionNum) {
        let newQuestion = currentQuestionSeq + 1;
        setSelectedValue(newQuestion);
    }
    scrollTOP();
}

function scrollTOP() {
    window.scrollTo(0, 0);
}
function showprevquestion(vent) {
    if (vent) {
        vent.preventDefault();
        vent.stopPropagation();
    }
    if (currentQuestionSeq > 1) {
        let newQuestion = currentQuestionSeq - 1;
        setSelectedValue(newQuestion);
    }
    scrollTOP();
}


let ventflag = true;
function onChangePagination(id, vent) {
    if (vent) {
        vent.preventDefault();
        vent.stopPropagation();
    }

    if (id.value && id.value != currentQuestionSeq) {
        document.getElementById('question-' + currentQuestionSeq).style.display = 'none';
        let newQuestion = Number(id.value);
        document.getElementById('question-' + newQuestion).style.display = 'block';
        currentQuestionSeq = newQuestion;
        showOrHideParaForQuestion(currentQuestionSeq);
        clearCanvasForQuestion();
        toggleSketchPad();
    } else if (id.value) {
        let newQuestion = Number(id.value);
        document.getElementById('question-' + newQuestion).style.display = 'block';
        currentQuestionSeq = newQuestion;
        showOrHideParaForQuestion(currentQuestionSeq);
        clearCanvasForQuestion();
        toggleSketchPad();

    }
    return false;

}
function setSelectedValue(currentQuestionSeq) {
    $("#pagination").unbind('change');
    $("#pagination").val(currentQuestionSeq).change();
}

$(document).on('keydown', function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (e.code === 'ArrowLeft') {
        showprevquestion();
    } else if (e.code === 'ArrowRight') {
        shownextquestion();
    }

    if (e.ctrlKey && e.key === 'z') {
        if (sketchpad) {
            console.log("Undo fired");
            sketchpad.undo();
        }
    }

    if (e.ctrlKey && e.key === 'y') {
        if (sketchpad) {
            console.log("Redo fired");
            sketchpad.redo();
        }
    }

    if (e.ctrlKey && e.key === 'q') {
        toggleSketchPad();
    }

    if (e.ctrlKey && e.key === 'e') {
        if (sketchpad) {
            console.log("Clear fired");
            sketchpad.clear();
            sketchpad.strokes = [];
        }
    }

    if (e.key === 'Equal') { // '+' key
        if (sketchpad && sketchpad.penSize < 30) {
            sketchpad.penSize++;
            $('#pensize').val(sketchpad.penSize);
        }
    }

    if (e.key === 'Minus') { // '-' key
        if (sketchpad && sketchpad.penSize > 1) {
            sketchpad.penSize--;
            $('#pensize').val(sketchpad.penSize);
        }
    }

    return false;
});



function setupCanvasForDragAndDrop(canvasId) {
    let canvas = document.getElementById(canvasId);
    let ctx = canvas.getContext('2d');
    let isCtrlPressed = false;
    let isMouseDown = false;
    let images = [];
    let textAnnotations = [];
    let selectedImageIndex = -1;
    let selectedTextIndex = -1;
    let scalingFactors = [];
    let deleteButton = document.getElementById('deleteButton');
    let dragMode = '';

    window.__canvasImageState = {
        addText(text) {
            if (!text || !text.trim()) {
                return;
            }
            textAnnotations.push({
                text: text.trim(),
                x: 80,
                y: 80 + (textAnnotations.length * 36),
                fontSize: 24,
                color: '#ffffff',
                backgroundColor: 'rgba(0, 0, 0, 0.55)'
            });
            selectedImageIndex = -1;
            selectedTextIndex = textAnnotations.length - 1;
            checkDeleteButtonVisibility();
            redrawCanvas();
            syncExplainControls();
        },
        editSelectedText(newText) {
            if (selectedTextIndex === -1 || !newText || !newText.trim()) {
                return;
            }
            textAnnotations[selectedTextIndex].text = newText.trim();
            redrawCanvas();
            syncExplainControls();
        },
        updateSelectedTextStyle(styleUpdates = {}) {
            if (selectedTextIndex === -1) {
                return false;
            }
            textAnnotations[selectedTextIndex] = {
                ...textAnnotations[selectedTextIndex],
                ...styleUpdates
            };
            redrawCanvas();
            syncExplainControls();
            return true;
        },
        getSelectedText() {
            return selectedTextIndex === -1 ? null : textAnnotations[selectedTextIndex];
        }
    };

    canvas.addEventListener('drop', function (event) {
        event.preventDefault();

        let files = event.dataTransfer.files;

        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if (file.type.startsWith('image/')) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    let image = new Image();
                    image.src = e.target.result;

                    image.onload = function () {
                        images.push({
                            img: image,
                            x: event.clientX - canvas.offsetLeft - image.width / 2,
                            y: event.clientY - canvas.offsetTop - image.height / 2,
                            width: image.width,
                            height: image.height
                        });

                        scalingFactors.push({
                            scale: 1.0,
                            isScaling: false
                        });

                        checkDeleteButtonVisibility();
                        redrawCanvas();
                    };
                };
                reader.readAsDataURL(file);
            }
        }
    });

    canvas.addEventListener('dragover', function (event) {
        event.preventDefault();
    });

    canvas.addEventListener('mousedown', function (event) {
        isCtrlPressed = event.ctrlKey;
        isMouseDown = true;
        selectedTextIndex = findTextIndex(event.clientX, event.clientY);
        if (selectedTextIndex !== -1) {
            selectedImageIndex = -1;
            dragMode = 'text';
        } else {
            selectedImageIndex = findImageIndex(event.clientX, event.clientY);
            dragMode = selectedImageIndex !== -1 ? 'image' : '';
        }
        checkDeleteButtonVisibility();
        redrawCanvas();
        syncExplainControls();
    });

    canvas.addEventListener('mouseup', function () {
        isCtrlPressed = false;
        isMouseDown = false;
        dragMode = '';

        // Reset scaling state for all images
        for (let i = 0; i < scalingFactors.length; i++) {
            scalingFactors[i].isScaling = false;
        }
    });

    canvas.addEventListener('mousemove', function (event) {
        if (isMouseDown) {
            if (dragMode === 'text' && selectedTextIndex !== -1) {
                canvas.style.cursor = 'move';
                textAnnotations[selectedTextIndex].x = event.clientX - canvas.offsetLeft;
                textAnnotations[selectedTextIndex].y = event.clientY - canvas.offsetTop;
                redrawCanvas();
                return;
            }

            if (isCtrlPressed) {
                // Ctrl + drag for resizing
                canvas.style.cursor = 'nwse-resize';

                if (selectedImageIndex !== -1) {
                    scalingFactors[selectedImageIndex].isScaling = true;
                    scalingFactors[selectedImageIndex].scale = Math.abs(event.clientX - canvas.offsetLeft - images[selectedImageIndex].x) / images[selectedImageIndex].width;
                    redrawCanvas();
                }
            } else {
                // Move only when Ctrl is not pressed
                canvas.style.cursor = 'move';

                if (selectedImageIndex !== -1) {
                    images[selectedImageIndex].x = event.clientX - canvas.offsetLeft - images[selectedImageIndex].width * scalingFactors[selectedImageIndex].scale / 2;
                    images[selectedImageIndex].y = event.clientY - canvas.offsetTop - images[selectedImageIndex].height * scalingFactors[selectedImageIndex].scale / 2;
                    redrawCanvas();
                }
            }
        }
    });

    deleteButton.addEventListener('click', function () {
        if (selectedTextIndex !== -1) {
            textAnnotations.splice(selectedTextIndex, 1);
            selectedTextIndex = -1;
            checkDeleteButtonVisibility();
            redrawCanvas();
            syncExplainControls();
            return;
        }

        if (selectedImageIndex !== -1) {
            images.splice(selectedImageIndex, 1);
            scalingFactors.splice(selectedImageIndex, 1);
            selectedImageIndex = -1;
            checkDeleteButtonVisibility();
            redrawCanvas();
            syncExplainControls();
        }
    });

    function redrawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < images.length; i++) {
            ctx.save();
            ctx.translate(images[i].x, images[i].y);

            if (scalingFactors[i].isScaling) {
                // Add border during scaling
                ctx.beginPath();
                ctx.rect(0, 0, images[i].width * scalingFactors[i].scale, images[i].height * scalingFactors[i].scale);
                ctx.strokeStyle = 'blue';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            ctx.scale(scalingFactors[i].scale, scalingFactors[i].scale);
            ctx.drawImage(images[i].img, 0, 0, images[i].width, images[i].height);
            ctx.restore();
        }

        for (let i = 0; i < textAnnotations.length; i++) {
            const annotation = textAnnotations[i];
            ctx.save();
            ctx.font = `bold ${annotation.fontSize}px Arial`;
            const metrics = ctx.measureText(annotation.text);
            const boxWidth = metrics.width + 20;
            const boxHeight = annotation.fontSize + 16;
            const boxX = annotation.x - 10;
            const boxY = annotation.y - annotation.fontSize;

            ctx.fillStyle = annotation.backgroundColor;
            ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

            if (i === selectedTextIndex) {
                ctx.strokeStyle = '#00b7ff';
                ctx.lineWidth = 2;
                ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
            }

            ctx.fillStyle = annotation.color;
            ctx.fillText(annotation.text, annotation.x, annotation.y);
            ctx.restore();
        }
    }

    function findImageIndex(x, y) {
        for (let i = images.length - 1; i >= 0; i--) {
            let image = images[i];
            if (x >= image.x && x <= image.x + image.width &&
                y >= image.y && y <= image.y + image.height) {
                return i;
            }
        }
        return -1;
    }

    function findTextIndex(x, y) {
        for (let i = textAnnotations.length - 1; i >= 0; i--) {
            const annotation = textAnnotations[i];
            ctx.save();
            ctx.font = `bold ${annotation.fontSize}px Arial`;
            const metrics = ctx.measureText(annotation.text);
            ctx.restore();

            const boxWidth = metrics.width + 20;
            const boxHeight = annotation.fontSize + 16;
            const boxX = annotation.x - 10;
            const boxY = annotation.y - annotation.fontSize;

            if (x >= boxX && x <= boxX + boxWidth &&
                y >= boxY && y <= boxY + boxHeight) {
                return i;
            }
        }
        return -1;
    }

    function checkDeleteButtonVisibility() {
        deleteButton.style.display =
            selectedImageIndex !== -1 || selectedTextIndex !== -1
                ? 'inline-block'
                : 'none';
    }

    function syncExplainControls() {
        const selectedText = selectedTextIndex === -1 ? null : textAnnotations[selectedTextIndex];
        const fontSizeInput = document.getElementById('explain-font-size');
        const textColorInput = document.getElementById('explain-text-color');
        const bgColorInput = document.getElementById('explain-bg-color');

        if (!fontSizeInput || !textColorInput || !bgColorInput || !selectedText) {
            return;
        }

        fontSizeInput.value = selectedText.fontSize;
        textColorInput.value = normalizeHexColor(selectedText.color, '#ffffff');
        bgColorInput.value = normalizeHexColor(selectedText.backgroundColor, '#000000');
    }
}

let cflag = true;
let sketchpad={};
function toggleSketchPad() {
    console.log("toggleSketchpad called");
    let x = document.getElementById("sketchDiv");
    if (x.style.display === "none") {
        document.getElementById('sketchButtons').style.display = 'flex';
        document.getElementById('asketch').style.display = 'none';
        x.style.display = "flex";
        if (cflag) {
            let width = document.body.offsetWidth;
            width = width;
            let height = document.body.offsetHeight;
            height = height * 6;
            sketchpad = new Sketchpad({
                element: '#sketchpad',
                width: width,
                height: height,
                penSize: 1.5


            });
            let sketchpadImg = document.getElementById('sketchpadImg');
            sketchpadImg.width = width;
            sketchpadImg.height = height;
            setupCanvasForDragAndDrop('sketchpadImg') 
            if ($("body").hasClass("dark-theme")) {
                sketchpad.color = '#fafafa';
            } else {
                sketchpad.color = '#E00000';
            }
            flag = false;
        }
    } else {
        x.style.display = "none";
        document.getElementById('sketchButtons').style.display = 'none';
        document.getElementById('asketch').style.display = 'flex';
    }
}



function clearCanvasForQuestion() {
    cflag = true;
    document.getElementById("sketchDiv").style.display = "none";
    document.getElementById('sketchButtons').style.display = 'none';
    document.getElementById('asketch').style.display = 'block';
}

function showOrHidePara(id) {
    console.log('showOrHidePara'+id);
    if (document.getElementById(id).style.display === 'none') {
        document.getElementById(id).style.display = 'block';
    } else {
        document.getElementById(id).style.display = 'none';
    }

}


function toggleImage_canvas() {
    let canvasElement = document.getElementById('sketchpadImg');
    if (canvasElement) {
        let zIndex = window.getComputedStyle(canvasElement).getPropertyValue('z-index');
        console.log(zIndex)
        if (zIndex == 999) {
            canvasElement.style.zIndex = '1001';
            canvasElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        } else {
            canvasElement.style.zIndex = '999';
            document.getElementById('deleteButton').style.display = 'none';
            canvasElement.style.backgroundColor = 'transparent';
        }
        console.log('Current z-index:', zIndex);
    } else {
        console.error('Canvas element not found.');
    }
}

function addExplainText() {
    const message = prompt('Enter explanation text');
    if (!message || !message.trim()) {
        return;
    }

    if (window.__canvasImageState && typeof window.__canvasImageState.addText === 'function') {
        if (document.getElementById("sketchDiv").style.display === "none") {
            toggleSketchPad();
        }
        window.__canvasImageState.addText(message);
    }
}

function editExplainText() {
    if (!window.__canvasImageState || typeof window.__canvasImageState.getSelectedText !== 'function') {
        return;
    }

    const selected = window.__canvasImageState.getSelectedText();
    if (!selected) {
        alert('Select an explain text note first.');
        return;
    }

    const updatedText = prompt('Edit explanation text', selected.text);
    if (!updatedText || !updatedText.trim()) {
        return;
    }

    window.__canvasImageState.editSelectedText(updatedText);
}

function updateSelectedExplainStyle(styleUpdates) {
    if (!window.__canvasImageState || typeof window.__canvasImageState.updateSelectedTextStyle !== 'function') {
        return;
    }
    window.__canvasImageState.updateSelectedTextStyle(styleUpdates);
}

function hexToRgba(hex, alpha = 1) {
    const normalized = normalizeHexColor(hex, '#000000').replace('#', '');
    const bigint = parseInt(normalized, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function normalizeHexColor(color, fallback) {
    if (!color) {
        return fallback;
    }

    if (color.startsWith('#')) {
        return color;
    }

    const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!rgbaMatch) {
        return fallback;
    }

    const r = parseInt(rgbaMatch[1], 10).toString(16).padStart(2, '0');
    const g = parseInt(rgbaMatch[2], 10).toString(16).padStart(2, '0');
    const b = parseInt(rgbaMatch[3], 10).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
}
