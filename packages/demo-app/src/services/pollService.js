const polls = [];

const createPoll = async (poll) => {
  polls.push(poll);
  return poll;
};

const getPolls = async () => polls;

export default {
  createPoll,
  getPolls,
};
