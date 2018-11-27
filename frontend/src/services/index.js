import axios from 'axios';

export const postRollout = (stepCount) => (
  axios.post('/api/rollouts', {
    step_count: stepCount,
  }).then((res) => ({
    rolloutPath: res.data.rollout_path,
    isRolloutStarted: res.data.is_rollout_started,
  }))
);

export const postSaliency = (rolloutId, fromStep, toStep, actorIntensity, criticIntensity, qfuncIntensity) => (
  axios.post(`/api/rollouts/${rolloutId}/saliency`, {
    from_step: fromStep,
    to_step: toStep,
    actor_intensity: actorIntensity,
    critic_intensity: criticIntensity,
    qfunc_intensity: qfuncIntensity,
  }).then((res) => ({
    isSaliencyStarted: res.data.is_saliency_started,
  }))
);

export const getRolloutLog = (rolloutId) => (
  axios.get(`/api/rollouts/${rolloutId}`).then((res) => ({
    logDataRows: res.data.rollout_log,
    logLastUpdated: res.data.last_updated,
  }))
);

export const getServerState = () => (
  axios.get('/api/server_state').then((res) => ({
    isJobRunning: res.data.is_job_running,
    isRolloutOnMemory: res.data.is_rollout_on_memory,
  }))
);

export const getLatestLogInfo = () => (
  axios.get('/api/rollouts?q=latest').then((res) => ({
    rolloutId: res.data.rollout_id,
    rolloutPath: res.data.rollout_path,
  }))
);

export const getAgentProfile = () => (
  axios.get('/api/agent_profile').then((res) => ({
    agentType: res.data.agent_type,
    rawImageInput: res.data.raw_image_input,
    actionMeanings: res.data.action_meanings,
    containsRecurrentModel: res.data.contains_recurrent_model,
    stateValueReturned: res.data.state_value_returned,
    distributionType: res.data.distribution_type,
    actionValueType: res.data.action_value_type,
  }))
);
