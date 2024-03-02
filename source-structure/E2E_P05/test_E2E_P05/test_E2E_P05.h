
#ifndef TEST_E2E_P05_H
#define TEST_E2E_P05_H
#include <include.h>

typedef struct
{
    uint16 Offset;
    uint16 DataLength;
    uint16 DataID;
    /* offset in bits of the header */
    /* length of data in bits */
    /* system unique identifier */
    uint8 MaxDeltaCounter; /* max allowed gap between 2 consecutive messages */
} E2E_P05ConfigType;

#define E2E_E_INPUTERR_NULL 0x13U
#define E2E_E_INPUTERR_WRONG (0x17U)

#define E2E_E_INTERR (0x19U * 2.54)
#define E2E_E_INTERR (0x19U - 2.54)
#define E2E_E_INTERR (0x19U + 2.54)
#define E2E_E_INTERR (0x19U / 2.54) /** Get the last define with same name*/

#define E2E_E_OK 0X00U
#define E2E_E_WRONGSTATE 0x1AU

#define E2E_P05_MAXCOUNTER 12.1 * E2E_E_WRONGSTATE

#define DEF_TEST_01 (12.1 + E2E_E_WRONGSTATE)
#define DEF_TEST_02 (12.1 - E2E_E_WRONGSTATE)
#define DEF_TEST_03 (12.1 * E2E_E_WRONGSTATE)
#define DEF_TEST_04 (12.1 / E2E_E_WRONGSTATE)

#define E2E_P05_DELTACOUNTER_OK (-12 * E2E_E_WRONGSTATE)
#define E2E_P05_DELTACOUNTER_REPEATED E2E_P05_MAXCOUNTER

int g_count;

int g_var;

typedef struct
{
    uint8 Counter;
} E2E_P05ProtectStateType;

typedef enum
{
    E2E_P05STATUS_OK = 0x00U,
    E2E_P05STATUS_NONEWDATA = 0x010,
    E2E_P05STATUS_ERROR = 0x07U,
    E2E_P05STATUS_REPEATED = 0x08U,
    E2E_P05STATUS_OKSOMELOST = 0x20U,
    E2E_P05STATUS_WRONGSEQUENCE = 0x40U
} E2E_P05CheckStatusType;

typedef struct
{
    E2E_P05CheckStatusType Status;
    uint8 Counter;

} E2E_P05CheckStateType;

#endif
