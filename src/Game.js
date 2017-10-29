import React, {Component} from 'react';
import './Game.css';

class Game extends Component {

    state = {};

    componentWillMount() {}

    componentDidMount() {
       this._init();
    }  

    render() {
        console.log(this.props);
        return (
            <canvas id='canvas' />
        )
    }

    _PUZZLE_HOVER_TINT = '#009900';
    _PUZZLE_DIFFICULTY = 4; //가로세로 조각 갯수(4x4)

    _img;
    _stage;
    _canvas;
    
    _pieces;
    _pieceWidth;
    _pieceHeight;

    _puzzleWidth;
    _puzzleHeight;
    _currentPiece;
    _currentDropPiece;  

    _screenWidth;
    _screenHeight;

    _init = () => {
        // 화면크기 셋팅
        this._screenWidth = document.body.offsetWidth;
        this._screenHeight = document.body.offsetHeight;

        this._PUZZLE_DIFFICULTY = this.props.location.piece;
    
        // 캔버스 셋팅
        this._canvas = document.getElementById('canvas');
        this._stage = this._canvas.getContext('2d');
        this._canvas.width = this._screenWidth;
        this._canvas.height = this._screenHeight;
    
        this._loadImage();
    }

    // 이미지 로딩
    _loadImage = () => {
        this._img = new Image();
        this._img.addEventListener('load', this._onImage, false);
        this._img.src = this.props.location.image;
        console.log('image: '+this._img.src);
    }

    // 이미지 로딩 완료
    _onImage = (e) => {
        console.log('Image Load Complate!');
        this._img.width = this._screenWidth;
        this._img.height = this._screenHeight;
        
        this._pieceWidth = Math.floor(this._screenWidth / this._PUZZLE_DIFFICULTY)    // 조각 가로 길이
        this._pieceHeight = Math.floor(this._screenHeight / this._PUZZLE_DIFFICULTY)  // 조각 세로 길이
        this._puzzleWidth = this._pieceWidth * this._PUZZLE_DIFFICULTY;             // 퍼즐 가로 길이
        this._puzzleHeight = this._pieceHeight * this._PUZZLE_DIFFICULTY;           // 퍼즐 세로 길이

        // 캔버스에 이미지 출력
        this._stage.drawImage(this._img, 0, 0, this._puzzleWidth, this._puzzleHeight);

        // 이미지 크기 조정
        this._img.src = this._canvas.toDataURL(); 
        this._img.removeEventListener('load', this._onImage);

        this._initPuzzle();
    }

    // 퍼즐 초기화
    _initPuzzle = () => {
        this._pieces = [];
        this._pointer = {x:0, y:0};
        this._currentPiece = null;
        this._currentDropPiece = null;

        // 화면에 표시
        this._createTitle("클릭하면 퍼즐을 시작합니다.");

        this._buildPieces();
    }

    // 메시지 출력
    _createTitle = (msg) => {
        this._stage.fillStyle = "#000000";
        this._stage.globalAlpha = 0.4;
        this._stage.fillRect(100, this._puzzleHeight - 40, this._puzzleWidth - 200, 40);
        this._stage.fillStyle = "#FFFFFF";
        this._stage.globalAlpha = 1.0;
        this._stage.textAlign = "center";
        this._stage.textBaseline = "middle";
        this._stage.font = "20px Arial";
        this._stage.fillText(msg, this._puzzleWidth / 2, this._puzzleHeight - 20);
    }

    // 퍼즐 생성
    _buildPieces = () => {
        var piece;
        var xPos = 0;
        var yPos = 0;
        for(var i = 0; i < this._PUZZLE_DIFFICULTY * this._PUZZLE_DIFFICULTY; i++){
            piece = {};
            piece.sx = xPos;
            piece.sy = yPos;
            this._pieces.push(piece);
            xPos += this._pieceWidth;
            if(xPos >= this._puzzleWidth){
                xPos = 0;
                yPos += this._pieceHeight;
            }
        }
        
        //this._canvas.addEventListener("click", this._startPuzzleGame, false); // 클릭하면 퍼즐 시작
        this._startPuzzleGame();
    }

    // 퍼즐 시작(조각 섞기)
    _startPuzzleGame = () => {
        this._pieces = this._shuffleArray(this._pieces);
        this._stage.clearRect(0, 0,  this._puzzleWidth,  this._puzzleHeight);

        this._stage.strokeStyle = "#F0F0F0";
        this._stage.lineWidth = 0.1;

        var piece;
        var xPos = 0;
        var yPos = 0;
        for(var i = 0; i <  this._pieces.length; i++){
            //퍼즐 조각 데이터 저장
            piece =  this._pieces[i];
            piece.xPos = xPos;
            piece.yPos = yPos;

            //퍼즐 조각 이미지 그리기
            this._stage.drawImage(this._img, piece.sx, piece.sy, this._pieceWidth,  this._pieceHeight, xPos, yPos, this._pieceWidth,  this._pieceHeight);
            this._stage.strokeRect(xPos, yPos, this._pieceWidth, this._pieceHeight);

            // 다음 퍼즐 조각 위치 계산
            xPos += this._pieceWidth;
            if(xPos >=  this._puzzleWidth){
                xPos = 0;
                yPos +=  this._pieceHeight;
            }
        }

        //this._canvas.removeEventListener("click", this._startPuzzleGame);            //퍼즐 시작 이벤트 해제

        this._canvas.addEventListener("mousedown", this._onPuzzleTouchStart, false);   //퍼즐조각 터치 시작
        this._canvas.addEventListener("touchstart", this._onPuzzleTouchStart, false);  //퍼즐조각 터치 시작
    }

    // 퍼즐 터치시 발생
    _onPuzzleTouchStart = (event) => {
        var touches = event.touches ? event.touches[0] : event.changedTouches ? event.changedTouches[0] : null;
        if( touches ){
            event.layerX = touches.pageX;
            event.layerY = touches.pageY;
        }
        //console.log('[_onPuzzleTouchStart] ', 'event.layerX: ' + event.layerX, ', event.offsetX: ' + event.offsetX)

        if(event.layerX || event.layerX === 0){
            event.puzzleX = event.layerX - this._canvas.offsetLeft;
            event.puzzleY = event.layerY - this._canvas.offsetTop;
        }
        else if(event.offsetX || event.offsetX === 0){
            event.puzzleX = event.offsetX - this._canvas.offsetLeft;
            event.puzzleY = event.offsetY - this._canvas.offsetTop;
        }
        
        this._currentPiece = this._getCurrentPiece(event.puzzleX, event.puzzleY);
        if(this._currentPiece != null){
            this._stage.clearRect(this._currentPiece.xPos, this._currentPiece.yPos, this._pieceWidth, this._pieceHeight);
            this._stage.save();
            this._stage.globalAlpha = 0.9;
            this._stage.drawImage(this._img, this._currentPiece.sx, this._currentPiece.sy, this._pieceWidth, this._pieceHeight, event.puzzleX - (this._pieceWidth / 2), event.puzzleY - (this._pieceHeight / 2), this._pieceWidth, this._pieceHeight);
            this._stage.restore();

            this._canvas.addEventListener("mousemove", this._onPuzzleTouchMove, false);
            this._canvas.addEventListener("mouseup", this._onPuzzleTouchEnd, false);
            this._canvas.addEventListener("touchmove", this._onPuzzleTouchMove, false);
            this._canvas.addEventListener("touchend", this._onPuzzleTouchEnd, false);
        }
    }

    // 현재 잡고 있는 퍼즐조각 가져오기
    _getCurrentPiece = (x, y) => {
        var piece;
        for(var i = 0; i <  this._pieces.length; i++){
            piece =  this._pieces[i];
            if( x < piece.xPos || 
                x > (piece.xPos +  this._pieceWidth) || 
                y < piece.yPos ||  
                y > (piece.yPos +  this._pieceHeight)) {
                //PIECE NOT HIT
            } else{
                return piece;
            }
        }
        return null;
    }

    // 퍼즐 업데이트
    _onPuzzleTouchMove = (event) => {
        var touches = event.touches ? event.touches[0] : event.changedTouches ? event.changedTouches[0] : null;
        if( touches ){
            event.layerX = touches.pageX;
            event.layerY = touches.pageY;
        }
        //console.log('[updatePuzzle] ', 'event.layerX: ' + event.layerX, ', event.offsetX: ' + event.offsetX)

        // 현재 포인터 위치 저장
        if(event.layerX || event.layerX === 0){
            event.puzzleX = event.layerX - this._canvas.offsetLeft;
            event.puzzleY = event.layerY - this._canvas.offsetTop;
        }
        else if(event.offsetX || event.offsetX === 0){
            event.puzzleX = event.offsetX - this._canvas.offsetLeft;
            event.puzzleY = event.offsetY - this._canvas.offsetTop;
        }

        this._currentDropPiece = null;
        this._stage.clearRect(0, 0, this._puzzleWidth, this._puzzleHeight);

        var piece;
        for(var i = 0; i < this._pieces.length; i++){
            piece = this._pieces[i];
            if( piece === this._currentPiece ){
                continue; //
            }

            // 현재 잡고 있는 피스 조각 그리기
            this._stage.drawImage(this._img, piece.sx, piece.sy, this._pieceWidth, this._pieceHeight, piece.xPos, piece.yPos, this._pieceWidth, this._pieceHeight);
            this._stage.strokeRect(piece.xPos, piece.yPos, this._pieceWidth, this._pieceHeight); //선그리기

            if( this._currentDropPiece == null ){
                if(event.puzzleX < piece.xPos || event.puzzleX > (piece.xPos +  this._pieceWidth) || event.puzzleY < piece.yPos || event.puzzleY > (piece.yPos +  this._pieceHeight)){
                    //NOT OVER
                }
                else{
                    this._currentDropPiece = piece;
                    this._stage.save();
                    this._stage.globalAlpha = 0.4;
                    this._stage.fillStyle =  this._PUZZLE_HOVER_TINT; //잡고있는 퍼즐을 놓을 위치 표시 색상
                    this._stage.fillRect(this._currentDropPiece.xPos, this._currentDropPiece.yPos,  this._pieceWidth,  this._pieceHeight);
                    this._stage.restore();
                }
            }
        }
        
        this._stage.save();
        this._stage.globalAlpha = 0.6;
        this._stage.drawImage(this._img,  this._currentPiece.sx,  this._currentPiece.sy,  this._pieceWidth,  this._pieceHeight,  event.puzzleX - ( this._pieceWidth / 2),  event.puzzleY - ( this._pieceHeight / 2),  this._pieceWidth,  this._pieceHeight);
        this._stage.restore();
        this._stage.strokeRect(event.puzzleX - (this._pieceWidth / 2), event.puzzleY - (this._pieceHeight / 2), this._pieceWidth, this._pieceHeight);
    }

    // 퍼즐 놓기
    _onPuzzleTouchEnd = (event) => {        
        this._canvas.removeEventListener("mousemove", this._onPuzzleTouchMove);
        this._canvas.removeEventListener("mouseup", this._onPuzzleTouchEnd);
        this._canvas.removeEventListener("touchmove", this._onPuzzleTouchMove);
        this._canvas.removeEventListener("touchend", this._onPuzzleTouchEnd);

        if( this._currentDropPiece != null ){
            var tmp = {
                xPos: this._currentPiece.xPos, 
                yPos: this._currentPiece.yPos
            };
            this._currentPiece.xPos = this._currentDropPiece.xPos;
            this._currentPiece.yPos = this._currentDropPiece.yPos;
            this._currentDropPiece.xPos = tmp.xPos;
            this._currentDropPiece.yPos = tmp.yPos;
        }
        
        this._resetPuzzleAndCheckWin();
    }

    // 퍼즐이 완성되었는지 체크한다.
    _resetPuzzleAndCheckWin = () => {
        this._stage.clearRect(0, 0, this._puzzleWidth, this._puzzleHeight);

        var gameWin = true;
        var piece;
        for(var i = 0;i < this._pieces.length; i++){
            piece = this._pieces[i];
            this._stage.drawImage(this._img, piece.sx, piece.sy, this._pieceWidth, this._pieceHeight, piece.xPos, piece.yPos, this._pieceWidth, this._pieceHeight);
            this._stage.strokeRect(piece.xPos, piece.yPos, this._pieceWidth, this._pieceHeight);
            if(piece.xPos !== piece.sx || piece.yPos !== piece.sy){
                gameWin = false;
            }
        }

        // 퍼즐 완성~!!!
        if(gameWin){
            setTimeout(this._gameOver, 500);
        }
    }

    // 게임 종료
    _gameOver = () => {
        // Web
        this._canvas.removeEventListener("mousemove"  , this._onPuzzleTouchMove);
        this._canvas.removeEventListener("mouseup"    , this._onPuzzleTouchEnd);
        this._canvas.removeEventListener("mousedown"  , this._onPuzzleTouchStart);

        // Mobile
        this._canvas.removeEventListener("touchmove"    , this._onPuzzleTouchMove);
        this._canvas.removeEventListener("touchend"     , this._onPuzzleTouchEnd);
        this._canvas.removeEventListener("touchstart"   , this._onPuzzleTouchStart);

        // 초기화
        this._initPuzzle();
    }

    // 퍼즐 순서 섞기
    _shuffleArray = (o) => {
        for(var j, x, i = o.length; i; j = parseInt(Math.random() * i, 10), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }
}

export default Game;