export default class ReportLine {
  static fetchFromExpenseAccountResponse(item) {
    let line: any = {};
    line.id = item.id;
    line.name = item.name;
    line.parent_id = item.ExpenseAccountId;
    line.summline = 0;
    line.sumTotal = 0;
    line.child = [];
    return line;
  }

  static fetchFromTimelineEagerResponse(item) {
    let line: any = {};
    line.id = item["Timeline.id"];
    line.name = item["Timeline.nom"];
    line.parent_id = item["Timeline.parentId"];
    if (item.seconds) {
      let secs: number = parseInt(item.seconds);
      let rems: number = secs % 60;
      line.summline = parseInt(String((secs - rems) / 60));
    } else line.summline = 0;
    line.sumTotal = 0;
    line.child = [];
    return line;
  }
}

module.exports.ReportLine = ReportLine;
