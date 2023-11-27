
extern "C"
{
#include "test_example_01.h"
}

extern int g_var_1;
extern int g_var_2;

extern "C" void Stub_func_1(void);
extern "C" void Stub_func_2(void);
extern "C" void Stub_func_3(void);
class Stub
{
public:
    // MOCK_METHOD(Stub_func_1, void(void));
    MOCK_METHOD0(Stub_func_1, void());
    MOCK_METHOD0(Stub_func_2, void());
    MOCK_METHOD0(Stub_func_3, void());

    Stub()
    {
        s_instance = this;
    }
    static Stub *s_instance;
};

Stub *Stub::s_instance;

void Stub_func_1(void)
{
    return Stub::s_instance->Stub_func_1();
}
void Stub_func_2(void)
{
    return Stub::s_instance->Stub_func_2();
}
void Stub_func_3(void)
{
    return Stub::s_instance->Stub_func_3();
}

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
    /** 
     * Check coverage case ( F && F ) = F of condition:
     *      (g_var_1 < 10 && g_var_2 == 5)
    */
    TEST_F(ClassUnitTest, FUN_Test_TC1){

        /* Test case declaration */
        Stub stubObj;

        /* Set value */
		g_var_1 = 10;
		g_var_2 = 6;
        
        /* Call Stub function */
		EXPECT_CALL(stubObj, Stub_func_1())
			.willRepeatly(Return());

        /* Call SUT */
        FUN_Test();
        /* Test case check for variables */

    }
        
    /** 
     * Check coverage case ( F && T ) = F of condition:
     *      (g_var_1 < 10 && g_var_2 == 5)
    */
    TEST_F(ClassUnitTest, FUN_Test_TC2){

        /* Test case declaration */
        Stub stubObj;

        /* Set value */
		g_var_1 = 10;
		g_var_2 = 5;
        
        /* Call Stub function */
		EXPECT_CALL(stubObj, Stub_func_1())
			.willRepeatly(Return());

        /* Call SUT */
        FUN_Test();
        /* Test case check for variables */

    }
        
    /** 
     * Check coverage case ( T && F ) = F of condition:
     *      (g_var_1 < 10 && g_var_2 == 5)
    */
    TEST_F(ClassUnitTest, FUN_Test_TC3){

        /* Test case declaration */
        Stub stubObj;

        /* Set value */
		g_var_1 = 9;
		g_var_2 = 6;
        
        /* Call Stub function */
		EXPECT_CALL(stubObj, Stub_func_1())
			.willRepeatly(Return());

        /* Call SUT */
        FUN_Test();
        /* Test case check for variables */

    }
        
    /** 
     * Check coverage case ( T && T ) = T of condition:
     *      (g_var_1 < 10 && g_var_2 == 5)
    */
    TEST_F(ClassUnitTest, FUN_Test_TC4){

        /* Test case declaration */
        Stub stubObj;

        /* Set value */
		g_var_1 = 9;
		g_var_2 = 5;
        
        /* Call Stub function */
		EXPECT_CALL(stubObj, Stub_func_3())
			.willRepeatly(Return());
		EXPECT_CALL(stubObj, Stub_func_2())
			.willRepeatly(Return());

        /* Call SUT */
        FUN_Test();
        /* Test case check for variables */

    }
        //==================END_AUTO_GEN_TC==================//

}