export const cFunc = `int test(int param_1, bool param_2)
{
    int my_var = 5;
    bool var_2;
    /** if block with condition at the start*/
    if (abc <  10)
    {
        // will be executed if the condition is true
        printf("my_var is less than 10.");
    }
    else if ((my_var_1 >= 10) && (my_var_2 < 100) || (var_2 == true))
    {
        // will be executed if the condition is false
        printf("my_var is greater than or equal to 10.");
    }
    else {
    	printf("my_var is greater than or equal to 100.");
    }
    return 0;
}`;

// export const cFunc = `int test(int param_1, bool param_2)
// {
//     int my_var = 5;
//     bool var_2;
//     /** if block with condition at the start*/
//     if (  (my_var <  10) && (  var_2 > 0) || var_3 > 10)
//     {
//         // will be executed if the condition is true
//         printf("my_var is less than 10.");
//         if(my_var >5){
//             printf("my_var is more than 10.");
//             if(my_var > 7){
//                 printf("");
//             }
//         }
//     }
//     return 0;
// }`;


// export const cFunc = `var a;`;