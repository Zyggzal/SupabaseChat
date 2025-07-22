const TIME_UNITS = [
  { unit: 'y', seconds: 60 * 60 * 24 * 365.2425 },
  { unit: 'm', seconds: 60 * 60 * 24 * 30.436875 },
  { unit: 'd', seconds: 60 * 60 * 24 },
  { unit: 'h', seconds: 60 * 60 },
  { unit: 'min', seconds: 60 },
  { unit: 's', seconds: 1 }
];

const divideClean = (a: number, b: number) => {
    let res = a / b;
    return Math.floor(res);
}

export function dateToAgo(date: Date) {
    const actualDate = new Date(date);
    let diff = divideClean(new Date().getTime() - actualDate.getTime(), 1000);

    if(diff < 5) return 'now';
    
    for(let tu of TIME_UNITS) {
        const value = divideClean(diff, tu.seconds)
        if(value >= 1) return `${value}${tu.unit}` 
    }

    return 'now';
}