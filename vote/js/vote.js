function setRem() {
  //动态设置像素比
  var oPixelRatio = 1 / window.devicePixelRatio
  //console.log(oPixelRatio)
  document.write(
    '<meta name="viewport" content="width=device-width,initial-scale=' +
      oPixelRatio +
      ",minimum-scale=" +
      oPixelRatio +
      ",maximum-scale=" +
      oPixelRatio +
      ',user-scalable=no" />'
  )

  //调用setSize函数，自动刷新
  setSize()
  window.addEventListener("resize", setSize, false)
  window.addEventListener("orientationchange", setSize, false)
  function setSize() {
    //获取字体大小
    var html = document.getElementsByTagName("html")[0]
    var pageWidth = html.getBoundingClientRect().width
    html.style.fontSize = pageWidth / 15 + "px"
  }
}


//获得参数
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}


$(function(){
	
	var sendUrl = "http://192.168.201.109:8080";
	
	  //投票
	var time = null;
	var check = false;
	$("#btns button").on("click", function () {
		var statusId = $(this).attr('abc');
		console.log(statusId);
	    if (!check) {
	      $(this).addClass("active");
	      $.ajax({
	      	type:"POST",
	      	url: sendUrl+"/randService/vote/insertTv",
	      	dataType: "json",
	      	data : {
	      		userId : GetQueryString('userId'),
	      		fileId : oldData.fId,
	      		fraction : statusId,
	      		rounds : oldData.rounds
	      	},
	      	success : function(data){
	      		if(data.code == 200){
	      			alert(data.msg);
	      		}else{
	      			alert(data.msg);
	      			check = true;
	      		}
	      		
	      	}
	      });
	    }else{
	    	alert('不能重复投票！');
	    }
	    
	    check = true;
	})
	
	var oldData = {};
	function getImg() {
	    $.ajax({
	      url:sendUrl+"/randService/vote/tCurrentList",
	      dataType: "json",
	      type: "get",
	      success: function (data) {
	        if (data.code == 200) {
	        	var arr = data.data || [];
	          	render(arr[0] || {});
	          	fileId = data.fId;
	        }
	      },
	      error: function (data) {
	        isRefreshImg = true // 请求失败可以继续刷新
	      },
	    })
	}
	function render(newData) {
	    console.log("oldData", JSON.stringify(oldData))
	    console.log("newData", JSON.stringify(newData))
	    console.log("-----------")
	    
	    if (newData.fId === oldData.fId) {
	      if (newData.fAddress !== oldData.fAddress) {
	        renderImg(newData);
	      } else {
	        isRefreshImg = true; // 图片url相同，可以继续刷新
	      }
	    } else {
	      renderImg(newData);
	      renderButton(newData);
	    }
	    oldData = newData;
	}
	
	function renderImg(newData) {
		
	    $("#voteImg")
	    .attr("src", sendUrl+"/randService/vote/getImg?fileName="+newData.fAddress)
	      .on("load", function () {
	        isRefreshImg = true // 新图片加载完成后，可以继续刷新
	      })
	      .on("error", function () {
	        isRefreshImg = true // 新图片加载失败后，可以继续刷新
	      })
	}
	function renderButton() {
	    check = false;
	    $("#btns button.active").removeClass("active");
	}
	
	var isRefreshImg = true // 是否刷新图片
	getImg();
	time = setInterval(function () {
	    if (isRefreshImg) {
	      isRefreshImg = false;
	      getImg();
	    }
	}, 1000)
})
