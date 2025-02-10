import type { Route } from "./+types/home";
import { TicTacToe } from "../welcome/TicTacToe";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Ajay's Games" },
		{ name: "description", content: "Welcome to a list of Ajay's Games." },
	];
}

export default function Home() {
	return <TicTacToe />;
}
