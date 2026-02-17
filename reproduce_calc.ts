
interface Evaluation {
    id: number;
    name: string;
    isGraded: boolean;
    score: string;
    weight: string;
    date: string;
    comment?: string;
    image?: string;
}

const calculateScore = (evals: Evaluation[]) => {
    const newScore = evals.reduce((sum, ev) => {
        if (ev.isGraded && ev.score && ev.weight) {
            const scoreVal = parseFloat(ev.score.toString().replace(',', '.'));
            const weightVal = parseFloat(ev.weight.toString().replace(',', '.'));

            console.log(`Eval: ${ev.name}, Score: ${scoreVal}, Weight: ${weightVal}`);

            if (!isNaN(scoreVal) && !isNaN(weightVal)) {
                return sum + (scoreVal * (weightVal / 100));
            }
        }
        return sum;
    }, 0);

    return Math.round(newScore * 100) / 100;
};

// Test Case 1: Standard
const evals1: Evaluation[] = [
    { id: 1, name: "Test 1", isGraded: true, score: "20", weight: "20", date: "" }
];
console.log("Test 1 (Expected 4):", calculateScore(evals1));

// Test Case 2: Comma
const evals2: Evaluation[] = [
    { id: 1, name: "Test 2", isGraded: true, score: "18,5", weight: "20", date: "" }
];
console.log("Test 2 (Expected 3.7):", calculateScore(evals2));

// Test Case 3: Empty strings
const evals3: Evaluation[] = [
    { id: 1, name: "Test 3", isGraded: true, score: "", weight: "20", date: "" }
];
console.log("Test 3 (Expected 0):", calculateScore(evals3));

// Test Case 4: Not graded
const evals4: Evaluation[] = [
    { id: 1, name: "Test 4", isGraded: false, score: "20", weight: "20", date: "" }
];
console.log("Test 4 (Expected 0):", calculateScore(evals4));
