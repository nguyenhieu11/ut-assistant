
extern "C"
{
#include "test_example_01.h"
}

extern int g_var;

extern "C" void Stub_more_than(void) { return; }
extern "C" void Stub_less_than(void) { return; }

class Stub
{
public:
    // MOCK_METHOD(Stub_more_than, void(void));
    Stub()
    {
        s_instance = this;
    }
    static Stub *s_instance;
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

    //=================TEST_CASE=================//

    //=================BEGIN_AUTO_GEN_TC=================//

    //==================END_AUTO_GEN_TC==================//
}