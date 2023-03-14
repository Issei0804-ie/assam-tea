import {isTimeAndCategory} from "./graph";
import {forEach} from "builtin-modules";
test('シンプルな正常系', function () {
	const testCase = "#### 22:00-23:00::hogehoge"
	expect(isTimeAndCategory(testCase)).toBe(true);
});

test('スペースを入れた正常系', function () {
	const testCases = [
		"#### 22:00 -23:00::hogehoge",
		"#### 22:00- 23:00::hogehoge",
		"#### 22:00 - 23:00::hogehoge",
		"#### 22:00 - 23:00 ::hogehoge",
		"#### 22:00 -23:00:: hogehoge"
		]
	for (let testCase of testCases){
		expect(isTimeAndCategory(testCase)).toBe(true);
	}
});
