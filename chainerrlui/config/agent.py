# ActionValue type names
DISCRETE_ACTION_VALUE = 'DiscreteActionValue'
DISTRIBUTIONAL_DISCRETE_ACTION_VALUE = 'DistributionalDiscreteActionValue'
QUADRATIC_ACTION_VALUE = 'QuadraticActionValue'
SINGLE_ACTION_VALUE = 'SingleActionValue'

# Distribution type names
SOFTMAX_DISTRIBUTION = 'SoftmaxDistribution'
GAUSSIAN_DISTRIBUTION = 'GaussianDistribution'
MELLOWMAX_DISTRIBUTION = 'MellowmaxDistribution'
CONTINUOUS_DETERMINISTIC_DISTRIBUTION = 'ContinuousDeterministicDistribution'

# TODO: Support `QuadraticActionValue` and `SingleActionValue`
SUPPORTED_ACTION_VALUES = [
    DISCRETE_ACTION_VALUE,
    DISTRIBUTIONAL_DISCRETE_ACTION_VALUE,
]

# TODO: Support `MellowmaxDistribution` and `ContinuousDeterministicDistribution`
SUPPORTED_DISTRIBUTIONS = [
    SOFTMAX_DISTRIBUTION,
    GAUSSIAN_DISTRIBUTION,
]
