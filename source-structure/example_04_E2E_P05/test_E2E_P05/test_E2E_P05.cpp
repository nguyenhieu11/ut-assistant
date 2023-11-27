
#include <gtest/gtest.h>
#include "gmock/gmock.h"
/* Extern header */
extern "C"
{
#include "test_E2E_P05.h"
}
using namespace ::testing;
using ::testing::_;
using ::testing::AnyNumber;
using ::testing::Eq;
using ::testing::Ref;
using ::testing::Return;
using ::testing::ReturnRef;

/* Extern function */
extern "C" Std_ReturnType E2E_P05CheckInit(void);
extern "C" Std_ReturnType E2E_P05ProtectInit(E2E_P05ProtectStateType *StatePtr);

/* START STUB DEFINITION */
class Stub
{
public:
    MOCK_METHOD1(E2E_Prv_P05CheckConfigType, boolean(const E2E_P05ConfigType *const Config_pst));
    MOCK_METHOD3(E2E_Prv_P05CheckData, boolean(const E2E_P05ConfigType *const Config_pst, const uint8 *const Data_pu8, uint16 Length_u16));
    Stub()
    {
        s_instance = this;
    }
    static Stub *s_instance; // the instance supports to call mock function from stub
};
Stub *Stub::s_instance;

namespace Test
{
    class ClassUnitTest : public ::testing::Test
    {
    public:
        void Setup() override
        {
        }
    };

    //=======================TEST_CASE=======================//
    //=======================E2E_P05CheckInit=======================//
    /**
     * Check coverage of function
     */
    TEST_F(ClassUnitTest, E2E_P05CheckInit_TC01)
    {
        /* Test case declarations */
        Stub stubobj;
        Std_ReturnType expected_returnValue;
        /* Set value */
        E2E_P05CheckStateType *map_StatePtr = NULL_PTR; // Call stub function
        // EXPECT CALL (stubobj, RBHMI_Stop ImmediateAccess()) //.Willonce (Return ());
        /* CALL SUT */
        expected_returnValue = E2E_P05CheckInit(map_StatePtr); /* Test case checks for variables */
        EXPECT_EQ(expected_returnValue, E2E_E_INPUTERR_NULL);
    }

    //=================BEGIN_AUTO_GEN_TC=================//

    //==================END_AUTO_GEN_TC==================//
}
