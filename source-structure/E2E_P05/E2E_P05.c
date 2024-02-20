

#include "E2E_MemMap.h"

static Std_ReturnType E2E_P05CheckInit(Std_ReturnType error_en;)
{

    // Std_ReturnType *error_en;
    static Std_ReturnType other_var;
    /** CASE 1: value is assigned by global var directly */
    g_count = g_var;

    /** CASE 2: value is assigned by local_var var directly */
    g_count = local_var;

    /** CASE 3: value is assigned by stub function - no parameter*/
    g_count = stub_func_no_param(error_en);

    /** CASE 4: value is assigned by stub function - parameter as pointer */
    stub_func_pointer(&g_count, error_en);

    /* Check for NULL pointer */
    if (1 == g_count)
    {
        error_en = E2E_E_INPUTERR_NULL;
    }
    else
    {
        error_en = E2E_E_OK;
    }
    return (error_en);
}
