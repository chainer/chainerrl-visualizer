// PlotContainer names
export const DISCRETE_ACTION_VALUE_PLOT = 'DISCETE_ACTION_VALUE_PLOT';
export const DISTRIBUTIONAL_ACTION_VALUE_PLOT = 'DISTRIBUTIONAL_ACTION_VALUE_PLOT';
export const QUADRATIC_ACTION_VALUE_PLOT = 'QUADRATIC_ACTION_VALUE_PLOT';
export const GAUSSIAN_DISTRIBUTION_PLOT = 'GAUSSIAN_DISTRIBUTION_PLOT';
export const SOFTMAX_DISTRIBUTION_PLOT = 'SOFTMAX_DISTRIBUTION_PLOT';
export const MELLOWMAX_DISTRIBUTION_PLOT = 'MELLOWMAX_DISTRIBUTION_PLOT';
export const CONTINUOUS_DETERMINISTIC_DISTRIBUTION_PLOT = 'CONTINUOUS_DETERMINISTIC_DISTRIBUTION_PLOT';

// ValuesPaneContainer names
export const DISCRETE_ACTION_VALUE_PANE = 'DISCRETE_ACTION_VALUE_PANE';
export const QUADRATIC_ACTION_VALUE_PANE = 'QUADRATIC_ACTION_VALUE_PANE';
export const GAUSSIAN_DISTRIBUTION_PANE = 'GAUSSIAN_DISTRIBUTION_PANE';
export const SOFTMAX_DISTRIBUTION_PANE = 'SOFTMAX_DISTRIBUTION_PANE';
export const MELLOWMAX_DISTRIBUTION_PANE = 'MELLOWMAX_DISTRIBUTION_PANE';
export const CONTINUOUS_DETERMINISTIC_DISTRIBUTION_PANE = 'CONTINUOUS_DETERMINISTIC_DISTRIBUTION_PANE';

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

export const mapAgentProfileToValuesPaneList = (profile) => {
  if (!validateProfile(profile)) return [];

  switch (profile.actionValueType) {
    case DISCRETE_ACTION_VALUE:
    case DISTRIBUTIONAL_DISCRETE_ACTION_VALUE:
      return [DISCRETE_ACTION_VALUE_PANE];
    case QUADRATIC_ACTION_VALUE:
      return [QUADRATIC_ACTION_VALUE_PANE];
    default:
  }

  switch (profile.distributionType) {
    case GAUSSIAN_DISTRIBUTION:
      return [GAUSSIAN_DISTRIBUTION_PANE];
    case SOFTMAX_DISTRIBUTION:
      return [SOFTMAX_DISTRIBUTION_PANE];
    case MELLOWMAX_DISTRIBUTION:
      return [MELLOWMAX_DISTRIBUTION_PANE];
    case CONTINUOUS_DETERMINISTIC_DISTRIBUTION:
      return [CONTINUOUS_DETERMINISTIC_DISTRIBUTION_PANE];
    default:
  }

  return [];
};

export const VALUES_PANE_TO_TITLE = {
  [DISCRETE_ACTION_VALUE_PANE]: 'QValues of next action',
  [QUADRATIC_ACTION_VALUE_PANE]: 'HOGE',
  [GAUSSIAN_DISTRIBUTION_PANE]: 'Distribution of next action',
  [SOFTMAX_DISTRIBUTION_PANE]: 'Probability of next action',
  [MELLOWMAX_DISTRIBUTION_PANE]: 'HOGE',
  [CONTINUOUS_DETERMINISTIC_DISTRIBUTION_PANE]: 'HOGE',
};

export const mapAgentProfileToValuesPaneTitle = (profile) => {
  const paneList = mapAgentProfileToValuesPaneList(profile);

  if (paneList.length === 0) {
    return '';
  }

  // TODO: deal with multiple pane switching
  return VALUES_PANE_TO_TITLE[paneList[0]];
};
