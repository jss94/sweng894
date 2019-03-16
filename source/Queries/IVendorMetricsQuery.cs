using System.Collections.Generic;
using System.Threading.Tasks;
using source.Models;
using System;

namespace source.Queries
{
    public interface IVendorMetricsQuery
    {
        Task<List<MonthlyReservationCountMetric>> GetMonthlyReservationCountMetricAsync(int vendorId);

        Task<List<WeeklyReservationCountMetric>> GetWeeklyReservationCountMetricAsync(int vendorId);

        Task<List<MonthlyReservationSalesMetric>> GetMonthlyReservationSalesMetricAsync(int vendorId);

    }
}