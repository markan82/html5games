// Setting Up Our Variables
const PUZZLE_DIFFICULTY = 4; //가로세로 조각 갯수(4x4)
const PUZZLE_HOVER_TINT = '#009900';

var _stage;
var _canvas;

var _img;
var _pieces;
var _puzzleWidth;
var _puzzleHeight;
var _pieceWidth;
var _pieceHeight;
var _currentPiece;
var _currentDropPiece;  

var _mouse;

var _screenWidth;
var _screenHeight;


// 게임 초기화
function init(canvas){
    _screenWidth = document.body.offsetWidth;
    _screenHeight = document.body.offsetHeight;

    _canvas = canvas;
    _stage = _canvas.getContext('2d');
    _canvas.width = _screenWidth;
    _canvas.height = _screenHeight;

    _img = new Image();
}

function load(imgSrc) {
    _img.addEventListener('load', onImage, false);
    _img.src = imgSrc;
}

// 이미지 로딩 완료
function onImage(e){
    _img.width = _screenWidth;
    _img.height = _screenHeight;

    _pieceWidth = Math.floor(_screenWidth / PUZZLE_DIFFICULTY)    // 조각 가로 길이
    _pieceHeight = Math.floor(_screenHeight / PUZZLE_DIFFICULTY)  // 조각 세로 길이
    _puzzleWidth = _pieceWidth * PUZZLE_DIFFICULTY;             // 퍼즐 가로 길이
    _puzzleHeight = _pieceHeight * PUZZLE_DIFFICULTY;           // 퍼즐 세로 길이

    //console.log(_pieceWidth, 'x', _pieceHeight, ', ', _puzzleWidth, 'x', _puzzleHeight);

    initPuzzle();
}

// 퍼즐 초기화
function initPuzzle(){
    _pieces = [];
    _mouse = {x:0, y:0};
    _currentPiece = null;
    _currentDropPiece = null;

    // 이미지 출력
    //_stage.drawImage(_img, 0, 0, _puzzleWidth, _puzzleHeight, 0, 0, _puzzleWidth, _puzzleHeight);
    _stage.drawImage(_img, 0, 0, _puzzleWidth, _puzzleHeight);

    // 이미지 크기 조정
    _img.src = _canvas.toDataURL(); 
    _img.removeEventListener('load', onImage);

    // 화면에 표시
    createTitle("클릭하면 퍼즐을 시작합니다.");

    buildPieces();
}

// 메시지 출력
function createTitle(msg){
    _stage.fillStyle = "#000000";
    _stage.globalAlpha = 0.4;
    _stage.fillRect(100, _puzzleHeight - 40, _puzzleWidth - 200, 40);
    _stage.fillStyle = "#FFFFFF";
    _stage.globalAlpha = 1.0;
    _stage.textAlign = "center";
    _stage.textBaseline = "middle";
    _stage.font = "20px Arial";
    _stage.fillText(msg,_puzzleWidth / 2,_puzzleHeight - 20);
}

// 퍼즐 조각내기
function buildPieces(){
    var piece;
    var xPos = 0;
    var yPos = 0;
    for(var i = 0; i < PUZZLE_DIFFICULTY * PUZZLE_DIFFICULTY; i++){
        piece = {};
        piece.sx = xPos;
        piece.sy = yPos;
        _pieces.push(piece);
        xPos += _pieceWidth;
        if(xPos >= _puzzleWidth){
            xPos = 0;
            yPos += _pieceHeight;
        }
    }

    //document.onmousedown = shufflePuzzle;
    _canvas.addEventListener("click", shufflePuzzle, false);
    //_canvas.addEventListener("touchend", shufflePuzzle, false);
}

// 퍼즐 섞기
function shufflePuzzle(){
    _pieces = shuffleArray(_pieces);
    _stage.clearRect(0, 0, _puzzleWidth,_puzzleHeight);
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    for(i = 0;i < _pieces.length; i++){
        piece = _pieces[i];
        piece.xPos = xPos;
        piece.yPos = yPos;
        _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, xPos, yPos, _pieceWidth, _pieceHeight);
        _stage.strokeRect(xPos, yPos, _pieceWidth,_pieceHeight);
        xPos += _pieceWidth;
        if(xPos >= _puzzleWidth){
            xPos = 0;
            yPos += _pieceHeight;
        }
    }
    //document.onmousedown = onPuzzleTouch;
    _canvas.removeEventListener("click", shufflePuzzle);
    _canvas.addEventListener("touchstart", onPuzzleTouch, false);
}

// 퍼즐 터치시 발생
function onPuzzleTouch(e){
    var touches = e.touches[0] || e.changedTouches[0];
    if(touches){
      e.layerX = touches.pageX;
      e.layerY = touches.pageY;
    }

    if(e.layerX || e.layerX == 0){
        _mouse.x = e.layerX - _canvas.offsetLeft;
        _mouse.y = e.layerY - _canvas.offsetTop;
    }
    else if(e.offsetX || e.offsetX == 0){
        _mouse.x = e.offsetX - _canvas.offsetLeft;
        _mouse.y = e.offsetY - _canvas.offsetTop;
    }
    
    _currentPiece = checkTouchexPiece();
    if(_currentPiece != null){
        _stage.clearRect(_currentPiece.xPos,_currentPiece.yPos,_pieceWidth,_pieceHeight);
        _stage.save();
        _stage.globalAlpha = .9;
        _stage.drawImage(_img, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
        _stage.restore();
        //document.onmousemove = updatePuzzle;
        //document.onmouseup = pieceDropped;
        _canvas.addEventListener("touchmove", updatePuzzle, false);
        _canvas.addEventListener("touchend", pieceDropped, false);
    }
}

function checkTouchexPiece(){
    var piece;
    for(var i = 0; i < _pieces.length; i++){
        piece = _pieces[i];
        if(_mouse.x < piece.xPos || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y > (piece.yPos + _pieceHeight)){
            //PIECE NOT HIT
        }
        else{
            return piece;
        }
    }
    return null;
}

// 퍼즐 업데이트
function updatePuzzle(e){
    var touches = e.touches[0] || e.changedTouches[0];
    if(touches){
      e.layerX = touches.pageX;
      e.layerY = touches.pageY;
    }

    _currentDropPiece = null;
    if(e.layerX || e.layerX == 0){
        _mouse.x = e.layerX - _canvas.offsetLeft;
        _mouse.y = e.layerY - _canvas.offsetTop;
    }
    else if(e.offsetX || e.offsetX == 0){
        _mouse.x = e.offsetX - _canvas.offsetLeft;
        _mouse.y = e.offsetY - _canvas.offsetTop;
    }
    _stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
    var i;
    var piece;
    for(i = 0;i < _pieces.length;i++){
        piece = _pieces[i];
        if(piece == _currentPiece){
            continue;
        }
        _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
        _stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth,_pieceHeight);
        if(_currentDropPiece == null){
            if(_mouse.x < piece.xPos || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y > (piece.yPos + _pieceHeight)){
                //NOT OVER
            }
            else{
                _currentDropPiece = piece;
                _stage.save();
                _stage.globalAlpha = .4;
                _stage.fillStyle = PUZZLE_HOVER_TINT;
                _stage.fillRect(_currentDropPiece.xPos,_currentDropPiece.yPos,_pieceWidth, _pieceHeight);
                _stage.restore();
            }
        }
    }
    _stage.save();
    _stage.globalAlpha = .6;
    _stage.drawImage(_img, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
    _stage.restore();
    _stage.strokeRect( _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth,_pieceHeight);
}

// 퍼즐 놓기
function pieceDropped(e){
    var touches = e.touches[0] || e.changedTouches[0];
    if(touches){
      e.layerX = touches.pageX;
      e.layerY = touches.pageY;
    }
    
    //document.onmousemove = null;
    //document.onmouseup = null;
    _canvas.removeEventListener("touchmove", updatePuzzle);
    _canvas.removeEventListener("touchend", pieceDropped);
    if(_currentDropPiece != null){
        var tmp = {xPos:_currentPiece.xPos,yPos:_currentPiece.yPos};
        _currentPiece.xPos = _currentDropPiece.xPos;
        _currentPiece.yPos = _currentDropPiece.yPos;
        _currentDropPiece.xPos = tmp.xPos;
        _currentDropPiece.yPos = tmp.yPos;
    }
    
    resetPuzzleAndCheckWin();
}


function resetPuzzleAndCheckWin(){
    _stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
    var gameWin = true;
    var i;
    var piece;
    for(i = 0;i < _pieces.length;i++){
        piece = _pieces[i];
        _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
        _stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth,_pieceHeight);
        if(piece.xPos != piece.sx || piece.yPos != piece.sy){
            gameWin = false;
        }
    }
    if(gameWin){
        setTimeout(gameOver,500);
    }
}

// 게임 종료
function gameOver(){
    //document.onmousedown = null;
    //document.onmousemove = null;
    //document.onmouseup = null;
    _canvas.removeEventListener("touchmove", updatePuzzle);
    _canvas.removeEventListener("touchend", pieceDropped);
    _canvas.removeEventListener("touchstart", onPuzzleTouch);
    initPuzzle();
}

// 퍼즐 순서 섞기
function shuffleArray(o){
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}