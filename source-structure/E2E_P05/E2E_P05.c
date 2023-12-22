

#include "E2E_MemMap.h"

int g_Count = 1;

static char g_Char = 2;

static Std_ReturnType g_Std;

int arr_1[];

static int arr_2[10];

Std_ReturnType arr_3[];

static Std_ReturnType arr_4[10];

static Std_ReturnType E2E_P05CheckInit()
{
    int param_1 = custom_a, param_2 = custom_b;
    Std_ReturnType param_3;
    Std_ReturnType *param_5 = NULL;
    Std_ReturnType *param_6;
    Std_ReturnType error_en = E2E_E_INTERR;
    int res_int;

    res_int = Stub_function_01(param_1, param_2);

    error_en = Stub_function_02(param_1, param_5);

    Stub_function_03(param_1, param_3);
    Stub_function_04(param_1, &param_2);

    /* Check for NULL pointer */
    if (1 == g_Count)
    {
        error_en = E2E_E_INPUTERR_NULL;
    }
    else
    {
        error_en = E2E_E_OK;
    }
    return (error_en);
}
