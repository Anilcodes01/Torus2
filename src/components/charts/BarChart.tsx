import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { RootState } from "../../store/store";
import { fetchAnalyticsData } from "../../store/slices/analyticsSlice";

const UsersByRegionChart: React.FC = () => {
  const dispatch = useDispatch();
  const { usersByRegion } = useSelector((state: RootState) => state.analytics);

  useEffect(() => {
    dispatch(fetchAnalyticsData() as any);
  }, [dispatch]);

  const chartData = useMemo(() => {
    const regions = Object.keys(usersByRegion);
    const userCounts = Object.values(usersByRegion);

    const totalUsers = userCounts.reduce((sum, count) => sum + count, 0);

    const percentages = userCounts.map((count) =>
      totalUsers > 0 ? ((count / totalUsers) * 100).toFixed(1) : "0"
    );

    return { regions, userCounts, percentages };
  }, [usersByRegion]);

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
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
        blur: 3,
        opacity: 0.1,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 5,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number, opts) => {
        const percentage = chartData.percentages[opts.dataPointIndex];
        return `${val} (${percentage}%)`;
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: chartData.regions,
      title: {
        text: "Regions",
        style: {
          fontWeight: 600,
          color: "#666",
        },
      },
      labels: {
        style: {
          colors: "#666",
        },
      },
    },
    yaxis: {
      title: {
        text: "Number of Users",
        style: {
          fontWeight: 600,
          color: "#666",
        },
      },
      labels: {
        style: {
          colors: "#666",
        },
      },
    },

    fill: {
      opacity: 1,
      colors: ["#3498db"],
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val: number, { dataPointIndex }) => {
          const percentage = chartData.percentages[dataPointIndex];
          return `${val} users (${percentage}%)`;
        },
      },
    },
    title: {
      text: "Users by Region",
      align: "left",
      style: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#333",
      },
    },
    grid: {
      show: true,
      borderColor: "#f1f1f1",
      strokeDashArray: 0,
      position: "back",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  };

  const series = [
    {
      name: "Users",
      data: chartData.userCounts,
    },
  ];

  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl">
      {chartData.regions.length > 0 ? (
        <Chart options={chartOptions} series={series} type="bar" height={350} />
      ) : (
        <div className="text-center text-gray-500 py-12">
          <svg
            className="mx-auto h-16 w-16 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
          <p className="mt-4 text-lg font-semibold">No user data available</p>
        </div>
      )}
    </div>
  );
};

export default UsersByRegionChart;
