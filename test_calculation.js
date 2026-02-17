// Test to verify the calculation flow
console.log("=== TESTING EVALUATION CALCULATION ===");

// Simulating the handleUpdateEvaluations function from MateriasView.tsx
const handleUpdateEvaluations = (id, evals) => {
    console.log(`\nUpdating evaluations for subject ID: ${id}`);
    console.log("Evaluations:", JSON.stringify(evals, null, 2));

    // This is the exact calculation from MateriasView.tsx (lines 826-839)
    const newScore = evals.reduce((sum, ev) => {
        if (ev.isGraded) {
            const sStr = ev.score ? ev.score.toString() : '0';
            const wStr = ev.weight ? ev.weight.toString() : '20';

            const scoreVal = parseFloat(sStr.replace(',', '.'));
            const weightVal = parseFloat(wStr.replace(',', '.'));

            console.log(`  - ${ev.name}: score=${scoreVal}, weight=${weightVal}%, contribution=${scoreVal * (weightVal / 100)}`);

            if (!isNaN(scoreVal) && !isNaN(weightVal)) {
                return sum + (scoreVal * (weightVal / 100));
            }
        }
        return sum;
    }, 0);

    const roundedScore = Math.round(newScore * 100) / 100;
    console.log(`\nTotal Accumulated Score: ${roundedScore}`);
    return roundedScore;
};

// Test Case 1: Single evaluation
console.log("\n--- Test 1: Single Evaluation ---");
const test1 = [
    { id: 1, name: "Examen 1", isGraded: true, score: "18", weight: "20", date: "10/02" }
];
handleUpdateEvaluations(1, test1);

// Test Case 2: Multiple evaluations
console.log("\n--- Test 2: Multiple Evaluations ---");
const test2 = [
    { id: 1, name: "Examen 1", isGraded: true, score: "18", weight: "20", date: "10/02" },
    { id: 2, name: "Tarea", isGraded: true, score: "20", weight: "10", date: "12/02" },
    { id: 3, name: "Proyecto", isGraded: false, score: "", weight: "30", date: "15/02" }
];
handleUpdateEvaluations(2, test2);

// Test Case 3: With comma decimal
console.log("\n--- Test 3: Comma Decimal ---");
const test3 = [
    { id: 1, name: "Examen", isGraded: true, score: "17,5", weight: "25", date: "10/02" }
];
handleUpdateEvaluations(3, test3);

console.log("\n=== ALL TESTS COMPLETED ===");
