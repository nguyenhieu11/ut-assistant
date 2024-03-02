
void PRC_NET_RBUXRDC_PDUHandler_x2(void)
{
    if (RBRDC_GetRemoteActuationMode())
    {
        RBPduHandler_Enable_IpduGroup(ComConf_ComIPduGroup_Can0_RBU_RDC);
    }
    else
    {
        RBPduHandler_Disable_IpduGroup(ComConf_ComIPduGroup_Can0_RBU_RDC);
    }

    RBPduHandler_ApplyIpduGroupSettings(TRUE);
}