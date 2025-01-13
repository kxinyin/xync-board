import { auth } from "@/src/auth";
import { MENU_ITEMS } from "@/src/lib/constants";
import AntdDashboardCard from "./antdDashboardCard";

export const metadata = {
  title: "Dashboard | Xync Board",
  description: "",
};

export default async function DashboardPage() {
  const session = await auth();

  const handleGreeting = () => {
    const now = new Date();
    const hours = now.getHours();
    let greeting;

    if (hours >= 0 && hours < 12) greeting = "Good Morning";
    else if (hours >= 12 && hours < 18) greeting = "Good Afternoon";
    else if (hours >= 18 && hours < 24) greeting = "Good Evening";
    else greeting = "Good Night";

    return greeting;
  };

  return (
    <section>
      <div className="w-full text-center pb-12 tracking-wide">
        {handleGreeting()}, {session?.user?.name}!
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6">
        {MENU_ITEMS.slice(1).map((item, index) => (
          <AntdDashboardCard key={index} item={item} />
        ))}
      </div>
    </section>
  );
}
