"""
This file contains a small subset of the tests we will run on your backend submission
"""

import unittest
import os
import testLib

class TestSmiles(testLib.SmileTestCase):

    ###
    ### THESE ARE THE ACTUAL TESTS
    ###
    def testAdd1(self):
        """
        Test adding one smile
        """
        respCreate = self.makeRequest("/api/smiles", method="POST",
                                    data = { 'title' : 'A shy smile',
                                             'space' : self.smileSpace,
                                             'story' : 'Once upon a time I was a shy boy...',
                                             'happiness_level' : 1,
                                             'like_count' : 0
                                             })
        self.assertSuccessResponse(respCreate)
        self.assertEqual(0, respCreate['smile']['like_count'])
        self.assertEqual('A shy smile', respCreate['smile']['title'])

        # Now read the smiles
        respGet = self.getSmiles(count=10)
        self.assertSuccessResponse(respGet)
        self.assertEqual(1, len(respGet['smiles']))
        self.assertEqual(respCreate['smile']['id'], respGet['smiles'][0]['id'])

    def testLike(self):
        """
        Test adding one smile
        """
        respCreate = self.makeRequest("/api/smiles", method="POST",
                                    data = { 'title' : 'A shy smile',
                                             'space' : self.smileSpace,
                                             'story' : 'Once upon a time I was a shy boy...',
                                             'happiness_level' : 1,
                                             'like_count' : 0
                                             })
        self.assertSuccessResponse(respCreate)
        self.assertEqual(0, respCreate['smile']['like_count'])
        self.assertEqual('A shy smile', respCreate['smile']['title'])

        # Now like the smile
        smile_id = respCreate['smile']['id'] #use the id for the story we just created
        respLike = self.likeSmiles(id=smile_id)
        self.assertSuccessResponse(respLike)
        self.assertEqual(respCreate['smile']['id'], respLike['smile']['id'])
        self.assertEqual((respCreate['smile']['like_count']+1), respLike['smile']['like_count'])


if __name__ == '__main__':
    unittest.main()