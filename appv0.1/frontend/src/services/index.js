import axios from 'axios';

export const postRollout = () => (
  axios.post('http://localhost:5002/api/rollouts').then((res) => ({
    rolloutPath: res.data.rollout_path,
    isRolloutStarted: res.data.is_rollout_started,
  }))
);

export const postSaliency = (rolloutId, fromStep, toStep) => (
  axios.post(`http://localhost:5002/api/rollouts/${rolloutId}/saliency`, {
    from_step: fromStep,
    to_step: toStep,
  }).then((res) => ({
    isSaliencyStarted: res.data.is_saliency_started,
  }))
);

export const getRolloutLog = (rolloutId) => (
  axios.get(`http://localhost:5002/api/rollouts/${rolloutId}`).then((res) => ({
    logDataRows: res.data.rollout_log,
    logLastUpdated: res.data.last_updated,
  }))
);

export const getServerState = () => (
  axios.get('http://localhost:5002/api/server_state').then((res) => ({
    agentType: res.data.agent_type,
    isJobRunning: res.data.is_job_running,
    isRolloutOnMemory: res.data.is_rollout_on_memory,
  }))
);

export const getLatestLogInfo = () => (
  axios.get('http://localhost:5002/api/rollouts?q=latest').then((res) => ({
    rolloutId: res.data.rollout_id,
    rolloutPath: res.data.rollout_path,
  }))
);
