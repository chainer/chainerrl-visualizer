// AGENT TYPE
export const CATEGORICAL_DQN = 'CategoricalDQN';
export const PPO = 'PPO';
export const A3C = 'A3C';

// CHART TYPE
export const DISCRETE_QVALUES = 'DISCRETE_QVALUES';
export const VALUE_DISTRIBUTION = 'VALUE_DISTRIBUTION';
export const CONTINUOUS_STOCHASTIC_ACTIONS_AND_VALUE = 'CONTINUOUS_STOCHASTIC_ACTIONS_AND_VALUE ';
export const DISCRETE_STOCHASTIC_ACTIONS = 'DISCRETE_STOCHASTIC_ACTIONS';

// VALUES PANE TYPE
export const DISCRETE_QVALUES_PANE = 'DISCRETE_QVALUES_PANE';
export const CONTINUOUS_STOCHASTIC_ACTIONS_PANE = 'CONTINUOUS_STOCHASTIC_ACTIONS_PANE';
export const DISCRETE_STOCHASTIC_ACTIONS_PANE = 'DISCRETE_STOCHASTIC_ACTIONS_PANE';

export const VALUES_PANE_TO_TITLE = {
  [DISCRETE_QVALUES_PANE]: 'QValues of next action',
  [CONTINUOUS_STOCHASTIC_ACTIONS_PANE]: 'Distribution of next action',
  [DISCRETE_STOCHASTIC_ACTIONS_PANE]: 'Probability of next action',
};

export const AGENT_TO_VALUES_PANE = {
  [CATEGORICAL_DQN]: DISCRETE_QVALUES_PANE,
  [PPO]: CONTINUOUS_STOCHASTIC_ACTIONS_PANE,
  [A3C]: DISCRETE_STOCHASTIC_ACTIONS_PANE,
};

// PlotContainer names
export const DISCRETE_ACTION_VALUE_PLOT = 'DISCETE_ACTION_VALUE_PLOT';
export const DISTRIBUTIONAL_ACTION_VALUE_PLOT = 'DISTRIBUTIONAL_ACTION_VALUE_PLOT';
export const QUADRATIC_ACTION_VALUE_PLOT = 'QUADRATIC_ACTION_VALUE_PLOT';
export const GAUSSIAN_DISTRIBUTION_PLOT = 'GAUSSIAN_DISTRIBUTION_PLOT';
export const SOFTMAX_DISTRIBUTION_PLOT = 'SOFTMAX_DISTRIBUTION_PLOT';
export const MELLOWMAX_DISTRIBUTION_PLOT = 'MELLOWMAX_DISTRIBUTION_PLOT';
export const CONTINUOUS_DETERMINISTIC_DISTRIBUTION_PLOT = 'CONTINUOUS_DETERMINISTIC_DISTRIBUTION_PLOT';

const profileProperties = [
  'containsRecurrentModel',
  'stateValueReturned',
  'distributionType',
  'actionValueType',
];

// Agent profile property - 'distributionType'
const GAUSSIAN_DISTRIBUTION = 'GaussianDistribution';
const SOFTMAX_DISTRIBUTION = 'SoftmaxDistribution';
const MELLOWMAX_DISTRIBUTION = 'MellowmaxDistribution';
const CONTINUOUS_DETERMINISTIC_DISTRIBUTION = 'ContinuousDeterministicDistribution';

// Agent profile property - 'actionValueType'
const DISCRETE_ACTION_VALUE = 'DiscreteActionValue';
const DISTRIBUTIONAL_DISCRETE_ACTION_VALUE = 'DistributionalDiscreteActionValue';
const QUADRATIC_ACTION_VALUE = 'QuadraticActionValue';
const SINGLE_ACTION_VALUE = 'SingleActionValue'; // eslint-disable-line no-unused-vars

export const validateProfile = (profile) => {
  let validProfile = true;

  profileProperties.forEach((prop) => {
    if (!Object.prototype.hasOwnProperty.call(profile, prop)) {
      validProfile = false;
    }
  });

  return validProfile;
};

export const mapAgentProfileToChartList = (profile) => {
  if (!validateProfile(profile)) return [];

  if (profile.actionValueType === DISCRETE_ACTION_VALUE) {
    return [DISCRETE_ACTION_VALUE_PLOT];
  }

  switch (profile.actionValueType) {
    case (DISCRETE_ACTION_VALUE):
      return [DISCRETE_ACTION_VALUE_PLOT];
    case (DISTRIBUTIONAL_DISCRETE_ACTION_VALUE):
      return [DISCRETE_ACTION_VALUE_PLOT, DISTRIBUTIONAL_ACTION_VALUE_PLOT];
    case (QUADRATIC_ACTION_VALUE):
      return [QUADRATIC_ACTION_VALUE_PLOT];
    default:
  }

  switch (profile.distributionType) {
    case (GAUSSIAN_DISTRIBUTION):
      return [GAUSSIAN_DISTRIBUTION_PLOT];
    case (SOFTMAX_DISTRIBUTION):
      return [SOFTMAX_DISTRIBUTION_PLOT];
    case (MELLOWMAX_DISTRIBUTION):
      return [MELLOWMAX_DISTRIBUTION_PLOT];
    case (CONTINUOUS_DETERMINISTIC_DISTRIBUTION):
      return [CONTINUOUS_DETERMINISTIC_DISTRIBUTION_PLOT];
    default:
  }

  return [];
};
