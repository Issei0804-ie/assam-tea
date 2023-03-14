
const re = /^#### ([012][0-9]:[0-9]{2}) *[-|~] *([012][0-9]:[0-9]{2}) *::(.*)$/;

export const STARTING_WORK_TIME_IDX = 1;
export const ENDING_WORK_TIME_IDX = 2;
export const CATEGORY_IDX = 3;
export function isTimeAndCategory(line:string){
	return re.test(line);
}

export function getTimeAndCategory(line:string):RegExpMatchArray{
	const match = line.match(re);

	if (match != null){
		return match;
	}
	throw new Error("result of match is null");
}

export function getDate(time:string):Date{
	const hour = Number(time.split(":")[0]);
	const min = Number(time.split(":")[1]);
	return new Date(2022, 1, 1,hour,min);
}
