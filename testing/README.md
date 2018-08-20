
 This are files to help you test your backend (Part 3).

---
 Prepare the Automated Tests 
---

While you write the code for the API, I strongly recommend that you spend
some time getting the automated tests ready. We are giving you a very simple
test framework, written in Python, along with two automated tests.  You too should add automated tests to the
framework. Writing automated tests, and experimenting with
running them against the backend we provide will familiarize you with
the more subtle corners of the API that you will have to implement. Plus,
these tests will allow you to test your own backend.
You will even be able to debug the corner cases of the API more easily
because the automated tests allow you to reproduce such a corner
case. For example, you may put a breakpoint in the debugger, and then
fire the specific automated test that you are trying to get right.

This development process is called **Test-Driven Development**.

The testing framework is provided to you in the `testing` directory:
* `testing/testLib.py`: this contains two classes, one which implements
    HTTP requests, and one that provides some helper functions for
    operating with smiles. You may want to add more helper functions
    to the `SmileTestCase` class.
    * By default, each test will first run the `setUp` method, defined
    in `testLib.SmileTestCase`. This method will **delete** all smile
    posts in the specified smile space. This is important, because
    you want all your tests to run in a predictable initial state.
    * Because of this, it is important to use a distinct smile space
    name from what other students will be using. All smiles in that
    space will be lost after running automated tests.
       
* `testing/testBarely.py`: this file contains two test cases, to serve as
    an example for you. You should write more test cases.

You invoke the tests as follows (on command line). Make sure that you are in `testing` directory. :
   ```
   python -m unittest
   ```
   OR
   ```
   python -m unittest  -v
   ```
   Passing the -v option to your test script will instruct unittest.main() to enable a higher level of verbosity. 
   
    * To enable the logging output, assign `VERBOSE` flag in `RestTestCase class` to 1 (in `testLib.py`). (If you use VERBOSE=1 you will see more detail about the messages that are sent/received. )
   
    * Update the `smileSpace` and `serverToTest` in  `RestTestCase class`. Current tests assume smile space `sakirenin` and 
      run against the server installed at `localhost` at port 5000.
      After deploying your app to Heroku, change the URL to your own. (Our  Heroku URL is `https://smile451.herokuapp.com`)
    * You can specify a single test to run by adding the argument as follows:
    ```python -m unittest  -v testBarely.TestSmiles.testAdd1```
    where `testAdd1` is the test we want to run. 

 
