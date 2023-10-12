export const cFunc = `int test(int param_1, bool param_2)
{
    int my_var = 5;
    bool var_2;
    /** if block with condition at the start*/
    if (my_var <  10)
    {
        // will be executed if the condition is true
        printf("my_var is less than 10.");
    }
    else if ((my_var >= 10) && (my_var < 100) || (var_2 == true))
    {
        // will be executed if the condition is false
        printf("my_var is greater than or equal to 10.");
    }
    else {
    	printf("my_var is greater than or equal to 100.");
    }
    return 0;
}`;

// export const cFunc = `var a;`;