
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
//==================BEGIN_AUTO_EXTERN_GLOBAL_FUNCTION==================//

//==================END_AUTO_EXTERN_GLOBAL_FUNCTION==================//

//==================BEGIN_AUTO_EXTERN_STUB_FUNCTION==================//

//==================END_AUTO_EXTERN_STUB_FUNCTION==================//

/* Extern variable */
//==================BEGIN_AUTO_EXTERN_VARIABLE==================//

//==================END_AUTO_EXTERN_VARIABLE==================//

/* START STUB DEFINITION */
class Stub
{
public:
    //==================BEGIN_AUTO_MOCK_STUB_FUNCTION==================//

    //==================END_AUTO_MOCK_STUB_FUNCTION==================//
    Stub()
    {
        s_instance = this;
    }
    static Stub *s_instance; // the instance supports to call mock function from stub
};
Stub *Stub::s_instance;

//==================BEGIN_AUTO_DEFINE_STUB_FUNCTION==================//

//==================END_AUTO_DEFINE_STUB_FUNCTION==================//
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

    //=================BEGIN_AUTO_GEN_TC=================//

    //==================END_AUTO_GEN_TC==================//
}
