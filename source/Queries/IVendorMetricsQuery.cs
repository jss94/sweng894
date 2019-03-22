using System.Collections.Generic;
using System.Threading.Tasks;
using source.Models;
using System;

namespace source.Queries
{
    public interface IVendorMetricsQuery
    {
        Task<List<ReservationCountMetric>> GetMonthlyReservationCountMetricAsync(int vendorId);

        Task<List<ReservationCountMetric>> GetWeekdayReservationCountMetricAsync(int vendorId);

        Task<List<ReservationSalesMetric>> GetMonthlyReservationSalesMetricAsync(int vendorId);

        Task<List<ReservationSalesMetric>> GetWeekdayReservationSalesMetricAsync(int vendorId);

    }
}