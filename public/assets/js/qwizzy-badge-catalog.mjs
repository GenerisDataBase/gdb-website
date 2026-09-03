const common = [1,3,5,10,15,20,25,30,40,50,75,100,150,200,250,500,750,1000,2500];

export const series = [
  ["accepted_questions",2500,91,[1,3,5,10,15,25,50,75,100,150,250,500,750,1000,1500,2500],"✓",158],
  ["submitted_questions",2500,91,[1,3,5,10,15,25,50,75,100,150,250,500,750,1000,1500,2500],"✎",215],
  ["daily_streak",2500,91,[1,3,5,7,10,14,21,30,50,75,100,150,200,250,365,500,750,1000,1500,2500],"🔥",28],
  ["correct_streak",2500,91,common,"✓✓",145],
  ["wrong_streak",2500,91,common,"×",350],
  ["sudden_death_score",2500,91,common,"⚡",266],
  ["three_hearts_score",2500,91,common,"♥",326],
  ["player_level",2500,91,[2,5,10,15,20,25,30,40,50,75,100,150,200,250,500,750,1000,1500,2500],"★",42],
  ["correct_answers",2500,91,[1,5,10,25,50,75,100,150,250,500,750,1000,1500,2500],"●",172],
  ["wrong_answers",2500,91,[1,5,10,25,50,75,100,150,250,500,750,1000,1500,2500],"○",3],
  ["fifty_fifty_uses",2500,90,[1,5,10,25,50,75,100,150,250,500,750,1000,1500,2500],"50",190],
];

export function milestones([, maximum, count, mandatory]) {
  const result = [...new Set(mandatory.filter(value => value >= 1 && value <= maximum))].sort((a,b)=>a-b);
  if (!result.includes(maximum)) result.push(maximum);
  while (result.length < count) {
    let largestGap = 0;
    let insertionIndex = -1;
    for (let index=0;index<result.length-1;index++) {
      const gap = result[index+1]-result[index];
      if (gap > largestGap) { largestGap=gap; insertionIndex=index; }
    }
    if (insertionIndex < 0 || largestGap <= 1) throw new Error(`Cannot build badge milestones for ${count}.`);
    result.push(result[insertionIndex]+Math.floor(largestGap/2));
    result.sort((a,b)=>a-b);
  }
  return result;
}

export const allBadges = series.flatMap((definition, seriesIndex) => milestones(definition).map((value,index) => ({
  id:`${definition[0]}:${value}`,
  key:definition[0],
  value,
  index,
  seriesIndex,
  icon:definition[4],
  hue:definition[5],
  catalogNumber:series.slice(0,seriesIndex).reduce((total,item)=>total+item[2],0)+index+1,
})));

if (allBadges.length !== 1000 || new Set(allBadges.map(badge => badge.id)).size !== 1000) {
  throw new Error("Qwizzy badge catalogue must contain exactly 1,000 unique badges.");
}
