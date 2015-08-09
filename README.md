# htmjs
htm implementation for javascript

# docs
Look at test/test.js which has an example on how to use this

# ideas
Grouping a few TP steps into an sdr (spatial pooler).  This would allow larger concepts to become learned, but i'm not sure how to use this. 

The system does output a prediction, so figure out how to turn that prediction into something it can either tell itself to do, or correct you (anomaly detection).  In the brain, the sensory motor stuff is near the control stuff, so maybe relate the two somehow to get a functioning app.

Goals:
Get it to read a definition
This would be able to update the segments and synapses of cells (possibly adding segments?). This would have to be able to somehow reorganize or somehow influence higher order synapses.

Get it to add numbers.
There are multiple ways to ask something to add a number.
This is different than the normal "prediction" algorithm where it takes time series data, and makes a prediction.  Adding isn't really learned by seeing it being added before.  You have to learn the general concept of what adding numbers does, learn what the numbers mean (their value) and then you can predict what the answer is.  I think that since this is a higher level computation, it is therefore not a sensory thing, there has to be multiple layers of this crap going on, but how do you learn to separate this stuff? 

