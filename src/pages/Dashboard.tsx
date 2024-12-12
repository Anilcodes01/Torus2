import Sidebar from "../components/Sidebar";
import Users from "../components/userList";
import UserRegistrationTrendChart from "../components/charts/LineChart";
import UsersByRegionChart from "../components/charts/BarChart";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import ActiveVsInactivePieChart from "../components/charts/PieChart";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import OverviewCard from "../components/charts/OverviewCards";

function Dashboard() {
  return (
    <div className="min-h-screen bg-customDark text-white">
      <div className="grid grid-cols-1 md:grid-cols-[20%_80%]">
        <div className="md:block hidden bg-gray-100 p-4">
          <Sidebar />
        </div>

        <div className="flex-grow p-4 ">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <span className="text-3xl font-mona text-black font-bold w-full md:w-auto">
              Your Dashboard
            </span>
          </div>

          <div className="md:mt-4">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={50}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              loop={true}
            >
              <SwiperSlide>
                <OverviewCard />
              </SwiperSlide>
              <SwiperSlide>
                <UserRegistrationTrendChart />
              </SwiperSlide>
              <SwiperSlide>
                <ActiveVsInactivePieChart />
              </SwiperSlide>
              <SwiperSlide>
                <UsersByRegionChart />
              </SwiperSlide>
            </Swiper>
          </div>

          <div className="flex-grow mt-6">
            <Users />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
