const app = getApp();
const array_weeks = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
const getDayList = function(tableType = "week") {
  var tmp = [];
  for (var idx_list = 0; idx_list < 10; idx_list++) {
    tmp[idx_list] = {
      start_time: tableType == "week" ? {
        hour: null,
        minute: null
      } : null,
      end_time: tableType == "week" ? {
        hour: null,
        minute: null
      } : null,
      value: ((tableType == "week") ? (null) : ({
        className: null,
        classTeacher: null,
        classRoom: null
      }))
    }
  }
  return tmp;
}
// Initialize function start
const defualt_onFail = (e) => {
  wx.showModal({
    title: '提示',
    content: '连接失败',
    showCancel: false
  })
}
const defualt_onComplete = (e) => {
  wx.hideLoading();
}
// Initialize function end
const items = {
  array_weeks: array_weeks,
  str_storageKey_days: "daysBackup",
  str_storageKey_editted: "editFlag",
  str_storageKey_tableName: "tableName",
  str_storageKey_tableType: "tableType"
};
var getInitDays = (tableType = "week") => {
  var t = [];
  if (tableType == "week") {
    // Initialize week days start
    for (var i = 0; i < 7; i++) {
      t[i] = {
        weekDay: array_weeks[i],
        checked: "nav-item",
        dayList: getDayList()
      }
    }
    t[0].checked = "nav-item cur";
    // Initialize week days end
  } else {
    // Intitalize class days start
    for (var i = 0; i < 5; i++) {
      t[i] = {
        weekDay: array_weeks[i],
        checked: "nav-item",
        dayList: getDayList("class")
      }
    }
    t[0].checked = "nav-item cur";
    // Initialize class days end
  }
  wx.setStorage({
    key: items.str_storageKey_days,
    data: t,
  })
  return t;
}
var getUserTables = function(onSuccessSync, onFail = null, onComplete = null) {
  var that = this;
  onFail = onFail == null ? defualt_onFail : onFail;
  onComplete = onComplete == null ? defualt_onComplete : onComplete;
  app.requestTo(
    "/wxapp/calendar/init", {
      sessionid: wx.getStorageSync("sessionID")
    },
    null,
    onSuccessSync,
    onFail,
    onComplete
  );
};
var isSetDays = function(onSuccessSync, onFailSync = null) {
  onFailSync = onFailSync == null ? () => {} : onFailSync;
  wx.getStorage({
    key: items.str_storageKey_days,
    success: onSuccessSync,
    fail: onFailSync,
    complete: (e) => {
      console.log(e)
    }
  });
}
var isSetType = function(onSuccessSync, onFailSync = null) {
  onFailSync = onFailSync == null ? () => {} : onFailSync;
  wx.getStorage({
    key: items.str_storageKey_tableType,
    success: onSuccessSync,
    fail: onFailSync,
    complete: (e) => {
      console.log(e)
    }
  })
};
var setDaysToStorage = function(obj, onSuccessSync = null, onFailSync = null) {
  wx.setStorage({
    key: items.str_storageKey_days,
    data: obj,
    success: onSuccessSync == null ? () => {} : onSuccessSync,
    fail: onFailSync == null ? () => {} : onFailSync,
    complete: (e) => {
      console.log(e);
    }
  });
}
var setTypeToStorage = function(obj, onSuccessSync = null, onFailSync = null) {
  onSuccessSync = onSuccessSync == null ? () => {} : onSuccessSync;
  onFailSync = onFailSync == null ? () => {} : onFailSync;
  wx.setStorage({
    key: items.str_storageKey_tableType,
    data: obj,
    success: onSuccessSync,
    fail: onFailSync,
    complete: (e) => {
      console.log(e);
    }
  });
}
var removeCalendarStorage = (e) => {
  console.log("removed");
  wx.removeStorageSync(items.str_storageKey_days);
  wx.removeStorageSync(items.str_storageKey_tableName);
  wx.removeStorageSync(items.str_storageKey_tableType);
  wx.removeStorageSync(items.str_storageKey_editted);
  wx.removeStorageSync("editedItemCount");
}
var uploadBuildUp = (onSuccessSync, onFailSync = null, onComplete = null) => {
  var d = null;
  onFailSync = onFailSync == null ? defualt_onFail : onFailSync;
  onComplete = onComplete == null ? defualt_onComplete : onComplete;
  wx.getStorage({
    key: items.str_storageKey_days,
    success: function(res) {
      d = res.data
      var type = wx.getStorageSync(items.str_storageKey_tableType);
      app.requestTo(
        "/wxapp/calendar/buildUp", {
          sessionid: wx.getStorageSync("sessionID"),
          table: JSON.stringify({
            table_name: wx.getStorageSync(items.str_storageKey_tableName),
            table_type: type,
            Mon: d[0].dayList,
            Tue: d[1].dayList,
            Wed: d[2].dayList,
            Thu: d[3].dayList,
            Fri: d[4].dayList,
            Sat: type == 'week' ? d[5].dayList : null,
            Sun: type == 'week' ? d[6].dayList : null
          }),
        },
        null,
        onSuccessSync,
        onFailSync,
        onComplete
      );
    },
  })
}
var getDaysFromStorage = (onSuccessSync, onFailSync = null, onComplete = null) => {
  onFailSync = onFailSync == null ? () => {} : onFailSync;
  onComplete = onComplete == null ? (e) => {
    console.log(e)
  } : onComplete;
  wx.getStorage({
    key: items.str_storageKey_days,
    success: onSuccessSync,
    fail: onFailSync,
    complete: onComplete
  })
}
var setEditFlag = (flag, onSuccessSync = null, onFail = null) => {
  onSuccessSync = onSuccessSync == null ? () => {} : onSuccessSync;
  onFail = onFail == null ? () => {} : onFail;
  wx.setStorage({
    key: items.str_storageKey_editted,
    data: flag,
    success: onSuccessSync,
    fail: onFail
  })
}
var isEdit = (onSuccessSync) => {
  wx.getStorage({
    key: items.str_storageKey_editted,
    success: onSuccessSync,
    complete: (e) => {
      console.log(e)
    }
  })
}
var editedItemCount = () => {
  var t = wx.getStorageSync("editedItemCount"),
    tt = 0;
  if (isNaN(parseInt(t))) {
    wx.setStorageSync("editedItemCount", tt);
  } else {
    tt = parseInt(t);
  }
  console.log("return: " + tt);
  return tt;
};
var editedItemCountAdd = (onSuccessSync) => {
  wx.getStorage({
    key: "editedItemCount",
    success: function(res) {
      wx.setStorageSync("editedItemCount", !isNaN(parseInt(res.data)) ? parseInt(res.data) + 1 : 1);
      console.log("ADD editedItemCount: " + editedItemCount());
      onSuccessSync();
    },
  })
};
var editedItemCountMinus = (onSuccessSync) => {
  wx.getStorage({
    key: "editedItemCount",
    success: function(res) {
      wx.setStorageSync("editedItemCount", !isNaN(parseInt(res.data)) ? (parseInt(res.data) <= 0 ? 0 : parseInt(res.data) - 1) : 0);
      console.log("MINUS editedItemCount: " + editedItemCount());
      onSuccessSync();
    },
  })
};
var viewTable = (tid, onSuccessSync, onFail = null, onComplete = null) => {
  app.requestTo(
    "/wxapp/calendar/viewTable", {
      tid: tid,
      isEditing: 1
    },
    null,
    onSuccessSync,
    onFail == null ? (e) => {} : onFail,
    onComplete == null ? (e) => {} : onComplete
  )
}
var rebuildTable = (tid, obj_newTable, onSuccessSync, onFail = null, onComplete = null) => {
  // getDaysFromStorage start
  getDaysFromStorage(
    (res) => {
      var data = {
        tid: tid,
        ttype: obj_newTable.type,
        Mon: JSON.stringify(obj_newTable.days[0].dayList),
        Tue: JSON.stringify(obj_newTable.days[1].dayList),
        Wed: JSON.stringify(obj_newTable.days[2].dayList),
        Thu: (JSON.stringify(obj_newTable.days[3].dayList)),
        Fri: (JSON.stringify(obj_newTable.days[4].dayList)),
        Sat: null,
        Sun: null
      }
      if (obj_newTable.type == "week") {
        data.Sat = (JSON.stringify(obj_newTable.days[5].dayList));
        data.Sun = (JSON.stringify(obj_newTable.days[6].dayList));
      }
      // app start
      app.requestTo(
        "/wxapp/calendar/reBuild",
        data,
        null,
        onSuccessSync,
        onFail == null ? (e) => {} : onFail,
        onComplete == null ? (e) => {} : onComplete
      );
      // app end
    }
  );
  // getDaysFromStorage end
}
var getSharingTable = (tid, onSuccessSync, onFail = null, onComplete = null) => {
  app.requestTo(
    "/wxapp/calendar/sharingTable", {
      tid: tid,
      sessionid: wx.getStorageSync("sessionID")
    },
    null,
    onSuccessSync,
    onFail == null ? null : onFail,
    onComplete == null ? null : onComplete
  )
}
var getTableCreator = (tid, onSuccessSync, onFail = null, onComplete = null) => {
  app.requestTo(
    "/wxapp/calendar/getTableCreator", {
      tid: tid
    },
    null,
    onSuccessSync,
    onFail == null ? null : onFail,
    onComplete == null ? null : onComplete,
  )
}
var saveSharingTable = (tid, onSuccessSync, onFail = null, onComplete = null) => {
  app.requestTo(
    "/wxapp/calendar/saveSharingTable", {
      tid: tid,
      sessionid: wx.getStorageSync("sessionID")
    },
    null,
    onSuccessSync,
    onFail == null ? null : onFail,
    onComplete == null ? null : onComplete
  )
}
// Export module start
module.exports = {
  getInitDays: getInitDays,
  getUserTables: getUserTables,
  getDaysFromStorage: getDaysFromStorage,
  isSetDays: isSetDays,
  isSetType: isSetType,
  setDaysToStorage: setDaysToStorage,
  setTypeToStorage: setTypeToStorage,
  items: items,
  uploadBuildUp: uploadBuildUp,
  removeCalendarStorage: removeCalendarStorage,
  setEditFlag: setEditFlag,
  isEdit: isEdit,
  editedItemCount: editedItemCount,
  editedItemCountAdd: editedItemCountAdd,
  editedItemCountMinus: editedItemCountMinus,
  viewTable: viewTable,
  rebuildTable: rebuildTable,
  getSharingTable: getSharingTable,
  getTableCreator: getTableCreator,
  saveSharingTable: saveSharingTable
}
// Export module end