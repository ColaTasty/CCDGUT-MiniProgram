function bindCheck(onBind, onNobind, onError, onComplete, beforeAPIInvoke) {
  onBind = onBind || function () {};
  onNobind = onNobind || function () {};
  onError = onError || function () {};
  onComplete = onComplete || function () {};
  beforeAPIInvoke = beforeAPIInvoke || function () {};

  var app = getApp();

  var bindCheckClosure = () => {
    // 若已检查过，直接调用回调
    if (app.educationSystemBindChecked) {
      if (app.educationSystemBind) {
        onBind();
      } else {
        onNobind();
      }
      onComplete();
      return;
    }

    beforeAPIInvoke();

    app.callAPI("/Module/EducationSystem/BindCheck", null,
      function (e) {
        if (e.data.result) {
          app.educationSystemBind = true;
          onBind();
        } else {
          app.educationSystemBind = false;          
          onNobind();
        }
        app.educationSystemBindChecked = true;
      },
      onError,
      onComplete
    );
  }

  if (app.sessionReady) {
    bindCheckClosure();
  } else {
    app.sessionReadyCallback = bindCheckClosure;
  }
}

module.exports.bindCheck = bindCheck;