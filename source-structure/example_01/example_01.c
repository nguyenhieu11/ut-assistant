int g_var = 0;
char FUN_Test(void)
{
    if (g_var > 10)
    {
        Stub_more_than();
    }
    else
    {
        Stub_less_than();
    }
}