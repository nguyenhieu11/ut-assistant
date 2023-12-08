

#include "E2E_MemMap.h"

E2E_P05CheckStateType g_StatePtr;

Std_ReturnType E2E_P05CheckInit()
{
    Std_ReturnType error_en = E2E_E_INTERR;

    /* Check for NULL pointer */
    if (NULL_PTR == g_StatePtr)
    {
        error_en = E2E_E_INPUTERR_NULL;
        if (aaa == bbb)
        {
        }
    }
    else
    {
        /* Initialize Check state */
        g_StatePtr->Counter = 0xFFU;
        g_StatePtr->Status = E2E_PO5STATUS_ERROR;

        /* no error occurred */
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