//APIキーの設定とSDKの初期化
var appKey    = "アプリケーションキー";
var clientKey = "クライアントキー";
var ncmb    　= new NCMB(appKey,clientKey);

// -------[Demo1]データをmBaaSに保存する -------//
function sendForm() {
        
    //ユーザーの入力したデータを変数にセットする
    var username    = $("#form_name").val();            //お名前
    var mailaddress = $("#form_mailaddress").val();     //メールアドレス
    var prefecture  = $("#form_prefecture").val();      //お住まい
    var agestr      = $("#form_age").val();             //ご年齢
    var title       = $("#form_title").val();           //タイトル
    var comment     = $("#form_comment").val();         //内容
        
    //agestrを数値に変換
    var ageint = Number(agestr);
        
    //入力規則およびデータをフィールドにセットする
    if(username == ""){
        alert("お名前が入力されていません");
    }else if(mailaddress == ""){
        alert("メールアドレスが入力されていません");
    }else if(title == ""){
        alert("タイトルが入力されていません");
    }else if(comment == ""){
        alert("お問い合わせ内容が入力されていません");
    }else{
        //mBaaSに保存先クラスの作成
        var SaveData = ncmb.DataStore("SaveData");
            
        //インスタンスの生成
        var saveData = new SaveData();
            
        //インスタンスにデータをセットする
        saveData.set("username", username)
                .set("mailaddress", mailaddress)
                .set("prefecture", prefecture)
                .set("age", ageint)
                .set("title", title)
                .set("comment", comment)
                .save()
                .then(function(results){
                    //保存に成功した場合の処理
                    alert("お問い合わせを受け付けました");
                    console.log("お問い合わせを受け付けました");
                    location.reload();
                })
                .catch(function(error){
                    //保存に失敗した場合の処理
                    alert("受け付けできませんでした：\n" + error);
                    console.log("受け付けできませんでした：\n" + error);
                });
    }
}

//------- [Demo2]保存したデータを全件検索し取得する-------//
function checkForm(){
    $("#formTable").empty();
        
    //インスタンスの生成
    var saveData = ncmb.DataStore("SaveData");
        
    //データを降順で取得する
    saveData.order("createDate",true)
            .fetchAll()
            .then(function(results){
                //全件検索に成功した場合の処理
                console.log("全件検索に成功しました："+results.length+"件");
                //テーブルにデータをセット
                setData(results);
            })
            .catch(function(error){
                //全件検索に失敗した場合の処理
                alert("全件検索に失敗しました：\n" + error);
                console.log("全件検索に失敗しました：\n" + error);
            });
}

// -------[Demo3-1]メールアドレスを指定して検索し取得する------- //
function checkAddress(){ 
    //データを変数にセット
    var mailaddress = $('#search_address').val();
        
    //インスタンスの生成
    var saveData = ncmb.DataStore("SaveData");
        
    //データの取得 
    saveData.order("createDate",true)
            .equalTo("mailaddress",mailaddress)
            .fetchAll()
            .then(function(results){
                //メールアドレスの検索に成功した場合の処理
                console.log("メールアドレスの検索に成功しました："+results.length+"件");
                setData(results);
                $.mobile.changePage('#ListUpPage');
            })
            .catch(function(error){
                //メールアドレスの検索に失敗した場合の処理
                alert("メールアドレスの検索に失敗しました：\n" + error);
                console.log("メールアドレスの検索に失敗しました：\n" + error);
            });
}

//------- [Demo3-2]お住まいを指定して検索し取得する-------//
function checkPrefecture(){
    //データを変数にセット
    var prefecture = $("#search_prefecture").val();
        
    //インスタンスの生成
    var saveData = ncmb.DataStore("SaveData");
        
    //データの取得
    saveData.order("createDate",true)
            .equalTo("prefecture",prefecture)
            .fetchAll()
            .then(function(results){
                //お住まいの検索に成功した場合の処理
                console.log("お住まいの検索に成功しました："+results.length+"件");
                setData(results);
                $.mobile.changePage('#ListUpPage');
            })
            .catch(function(error){
                //お住まいの検索に失敗した場合の処理
                alert("お住まいの検索に失敗しました：\n" + error);
                console.log("お住まいの検索に失敗しました：\n" + error);
            });
}

//------- [Demo3-3]日付を指定して検索し取得する -------//
function checkDate(divider){
    //データを変数にセット
    var searchdate  = $("#search_date").val();
    var searchtime  = $("#search_time").val();
        
    //検索用に二つの変数を合体
    var dateandtime = searchdate+" "+searchtime;
        
    //Date型に変換
    var date = new Date(dateandtime);
    date.setHours(date.getHours() + 9); 
        
    //インスタンスの生成
    var saveData  = ncmb.DataStore("SaveData");
        
    //データの取得：三項演算子(条件 ? 真:偽)によって以前と以後の処理を分ける
    (divider ? saveData.lessThanOrEqualTo("createDate", { "__type": "Date", "iso": date.toISOString() }) : saveData.greaterThanOrEqualTo("createDate", { "__type": "Date", "iso": date.toISOString() }))
                       .order("createDate",true)
                       .fetchAll()
                       .then(function(results){
                           //日付の検索に成功した場合の処理
                           console.log("日付の検索に成功しました："+results.length+"件");
                           setData(results);
                       })
                       .catch(function(error){
                           //日付の検索に失敗した場合の処理
                           alert("日付の検索に失敗しました：\n" + error);
                           console.log("日付の検索に失敗しました：\n" + error);
                       });
}

//テーブルにデータをセットする処理
function setData(results) {
    //操作するテーブルへの参照を取得
    var table = document.getElementById("formTable");
        for(i=0; i<results.length; i++) {
            var object   = results[i];
            var year     = object.get("createDate").slice(0,4);      //YYYYを取り出す
            var month    = object.get("createDate").slice(5,7);      //MMを取り出す
            var day      = object.get("createDate").slice(8,10);     //DDを取り出す            
            var hour     = object.get("createDate");                 //hhを取り出す
            var minute   = object.get("createDate").slice(14,16);    //mmを取り出す
                
            //hourが協定時間なので、現地時間（+09:00）となるようにする
            var datehour = new Date(hour);  //hourをDate型に変換
            var jsthour  = datehour.getHours();  //datehourを現地時間にする
            var jstDate  = year + "/" + month + "/" + day + " " + jsthour +":"+ minute;
                
            //テーブルに行とセルを設定
            var row      = table.insertRow(-1);
            var cell     = row.insertCell(-1);
                
            formTable.rows[i].cells[0].innerHTML = jstDate + "<br>" + "お名前：　" + object.get("username") + " さん"+"<br>" +"タイトル："+object.get("title");
        }
    var searchResult = document.getElementById("searchResult");
    searchResult.innerHTML = "検索結果："+results.length+"件";
        
    //セットするデータが無かった場合
    if(results.length == 0){
        var table = document.getElementById("formTable");
        formTable.innerHTML = "<br>" + "<center>" + "データはありません" + "</center>" + "<br>";   
    }
    $.mobile.changePage('#ListUpPage');
}

//メールアドレス検索ボタン押下時の処理
function searchAddress(){
    $("#formTable").empty();
        
    //メールアドレス欄に入力された値を変数mailaddressに格納
    var mailaddress = $('#search_address').val();
        
    //メールアドレスをフィールドの中から探す
    if(mailaddress == ""){
        alert("メールアドレスを入力してください");
    }else{
        //入力されたメールアドレスを調べる
        checkAddress(mailaddress);
    }
}

//お住まい検索ボタン押下時の処理
function searchPrefecture(){
    $("#formTable").empty();
        
    //ユーザーに選択されたお住まいを変数prefectureに格納
    var prefecture = $("#search_prefecture").val();
        
    //お住まいをフィールドの中から探す
    if(prefecture == ""){
        alert("都道府県を選択してください");
    }else{
        checkPrefecture(prefecture);
    }
}

//日付検索ボタン押下時の処理
function searchDate(){
    $("#formTable").empty();
    var searchdate  = $("#search_date").val();
    var searchtime  = $("#search_time").val();
    var beforeafter = $("#search_beforeafter").val();
    var dateandtime = searchdate+" "+searchtime;
        
    //dividerの初期値はtrue
    var divider = true;
        
    //Date型に変換
    var date = new Date(dateandtime);
        
    //フィールドの中から探す
    if(searchdate == ""){
        alert("年月日を入力してください");                
    }else if(searchtime == ""){
        alert("時間を入力してください"); 
    }else if(beforeafter == ""){
        alert("以前／以後を選択してください");
    }else{
        if($("#search_beforeafter").val() == "before"){
            divider = true;
        }else{
            divider = false;
        }
    checkDate(divider);
    }
}

