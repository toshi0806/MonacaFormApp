// APIキーの設定とSDKの初期化
var appKey    = "YOUR_APPLICATIONKEY";
var clientKey = "YOUR_CLIENTKEY";
var ncmb = new NCMB(appKey,clientKey);

// -------[Demo1]「送信」ボタン押下時の処理 -------//
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
				})
				.catch(function(error){
    				// 検索に失敗した場合の処理
    				alert("NG:" + error);
                    console.log(error);
				});
                $("#formTable").empty();
                
}

// -------[Demo2]テーブルにデータをセットする処理-------//
function setData(formArray) {
    
    //操作するテーブルへの参照を取得
    var table = document.getElementById("formTable");
        for(i=0; i<formArray.length; i++) {
            var object = formArray[i];
            
            var year    = object.get("createDate");    //YYYYを取り出す
            var month   = object.get("createDate");    //MMを取り出す
            var day     = object.get("createDate");    //DDを取り出す            
            var hour    = object.get("createDate");    //hhを取り出す
            var minute  = object.get("createDate");    //mmを取り出す
            
            //hourが協定時間なので、現地時間（+09:00）となるようにする
            var datehour = new Date(hour);  //hourをDate型に変換
            var jsthour = datehour.getHours();  //datehourを現地時間にする
            var jstDate = year.slice(0,4) +"/"+ month.slice(5,7) +"/"+ day.slice(8,10) + " " + jsthour +":"+ minute.slice(14,16);   

            var row        = table.insertRow(-1);
            var cell       = row.insertCell(-1);
        	
            formTable.rows[i].cells[0].innerHTML = jstDate + "<br>" + "名前：　　" + object.get("username") + " さん"+"<br>" +"タイトル："+object.get("title");   
        }
}

// -------[Demo3-1]入力されたアドレスを調べる処理-------//
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
        		   console.log("検索に成功しました:"+search.length);
                   alert(search.length+"件ヒットしましした");
                    setData(search);
                    $.mobile.changePage('#ListUpPage');
                }else if(search.length == 0){
                    //検索されたアドレスがなかった場合
                    document.getElementById("sectionListUp");
                    sectionListUp.innerHTML = "検索結果："+search.length+"件";  //0件と表示
                    console.log("検索されたアドレスはありません");
                    
                }
                 $.mobile.changePage('#ListUpPage');
                
    	        })
        	    .catch(function(error){
    			    //検索失敗時の処理
    			    alert("検索に失敗しました：" + error);
    		    	console.log("検索に失敗しました：" + error);
                    
    		    });
                $("#formTable").empty();
}

// -------[Demo3-1]アドレス検索ボタン-------//
function searchAddress(){
		
    var formSearch = ncmb.DataStore("SaveData");    //検索クラスのインスタンスを生成
    var mailaddress = $('#search_address').val();   //アドレス欄に入力された値を変数mailaddressに格納
        
        //フィールドの中から探す
        if(mailaddress == ""){
            alert("メールアドレスを入力してください");
            $.mobile.changePage("#SearchPage");
        }else{
            //入力されたアドレスを調べる
            checkAddress();
        }
        $("#formTable").empty();
}

//------- [Demo3-2]入力された都道府県を調べる処理-------//
function checkPrefecture(){
    
        var formSearch = ncmb.DataStore("SaveData");        //検索クラスのインスタンスを生成
        var prefecture = $("#search_prefecture").val();     //ユーザーに選択された都道府県の値を変数prefectureに格納
    
        formSearch.order("date",true)
                  .order("username", true)
                  .order("title",true)
                  .equalTo("prefecture",prefecture)
                  .fetchAll()
        		  .then(function(search){
    					//検索成功時の処理
    					if(search.length>0){
                            //検索された都道府県があった場合
                            console.log("検索に成功しました:"+search.length);
                            alert(search.length+"件ヒットしましした");
                            setData(search);
    					}else if(search.length == 0){
                            //検索された都道府県がなかった場合
                            document.getElementById("sectionListUp");
                            sectionListUp.innerHTML = "検索結果："+search.length+"件";  //0件と表示
    					}
                        $.mobile.changePage('#ListUpPage');
    				  })
    				  .catch(function(error){
    					//検索失敗時の処理
    					alert("検索に失敗しました：" + error);
    					console.log("検索に失敗しました：" + error);
    				  });
}

//------- [Demo3-2]住まい検索ボタン-------//
function searchPrefecture(){
    	var formSearch = ncmb.DataStore("SaveData");        //検索クラスのインスタンスを生成
        var prefecture = $("#search_prefecture").val();     //ユーザーに選択された都道府県の値を変数prefectureに格納
        
        //フィールドの中から探す
        if(prefecture == ""){
            alert("都道府県を選択してください");
        }else{
            checkPrefecture();
        }
        $("#formTable").empty();
}

//------- [Demo3-3]YYYY-MM-DD hh:mm以後の日付を調べる処理 -------//
function checkAfterDate(){
    
		var formSearch  = ncmb.DataStore("SaveData");        //検索クラスのインスタンスを生成
        var searchdate  = $("#search_date").val();           //年/月/日の値を変数searchdateに格納
        var searchtime  = $("#search_time").val();           //時間に入力された値を変数searchtimeに格納
        var beforeafter = $("#search_beforeafter").val();    //以前以後のどちらか選択された値を変数beforeafterに格納
        var beforedate  = $("#before").val();                //選択された値が以前だった場合、変数beforedateに格納
        var afterdate   = $("#after").val();                 //選択された値が以後だった場合、変数afterdateに格納        
        var dateandtime = searchdate+" "+searchtime;         //検索用に二つの変数(searchdateとsearchtime)を合体
        
        formSearch.order("date",true)
                  .order("username",true)
                  .order("title",true)
                  .greaterThanOrEqualTo("date",dateandtime)
                  .fetchAll()
                  .then(function(search){
                        //検索成功時の処理
                        if(search.length>0){
                            //以後で検索＆検索結果が0以上の場合
                    		console.log("以後の検索に成功しました:"+search.length);
                            alert(search.length+"件ヒットしましした");
                            setData(search);
                        }else if(search.length == 0){
                            //以後で検索＆検索結果が0の場合
                            document.getElementById("sectionListUp");
                            sectionListUp.innerHTML = "検索結果："+search.length+"件";  //0件と表示
                        }
                        $.mobile.changePage('#ListUpPage');
                  })
                  .catch(function(error){
            		    //検索失敗時の処理
            			alert("検索に失敗しました：" + error);
            			console.log("検索に失敗しました：" + error);
            	  });
        
}
//------- [Demo3-3]YYYY-MM-DD hh:mm以前の日付を調べる処理 -------//
function checkBeforeDate(){
        
        //checkAfterDate()と同じ
        var formSearch  = ncmb.DataStore("SaveData");
        var searchdate  = $("#search_date").val();
        var searchtime  = $("#search_time").val();
        var beforeafter = $("#search_beforeafter").val();
        var beforedate  = $("#before").val();
        var afterdate   = $("#after").val();
        var dateandtime = searchdate+" "+searchtime;
        
        formSearch.order("date",true)
                  .order("username",true)
                  .order("title",true)
                  .lessThanOrEqualTo("date",dateandtime)
                  .fetchAll()       
                  .then(function(search){
                        //検索成功時の処理
                        if(search.length>0){
                            //以前で検索＆検索結果が0以上の場合
                            console.log("以前の検索に成功しました:"+search.length);
                            alert(search.length+"件ヒットしましした");
                            setData(search);
                        }else if(search.length == 0){
                            //以前で検索＆検索結果が0の場合
                            document.getElementById("sectionListUp");
                            sectionListUp.innerHTML = "検索結果："+search.length+"件";  //0件と表示
                        }
                        $.mobile.changePage('#ListUpPage');
                  })
        	      .catch(function(error){
        			    //検索失敗時の処理
        			    alert("検索に失敗しました：" + error);
        			    console.log("検索に失敗しました：" + error);
        	      });
        
}

//------- [Demo3-3]日付検索ボタン-------//
function searchDate(){
        
        //checkBeforeDate()、checkAfterDate()と同じ
		var formSearch  = ncmb.DataStore("SaveData");
        var searchdate  = $("#search_date").val();
        var searchtime  = $("#search_time").val();
        var beforeafter = $("#search_beforeafter").val();
        var beforedate  = $("#before").val();
        var afterdate   = $("#after").val();
        var dateandtime = searchdate+" "+searchtime;
    
        //フィールドの中から探す
            if(afterdate　== beforeafter){
                //以後の日付を探す
                checkAfterDate();
            }else if(beforedate == beforeafter){
                //以前の日付を探す
                checkBeforeDate();
            }else if(searchdate == ""){
                alert("年月日を入力してください");                
            }else if(searchtime == ""){
                alert("時間を入力してください"); 
            }else if(beforeafter == ""){
                alert("以前／以後を選択してください");
            }
        $("#formTable").empty();
}


