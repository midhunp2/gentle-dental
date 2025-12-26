import Navbar from "../components/Navbar/page";
import Footer from "../components/Footer/page";
import { AppointmentSchedulerSkeleton } from "../components/Skeleton/Skeleton";

export default function AppointmentLoading() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: "80vh", padding: "40px 20px" }}>
        <AppointmentSchedulerSkeleton />
      </div>
      <Footer />
    </>
  );
}

