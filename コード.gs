function createMessage(i,sheet) {
    const now = new Date();
    const nowMonth = now.getMonth() + 1;
    let day = now.getDate() + 1;
    const deadline = sheet.getRange(i, 6);
    const deadlinemonth = deadline.getValue().getMonth() + 1;
    const deadlinedate = deadline.getValue().getDate();;

    // 今日が金曜日だったら月曜日のTODOを見る
    if (now.getDay() === 5.0){
      day = now.getDate() + 3;
    } else {
      day = now.getDate() + 1;
    }

    if (day === deadlinedate && nowMonth === deadlinemonth){
      const title = sheet.getRange(i, 5).getValue();
      const method = sheet.getRange(i, 8).getValue();

      // 名前とステータス全取得
      const user = sheet.getRange(2,10,i-1,4).getValues();

      // ステータス収集
      let array = [];
      for (t = 0; t < 4; t++) {
        obj = {
          name: user[0][t],
          status: user[i-2][t],
        }
        array.push(obj)
      }

      // 対象者一覧作成
      let target = [];
      array.map((user) => {
        if (user.status === "") {
          target.push(`<@${user.name}>さん`)
        }
      })
      return `明日期限のTODOがあります！ \n タイトル：「${title}」 \n 提出方法：「${method}」 \n 対象者：「${target}」 \n "url"`
    }
}

function postMessage() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("シート1");
  const lastrow = sheet.getLastRow();

  // TODO件数分繰り返す
  for (let i = 3; i <= lastrow; i++) {
    const message = createMessage(i, sheet);
    if (!message) {
      continue;
    }

    const slackurl = "url";
    const jsonData = {
      text: message,
    };
    const payload = JSON.stringify(jsonData);
    const options = {
      method: "post",
      contentType: "application/json",
      payload: payload,
      };

    UrlFetchApp.fetch(slackurl, options);

  }
}