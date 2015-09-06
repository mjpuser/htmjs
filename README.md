# htmjs
htm implementation for javascript

# docs
Look at test/test.js which has an example on how to use this

.h1 concepts

.h2 Maps
* Thalamus -> Cortex -> Striatum -> Pallidum/nigra -> Thalamus
* *Direct:* Cortex (stimulates) → Striatum (inhibits) → "SNr-GPi" complex (less inhibition of thalamus) → Thalamus (stimulates) → Cortex (stimulates) → Muscles, etc. → (hyperkinetic state)
* *Indirect (antagonist):* Cortex (stimulates) → Striatum (inhibits) → GPe (less inhibition of STN) → STN (stimulates) → "SNr-GPi" complex (inhibits) → Thalamus (is stimulating less) → Cortex (is stimulating less) → Muscles, etc. → (hypokinetic state)

.h2 Diffs between hemispheres

.h2 Notes
* differences between hemispheres (wider dendrite spans in right)
* frequency to mean more intense sensation (this could differ for different areas)
* bursting vs tonic impulses
* 


.h2 Thalamus
* Every sensory system relayed through here to the cortex
* Gets feedback from cortex
* involved in sleep/awakefulness
* functionally connected to hippocampus for spatial and episodic memory
* connected to basal ganglia

.h3 Subthalamic Nucleus
* neuron have long sparsely spiny dendrites
* legions increase impulsivity in individuals presented with two equally rewarding stimuli

.h2 Basal Ganglia
* strong ties to cortex, thalamus, and brainstem
* control of voluntary motor movements, procedural learning, routine behaviors or "habits" such as bruxism, eye movements, cognition and emotion
* Basal ganglia outputs contact regions of the thalamus (the intralaminar and ventromedial nuclei) that project directly back to basal ganglia input nuclei (Kimura et al. 2004, Smith et al. 1998) but also back to those regions of cortex providing original inputs to the striatum 
* reinforcement learning 
* action selection (vague)

.h3 Stratium
* cognition, including motor and action planning, decision-making, motivation, reinforcement, and reward perception
* inhibition neurons

.h3 Pallidum
* Pallidal neurons operate using a disinhibition principle. These neurons fire at steady high rates in the absence of input, and signals from the striatum cause them to pause or reduce their rate of firing. Because pallidal neurons themselves have inhibitory effects on their targets, the net effect of striatal input to the pallidum is a reduction of the tonic inhibition exerted by pallidal cells on their targets (disinhibition) with an increased rate of firing in the targets.

.h2 Hippocampus
* forms declaritive memory and episodic memory
* legions prevent forming new memories
* By way of the entorhinal cortex, it communicates with all parts of the neocortex.  Every part of the cortex is represented in the hippocampus
* cognitive map theory
* semantic knowledge
* theta state: exploratory movement & REM sleep - neocortical -> hippo flow
* share state: immobility and consumatory - hippo -> neocortical flow
* interneurons
* place cells

.h2 Entorhinal cortex
* alzheimers (causes smaller hippocampus), schizo (think random connections)
* grid cells - represent spatial environment

.h3 Grid Cells
* Grid cells are predominant in layer II of the entorhinal cortex, but exist also in layers III and V. Grid cells in layers III and V intermingle with cells that code for the direction the animal is looking, the head-direction cells, as well as cells with conjunctive grid and head-direction properties (Sargolini et al., 2006) and border cells 

.3 presubiculum

.h2 Fornix

.h2 Pons

.h2 Brainstem

.h2 Medula

.h1 Areas!
* 24,32,33 - error detection / conflict monitoring, emotional reaction to pain
* 28 - speed, spatial, memory consolidation
* 31 - autobiographical memory retrieval


.h1 Neurons
* granule - excitatory. Two long axonal branches.  Many in cerebellum.
* microfiber - excitatory 
* purkinje _ inhibitory - large branching arbors.  Intersect with granule

.h2 Neural Circuits
* divergent
* convergent
* feedback loops
* parallel after-discharge - related to bursting?

.h2 Neuron types
* bipolar
* double bouquet
* Multipolar
* thalamic neurons vs cortical neurons vs different layers vs hippocampal neurons



.h1 Roadmap
.h2 Build up working structures from the ground up.
* How do neurons work synapses / neurotransmitters / pumps / dendrites / terminals?
* How do smaller Neural circuits work / behavior?
* What types of neurons differentiate different brain structures?
* Do circuits make larger structures (cortical columns)?
* how are the larger structures connected?
* how do they inhibit/excite?




.h2 Tasks
.h3 Read a definition
This would be able to update the segments and synapses of cells (possibly adding segments?). This would have to be able to somehow reorganize or somehow influence higher order synapses.

.h3 Add numbers
There are multiple ways to ask something to add a number.
This is different than the normal "prediction" algorithm where it takes time series data, and makes a prediction.  Adding isn't really learned by seeing it being added before.  You have to learn the general concept of what adding numbers does, learn what the numbers mean (their value) and then you can predict what the answer is.  I think that since this is a higher level computation, it is therefore not a sensory thing, there has to be multiple layers of this crap going on, but how do you learn to separate this stuff? 

