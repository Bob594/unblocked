import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { PiDiceFive } from "react-icons/pi";
import { Icon } from "~/assets/Icon";
import { Carousel } from "~/components/Carousel";
import GameList from "~/components/GameList";
import { bestGames, hotGames, popularGames, allGames } from "~/util/games";

export async function loader() {
  // Pass data through loader as to not include it in the client bundle
  return json({
    popularGames,
    hotGames,
    bestGames,
    allGames,
    randomGame: allGames[Math.floor(Math.random() * allGames.length)]?.slug
  });
}

export default function Games() {
  const { popularGames, hotGames, bestGames, allGames, randomGame } =
    useLoaderData<typeof loader>();
  const [profile, setProfile] = useState<Window["__profile"]>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.__profile) {
        setProfile(window.__profile);
        clearInterval(interval);
      }
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <main className="flex flex-col px-8 py-32 md:px-16 lg:px-32 xl:px-48">
      <section className="flex w-full flex-col items-center justify-center gap-5 pb-32">
        <Icon className="h-10 sm:h-14" />
        <p className="text-center">
          Browse from Radon&apos;s selection of {allGames.length} games!
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5">
          <form method="GET" action="/search">
            <input
              name="q"
              className="rounded-md border-2 border-bg-secondary bg-transparent px-4 py-1.5 font-normal shadow outline-accent-secondary ring-accent-primary transition-all focus:scale-105 focus:shadow-[0px_0px_16px_var(--accent-primary)] focus:outline-0 focus:ring-2"
              placeholder="Search Games"
              type="text"
              autoComplete="off"
            />
          </form>
          <a
            href={`/game/${randomGame}`}
            className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg bg-accent-secondary px-4 py-2 font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-[0px_0px_16px_var(--accent-secondary)] focus:outline-0"
          >
            <PiDiceFive />
            Or Play a Random Game
          </a>
        </div>
      </section>
      {profile && (
        <section className="mb-10">
          <h3 className="mb-2 text-2xl font-bold tracking-wide">
            Play Your Favorited Games
          </h3>
          {/* @ts-expect-error - TODO: fix the types here */}
          <Carousel games={profile.favorites} />
        </section>
      )}
      <section className="mb-10">
        <h3 className="mb-2 text-2xl font-bold tracking-wide">
          Explore Popular Games
        </h3>
        <Carousel games={popularGames} />
      </section>
      <section className="mb-10">
        <h3 className="mb-2 text-2xl font-bold tracking-wide">
          See the Best Rated Games
        </h3>
        <Carousel games={bestGames} />
      </section>
      <section className="mb-10">
        <h3 className="mb-2 text-2xl font-bold tracking-wide">Hottest Games</h3>
        <Carousel games={hotGames} />
      </section>
      <section className="mb-10">
        <div className="mb-5 flex items-center gap-5">
          <h3 className="text-2xl font-bold tracking-wide">All Games (A-Z)</h3>
          <form method="GET" action="/search">
            <input
              name="q"
              className="rounded-md border-2 border-bg-secondary bg-transparent px-2 py-1 font-normal shadow outline-accent-secondary ring-accent-primary transition-all focus:outline-0 focus:ring-2"
              placeholder="Search Games"
              type="text"
              autoComplete="off"
            />
          </form>
        </div>
        <GameList games={allGames} />
      </section>
    </main>
  );
}
