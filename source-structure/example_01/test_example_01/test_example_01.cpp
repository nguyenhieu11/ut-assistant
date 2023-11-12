
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
        /** 
         * Check coverage case ( F && F )
         *      (g_var_1 < 10 && g_var_2 < 5)
        */
        TEST_F(ClassUnitTest, FUN_Test_TC1){

            /* Test case declaration */
            Stub stubObj;

            /* Set value */
            g_var_1 = 10; 
g_var_2 = 5; 

            
            /* Call Stub function */

            /* Call SUT */

            /* Test case check for variables */

        }
        
        /** 
         * Check coverage case ( F && T )
         *      (g_var_1 < 10 && g_var_2 < 5)
        */
        TEST_F(ClassUnitTest, FUN_Test_TC2){

            /* Test case declaration */
            Stub stubObj;

            /* Set value */
            g_var_1 = 10; 
g_var_2 = 4; 

            
            /* Call Stub function */

            /* Call SUT */

            /* Test case check for variables */

        }
        
        /** 
         * Check coverage case ( T && F )
         *      (g_var_1 < 10 && g_var_2 < 5)
        */
        TEST_F(ClassUnitTest, FUN_Test_TC3){

            /* Test case declaration */
            Stub stubObj;

            /* Set value */
            g_var_1 = 9; 
g_var_2 = 5; 

            
            /* Call Stub function */

            /* Call SUT */

            /* Test case check for variables */

        }
        
        /** 
         * Check coverage case ( T && T )
         *      (g_var_1 < 10 && g_var_2 < 5)
        */
        TEST_F(ClassUnitTest, FUN_Test_TC4){

            /* Test case declaration */
            Stub stubObj;

            /* Set value */
            g_var_1 = 9; 
g_var_2 = 4; 

            
            /* Call Stub function */

            /* Call SUT */

            /* Test case check for variables */

        }
        //==================END_AUTO_GEN_TC==================//

}