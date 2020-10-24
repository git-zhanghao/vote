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



$(function () {
  //手机号校验
  var $phone = $("#phone");
//var isOK = false;
  function inp() {
    if ($phone.val().length == 0) {
      alert("请输入手机号！");
      return false;
    }
    if ($phone.val().length != 11) {
      alert("请输入长度11位手机号码！");
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
    if (!myreg.test($phone.val())) {
      alert("请输入有效的手机号码！");
      return false;
    }
    return true;
  }

	var sendUrl = "http://192.168.201.109:8080";

  //获取验证码
  var $code = $(".get-code");
  var $nCode = $('#ncode');
  var bFlag = true;
  var timer = null;

  $code.on("click", function () {
    if (!inp()) {
      return
    }

    if (!bFlag) {
      return false
    }
    bFlag = false;
    var _this = $(this);

    $.ajax({
      url: sendUrl+"/randService/vote/sendCode",
      dataType: "json",
      type: "POST",
      data: {
        mobile: $phone.val(),
      },
//    complete: function () {
//      bFlag = true
//    },
      success: function (data) {
        // 如果data成功
        if(data.code == 200){
        	var countDown = 60;
					
	        function send() {
	          _this.html("重新发送(" + countDown + ")")
	          countDown--
	          if (countDown == -1) {
	            _this.html("获取验证码");
	            clearInterval(timer);
	            bFlag = true;
//	            isOk = false;
	          }
	        }
	        send();
	        timer = setInterval(send, 1000);
        }else{
        	bFlag = true;
        	alert(data.msg);
        }
      },
      error: function () {
      	bFlag = true;
      },
    })
  })

  //登陆
  var isClick = true;
  $(".submit-btn").on("click", function () {
    if (!inp()) {
      return
    }
    var codeVal
    if ($nCode.val() == "" || $.trim($nCode.val()).length == 0) {
      return;
    } else {
      codeVal = $.trim($nCode.val());
    }
    if (!isClick) {
      return
    }
    isClick = false
    $.ajax({
      url: sendUrl+"/randService/vote/sign",
      dataType: "json",
      type: "POST",
      data: {
        mobile: $phone.val(),
        code: codeVal
      },
      complete: function () {
        isClick = true
      },
      success: function (data) {
      	var userId = data.userId;
      	if(data.code == 200){
      		window.location.href = "vote.html?userId="+userId;
      	}
      },
    })
  })
})
