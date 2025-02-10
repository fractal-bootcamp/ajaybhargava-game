import { expect, test, describe } from "bun:test";
import { AssignCardValue, Select5Cards } from "./GameState";
import type { ValidCards } from "./GameState";

const exampleDeck: ValidCards[] = [
	"JH",
	"QH",
	"KH",
	"AH",
	"JS",
	"QS",
	"KS",
	"AS",
	"JD",
	"QD",
	"KD",
	"AD",
	"JC",
	"QC",
	"KC",
	"AC",
];
describe("AssignCardValue", () => {
	test("should return correct value for Jack of Hearts", () => {
		expect(AssignCardValue("JH")).toBe(11);
	});
});

describe("Select5Cards", () => {
	test("should return 5 cards", () => {
		console.log(Select5Cards(exampleDeck));
		expect(Select5Cards(exampleDeck).length).toBe(5);
	});
});
