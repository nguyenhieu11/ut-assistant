// Define the condition string
const conditionString = "my_var < 10 && (var_2 > 0)";

// Create a function from the condition string
const conditionFunction = new Function('my_var', 'var_2', `return ${conditionString};`);

// Function to evaluate the condition
function evaluateCondition(my_var, var_2) {
    return conditionFunction(my_var, var_2);
}

// Example usage:
const my_var = 11;
const var_2 = 3;
const result = evaluateCondition(my_var, var_2);
console.log(`Result for my_var=${my_var} and var_2=${var_2}: ${result}`);