
Std_ReturnType RBSCl_Complex_DTConCAN(boolean *value_p)
{
    uint8 l_NMSG_DTCONCAN_Counter;
    RcvMESG(l_NMSG_DTCONCAN_Counter, NMSG_DTCONCAN_Counter);
    if (l_NMSG_DTCONCAN_Counter > 0)
    {
        *value_p = TRUE;
        SendMESG(NMSG_DTCONCAN_Counter, --l_NMSG_DTCONCAN_Counter);
    }
    else
    {
        *value_p = FALSE;
    }
    return E_OK;
}
