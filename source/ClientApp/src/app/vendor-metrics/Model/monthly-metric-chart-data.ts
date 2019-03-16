export class MonthlyMetricChartData {

  private months: any[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  data: any[];

  constructor() {
    this.data = [];
    this.months.forEach(month => {
      this.data.push({ name: month, value: 0 });
    });
  }
}
