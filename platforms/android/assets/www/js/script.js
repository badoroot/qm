

//Open Database Connection
document.addEventListener("deviceready",onDeviceReady,false);
function onDeviceReady(){
//copy Database	
window.plugins.sqlDB.copy('dectinary.db', 2, function(){toast('اهلا بك في برنامج qm');},function(e){console.log("Error Code = "+JSON.stringify(e));});
loadFavorite("");

/////////////////////////admob////////////////////////////////
var admobid  = {};

admobid = {
      banner: 'ca-app-pub-1820395310606305/1249545957', // or DFP format "/6253334/dfp_example_ad"
      interstitial: 'ca-app-pub-1820395310606305/7884071217'
};


if(AdMob){ 

 AdMob.createBanner({
  adId: admobid.banner,
  position: AdMob.AD_POSITION.TOP_BOTTOM,
  autoShow: true 
 });

 AdMob.prepareInterstitial( {
	 adId:admobid.interstitial,
	 autoShow:false} 
	 );
}



/////////////////////////admob////////////////////////////////

$('#srch_txt').keyup(function() {
	
   srch_txt = $(this).val();
   
   if(srch_txt.length > 1)
   {
	   
	 srch_counter = parseInt($('#srch_counter').val()); 
     if(srch_counter == 7){
		 $('#srch_counter').val(0);
		 AdMob.showInterstitial();
	 }else{
		 $('#srch_counter').val(srch_counter + 1);
	 }

	 
	var myDB = window.sqlitePlugin.openDatabase({name: "dectinary.db", location: 'default'});   
	myDB.transaction(function(transaction) {
    transaction.executeSql("SELECT * FROM Dictionry where A like '"+srch_txt+"%' or E like '"+srch_txt+"%' order by fav", [], function (tx, results) {
      $("ul#words").empty();
	  var len = results.rows.length, i;
	  for (i = 0; i < len; i++){
	   word_id = results.rows.item(i).id;
	   ar_word = results.rows.item(i).A;
       en_word = results.rows.item(i).E;
       fav     = results.rows.item(i).fav;
	   
	   if(fav == 1){liked = 'liked';}else{liked = '';}
	   
       $li = "<li><span class='right'>";  
       $li+= ar_word+"<br>"+en_word+"</span>";
       $li+= "<span id='span_"+word_id+"'  onclick='favorite("+word_id+")' class='left heart "+liked+"'></span></li>";
       $('ul#words').prepend($li);
     }
     }, null);
    });  

   myDB = null;	
   }
  
});
}





function favorite(id){
	$chk_liked = $("#span_"+id).hasClass("liked");
	fav_val    = '';
	
	if($chk_liked == true){
	  /// remover like
	  $("#span_"+id).removeClass("liked");
      fav_val    = 0;  
	  update(id,fav_val);
      toast('تم حذف المفضلة');	  
  }
  else{
	  ///add like
	   $("#span_"+id).addClass("liked");
	   fav_val    = 1;
	   update(id,fav_val);
	   toast('تم الاضافة للمفضلة');	
  }
}

function update(id,fav_val){
var DB = window.sqlitePlugin.openDatabase({name: "dectinary.db", location: 'default'});   
DB.transaction(function(tx) {
    tx.executeSql("update Dictionry set fav = "+fav_val+" where id = "+id);
  }, function(error) {
 
 }, function() {

 });
}


function toast(txt){
	window.plugins.toast.hide();
	window.plugins.toast.showLongBottom(txt);
}





function loadFavorite(type){
if(type==""){
	limit = "limit 0,10";
}	else{
	limit = "";
	closeNav();
	AdMob.showInterstitial();
	$('#srch_txt').val("");
}
	
	
var db = window.sqlitePlugin.openDatabase({name: "dectinary.db", location: 'default'});   
	db.transaction(function(transaction) {
    transaction.executeSql("SELECT * FROM Dictionry where fav = 1 "+limit, [], function (tx, results) {
      $("ul#words").empty();
	  var len = results.rows.length, i;
	  for (i = 0; i < len; i++){
	   word_id = results.rows.item(i).id;
	   ar_word = results.rows.item(i).A;
       en_word = results.rows.item(i).E;
       fav     = results.rows.item(i).fav;
	   
	   if(fav == 1){liked = 'liked';}else{liked = '';}
	   
       $li = "<li><span class='right'>";  
       $li+= ar_word+"<br>"+en_word+"</span>";
       $li+= "<span id='span_"+word_id+"'  onclick='favorite("+word_id+")' class='left heart "+liked+"'></span></li>";
       $('ul#words').prepend($li);
     }
     }, null);
    });
}