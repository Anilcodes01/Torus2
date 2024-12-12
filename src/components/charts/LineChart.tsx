import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { RootState } from "../../store/store";

const UserRegistrationTrendChart: React.FC = () => {
  const { userRegistrationTrend } = useSelector(
    (state: RootState) => state.analytics
  );
  const [selectedPeriod, setSelectedPeriod] = useState<number>(12);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const registrationCounts = useMemo(() => {
    return monthNames.map(
      (_, monthIndex) =>
        userRegistrationTrend.filter((month) => month === monthIndex).length
    );
  }, [userRegistrationTrend]);

  const filteredData = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    return registrationCounts.slice(
      Math.max(0, currentMonth - selectedPeriod + 1),
      currentMonth + 1
    );
  }, [registrationCounts, selectedPeriod]);

  const chartLabels = useMemo(() => {
    const currentMonth = new Date().getMonth();
    return monthNames.slice(
      Math.max(0, currentMonth - selectedPeriod + 1),
      currentMonth + 1
    );
  }, [selectedPeriod]);

  const chartOptions: ApexOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: chartLabels,
      title: {
        text: "Months",
      },
    },
    yaxis: {
      title: {
        text: "Number of Registrations",
      },
    },
    title: {
      text: "User Registration Trend",
      align: "left",
      style: {
        fontSize: "20px",
      },
    },
    colors: ["#3498db"],
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val: number) => `${val} registrations`,
      },
    },
    markers: {
      size: 5,
      hover: {
        size: 7,
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 300,
          },
          title: {
            style: {
              fontSize: "16px",
            },
          },
          xaxis: {
            title: {
              text: "",
            },
          },
        },
      },
    ],
  };

  const series = [
    {
      name: "Registrations",
      data: filteredData,
    },
  ];

  const periodButtons = [
    { label: "12 Months", value: 12 },
    { label: "6 Months", value: 6 },
    { label: "4 Months", value: 4 },
  ];

  return (
    <div className="p- pl-8 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-2 md:space-y-0">
        <h2 className="text-lg font-semibold">User Registration Trend</h2>
        <div className="flex space-x-2">
          {periodButtons.map((button) => (
            <button
              key={button.value}
              className={`px-3 py-1 text-sm rounded  transition-colors ${
                selectedPeriod === button.value
                  ? " text-black"
                  : " text-gray-400"
              }`}
              onClick={() => setSelectedPeriod(button.value)}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

      {filteredData.length > 0 ? (
        <Chart
          options={chartOptions}
          series={series}
          type="line"
          height={350}
        />
      ) : (
        <div className="text-center text-gray-500">
          No registration data available
        </div>
      )}
    </div>
  );
};

export default UserRegistrationTrendChart;
