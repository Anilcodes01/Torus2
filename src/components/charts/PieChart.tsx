import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { RootState } from "../../store/store";
import { fetchAnalyticsData } from "../../store/slices/analyticsSlice";

const ActiveVsInactivePieChart: React.FC = () => {
  const dispatch = useDispatch();
  const { activeVsInactive } = useSelector(
    (state: RootState) => state.analytics
  );

  useEffect(() => {
    dispatch(fetchAnalyticsData() as any);
  }, [dispatch]);

  const chartData = useMemo(() => {
    const totalUsers = activeVsInactive.active + activeVsInactive.inactive;

    const activePercentage =
      totalUsers > 0
        ? ((activeVsInactive.active / totalUsers) * 100).toFixed(1)
        : "0";

    const inactivePercentage =
      totalUsers > 0
        ? ((activeVsInactive.inactive / totalUsers) * 100).toFixed(1)
        : "0";

    return {
      series: [activeVsInactive.active, activeVsInactive.inactive],
      totalUsers,
      percentages: {
        active: activePercentage,
        inactive: inactivePercentage,
      },
    };
  }, [activeVsInactive]);

  const chartOptions: ApexOptions = {
    chart: {
      type: "pie",
      height: 350,
      fontFamily: "Inter, sans-serif",
      background: "transparent",
      toolbar: { show: false },
      animations: {
        enabled: true,
        dynamicAnimation: {
          enabled: true,
          speed: 800,
        },
      },
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 0,
        left: 0,
        blur: 4,
        opacity: 0.1,
      },
    },
    labels: ["Active Users", "Inactive Users"],
    colors: ["#2B6CB0", "#A0AEC0"],
    stroke: {
      show: false,
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontFamily: "Inter, sans-serif",
      labels: {
        colors: "#000",
        useSeriesColors: false,
      },
      markers: {
        fillColors: ["#2B6CB0", "#A0AEC04"],
      },
    },
    title: {
      text: "User Activity Overview",
      align: "left",
      style: {
        fontSize: "20px",
        color: "#111827",
        fontWeight: "700",
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
        fontWeight: "bold",
        colors: ["#FFFFFF"],
      },
      formatter: function (val, { seriesIndex }) {
        const percentages = [
          chartData.percentages.active,
          chartData.percentages.inactive,
        ];
        return `${percentages[seriesIndex]}%`;
      },
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: function (val) {
          return `${val} users`;
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
              color: "#6B7280",
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: "20px",
              fontFamily: "Inter, sans-serif",
              color: "#111827",
              fontWeight: "bold",
              offsetY: 10,
            },
            total: {
              show: true,
              label: "Total Users",
              color: "#fff",
              formatter: function () {
                return chartData.totalUsers.toString();
              },
            },
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl  p-6 max-w-md mx-auto transform transition-all duration-300 ">
      {activeVsInactive.active > 0 || activeVsInactive.inactive > 0 ? (
        <div className="relative">
          <Chart
            options={chartOptions}
            series={chartData.series}
            type="pie"
            height={350}
          />
          <div className="absolute inset-x-0  text-center text-sm text-gray-500 pb-2">
            <span className="font-semibold text-gray-700">
              Total Users: {chartData.totalUsers}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 space-y-4 text-gray-400">
          <svg
            className="w-16 h-16 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.768-.231-1.482-.634-2.257M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.768.231-1.482.634-2.257m0 0a5.002 5.002 0 019.732 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p className="text-lg font-semibold">No user activity data</p>
        </div>
      )}
    </div>
  );
};

export default ActiveVsInactivePieChart;
