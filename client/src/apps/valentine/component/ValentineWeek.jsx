
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ValentineWeek() {

  const navigate = useNavigate();
  const [today, setToday] = useState(new Date());

  // ✅ AUTO REFRESH AT MIDNIGHT
  useEffect(() => {

    const now = new Date();

    const msUntilMidnight =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      ) - now;

    const timer = setTimeout(() => {
      setToday(new Date());
    }, msUntilMidnight);

    return () => clearTimeout(timer);

  }, [today]);



  // Valentine days
  const days = [
    { date: 7, label: "Propose Day 💍", path: "/propose" },
    { date: 8, label: "Chocolate Day 🍫", path: "/chocolate" },
    { date: 9, label: "Promise Day 🤝", path: "/promise" },
    { date: 10, label: "Teddy Day 🧸", path: "/teddy" },
    { date: 11, label: "Hug Day 🤗", path: "/hug" },
    { date: 12, label: "Kiss Day 😘", path: "/kiss" },
    { date: 14, label: "Valentine ❤️", path: "/valentine" },
  ];


  // ✅ Unlock Logic
  const isUnlocked = (d) =>
    today.getMonth() === 1 && today.getDate() >= d;

  // ✅ Today Logic
  const isToday = (d) =>
    today.getMonth() === 1 && today.getDate() === d;



  return (
    <div className="
    min-h-screen
    flex
    flex-col
    items-center
    justify-center
    bg-linear-to-br
    from-rose-100
    via-pink-100
    to-rose-200
    p-10
    ">

      <h1 className="text-5xl font-serif text-rose-700 mb-14">
        Valentine Week ❤️
      </h1>


      {/* GRID */}
      <div className="
      grid
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3
      gap-10
      max-w-6xl
      w-full
      ">

        {days.map((item, index) => {

          const unlocked = isUnlocked(item.date);
          const active = isToday(item.date);

          return (

            <div
              key={index}
              onClick={() => unlocked && navigate(item.path)}
              className={`
              relative
              rounded-3xl
              p-10
              text-center
              transition
              duration-500
              backdrop-blur-lg
              transform

              ${unlocked
                ? "bg-white/70 hover:scale-105 cursor-pointer shadow-lg"
                : "bg-gray-300/40 cursor-not-allowed"}

              ${active && `
                ring-4
                ring-pink-400
                shadow-[0_0_70px_rgba(255,105,180,.8)]
                animate-pulse
                scale-105
              `}
              `}
            >

              {/* LOCK OVERLAY */}
              {!unlocked && (
                <div className="
                absolute inset-0
                bg-black/40
                rounded-3xl
                flex items-center justify-center
                text-5xl
                ">
                  🔒
                </div>
              )}

              <h2 className="text-2xl font-semibold">
                {item.label}
              </h2>

              {!unlocked && (
                <p className="mt-4 text-gray-700">
                  Unlocks Feb {item.date}
                </p>
              )}

              {active && (
                <p className="mt-4 text-pink-600 font-bold">
                  ❤️ Today
                </p>
              )}

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default ValentineWeek;
