// This is a JavaScript file
var applicationID = "YOUR_APP_ID";
var sender_id     = "SENDER_ID";   //Android端末のみ

// APIキーの設定とSDKの初期化
var appKey    = "3b80c39b86cb7591fef1cf3432a5679c4b61d7f866ef7c058cd5d1dc30e0ba21";
var clientKey = "c064a98530de073ca96c5037bb93425644349c4f5b623533fc4b1b5bbd00968f";
var ncmb = new NCMB(appKey,clientKey);

// -------[Demo1]「送信」ボタン押下時の処理 -------//
function sendForm() {    

    // mBaaSにて保存先クラスを作成
    var TestClass = ncmb.DataStore("TestClass");

    // 保存先クラスのインスタンスを生成
    var testClass = new TestClass();
    
    // 送信時間の取得
    var now = new Date();
    var yyyymmdd = now.getFullYear()+"-"+( "0"+( now.getMonth()+1 ) ).slice(-2)+"-"+( "0"+now.getDate() ).slice(-2)+" "+( "0"+now.getHours() ).slice(-2)+":"+( "0"+now.getMinutes() ).slice(-2);
    
    //ユーザーの入力したデータをそれぞれ変数にセットする
    var username    = $("#form_name").val();            //お名前
    var mailaddress = $("#form_mailaddress").val();     //メールアドレス
    var prefecture  = $("#form_prefecture").val();      //お住まい
    var userage     = $("#form_age").val();             //ご年齢
    var title       = $("#form_title").val();           //タイトル
    var comment     = $("#form_comment").val();         //内容

    // お住まいと年齢以外で入力がない項目があった場合、アラートを表示させる
    if(username == ""){
        alert("お名前が入力されていません");
    }else if(mailaddress == ""){
        alert("メールアドレスが入力されていません");
        request.form("form_name");
    }else if(title == ""){
        alert("タイトルが入力されていません");
    }else if(comment == ""){
        alert("お問い合わせ内容が入力されていません");
    }else{
            testClass.set("form_name", username)
                     .set("form_mailaddress", mailaddress)
    		         .set("form_prefecture", prefecture)
    		         .set("form_age", userage)
    		         .set("form_title", title)
    		         .set("form_comment", comment)
                     .set("form_date", yyyymmdd)
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
    // 保存先クラスを作成
	var formData = ncmb.DataStore("TestClass");

	// 日付、名前、タイトルを降順でデータを取得するように設定する
    formData.order("form_date",true)
            .order("form_name", true)
            .order("form_title",true)
            
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

// -------[Demo2]テーブルにデータをセットする関数-------//
function setData(formArray) {
    
    //操作するテーブルへの参照を取得
    var table = document.getElementById("formTable");
        for(i=0; i<formArray.length; i++) {
    		// 名前の設定
            var nameobject = formArray[i];
            console.log(nameobject.get("form_name"));
            var row        = table.insertRow(-1);
            var cell       = row.insertCell(-1);
            
    		formTable.rows[i].cells[0].innerHTML = nameobject.get("form_date") +"<br>" + "名前：　　" + nameobject.get("form_name") + " さん"+"<br>" +"タイトル："+nameobject.get("form_title");
        }
}

// -------[Demo3-1]アドレス検索ボタン押下時の処理-------//
function searchAddress(){
		
        //検索クラスのインスタンスを生成
		var formSearch = ncmb.DataStore("TestClass");
        
		//アドレス欄に入力された値を変数mailaddressに格納
		var mailaddress = $('#search_address').val();
        console.log("入力メールアドレス"+mailaddress);
        
        //mBaaSのオブジェクトの中から探す
        if(mailaddress == ""){
            alert("メールアドレスを入力してください");
            $.mobile.changePage("#SearchPage");
        }else{
    		formSearch.order("form_date",true)
                      .order("form_name",true)
                      .order("form_title",true)
                      .equalTo("form_mailaddress",mailaddress)
                      .fetchAll()
    				  .then(function(search){
    			        //検索成功時の処理
    					console.log("検索に成功しました:"+search.length);
                        var table = document.getElementById("formTable");
    					for(var i=0; i<search.length; i++){
    						var searchInfo = search[i];
    						var searchAddress    = searchInfo.get("form_mailaddress");
                            var searchName       = searchInfo.get("form_name");
                            var searchTitle      = searchInfo.get("form_title");
                            var searchDate       = searchInfo.get("form_date");
                            var searchPrefecture = searchInfo.get("form_prefecture");
                            var row  = table.insertRow(-1);
                            var cell = row.insertCell(-1);
                            formTable.rows[i].cells[0].innerHTML = searchDate +"<br>" + "名前：" + searchName + " さん"+"<br>" +"タイトル："+searchTitle;
    					}
                        $.mobile.changePage('#ListUpPage');
    			      })
    				  .catch(function(error){
    					//検索失敗時の処理
    					alert("検索に失敗しました：" + error);
    					console.log("検索に失敗しました：" + error);
    				  });
        }
        $("#formTable").empty();
}

//------- [Demo3-2]日付検索ボタン押下時の処理-------//
function searchDate(){
    
    	//検索クラスのインスタンスを生成
		var formSearch = ncmb.DataStore("TestClass");
        
        //年/月/日欄に入力された値を変数searchdateに格納
        var searchdate = $("#search_date").val();
        
        //時間に入力された値を変数searchtimeに格納
        var searchtime =$("#search_time").val();
        
        //以前以後のどちらか選択された値を変数beforeafterに格納
        var beforeafter =$("#search_beforeafter").val();
        
        //選択された値が以前だった場合、変数beforedateに格納
        var beforedate = $("#before").val();
        
        //選択された値が以後だった場合、変数afterdateに格納
        var afterdate = $("#after").val();
        
        //検索用に二つの変数(searchdateとsearchtime)を合体
        var dateandtime = searchdate+" "+searchtime;
    
        //mBaaSのオブジェクトの中から探す
        //検索処理
            if(afterdate　== beforeafter){
                formSearch.order("form_date",true)
                          .order("form_name",true)
                          .order("form_title",true)
                          .greaterThanOrEqualTo("form_date",dateandtime)
                          .fetchAll()
                          .then(function(search){
                          //以後で検索した時の処理
            			  console.log("以後の検索に成功しました:"+search.length);
                            var table = document.getElementById("formTable");
                    			for(var i=0; i<search.length; i++){
                    				var searchInfo = search[i];
                    				var searchAddress    = searchInfo.get("form_mailaddress");
                                    var searchName       = searchInfo.get("form_name");
                                    var searchTitle      = searchInfo.get("form_title");
                                    var searchDate       = searchInfo.get("form_date");
                                    var searchPrefecture = searchInfo.get("form_prefecture");
                                    var row  = table.insertRow(-1);
                                    var cell = row.insertCell(-1);
                                    formTable.rows[i].cells[0].innerHTML = searchDate +"<br>" + "名前：　　" + searchName + " さん"+"<br>" +"タイトル："+searchTitle;
            			        }
                            $.mobile.changePage('#ListUpPage');
                            alert(search.length+"件ヒットしました");
                          })
                          .catch(function(error){
                		    //検索失敗時の処理
                			alert("検索に失敗しました：" + error);
                			console.log("検索に失敗しました：" + error);
                		  });    
            }else if(beforedate == beforeafter){
                    formSearch.order("form_date",true)
                              .order("form_name",true)
                              .order("form_title",true)
                              .lessThanOrEqualTo("form_date",dateandtime)
                              .fetchAll()       
                              .then(function(search){
                              //以前で検索した時の処理
                              console.log("以前の検索に成功しました:"+search.length);
                                var table = document.getElementById("formTable");
                                    for(var i=0; i<search.length; i++){
                                        var searchInfo = search[i];
                                        var searchAddress    = searchInfo.get("form_mailaddress");
                                        var searchName       = searchInfo.get("form_name");
                                        var searchTitle      = searchInfo.get("form_title");
                                        var searchDate       = searchInfo.get("form_date");
                                        var searchPrefecture = searchInfo.get("form_prefecture");
                                        var row              = table.insertRow(-1);
                                        var cell             = row.insertCell(-1);
                                        formTable.rows[i].cells[0].innerHTML = searchDate +"<br>" + "名前：　　" + searchName + " さん"+"<br>" +"タイトル："+searchTitle;
                
                                    }
                                    $.mobile.changePage('#ListUpPage');
                                    alert(search.length+"件ヒットしました");
                              })
                		      .catch(function(error){
                			    //検索失敗時の処理
                			    alert("検索に失敗しました：" + error);
                			    console.log("検索に失敗しました：" + error);
                		      });
            }else if(searchdate == ""){
                alert("年月日を入力してください");                
            }else if(searchtime == ""){
                alert("時間を入力してください"); 
            }else if(beforeafter == ""){
                alert("以前／以後を選択してください");
            }
        $("#formTable").empty();
}

//------- [Demo3-3]住まい検索ボタン押下時の処理-------//
function searchPrefecture(){
    
        //検索クラスのインスタンスを生成
		var formSearch = ncmb.DataStore("TestClass");
        
        //ユーザーに選択された都道府県の値を変数prefectureに格納
        var prefecture = $("#search_prefecture").val();
        
        //mBaaSのオブジェクトの中から探す
        if(prefecture == ""){
            alert("都道府県を選択してください");
        }else{
            formSearch.order("form_date",true)
                      .order("form_name", true)
                      .order("form_title",true)
                      .equalTo("form_prefecture",prefecture)
                      .fetchAll()
        			  .then(function(search){
    					//検索成功時の処理
    					console.log("検索に成功しました:"+search.length);
                        var table = document.getElementById("formTable");
    					    for(var i=0; i<search.length; i++){
        						var searchInfo = search[i];
        						var searchAddress    = searchInfo.get("form_mailaddress");
                                var searchName       = searchInfo.get("form_name");
                                var searchTitle      = searchInfo.get("form_title");
                                var searchDate       = searchInfo.get("form_date");
                                var searchPrefecture = searchInfo.get("form_prefecture");
                                
                                var row  = table.insertRow(-1);
                                var cell = row.insertCell(-1);
                                formTable.rows[i].cells[0].innerHTML = searchDate +"<br>" + "名前：" + searchName + " さん"+"<br>" +"タイトル："+searchTitle;
    					    }
                        $.mobile.changePage('#ListUpPage');
                        alert(search.length+"件ヒットしました");
    				  })
    				  .catch(function(error){
    					//検索失敗時の処理
    					alert("検索に失敗しました：" + error);
    					console.log("検索に失敗しました：" + error);
    				  });
        }
        $("#formTable").empty();
}

//公開ファイルURL
var publicFileUrl = "https://mb.api.cloud.nifty.com/2013-09-01/applications/" + applicationID  + "/publicFiles/";

//現在の端末情報
var currentInstallation;


