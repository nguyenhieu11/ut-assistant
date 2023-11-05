int g_var_1 = 0;
int g_var_2 = 0;
char FUN_Test(void)
{
    // if (10 > g_var_1){}
    // if (g_var_1 > 10){}
    // if (g_var_1){}
    // if (!g_var_1){}
    // if (!(g_var_1 > 10)){}
    if (10 > g_var_1 && g_var_2)
    // if (!(10 > g_var_1) && g_var_1){}
    // if (10 > g_var_1 && !g_var_1)
    // if (g_var_1 && g_var_2)
    {
        Stub_more_than();
    }
    else
    {
        Stub_less_than();
    }
}
