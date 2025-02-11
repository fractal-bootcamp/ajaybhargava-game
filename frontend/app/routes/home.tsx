import TwoClubs from "@/assets/2C.svg";
import type { Route } from "./+types/Home";
import { useLoaderData } from "react-router";
import { CardImage }  from "@components/CardImage";
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
	return <CardImage card="QC" alt="Queen of Clubs" />;
}
