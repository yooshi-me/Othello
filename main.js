class Square{
    pice=-1//-1:なし　1:黒　0:白
}
class PossibleClass{
    possibleI=-1;
    possibleJ=-1;
    possibleKey=1;
}
let solo=0;//1ならソロプレイ
//人数設定
function setPlay(){
   if( window.confirm("一人で遊ぶの？")){
        solo=1;
        alert("コンピュータと対戦します。");
   }else{
   }
   changeButton();
}
function generateSquares(){
    let a=new Array(8);
    for(let i=0;i<8;i++){
        a[i]=new Array(8);
        for(let j=0;j<8;j++){
            a[i][j]=new Square();
            if((i===3&&j===4)||(i===4&&j===3)){//盤面の中央の黒石を配置
                a[i][j].pice=1;
            }
            if((i===3&&j===3)||(i===4&&j===4)){//盤面の中央の白石を配置
                a[i][j].pice=0;
            }
        }
    }
    return a;
}

//グローバル変数の宣言
let squares=generateSquares();//squaresに初期の盤面情報を与える
let turn=1;//どちらの番か決める
let pass=0;//パス回数
let put_count=0;//置いた駒の数
let pass_count=0;//連続でパスした回数を数え2回以上ならゲームを終了させる。
let black=2;//石の個数
let white=2;

//指定されたマスに駒を置くことができるかを判定する
//返り値はkeyで素因数分解することでどの方向の駒をひっくり返せるかわかる
//置けない場合は１を返す
function possible(iIndex,jIndex){
    let key=1;
    let color=((turn)%2+pass)%2;// 自分の色　color=0：白　　color=1：黒
    let op_color=((turn+1)%2+pass)%2;//相手の色

    //ここからチェックする
    //選択したマスが空であること
    if(squares[iIndex][jIndex].pice===0||squares[iIndex][jIndex].pice===1){
        return 1;
    }
    //上チェック...keyが2の倍数になるok
    if(iIndex>1&&squares[iIndex-1][jIndex].pice===op_color){//選ばれたセルが相手の色　かつ　一番上の列でない
        let i=iIndex-2,j=jIndex;
        while(i>-1){
            if(squares[i][j].pice===color){//自分の色があったので置ける
                key=key*2;
                break;
            }else if(squares[i][j].pice===op_color){//相手の駒があれば探索続行
                i--;
            }else{//駒が置いてなかったので続行不可
                break;
            }
        }
    }
    //右上チェック...keyが3の倍数になるok
    if(iIndex>1&&jIndex<6&&squares[iIndex-1][jIndex+1].pice===op_color){//選ばれたセルの右上が相手の色　かつ　一番上＆一番右の列でない
        let i=iIndex-2,j=jIndex+2;
        while(i>-1&&j<8){
            if(squares[i][j].pice===color){//自分の色があったので置ける
                key=key*3;
                break;
            }else if(squares[i][j].pice===op_color){//相手の駒があれば探索続行
                i--;
                j++;
            }else{//駒が置いてなかったので続行不可
                break;
            }
        }
    }
    //右チェック...keyが5の倍数になるok
    if(jIndex<6&&squares[iIndex][jIndex+1].pice===op_color){//選ばれたセルの右が相手の色　かつ　一番右の列でない
        let i=iIndex,j=jIndex+2;
        while(j<8){
            if(squares[i][j].pice===color){//自分の色があったので置ける
                key=key*5;
                break;
            }else if(squares[i][j].pice===op_color){//相手の駒があれば探索続行
                j++;
            }else{//駒が置いてなかったので続行不可
                break;
            }
        }
    }
    //右下チェック...keyが7の倍数になるok
    if(iIndex<6&&jIndex<6&&squares[iIndex+1][jIndex+1].pice===op_color){//選ばれたセルが相手の色　かつ　一番上の列でない
        let i=iIndex+2,j=jIndex+2;
        while(i<8&&j<8){
            if(squares[i][j].pice===color){//自分の色があったので置ける
                key=key*7;
                break;
            }else if(squares[i][j].pice===op_color){//相手の駒があれば探索続行
                i++;
                j++;
            }else{//駒が置いてなかったので続行不可
                break;
            }
        }
    }
    //下チェック...keyが11の倍数になるok
    if(iIndex<6&&squares[iIndex+1][jIndex].pice===op_color){//選ばれたセルの下が相手の色　かつ　一番下の列でない
        let i=iIndex+2,j=jIndex;
        while(i<8){
            if(squares[i][j].pice===color){//自分の色があったので置ける
                key=key*11;
                break;
            }else if(squares[i][j].pice===op_color){//相手の駒があれば探索続行
                i++;
            }else{//駒が置いてなかったので続行不可
                break;
            }
        }
    }
    //左下チェック...keyが13の倍数になるok
    if(iIndex<6&&jIndex>1&&squares[iIndex+1][jIndex-1].pice===op_color){//選ばれたセルの左下が相手の色　かつ　一番上の列でない
        let i=iIndex+2,j=jIndex-2;
        while(i<8&&j>-1){
            if(squares[i][j].pice===color){//自分の色があったので置ける
                key=key*13;
                break;
            }else if(squares[i][j].pice===op_color){//相手の駒があれば探索続行
                i++;
                j--;
            }else{//駒が置いてなかったので続行不可
                break;
            }
        }
    }
    //左チェック...keyが17の倍数になるok
    if(jIndex>1&&squares[iIndex][jIndex-1].pice===op_color){//選ばれたセルの左が相手の色　かつ　一番左の列でない
        let i=iIndex,j=jIndex-2;
        while(j>-1){
            if(squares[i][j].pice===color){//自分の色があったので置ける
                key=key*17;
                break;
            }else if(squares[i][j].pice===op_color){//相手の駒があれば探索続行
                j--;
            }else{//駒が置いてなかったので続行不可
                break;
            }
        }
    }
    //左上チェック...keyが19の倍数になる
    if(iIndex>1&&jIndex>1&&squares[iIndex-1][jIndex-1].pice===op_color){//選ばれたセルが相手の色　かつ　一番上の列でない
        let i=iIndex-2,j=jIndex-2;
        while(i>-1&&j>-1){
            if(squares[i][j].pice===color){//自分の色があったので置ける
                key=key*19;
                break;
            }else if(squares[i][j].pice===op_color){//相手の駒があれば探索続行
                i--;
                j--;
            }else{//駒が置いてなかったので続行不可
                break;
            }
        }
    }
    return key;
}
//ボタンの色を更新する
function changeButton(){
    let put_possible=0;
    black=0;
    white=0;
    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            let iStringNum=String(i);
            let jStringNum=String(j);
            if(squares[i][j].pice===0){//ボタンを白にする
                white++;
                $('#field').find(`button[value="${iStringNum},${jStringNum}"]`).css('background','white');
            }else if(squares[i][j].pice===1){//ボタンを黒にする
                black++;
                $('#field').find(`button[value="${iStringNum},${jStringNum}"]`).css('background','black');
            }else{
                $('#field').find(`button[value="${iStringNum},${jStringNum}"]`).css('background','rgb(72, 230, 93)');
                let key=possible(i,j);
                if(key!==1){
                    $('#field').find(`button[value="${iStringNum},${jStringNum}"]`).css('background','rgb(5, 94, 10)');
                    put_possible++;
                }
            }
        }
    }
    if(put_possible===0){
        pass++;
        pass_count++;
        if(pass_count>1){//ゲーム終了
            alert("試合は終了しました。");
            return;
        }else{
            alert('駒が置けなくなったのでパスします');
            changeButton();
        }
    }else{
        pass_count=0;
    }
}
//指定されたマスに置いたときに裏返す
function reverse(index,jdex,key){
    let i=index,j=jdex,my_color=((turn)%2+pass)%2;
    squares[i][j].pice=my_color;//置いたところをひっくり返す
    if(key%2===0){//上側をひっくり返す
        i--;
        while(squares[i][j].pice!=my_color){
            squares[i][j].pice=my_color;
            i--;
        }
        i=index;j=jdex;
    }
    if(key%3===0){//右上側をひっくり返す
        i--;
        j++;
        while(squares[i][j].pice!=my_color){
            squares[i][j].pice=my_color;
            i--;
            j++;
        }
        i=index;j=jdex;
    }
    if(key%5===0){//右側をひっくり返す
        j++;
        while(squares[i][j].pice!=my_color){
            squares[i][j].pice=my_color;
            j++;
        }
        i=index;j=jdex;
    }
    if(key%7===0){//右下側をひっくり返す
        i++;
        j++;
        while(squares[i][j].pice!=my_color){
            squares[i][j].pice=my_color;
            i++;
            j++;
        }
        i=index;j=jdex;
    }
    if(key%11===0){//下側をひっくり返す
        i++;
        while(squares[i][j].pice!=my_color){
            squares[i][j].pice=my_color;
            i++;
        }
        i=index;j=jdex;
    }
    if(key%13===0){//左下側をひっくり返す
        i++;
        j--;
        while(squares[i][j].pice!=my_color){
            squares[i][j].pice=my_color;
            i++;
            j--;
        }
        i=index;j=jdex;
    }
    if(key%17===0){//左側をひっくり返す
        j--;
        while(squares[i][j].pice!=my_color){
            squares[i][j].pice=my_color;
            j--;
        }
        i=index;j=jdex;
    }
    if(key%19===0){//左上側をひっくり返す
        i--;
        j--;
        while(squares[i][j].pice!=my_color){
            squares[i][j].pice=my_color;
            i--;
            j--;
        }
        i=index;j=jdex;
    }
}
//駒を置く
function put(button){
    let values=button.value.split(',');
    let i=Number(values[0]);
    let j=Number(values[1]);
    let key=possible(i,j);
    if(key===1){
        alert('ここに駒は置けません');
    }else{
        put_count++;  
        reverse(i,j,key);
        turn++;
        changeButton();
    }
    changeDisplay();
    if(put_count>59){
        //終了
        alert("試合は終了しました。");
    }else if(solo===1&&((turn)%2+pass)%2===0){
        setTimeout('game()',2500);
    }
}
//表示を変更する
function changeDisplay(){
    if(((turn)%2+pass)%2===1){//黒ターン
        document.getElementById("display").innerText = `    黒の番です。　　黒：${black}コ　白：${white}コ`;
    }else if(((turn)%2+pass)%2===0){//白ターン
        document.getElementById("display").innerText = `    白の番です。　　黒：${black}コ　白：${white}コ`;
    }
}
//PC用のput関数
function pcPut(i,j,key){
    put_count++;
    reverse(i,j,key);
    turn++;
    changeButton();
    changeDisplay();
    if(put_count>59){
        //終了
        alert("試合は終了しました。");
        return;
    }else if(solo===1&&((turn)%2+pass)%2===0){
        game();
    }
}
//置けるところに置く
function game(){
    let key=1;
    let possibleCount=0;
    let possibles=new Array();
     for(let i=0;i<8;i++){
         for(let j=0;j<8;j++){
            key=possible(i,j)
             if(key>1){
                 possibles[possibleCount]=new PossibleClass();
                 possibles[possibleCount].possibleI=i;
                 possibles[possibleCount].possibleJ=j;
                 possibles[possibleCount].possibleKey=key;
                 possibleCount++;
                }
            }
        }
        let rand=Math.floor(Math.random()*possibleCount);
        pcPut(possibles[rand].possibleI,possibles[rand].possibleJ,possibles[rand].possibleKey);
        return;
    }
