const checkRole = (msg) => {
  if (
    msg.channel.type === 'dm' ||
    !msg.member.roles.cache.find((r) => r.id === '796480236647612487')
  )
    return 'noPerm';
};

module.exports = {
  checkRole,
};
