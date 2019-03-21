using System.Collections.Generic;
using System.Threading.Tasks;
using source.Models;
using System;

namespace source.Queries
{
    public interface IVendorMetricsQuery
    {
        Task<List<MonthlyReservationCountMetric>> GetMonthlyReservationCountMetricAsync(int vendorId);

        Task<List<WeekdayReservationCountMetric>> GetWeekdayReservationCountMetricAsync(int vendorId);

        Task<List<MonthlyReservationSalesMetric>> GetMonthlyReservationSalesMetricAsync(int vendorId);

        Task<List<MonthlyReservationSalesMetric>> GetWeekdayReservationSalesMetricAsync(int vendorId);

    }
}