// APIキーの設定とSDKの初期化
var appKey    = "アプリケーションキー";
var clientKey = "クライアントキー";
var ncmb = new NCMB(appKey,clientKey);

// -------[Demo1フォームに入力された内容を送信する -------//
function sendForm() {
    
    var SaveData = ncmb.DataStore("SaveData");   //mBaaSにて保存先クラスを作成
    var sendData = new SaveData();               //保存先クラスのインスタンスを生成
    
    //ユーザーの入力したデータをそれぞれ変数にセットする
    var username    = $("#form_name").val();            //お名前
    var mailaddress = $("#form_mailaddress").val();     //メールアドレス
    var prefecture  = $("#form_prefecture").val();      //お住まい
    var agestr      = $("#form_age").val();             //ご年齢
    var title       = $("#form_title").val();           //タイトル
    var comment     = $("#form_comment").val();         //内容
    
    //agestrをint型に変換
    var ageint = Number(agestr);
        
    // お住まいと年齢以外で入力がない項目があった場合、アラートを表示させる
    if(username == ""){
        alert("お名前が入力されていません");
    }else if(mailaddress == ""){
        alert("メールアドレスが入力されていません");
    }else if(title == ""){
        alert("タイトルが入力されていません");
    }else if(comment == ""){
        alert("お問い合わせ内容が入力されていません");
    }else{
        sendData.set("username", username)
                .set("mailaddress", mailaddress)
                .set("prefecture", prefecture)
    	        .set("age", ageint)
    	        .set("title", title)
    	        .set("comment", comment)
    	        .save()
    	        .then(function(object){
				    // 保存に成功した場合の処理
				    alert("お問い合わせを受け付けました");
                    $.mobile.changePage('#FormPage');
			    })
			    .catch(function(err){
				    // 保存に失敗した場合の処理
				    alert("受け付けできませんでした" + "error code:" + error);
			    });
    }
}

//------- [Demo2]保存したデータの検索と取得-------//
function checkForm() {

	var formData = ncmb.DataStore("SaveData");

	// 日付、名前、タイトルを降順でデータを取得するように設定する
    formData.order("createDate",true)
            .order("username", true)
            .order("title",true)
            
            //データの取得
			.count()
			.fetchAll()
			.then(function(results){
                // 検索に成功した場合の処理
                console.log(results.count); // 検索結果の件数を表示
                for (var i = 0; i < results.length; i++) {
					 var object = results[i];
				}
				// テーブルにデータをセット
				setData(results);
                var searchresult = document.getElementById("searchResult");
                    searchResult.innerHTML = "お問い合わせ一覧";
				})
				.catch(function(error){
    				// 検索に失敗した場合の処理
                    console.log(error);
				});
                $("#formTable").empty();
                
}

// -------[Demo2/Demo3]テーブルにデータをセットする処理------- //
function setData(formArray) {
    
    //操作するテーブルへの参照を取得
    var table = document.getElementById("formTable");
        for(i=0; i<formArray.length; i++) {
            var object = formArray[i];
            var year    = object.get("createDate").slice(0,4);      //YYYYを取り出す
            var month   = object.get("createDate").slice(5,7);      //MMを取り出す
            var day     = object.get("createDate").slice(8,10);     //DDを取り出す            
            var hour    = object.get("createDate");                 //hhを取り出す
            var minute  = object.get("createDate").slice(14,16);    //mmを取り出す
            
            //hourが協定時間なので、現地時間（+09:00）となるようにする
            var datehour = new Date(hour);  //hourをDate型に変換
            var jsthour  = datehour.getHours();  //datehourを現地時間にする
            var jstDate  = year + "/" + month + "/" + day + " " + jsthour +":"+ minute;
            
            //テーブルに行とセルを設定
            var row        = table.insertRow(-1);
            var cell       = row.insertCell(-1);
        	
            formTable.rows[i].cells[0].innerHTML = jstDate + "<br>" + "名前：　　" + object.get("username") + " さん"+"<br>" +"タイトル："+object.get("title");   
        }
}


// -------[Demo3-1]入力されたアドレスの検索と取得------- //
function checkAddress(){
    
    var formSearch = ncmb.DataStore("SaveData");    //検索クラスのインスタンスを生成
	var mailaddress = $('#search_address').val();   //アドレス欄に入力された値を変数mailaddressに格納
    
    formSearch.order("createDate",true)
              .order("username",true)
              .order("title",true)
            　.equalTo("mailaddress",mailaddress)
            　.fetchAll()
        	　.then(function(search){
    		    //検索成功時の処理
                if(search.length>0){
                    //検索されたアドレスがあった場合
                    setData(search);
                    var searchresult = document.getElementById("searchResult");
                        searchResult.innerHTML = "検索結果：" + search.length + "件";
                    console.log("検索に成功しました:"+search.length);
                }else if(search.length == 0){
                    //検索されたアドレスがなかった場合
                    var table = document.getElementById("formTable");
                        formTable.innerHTML = "<br>" + "<center>" + "データはありません" + "</center>" + "<br>";   
                    var searchresult = document.getElementById("searchResult");
                        searchResult.innerHTML = "検索結果：" + search.length + "件";
                    console.log("検索されたアドレスはありません");
                }
                //検索後にページ遷移する
                $.mobile.changePage('#ListUpPage');
                
    	        })
        	    .catch(function(error){
    			    //検索失敗時の処理
    		    	console.log("検索に失敗しました：" + error);
    		    });
                $("#formTable").empty();
}

// -------[Demo3-1]アドレス検索ボタン-------//
function searchAddress(){

    var mailaddress = $('#search_address').val();   //アドレス欄に入力された値を変数mailaddressに格納
        
        //アドレスをフィールドの中から探す
        if(mailaddress == ""){
            alert("メールアドレスを入力してください");
            $.mobile.changePage("#SearchPage");
        }else{
            //入力されたアドレスを調べる
            checkAddress(mailaddress);
        }
        $("#formTable").empty();
}

//------- [Demo3-2]入力された都道府県の検索と取得-------//
function checkPrefecture(){
    
        var formSearch = ncmb.DataStore("SaveData");        //検索クラスのインスタンスを生成
        var prefecture = $("#search_prefecture").val();     //ユーザーに選択された都道府県を変数prefectureに格納
    
        formSearch.order("createDate",true)
                  .order("username", true)
                  .order("title",true)
                  .equalTo("prefecture",prefecture)
                  .fetchAll()
        		  .then(function(search){
    					//検索成功時の処理
    					if(search.length>0){
                            //検索された都道府県があった場合
                            console.log("検索に成功しました:"+search.length);
                            setData(search);
                            var searchresult = document.getElementById("searchResult");
                                searchResult.innerHTML = "検索結果：" + search.length + "件";
    					}else if(search.length == 0){
                            //検索された都道府県がなかった場合
                            var table = document.getElementById("formTable");
                                formTable.innerHTML = "<br>" + "<center>" + "データはありません" + "</center>" + "<br>";   
                            var searchresult = document.getElementById("searchResult");
                                searchResult.innerHTML = "検索結果：" + search.length + "件";
    					}
                        $.mobile.changePage('#ListUpPage');
    				  })
    				  .catch(function(error){
    					//検索失敗時の処理
    					console.log("検索に失敗しました：" + error);
    				  });
}

//------- [Demo3-2]住まい検索ボタン -------//
function searchPrefecture(){

        var prefecture = $("#search_prefecture").val();     //ユーザーに選択された都道府県を変数prefectureに格納
        
        //フィールドの中から探す
        if(prefecture == ""){
            alert("都道府県を選択してください");
        }else{
            checkPrefecture(prefecture);
        }
        $("#formTable").empty();
}

//------- [Demo3-3]YYYY-MM-DD hh:mm以後の日付の検索と取得 -------//
function checkAfterDate(){
        
		var formSearch  = ncmb.DataStore("SaveData");        //検索クラスのインスタンスを生成
        var searchdate  = $("#search_date").val();           //年/月/日の値を変数searchdateに格納
        var searchtime  = $("#search_time").val();           //時間に入力された値を変数searchtimeに格納
        var beforeafter = $("#search_beforeafter").val();    //以前以後のどちらか選択された値を変数beforeafterに格納
        var before      = $("#before").val();                //選択された値が以前だった場合、変数beforeに格納
        var after       = $("#after").val();                 //選択された値が以後だった場合、変数afterに格納        
        var dateandtime = searchdate+" "+searchtime;         //検索用に二つの変数(searchdateとsearchtime)を合体　YYYY/MM/DD hh:mm
        
        //Date型に変換
        var date = new Date(dateandtime);
        
        //dateをISO形式に変換し第二引数に設定
        formSearch.greaterThanOrEqualTo("createDate", { "__type": "Date", "iso": date.toISOString() })
                  .order("createDate",true)
                  .order("username",true)
                  .order("title",true)
                  .fetchAll()
                  .then(function(search){
                        //検索成功時の処理
                        if(search.length>0){
                            //以後で検索＆検索結果が0以上の場合
                    		console.log("以後の検索に成功しました:"+search.length);
                            setData(search);
                            var searchresult = document.getElementById("searchResult");
                                searchResult.innerHTML = "検索結果：" + search.length + "件";
                        }else if(search.length == 0){
                            //以後で検索＆検索結果が0の場合
                            var table = document.getElementById("formTable");
                                formTable.innerHTML = "<br>" + "<center>" + "データはありません" + "</center>" + "<br>";   
                            var searchresult = document.getElementById("searchResult");
                                searchResult.innerHTML = "検索結果：" + search.length + "件";
                        }
                        $.mobile.changePage('#ListUpPage');
                  })
                  .catch(function(error){
            		    //検索失敗時の処理
            			console.log("検索に失敗しました：" + error);
            	  });
}
//------- [Demo3-3]YYYY-MM-DD hh:mm以前の日付の検索と取得 -------//
function checkBeforeDate(){
        
        //checkAfterDate()と同じ
        var formSearch  = ncmb.DataStore("SaveData");
        var searchdate  = $("#search_date").val();
        var searchtime  = $("#search_time").val();
        var beforeafter = $("#search_beforeafter").val();
        var before      = $("#before").val();
        var after       = $("#after").val();
        var dateandtime = searchdate+" "+searchtime;
        
        //Date型に変換
        var date = new Date(dateandtime);
        
        //dateをISO形式に変換し第二引数に設定
        formSearch.lessThanOrEqualTo("createDate", { "__type": "Date", "iso": date.toISOString() })
                  .order("date",true)
                  .order("username",true)
                  .order("title",true)
                  .fetchAll()       
                  .then(function(search){
                        //検索成功時の処理
                        if(search.length>0){
                            //以前で検索＆検索結果が0以上の場合
                            console.log("以前の検索に成功しました:"+search.length);
                            setData(search);
                            var searchresult = document.getElementById("searchResult");
                                searchResult.innerHTML = "検索結果：" + search.length + "件";
                        }else if(search.length == 0){
                            //以前で検索＆検索結果が0の場合
                            var table = document.getElementById("formTable");
                                formTable.innerHTML = "<br>" + "<center>" + "データはありません" + "</center>" + "<br>";   
                            var searchresult = document.getElementById("searchResult");
                                searchResult.innerHTML = "検索結果：" + search.length + "件";
                        }
                        $.mobile.changePage('#ListUpPage');
                  })
        	      .catch(function(error){
        			    //検索失敗時の処理
        			    console.log("検索に失敗しました：" + error);
        	      });
        
}

//------- [Demo3-3]日付検索ボタン-------//
function searchDate(){
        
        //checkBeforeDate()、checkAfterDate()と同じ
        var searchdate  = $("#search_date").val();
        var searchtime  = $("#search_time").val();
        var beforeafter = $("#search_beforeafter").val();
        var before      = $("#before").val();
        var after       = $("#after").val();
        var dateandtime = searchdate+" "+searchtime;
    
        //Date型に変換
        var date = new Date(dateandtime);
        
        //フィールドの中から探す
            if(after　== beforeafter){
                //以後の日付を探す
                checkAfterDate(date);
            }else if(before == beforeafter){
                //以前の日付を探す
                checkBeforeDate(date);
            }else if(searchdate == ""){
                alert("年月日を入力してください");                
            }else if(searchtime == ""){
                alert("時間を入力してください"); 
            }else if(beforeafter == ""){
                alert("以前／以後を選択してください");
            }
        $("#formTable").empty();
}


