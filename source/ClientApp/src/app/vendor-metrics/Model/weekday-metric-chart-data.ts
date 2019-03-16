export class WeekdayMetricChartData {

  private weekdays: any[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  data: any[];

  constructor() {
    this.data = [];
    this.weekdays.forEach(weekday => {
      this.data.push({ name: weekday, value: 0 });
    });
  }
}
