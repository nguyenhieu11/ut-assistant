

#include "E2E_MemMap.h"

int g_Count = 1;

int E2E_P05CheckInit()
{
    Std_ReturnType error_en = E2E_E_INTERR;

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

Std_ReturnType E2E_P05ProtectInit(E2E_P05ProtectStateType *StatePtr)
{
    Std_ReturnType error_en = E2E_E_INTERR;

    /* Check for NULL pointer */
    if (NULL_PTR == StatePtr)
    {
        error_en = E2E_E_INPUTERR_NULL;
    }
    else
    {
        /* Initialize Check state */
        StatePtr->Counter = 0U;

        /* no error occurred */
        error_en = E2E_E_OK;
    }
    return (error_en);
}