import type { Route } from "./+types/Home";
import { useLoaderData } from "react-router";
import { CardImage } from "@components/CardImage";

export async function loader() {
	const response = await fetch("http://localhost:3001/roomIds");
	const roomIds = await response.json();
	return {
		roomIds,
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
		<div>
			<h1>Available Rooms:</h1>
			<ul>
				{data.roomIds.map((roomId: string) => (
					<li key={roomId}>{roomId}</li>
				))}
			</ul>
		</div>
	);
}
