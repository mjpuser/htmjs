# htmjs
htm implementation for javascript

# Concepts

## Maps
* Thalamus -> Cortex -> Striatum -> Pallidum/nigra -> Thalamus
* *Direct:* Cortex (stimulates) → Striatum (inhibits) → "SNr-GPi" complex (less inhibition of thalamus) → Thalamus (stimulates) → Cortex (stimulates) → Muscles, etc. → (hyperkinetic state)
* *Indirect (antagonist):* Cortex (stimulates) → Striatum (inhibits) → GPe (less inhibition of STN) → STN (stimulates) → "SNr-GPi" complex (inhibits) → Thalamus (is stimulating less) → Cortex (is stimulating less) → Muscles, etc. → (hypokinetic state)


## Notes
* differences between hemispheres (wider dendrite spans in right)
* frequency to mean more intense sensation (this could differ for different areas)
* bursting vs tonic impulses


## Thalamus
* Every sensory system relayed through here to the cortex
* Gets feedback from cortex
* involved in sleep/awakefulness
* functionally connected to hippocampus for spatial and episodic memory
* connected to basal ganglia

### Subthalamic Nucleus
* neuron have long sparsely spiny dendrites
* legions increase impulsivity in individuals presented with two equally rewarding stimuli

## Basal Ganglia
* strong ties to cortex, thalamus, and brainstem
* control of voluntary motor movements, procedural learning, routine behaviors or "habits" such as bruxism, eye movements, cognition and emotion
* Basal ganglia outputs contact regions of the thalamus (the intralaminar and ventromedial nuclei) that project directly back to basal ganglia input nuclei (Kimura et al. 2004, Smith et al. 1998) but also back to those regions of cortex providing original inputs to the striatum 
* reinforcement learning 
* action selection (vague)
* includes the putamen.  Encircles the thalamas.
* knob ends are the amygdala

### Stratium
* cognition, including motor and action planning, decision-making, motivation, reinforcement, and reward perception
* inhibition neurons

### Pallidum
* Pallidal neurons operate using a disinhibition principle. These neurons fire at steady high rates in the absence of input, and signals from the striatum cause them to pause or reduce their rate of firing. Because pallidal neurons themselves have inhibitory effects on their targets, the net effect of striatal input to the pallidum is a reduction of the tonic inhibition exerted by pallidal cells on their targets (disinhibition) with an increased rate of firing in the targets.

## Hippocampus
* forms declaritive memory and episodic memory
* legions prevent forming new memories
* By way of the entorhinal cortex, it communicates with all parts of the neocortex.  Every part of the cortex is represented in the hippocampus
* cognitive map theory (place cells + grid cells in neocortex?)
* semantic knowledge (probably the connections)
* theta state: exploratory movement & REM sleep - neocortical -> hippo flow
* share state: immobility and consumatory - hippo -> neocortical flow
* place cells
* circuit is lateral (cross section of the hippocampus)

## Entorhinal cortex
* alzheimers (causes smaller hippocampus), schizo (think random connections)
* grid cells - represent spatial environment

### Grid Cells
* Grid cells are predominant in layer II of the entorhinal cortex, but exist also in layers III and V. Grid cells in layers III and V intermingle with cells that code for the direction the animal is looking, the head-direction cells, as well as cells with conjunctive grid and head-direction properties (Sargolini et al., 2006) and border cells 

### Fornix
* commissure - connects both sides of the hippocampus and fornix
* wraps around thalamus
* the front knobs are the mammilary bodies


.h1 Areas!
* 24,32,33 - error detection / conflict monitoring, emotional reaction to pain
* 28 - speed, spatial, memory consolidation
* 31 - autobiographical memory retrieval


.h1 Neurons
* granule - excitatory. Two long axonal branches.  Many in cerebellum.
* mossy fiber - excitatory (cerebellum vs hippocampus) - hippo: vericosy (like purkinje) - cerebellum: long, extending from pons, affect many purkinje
* purkinje - inhibitory - large branching arbors.  Intersect with granule
* chandelier - inhibitory - connect to the axon and stop action potential
* pyramidal - excitatory - dendrites, body, axon, terminal ( make up 65% of neocortex).  Only cells that send signals to other regions of the brain.  mostly regular spiking
* basket - inhibitory - connect to soma (could be many somas)
* (undesignated) - inhibitory - help with reuptake. neuromodulator spreads to multiple
* stellate - excitatory in neocortex, inhibitory in cerebellum - layer IV and make up about 20% (visual cortex)
* other inhibitory - 15% of neocortex - fast spiking

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

Cool article on circuits in the neocortex:
http://www.mrc.uidaho.edu/~rwells/techdocs/reu06/Cortical%20Neurons%20and%20Circuits.pdf
