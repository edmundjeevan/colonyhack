const ecp = require('./ecp');

const example = async ({ colonyClient, metaColonyClient }) => {
  // Initialise the Extended Colony Protocol

  await ecp.init();

  // Create a task!
  const specificationHash = await ecp.saveTaskSpecification({ title: 'Cool task', description: 'Create this cool thing.' });

  // Unique, immutable hash on IPFS
  console.log('Specification hash', specificationHash);

  // Create a task in the root domain
  const { eventData: { taskId }} = await colonyClient.createTask.send({ specificationHash, domainId: 1 });

  // Let's take a look at the newly created task
  const task = await colonyClient.getTask.call({ taskId })
  console.log(task);

  const { eventData: { skillId } } = await metaColonyClient.addGlobalSkill.send({ parentSkillId: 1 })
  console.log(skillId);

  await colonyClient.setTaskSkill.send({ taskId, skillId });

  const taskNew = await colonyClient.getTask.call({ taskId })

  console.log(taskNew);

  // Do some cleanup
  await ecp.stop();
}

module.exports = example;
