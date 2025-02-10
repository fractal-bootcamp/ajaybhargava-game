import TwoClubs from "@/assets/2C.svg";
import type { Route } from "./+types/Home";
import { useLoaderData } from "react-router";
import { CardImage } from "~/components/CardImage";
export async function loader() {
	return {
		message: "Hello, world!",
	};
}

// biome-ignore lint/correctness/noEmptyPattern: <explanation>
export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Ajay's Games" },
		{ name: "description", content: "Just a simple Games V7 Router App!" },
	];
}

export default function Home({ actionData }: Route.ComponentProps) {
	const data = useLoaderData<typeof loader>();
	return (
		<div className="grid place-items-center bg-gray-100 dark:bg-gray-700 min-h-screen">
			<div className="grid grid-cols-5 grid-rows-5 gap-4 p-4">
				<CardImage card="QC" alt="Queen of Clubs" className="w-18 h-auto" />
				<CardImage card="KC" alt="King of Clubs" className="w-18 h-auto" />
				<CardImage card="AC" alt="Ace of Clubs" className="w-18 h-auto" />
				<CardImage card="2H" alt="2 of Hearts" className="w-18 h-auto" />
				<CardImage card="3H" alt="3 of Hearts" className="w-18 h-auto" />
				<CardImage card="4H" alt="4 of Hearts" className="w-18 h-auto" />
				<CardImage card="5H" alt="5 of Hearts" className="w-18 h-auto" />
				<CardImage card="6H" alt="6 of Hearts" className="w-18 h-auto" />
				<CardImage card="7H" alt="7 of Hearts" className="w-18 h-auto" />
				<CardImage card="8H" alt="8 of Hearts" className="w-18 h-auto" />
				<CardImage card="9H" alt="9 of Hearts" className="w-18 h-auto" />
				<CardImage card="10H" alt="10 of Hearts" className="w-18 h-auto" />
				<CardImage card="JS" alt="Jack of Spades" className="w-18 h-auto" />
				<CardImage card="QS" alt="Queen of Spades" className="w-18 h-auto" />
				<CardImage card="KS" alt="King of Spades" className="w-18 h-auto" />
				<CardImage card="AS" alt="Ace of Spades" className="w-18 h-auto" />
				<CardImage card="2S" alt="2 of Spades" className="w-18 h-auto" />
				<CardImage card="3S" alt="3 of Spades" className="w-18 h-auto" />
				<CardImage card="4S" alt="4 of Spades" className="w-18 h-auto" />
				<CardImage card="5S" alt="5 of Spades" className="w-18 h-auto" />
				<CardImage card="6S" alt="6 of Spades" className="w-18 h-auto" />
				<CardImage card="7S" alt="7 of Spades" className="w-18 h-auto" />
				<CardImage card="8S" alt="8 of Spades" className="w-18 h-auto" />
				<CardImage card="9S" alt="9 of Spades" className="w-18 h-auto" />
				<CardImage card="10S" alt="10 of Spades" className="w-18 h-auto" />
			</div>
		</div>
	);
}
